-- Create availability_slots table for managing available time slots
CREATE TABLE public.availability_slots (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  date DATE NOT NULL,
  time_slot TEXT NOT NULL,
  is_available BOOLEAN NOT NULL DEFAULT true,
  max_bookings INTEGER NOT NULL DEFAULT 1,
  current_bookings INTEGER NOT NULL DEFAULT 0,
  blocked_by UUID REFERENCES auth.users(id),
  blocked_reason TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(date, time_slot)
);

-- Enable RLS
ALTER TABLE public.availability_slots ENABLE ROW LEVEL SECURITY;

-- Policy: Anyone can view available slots
CREATE POLICY "Anyone can view availability slots"
ON public.availability_slots
FOR SELECT
TO authenticated, anon
USING (true);

-- Policy: Admins can manage availability slots
CREATE POLICY "Admins can manage availability slots"
ON public.availability_slots
FOR ALL
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- Create function to update current_bookings when reservation is made
CREATE OR REPLACE FUNCTION public.update_availability_on_reservation()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Increment current_bookings for the booked slot
  UPDATE public.availability_slots
  SET 
    current_bookings = current_bookings + 1,
    is_available = CASE 
      WHEN current_bookings + 1 >= max_bookings THEN false 
      ELSE true 
    END,
    updated_at = now()
  WHERE date = NEW.preferred_date::date
    AND time_slot = NEW.preferred_time;
  
  -- If slot doesn't exist, create it
  IF NOT FOUND THEN
    INSERT INTO public.availability_slots (date, time_slot, current_bookings, is_available, max_bookings)
    VALUES (NEW.preferred_date::date, NEW.preferred_time, 1, false, 1);
  END IF;
  
  RETURN NEW;
END;
$$;

-- Create trigger for automatic availability updates
CREATE TRIGGER on_reservation_created
AFTER INSERT ON public.reservations
FOR EACH ROW
EXECUTE FUNCTION public.update_availability_on_reservation();

-- Enable realtime for availability_slots
ALTER PUBLICATION supabase_realtime ADD TABLE public.availability_slots;

-- Create indexes for better performance
CREATE INDEX idx_availability_date ON public.availability_slots(date);
CREATE INDEX idx_availability_date_available ON public.availability_slots(date, is_available);

-- Insert default availability for next 30 days (all time slots available)
INSERT INTO public.availability_slots (date, time_slot, is_available, max_bookings)
SELECT 
  generate_series(CURRENT_DATE, CURRENT_DATE + INTERVAL '30 days', '1 day')::date as date,
  time_slot,
  true,
  2 -- Allow 2 bookings per time slot by default
FROM unnest(ARRAY[
  '08:00 - 10:00',
  '10:00 - 12:00', 
  '12:00 - 14:00',
  '14:00 - 16:00',
  '16:00 - 18:00'
]) as time_slot
ON CONFLICT (date, time_slot) DO NOTHING;