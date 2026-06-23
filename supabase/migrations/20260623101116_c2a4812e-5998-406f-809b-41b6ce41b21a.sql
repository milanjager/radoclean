-- 1. Server-side function: enforces that the caller's visitor_id matches the conversation
CREATE OR REPLACE FUNCTION public.insert_visitor_chat_message(
  p_conversation_id uuid,
  p_visitor_id text,
  p_sender_name text,
  p_message text
)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  v_owner text;
  v_new_id uuid;
BEGIN
  IF p_visitor_id IS NULL OR length(p_visitor_id) < 8 THEN
    RAISE EXCEPTION 'invalid visitor id';
  END IF;
  IF p_message IS NULL OR length(p_message) < 1 OR length(p_message) > 5000 THEN
    RAISE EXCEPTION 'invalid message';
  END IF;
  IF p_sender_name IS NOT NULL AND length(p_sender_name) > 200 THEN
    RAISE EXCEPTION 'invalid sender name';
  END IF;

  SELECT visitor_id INTO v_owner
  FROM public.chat_conversations
  WHERE id = p_conversation_id;

  IF v_owner IS NULL THEN
    RAISE EXCEPTION 'conversation not found';
  END IF;
  IF v_owner <> p_visitor_id THEN
    RAISE EXCEPTION 'visitor does not own this conversation';
  END IF;

  INSERT INTO public.chat_messages (conversation_id, sender_type, sender_name, message)
  VALUES (p_conversation_id, 'visitor', p_sender_name, p_message)
  RETURNING id INTO v_new_id;

  RETURN v_new_id;
END;
$$;

REVOKE EXECUTE ON FUNCTION public.insert_visitor_chat_message(uuid, text, text, text) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.insert_visitor_chat_message(uuid, text, text, text) TO anon, authenticated;

-- 2. Remove direct INSERT access from public clients
DROP POLICY IF EXISTS "Visitors can insert visitor messages" ON public.chat_messages;

-- 3. Allow admins to insert agent replies via the regular API
DROP POLICY IF EXISTS "Admins can insert messages" ON public.chat_messages;
CREATE POLICY "Admins can insert messages" ON public.chat_messages
  FOR INSERT TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'admin'));
