-- Update triggers to use proper Supabase webhook approach
-- These functions will use the pg_net extension which is pre-configured with Supabase

-- Update trigger_notify_new_chat function
CREATE OR REPLACE FUNCTION trigger_notify_new_chat()
RETURNS TRIGGER
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
    
    -- Use Supabase's internal network to call edge function
    SELECT net.http_post(
      url := 'https://xeogwgtqbgpthfpxoofw.supabase.co/functions/v1/notify-new-chat',
      headers := jsonb_build_object(
        'Content-Type', 'application/json',
        'Authorization', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inhlb2d3Z3RxYmdwdGhmcHhvb2Z3Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MjkwMjI5OSwiZXhwIjoyMDc4NDc4Mjk5fQ.zyGqC9pOa-Nyu-6mz1LQn5hqSi0qT5bqTnwmLpZlJcI'
      ),
      body := payload
    ) INTO request_id;
  END IF;
  
  RETURN NEW;
END;
$$;

-- Update trigger_notify_new_inquiry function
CREATE OR REPLACE FUNCTION trigger_notify_new_inquiry()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  request_id bigint;
  payload jsonb;
BEGIN
  payload := jsonb_build_object('record', row_to_json(NEW));
  
  -- Use Supabase's internal network to call edge function
  SELECT net.http_post(
    url := 'https://xeogwgtqbgpthfpxoofw.supabase.co/functions/v1/notify-new-inquiry',
    headers := jsonb_build_object(
      'Content-Type', 'application/json',
      'Authorization', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inhlb2d3Z3RxYmdwdGhmcHhvb2Z3Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MjkwMjI5OSwiZXhwIjoyMDc4NDc4Mjk5fQ.zyGqC9pOa-Nyu-6mz1LQn5hqSi0qT5bqTnwmLpZlJcI'
    ),
    body := payload
  ) INTO request_id;
  
  RETURN NEW;
END;
$$;
