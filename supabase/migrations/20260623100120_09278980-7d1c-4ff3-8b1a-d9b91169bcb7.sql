
-- has_role: only authenticated
REVOKE EXECUTE ON FUNCTION public.has_role(uuid, app_role) FROM PUBLIC, anon;

-- get_or_create_referral_code: only authenticated
REVOKE EXECUTE ON FUNCTION public.get_or_create_referral_code(text) FROM PUBLIC, anon;

-- insert_reservation: deprecated, lock down entirely
REVOKE EXECUTE ON FUNCTION public.insert_reservation(text, text, text, text, text, text, text, jsonb, integer, integer, integer, date, text, text, text) FROM PUBLIC, anon, authenticated;

-- trigger_notify_new_reservation: trigger only
REVOKE EXECUTE ON FUNCTION public.trigger_notify_new_reservation() FROM PUBLIC, anon, authenticated;
