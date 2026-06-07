-- Grant authenticated SELECT on email_send_log (RLS still restricts to admins)
GRANT SELECT ON public.email_send_log TO authenticated;

-- Drop and recreate the admin SELECT policy to be safe across re-runs
DROP POLICY IF EXISTS "Admins can read email send log" ON public.email_send_log;

CREATE POLICY "Admins can read email send log"
ON public.email_send_log
FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Helpful index for fast lookups by idempotency key (used by the delivery log UI)
CREATE INDEX IF NOT EXISTS email_send_log_idempotency_key_idx
  ON public.email_send_log ((metadata->>'idempotency_key'));