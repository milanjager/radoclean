-- Drop existing restrictive SELECT policy on feedback table
DROP POLICY IF EXISTS "Admins can view all feedback" ON public.feedback;

-- Create a PERMISSIVE SELECT policy that only allows admin access
CREATE POLICY "Admins can view all feedback" 
ON public.feedback 
FOR SELECT 
TO authenticated
USING (public.has_role(auth.uid(), 'admin'::app_role));