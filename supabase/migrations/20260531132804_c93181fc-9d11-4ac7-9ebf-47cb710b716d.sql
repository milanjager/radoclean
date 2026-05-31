
-- 1. Remove direct INSERT on reservations (app uses insert_reservation RPC)
DROP POLICY IF EXISTS "Anyone can submit reservation" ON public.reservations;

-- 2. Replace permissive referral_uses INSERT with SECURITY DEFINER RPC
DROP POLICY IF EXISTS "System can insert referral uses" ON public.referral_uses;

CREATE OR REPLACE FUNCTION public.record_referral_use(
  p_referral_code text,
  p_user_email text,
  p_reservation_id uuid
)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_code_id uuid;
  v_use_id uuid;
BEGIN
  IF p_referral_code IS NULL OR length(trim(p_referral_code)) = 0 THEN
    RETURN NULL;
  END IF;

  SELECT id INTO v_code_id
  FROM public.referral_codes
  WHERE code = p_referral_code
  LIMIT 1;

  IF v_code_id IS NULL THEN
    RETURN NULL;
  END IF;

  -- Verify the reservation actually exists and email matches (sanity check)
  IF NOT EXISTS (
    SELECT 1 FROM public.reservations
    WHERE id = p_reservation_id AND email = p_user_email
  ) THEN
    RETURN NULL;
  END IF;

  INSERT INTO public.referral_uses (referral_code_id, user_email, reservation_id)
  VALUES (v_code_id, p_user_email, p_reservation_id)
  RETURNING id INTO v_use_id;

  RETURN v_use_id;
END;
$$;

REVOKE EXECUTE ON FUNCTION public.record_referral_use(text, text, uuid) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.record_referral_use(text, text, uuid) TO anon, authenticated;

-- 3. Set search_path on email helper functions (linter: function_search_path_mutable)
ALTER FUNCTION public.enqueue_email(text, jsonb) SET search_path = public, extensions;
ALTER FUNCTION public.read_email_batch(text, integer, integer) SET search_path = public, extensions;
ALTER FUNCTION public.delete_email(text, bigint) SET search_path = public, extensions;
ALTER FUNCTION public.move_to_dlq(text, text, bigint, jsonb) SET search_path = public, extensions;

-- 4. Revoke EXECUTE on internal/trigger-only SECURITY DEFINER functions from public roles
REVOKE EXECUTE ON FUNCTION public.enqueue_email(text, jsonb) FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.read_email_batch(text, integer, integer) FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.delete_email(text, bigint) FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.move_to_dlq(text, text, bigint, jsonb) FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.trigger_notify_new_inquiry() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.trigger_notify_new_chat() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.update_inquiries_updated_at() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.update_referral_count() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.update_availability_on_reservation() FROM PUBLIC, anon, authenticated;
