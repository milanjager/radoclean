DROP POLICY IF EXISTS "Anyone can upload CV" ON storage.objects;

CREATE POLICY "Anyone can upload CV"
ON storage.objects
FOR INSERT
TO anon, authenticated
WITH CHECK (
  bucket_id = 'cv-uploads'
  AND (lower(name) LIKE '%.pdf' OR lower(name) LIKE '%.doc' OR lower(name) LIKE '%.docx')
  AND length(name) BETWEEN 10 AND 200
  AND name !~ '\.\./'
  AND name !~ '^/'
);

CREATE POLICY "Admins can update CVs"
ON storage.objects
FOR UPDATE
TO authenticated
USING (bucket_id = 'cv-uploads' AND public.has_role(auth.uid(), 'admin'))
WITH CHECK (bucket_id = 'cv-uploads' AND public.has_role(auth.uid(), 'admin'));