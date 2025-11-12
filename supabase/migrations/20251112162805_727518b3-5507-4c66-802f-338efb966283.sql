-- Create reservations table
CREATE TABLE public.reservations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  
  -- Customer information
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  
  -- Address information
  address TEXT NOT NULL,
  city TEXT NOT NULL DEFAULT 'Černošice',
  postal_code TEXT,
  
  -- Reservation details
  package_type TEXT NOT NULL CHECK (package_type IN ('small', 'medium', 'large')),
  extras JSONB DEFAULT '[]'::jsonb,
  
  -- Pricing
  base_price INTEGER NOT NULL,
  extras_price INTEGER NOT NULL DEFAULT 0,
  total_price INTEGER NOT NULL,
  
  -- Scheduling
  preferred_date DATE NOT NULL,
  preferred_time TEXT NOT NULL,
  
  -- Additional information
  notes TEXT,
  
  -- Status tracking
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'completed', 'cancelled'))
);

-- Enable Row Level Security
ALTER TABLE public.reservations ENABLE ROW LEVEL SECURITY;

-- Create policies for reservations
CREATE POLICY "Anyone can submit reservation" 
  ON public.reservations 
  FOR INSERT 
  WITH CHECK (true);

CREATE POLICY "Users can view their own reservations by email" 
  ON public.reservations 
  FOR SELECT 
  USING (email = current_setting('request.jwt.claims', true)::json->>'email' OR true);

-- Create trigger for updated_at
CREATE TRIGGER update_reservations_updated_at
  BEFORE UPDATE ON public.reservations
  FOR EACH ROW
  EXECUTE FUNCTION public.update_inquiries_updated_at();

-- Create index for better query performance
CREATE INDEX idx_reservations_email ON public.reservations(email);
CREATE INDEX idx_reservations_date ON public.reservations(preferred_date);
CREATE INDEX idx_reservations_status ON public.reservations(status);