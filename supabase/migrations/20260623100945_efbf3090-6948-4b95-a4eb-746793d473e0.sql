DROP POLICY IF EXISTS "Anyone can create conversations" ON public.chat_conversations;

CREATE POLICY "Anyone can create conversations"
ON public.chat_conversations
FOR INSERT
TO anon, authenticated
WITH CHECK (
  visitor_id IS NOT NULL
  AND length(visitor_id) BETWEEN 8 AND 128
  AND NOT EXISTS (
    SELECT 1 FROM public.chat_conversations c
    WHERE c.visitor_id = chat_conversations.visitor_id
      AND COALESCE(c.visitor_email, '') <> COALESCE(chat_conversations.visitor_email, '')
  )
);