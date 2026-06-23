-- Revoke EXECUTE from anon/PUBLIC on SECURITY DEFINER functions that are not intended for anonymous callers.
-- Legacy reservation insert (superseded by insert_reservation_secure)
REVOKE EXECUTE ON FUNCTION public.insert_reservation(text, text, text, text, text, text, text, jsonb, integer, integer, integer, date, text, text, text) FROM PUBLIC, anon, authenticated;

-- Queue/email helper functions are only called from edge functions (service_role)
REVOKE EXECUTE ON FUNCTION public.enqueue_email(text, jsonb) FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.read_email_batch(text, integer, integer) FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.delete_email(text, bigint) FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.move_to_dlq(text, text, bigint, jsonb) FROM PUBLIC, anon, authenticated;

-- has_role is called from RLS policies (runs as definer regardless), no need for anon EXECUTE
REVOKE EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) FROM PUBLIC, anon;
