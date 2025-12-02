-- Add delete policy for job applications
CREATE POLICY "Admins can delete job applications"
ON public.job_applications
FOR DELETE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));