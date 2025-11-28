-- Drop existing restrictive INSERT policies if they exist
DROP POLICY IF EXISTS "Anyone can create conversations" ON public.chat_conversations;
DROP POLICY IF EXISTS "Anyone can insert messages" ON public.chat_messages;

-- Create permissive policies for anonymous users to create chat conversations and messages
CREATE POLICY "Public can create conversations"
  ON public.chat_conversations
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Public can insert messages"
  ON public.chat_messages
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);
