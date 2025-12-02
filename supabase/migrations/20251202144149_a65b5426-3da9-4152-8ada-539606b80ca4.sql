-- Drop existing restrictive INSERT policies and recreate as permissive for anonymous access

-- Fix inquiries table - allow anonymous inserts
DROP POLICY IF EXISTS "Anyone can submit inquiry" ON public.inquiries;
CREATE POLICY "Anyone can submit inquiry" 
ON public.inquiries 
FOR INSERT 
TO anon, authenticated
WITH CHECK (true);

-- Fix feedback table - allow anonymous inserts
DROP POLICY IF EXISTS "Anyone can submit feedback" ON public.feedback;
CREATE POLICY "Anyone can submit feedback" 
ON public.feedback 
FOR INSERT 
TO anon, authenticated
WITH CHECK (true);

-- Fix reservations table - allow anonymous inserts
DROP POLICY IF EXISTS "Anyone can submit reservation" ON public.reservations;
CREATE POLICY "Anyone can submit reservation" 
ON public.reservations 
FOR INSERT 
TO anon, authenticated
WITH CHECK (true);

-- Fix chat_conversations table - allow anonymous inserts
DROP POLICY IF EXISTS "Anyone can create conversations" ON public.chat_conversations;
CREATE POLICY "Anyone can create conversations" 
ON public.chat_conversations 
FOR INSERT 
TO anon, authenticated
WITH CHECK (true);

-- Fix chat_messages table - allow anonymous inserts
DROP POLICY IF EXISTS "Anyone can insert messages" ON public.chat_messages;
CREATE POLICY "Anyone can insert messages" 
ON public.chat_messages 
FOR INSERT 
TO anon, authenticated
WITH CHECK (true);