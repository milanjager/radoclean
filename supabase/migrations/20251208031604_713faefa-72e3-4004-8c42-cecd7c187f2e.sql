-- Drop the insecure trigger functions that contain hardcoded service role keys
DROP FUNCTION IF EXISTS public.trigger_notify_new_chat() CASCADE;
DROP FUNCTION IF EXISTS public.trigger_notify_new_inquiry() CASCADE;

-- Drop the triggers that reference these functions (if they exist)
DROP TRIGGER IF EXISTS on_new_chat_message ON public.chat_messages;
DROP TRIGGER IF EXISTS on_new_inquiry ON public.inquiries;

-- Create new secure trigger functions that use pg_net with anon key only (not service role)
-- The edge functions themselves will handle authentication via their own environment variables

CREATE OR REPLACE FUNCTION public.trigger_notify_new_chat()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  request_id bigint;
  payload jsonb;
BEGIN
  -- Only trigger for visitor messages
  IF NEW.sender_type = 'visitor' THEN
    payload := jsonb_build_object('record', row_to_json(NEW));
    
    -- Use pg_net with anon key - edge function handles its own auth via env vars
    SELECT net.http_post(
      url := 'https://xeogwgtqbgpthfpxoofw.supabase.co/functions/v1/notify-new-chat',
      headers := jsonb_build_object(
        'Content-Type', 'application/json',
        'Authorization', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inhlb2d3Z3RxYmdwdGhmcHhvb2Z3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI5MDIyOTksImV4cCI6MjA3ODQ3ODI5OX0.N-4dPHz-YCyjEi-4N8OxpMvhKLsgsNBjaF7HDiuNPz0'
      ),
      body := payload
    ) INTO request_id;
  END IF;
  
  RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.trigger_notify_new_inquiry()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  request_id bigint;
  payload jsonb;
BEGIN
  payload := jsonb_build_object('record', row_to_json(NEW));
  
  -- Use pg_net with anon key - edge function handles its own auth via env vars
  SELECT net.http_post(
    url := 'https://xeogwgtqbgpthfpxoofw.supabase.co/functions/v1/notify-new-inquiry',
    headers := jsonb_build_object(
      'Content-Type', 'application/json',
      'Authorization', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inhlb2d3Z3RxYmdwdGhmcHhvb2Z3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI5MDIyOTksImV4cCI6MjA3ODQ3ODI5OX0.N-4dPHz-YCyjEi-4N8OxpMvhKLsgsNBjaF7HDiuNPz0'
    ),
    body := payload
  ) INTO request_id;
  
  RETURN NEW;
END;
$$;

-- Recreate the triggers
CREATE TRIGGER on_new_chat_message
  AFTER INSERT ON public.chat_messages
  FOR EACH ROW
  EXECUTE FUNCTION public.trigger_notify_new_chat();

CREATE TRIGGER on_new_inquiry
  AFTER INSERT ON public.inquiries
  FOR EACH ROW
  EXECUTE FUNCTION public.trigger_notify_new_inquiry();