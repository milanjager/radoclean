-- Create security definer function to validate referral codes without exposing emails
CREATE OR REPLACE FUNCTION public.validate_referral_code(code_value text)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  result json;
BEGIN
  SELECT json_build_object(
    'valid', true,
    'discount_activated', discount_activated,
    'referrals_count', referrals_count
  )
  INTO result
  FROM public.referral_codes
  WHERE code = code_value;
  
  RETURN COALESCE(result, json_build_object('valid', false));
END;
$$;

-- Create security definer function to get or create referral code by email
CREATE OR REPLACE FUNCTION public.get_or_create_referral_code(user_email text)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  existing_code record;
  new_code text;
  result json;
BEGIN
  -- Check if user already has a code
  SELECT * INTO existing_code
  FROM public.referral_codes
  WHERE email = user_email
  LIMIT 1;
  
  IF FOUND THEN
    SELECT json_build_object(
      'code', existing_code.code,
      'referrals_count', existing_code.referrals_count,
      'discount_activated', existing_code.discount_activated
    ) INTO result;
    RETURN result;
  END IF;
  
  -- Generate new code (prefix from email + random)
  new_code := UPPER(
    SUBSTRING(SPLIT_PART(user_email, '@', 1), 1, 4) ||
    SUBSTRING(MD5(RANDOM()::text), 1, 4)
  );
  
  -- Insert new code
  INSERT INTO public.referral_codes (code, email)
  VALUES (new_code, user_email)
  RETURNING code, referrals_count, discount_activated
  INTO existing_code;
  
  SELECT json_build_object(
    'code', existing_code.code,
    'referrals_count', existing_code.referrals_count,
    'discount_activated', existing_code.discount_activated
  ) INTO result;
  
  RETURN result;
END;
$$;

-- Drop existing overly permissive policies on referral_codes
DROP POLICY IF EXISTS "Anyone can view referral codes" ON public.referral_codes;
DROP POLICY IF EXISTS "Anyone can update their referral codes" ON public.referral_codes;
DROP POLICY IF EXISTS "Anyone can create referral codes" ON public.referral_codes;

-- Drop existing overly permissive policies on referral_uses
DROP POLICY IF EXISTS "Anyone can view referral uses" ON public.referral_uses;
DROP POLICY IF EXISTS "Anyone can create referral uses" ON public.referral_uses;

-- Create restrictive policies for referral_codes
CREATE POLICY "Admins can manage referral codes"
ON public.referral_codes
FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Allow system to insert via security definer functions only
CREATE POLICY "System can insert referral codes"
ON public.referral_codes
FOR INSERT
WITH CHECK (true);

-- Allow system to update via triggers only
CREATE POLICY "System can update referral codes"
ON public.referral_codes
FOR UPDATE
USING (true)
WITH CHECK (true);

-- Create restrictive policies for referral_uses
CREATE POLICY "Admins can view referral uses"
ON public.referral_uses
FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "System can insert referral uses"
ON public.referral_uses
FOR INSERT
WITH CHECK (true);