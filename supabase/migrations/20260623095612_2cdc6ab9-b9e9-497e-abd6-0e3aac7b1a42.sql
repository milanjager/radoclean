-- 1) Private secret storage
CREATE TABLE IF NOT EXISTS public.app_secrets (
  key text PRIMARY KEY,
  value text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

GRANT ALL ON public.app_secrets TO service_role;
ALTER TABLE public.app_secrets ENABLE ROW LEVEL SECURITY;
-- no policies: anon/authenticated have zero access; only service_role bypasses RLS

INSERT INTO public.app_secrets (key, value)
VALUES ('webhook_secret', encode(extensions.gen_random_bytes(32), 'hex'))
ON CONFLICT (key) DO NOTHING;

-- 2) Update chat trigger to include shared secret header
CREATE OR REPLACE FUNCTION public.trigger_notify_new_chat()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, extensions, net
AS $function$
DECLARE
  request_id bigint;
  payload jsonb;
  v_secret text;
BEGIN
  IF NEW.sender_type = 'visitor' THEN
    SELECT value INTO v_secret FROM public.app_secrets WHERE key = 'webhook_secret';
    payload := jsonb_build_object('record', row_to_json(NEW));

    SELECT net.http_post(
      url := 'https://xeogwgtqbgpthfpxoofw.supabase.co/functions/v1/notify-new-chat',
      headers := jsonb_build_object(
        'Content-Type', 'application/json',
        'Authorization', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inhlb2d3Z3RxYmdwdGhmcHhvb2Z3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI5MDIyOTksImV4cCI6MjA3ODQ3ODI5OX0.N-4dPHz-YCyjEi-4N8OxpMvhKLsgsNBjaF7HDiuNPz0',
        'X-Webhook-Secret', v_secret
      ),
      body := payload
    ) INTO request_id;
  END IF;

  RETURN NEW;
END;
$function$;

-- 3) Update inquiry trigger to include shared secret header
CREATE OR REPLACE FUNCTION public.trigger_notify_new_inquiry()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, extensions, net
AS $function$
DECLARE
  request_id bigint;
  payload jsonb;
  v_secret text;
BEGIN
  SELECT value INTO v_secret FROM public.app_secrets WHERE key = 'webhook_secret';
  payload := jsonb_build_object('record', row_to_json(NEW));

  SELECT net.http_post(
    url := 'https://xeogwgtqbgpthfpxoofw.supabase.co/functions/v1/notify-new-inquiry',
    headers := jsonb_build_object(
      'Content-Type', 'application/json',
      'Authorization', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inhlb2d3Z3RxYmdwdGhmcHhvb2Z3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI5MDIyOTksImV4cCI6MjA3ODQ3ODI5OX0.N-4dPHz-YCyjEi-4N8OxpMvhKLsgsNBjaF7HDiuNPz0',
      'X-Webhook-Secret', v_secret
    ),
    body := payload
  ) INTO request_id;

  RETURN NEW;
END;
$function$;

-- 4) New trigger function for reservations
CREATE OR REPLACE FUNCTION public.trigger_notify_new_reservation()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, extensions, net
AS $function$
DECLARE
  request_id bigint;
  v_secret text;
BEGIN
  SELECT value INTO v_secret FROM public.app_secrets WHERE key = 'webhook_secret';

  SELECT net.http_post(
    url := 'https://xeogwgtqbgpthfpxoofw.supabase.co/functions/v1/send-reservation-confirmation',
    headers := jsonb_build_object(
      'Content-Type', 'application/json',
      'Authorization', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inhlb2d3Z3RxYmdwdGhmcHhvb2Z3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI5MDIyOTksImV4cCI6MjA3ODQ3ODI5OX0.N-4dPHz-YCyjEi-4N8OxpMvhKLsgsNBjaF7HDiuNPz0',
      'X-Webhook-Secret', v_secret
    ),
    body := jsonb_build_object('reservationId', NEW.id::text)
  ) INTO request_id;

  RETURN NEW;
END;
$function$;

DROP TRIGGER IF EXISTS trg_notify_new_reservation ON public.reservations;
CREATE TRIGGER trg_notify_new_reservation
AFTER INSERT ON public.reservations
FOR EACH ROW EXECUTE FUNCTION public.trigger_notify_new_reservation();