-- Create referral_codes table for neighborhood discount tracking
CREATE TABLE IF NOT EXISTS public.referral_codes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  code TEXT NOT NULL UNIQUE,
  email TEXT NOT NULL,
  referrals_count INTEGER NOT NULL DEFAULT 0,
  discount_activated BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create referral_uses table to track who used which referral code
CREATE TABLE IF NOT EXISTS public.referral_uses (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  referral_code_id UUID NOT NULL REFERENCES public.referral_codes(id) ON DELETE CASCADE,
  user_email TEXT NOT NULL,
  reservation_id UUID REFERENCES public.reservations(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.referral_codes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.referral_uses ENABLE ROW LEVEL SECURITY;

-- Create policies for referral_codes (public read, authenticated write)
CREATE POLICY "Anyone can view referral codes"
  ON public.referral_codes
  FOR SELECT
  USING (true);

CREATE POLICY "Anyone can create referral codes"
  ON public.referral_codes
  FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Anyone can update their referral codes"
  ON public.referral_codes
  FOR UPDATE
  USING (true);

-- Create policies for referral_uses
CREATE POLICY "Anyone can view referral uses"
  ON public.referral_uses
  FOR SELECT
  USING (true);

CREATE POLICY "Anyone can create referral uses"
  ON public.referral_uses
  FOR INSERT
  WITH CHECK (true);

-- Create function to update referral count
CREATE OR REPLACE FUNCTION public.update_referral_count()
RETURNS TRIGGER AS $$
BEGIN
  -- Update the referrals_count in referral_codes
  UPDATE public.referral_codes
  SET 
    referrals_count = (
      SELECT COUNT(*) 
      FROM public.referral_uses 
      WHERE referral_code_id = NEW.referral_code_id
    ),
    discount_activated = (
      SELECT COUNT(*) >= 2
      FROM public.referral_uses 
      WHERE referral_code_id = NEW.referral_code_id
    ),
    updated_at = now()
  WHERE id = NEW.referral_code_id;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Create trigger to automatically update referral count
CREATE TRIGGER update_referral_count_trigger
  AFTER INSERT ON public.referral_uses
  FOR EACH ROW
  EXECUTE FUNCTION public.update_referral_count();

-- Create index for faster lookups
CREATE INDEX idx_referral_codes_code ON public.referral_codes(code);
CREATE INDEX idx_referral_uses_code_id ON public.referral_uses(referral_code_id);

-- Add referral_code column to reservations table
ALTER TABLE public.reservations 
ADD COLUMN IF NOT EXISTS referral_code TEXT REFERENCES public.referral_codes(code) ON DELETE SET NULL;

CREATE INDEX idx_reservations_referral_code ON public.reservations(referral_code);