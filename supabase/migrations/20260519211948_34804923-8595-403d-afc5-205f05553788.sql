
-- 1) Remove permissive referral_codes policies
DROP POLICY IF EXISTS "System can update referral codes" ON public.referral_codes;
DROP POLICY IF EXISTS "System can insert referral codes" ON public.referral_codes;

-- 2) Explicit deny for anonymous/public SELECT on feedback (admins still allowed via existing policy)
DROP POLICY IF EXISTS "Block public read of feedback" ON public.feedback;
CREATE POLICY "Block public read of feedback"
ON public.feedback
AS RESTRICTIVE
FOR SELECT
TO anon, authenticated
USING (has_role(auth.uid(), 'admin'::app_role));
