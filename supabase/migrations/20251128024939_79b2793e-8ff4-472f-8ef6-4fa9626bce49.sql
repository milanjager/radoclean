-- Fix inquiries table RLS policies - Admin only access
DROP POLICY IF EXISTS "Authenticated users can view inquiries" ON inquiries;
DROP POLICY IF EXISTS "Authenticated users can update inquiries" ON inquiries;

CREATE POLICY "Admins can view all inquiries" 
ON inquiries
FOR SELECT 
TO authenticated
USING (has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update inquiries" 
ON inquiries
FOR UPDATE 
TO authenticated
USING (has_role(auth.uid(), 'admin'));

-- Fix chat_conversations RLS policies
-- Remove the overly permissive anonymous SELECT policy
DROP POLICY IF EXISTS "Users can view their own conversations" ON chat_conversations;

-- Admins can view all conversations
CREATE POLICY "Admins can view all conversations" 
ON chat_conversations
FOR SELECT
TO authenticated
USING (has_role(auth.uid(), 'admin'));

-- Fix chat_messages RLS policies  
-- Remove the overly permissive anonymous SELECT policy
DROP POLICY IF EXISTS "Anyone can view messages" ON chat_messages;

-- Admins can view all messages
CREATE POLICY "Admins can view all messages"
ON chat_messages
FOR SELECT  
TO authenticated
USING (has_role(auth.uid(), 'admin'));