-- Create storage bucket for CV uploads
INSERT INTO storage.buckets (id, name, public)
VALUES ('cv-uploads', 'cv-uploads', false)
ON CONFLICT (id) DO NOTHING;

-- RLS policy for CV uploads - anyone can upload
CREATE POLICY "Anyone can upload CV"
ON storage.objects
FOR INSERT
TO anon, authenticated
WITH CHECK (bucket_id = 'cv-uploads');

-- Admins can view/delete CVs
CREATE POLICY "Admins can view CVs"
ON storage.objects
FOR SELECT
TO authenticated
USING (bucket_id = 'cv-uploads' AND public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete CVs"
ON storage.objects
FOR DELETE
TO authenticated
USING (bucket_id = 'cv-uploads' AND public.has_role(auth.uid(), 'admin'));

-- Create job applications table
CREATE TABLE public.job_applications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  position TEXT NOT NULL,
  message TEXT,
  cv_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.job_applications ENABLE ROW LEVEL SECURITY;

-- Anyone can submit application
CREATE POLICY "Anyone can submit job application"
ON public.job_applications
FOR INSERT
TO anon, authenticated
WITH CHECK (true);

-- Admins can view applications
CREATE POLICY "Admins can view job applications"
ON public.job_applications
FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));