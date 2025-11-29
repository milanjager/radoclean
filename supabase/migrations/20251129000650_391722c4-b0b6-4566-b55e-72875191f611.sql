-- Create webhook triggers for email notifications

-- Function to trigger notify-new-chat edge function
CREATE OR REPLACE FUNCTION trigger_notify_new_chat()
RETURNS TRIGGER AS $$
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
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to trigger notify-new-inquiry edge function
CREATE OR REPLACE FUNCTION trigger_notify_new_inquiry()
RETURNS TRIGGER AS $$
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
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create triggers
DROP TRIGGER IF EXISTS on_chat_message_created ON public.chat_messages;
CREATE TRIGGER on_chat_message_created
  AFTER INSERT ON public.chat_messages
  FOR EACH ROW
  EXECUTE FUNCTION trigger_notify_new_chat();

DROP TRIGGER IF EXISTS on_inquiry_created ON public.inquiries;
CREATE TRIGGER on_inquiry_created
  AFTER INSERT ON public.inquiries
  FOR EACH ROW
  EXECUTE FUNCTION trigger_notify_new_inquiry();

-- Set configuration parameters (replace with actual values)
-- Note: These need to be set in your Supabase project settings
-- ALTER DATABASE postgres SET app.settings.api_url TO 'https://xeogwgtqbgpthfpxoofw.supabase.co';
-- ALTER DATABASE postgres SET app.settings.service_role_key TO 'your-service-role-key';
