-- Fix RLS policies for chat to allow anonymous users

-- Drop existing policies
DROP POLICY IF EXISTS "Public can create conversations" ON public.chat_conversations;
DROP POLICY IF EXISTS "Public can insert messages" ON public.chat_messages;
DROP POLICY IF EXISTS "Anyone can create conversations" ON public.chat_conversations;
DROP POLICY IF EXISTS "Anyone can insert messages" ON public.chat_messages;

-- Create proper policies for anonymous chat
-- Allow anyone (anon + authenticated) to create conversations
CREATE POLICY "Anyone can create conversations"
ON public.chat_conversations
FOR INSERT
TO anon, authenticated
WITH CHECK (true);

-- Allow anyone to insert messages
CREATE POLICY "Anyone can insert messages"
ON public.chat_messages
FOR INSERT
TO anon, authenticated
WITH CHECK (true);