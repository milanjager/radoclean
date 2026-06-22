DROP POLICY IF EXISTS "Anyone can upload CV" ON storage.objects;

CREATE POLICY "Anyone can upload CV"
ON storage.objects
FOR INSERT
TO anon, authenticated
WITH CHECK (
  bucket_id = 'cv-uploads'
  AND (
    lower(name) LIKE '%.pdf'
    OR lower(name) LIKE '%.doc'
    OR lower(name) LIKE '%.docx'
  )
);