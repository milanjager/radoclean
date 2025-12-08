-- Create a SECURITY DEFINER function to insert reservations (bypasses RLS)
CREATE OR REPLACE FUNCTION public.insert_reservation(
  p_name text,
  p_email text,
  p_phone text,
  p_address text,
  p_city text,
  p_postal_code text,
  p_package_type text,
  p_extras jsonb,
  p_base_price integer,
  p_extras_price integer,
  p_total_price integer,
  p_preferred_date date,
  p_preferred_time text,
  p_notes text,
  p_referral_code text
)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  new_id uuid;
BEGIN
  INSERT INTO public.reservations (
    name, email, phone, address, city, postal_code,
    package_type, extras, base_price, extras_price, total_price,
    preferred_date, preferred_time, notes, referral_code
  ) VALUES (
    p_name, p_email, p_phone, p_address, p_city, p_postal_code,
    p_package_type, p_extras, p_base_price, p_extras_price, p_total_price,
    p_preferred_date, p_preferred_time, p_notes, p_referral_code
  )
  RETURNING id INTO new_id;
  
  RETURN new_id;
END;
$$;

-- Grant execute permission to anon and authenticated roles
GRANT EXECUTE ON FUNCTION public.insert_reservation TO anon, authenticated;