CREATE EXTENSION IF NOT EXISTS pg_net WITH SCHEMA extensions;
-- ensure trigger function can find net.http_post via search_path
ALTER FUNCTION public.trigger_notify_new_inquiry() SET search_path = public, extensions, net;
ALTER FUNCTION public.trigger_notify_new_chat() SET search_path = public, extensions, net;