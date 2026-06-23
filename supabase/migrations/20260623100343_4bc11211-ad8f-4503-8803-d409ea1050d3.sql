
-- inquiries
DROP POLICY IF EXISTS "Anyone can submit inquiry" ON public.inquiries;
CREATE POLICY "Anyone can submit inquiry" ON public.inquiries
  FOR INSERT TO anon, authenticated
  WITH CHECK (
    length(name) BETWEEN 1 AND 200
    AND email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$' AND length(email) <= 320
    AND (phone IS NULL OR length(phone) <= 40)
    AND length(message) BETWEEN 1 AND 5000
    AND (status IS NULL OR status = 'new')
  );

-- feedback
DROP POLICY IF EXISTS "Anyone can submit feedback" ON public.feedback;
CREATE POLICY "Anyone can submit feedback" ON public.feedback
  FOR INSERT TO anon, authenticated
  WITH CHECK (
    (name IS NULL OR length(name) <= 200)
    AND (email IS NULL OR (email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$' AND length(email) <= 320))
    AND length(message) BETWEEN 1 AND 5000
    AND (rating IS NULL OR rating BETWEEN 1 AND 5)
  );

-- chat_conversations
DROP POLICY IF EXISTS "Anyone can create conversations" ON public.chat_conversations;
CREATE POLICY "Anyone can create conversations" ON public.chat_conversations
  FOR INSERT TO anon, authenticated
  WITH CHECK (
    length(visitor_id) BETWEEN 8 AND 128
    AND (visitor_name IS NULL OR length(visitor_name) <= 200)
    AND (visitor_email IS NULL OR (visitor_email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$' AND length(visitor_email) <= 320))
    AND (status IS NULL OR status IN ('active','closed'))
  );

-- chat_messages: only visitor-sent messages from public clients
DROP POLICY IF EXISTS "Anyone can insert messages" ON public.chat_messages;
CREATE POLICY "Visitors can insert visitor messages" ON public.chat_messages
  FOR INSERT TO anon, authenticated
  WITH CHECK (
    sender_type = 'visitor'
    AND length(message) BETWEEN 1 AND 5000
    AND (sender_name IS NULL OR length(sender_name) <= 200)
    AND EXISTS (SELECT 1 FROM public.chat_conversations c WHERE c.id = conversation_id)
  );

-- job_applications
DROP POLICY IF EXISTS "Anyone can submit job application" ON public.job_applications;
CREATE POLICY "Anyone can submit job application" ON public.job_applications
  FOR INSERT TO anon, authenticated
  WITH CHECK (
    length(name) BETWEEN 1 AND 200
    AND email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$' AND length(email) <= 320
    AND (phone IS NULL OR length(phone) <= 40)
    AND length(position) BETWEEN 1 AND 200
    AND (message IS NULL OR length(message) <= 5000)
    AND (cv_url IS NULL OR length(cv_url) <= 2000)
  );
