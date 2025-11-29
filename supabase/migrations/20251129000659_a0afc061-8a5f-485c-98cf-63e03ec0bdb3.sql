-- Fix search_path security warnings for notification functions

-- Update trigger_notify_new_chat function with search_path
CREATE OR REPLACE FUNCTION trigger_notify_new_chat()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  request_id bigint;
BEGIN
  -- Only trigger for visitor messages
  IF NEW.sender_type = 'visitor' THEN
    SELECT net.http_post(
      url := current_setting('app.settings.api_url', true) || '/functions/v1/notify-new-chat',
      headers := jsonb_build_object(
        'Content-Type', 'application/json',
        'Authorization', 'Bearer ' || current_setting('app.settings.service_role_key', true)
      ),
      body := jsonb_build_object('record', row_to_json(NEW))
    ) INTO request_id;
  END IF;
  
  RETURN NEW;
END;
$$;

-- Update trigger_notify_new_inquiry function with search_path
CREATE OR REPLACE FUNCTION trigger_notify_new_inquiry()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  request_id bigint;
BEGIN
  SELECT net.http_post(
    url := current_setting('app.settings.api_url', true) || '/functions/v1/notify-new-inquiry',
    headers := jsonb_build_object(
      'Content-Type', 'application/json',
      'Authorization', 'Bearer ' || current_setting('app.settings.service_role_key', true)
    ),
    body := jsonb_build_object('record', row_to_json(NEW))
  ) INTO request_id;
  
  RETURN NEW;
END;
$$;
