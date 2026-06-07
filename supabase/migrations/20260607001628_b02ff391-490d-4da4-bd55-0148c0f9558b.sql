-- Create public email-assets bucket for logo and email images
begin;
  -- Drop existing policy if it exists to avoid duplicates
  drop policy if exists "Public email assets access" on storage.objects;
  
  create policy "Public email assets access"
  on storage.objects
  for select
  to anon, authenticated
  using ( bucket_id = 'email-assets' );
commit;

begin;
  drop policy if exists "Allow authenticated uploads to email-assets" on storage.objects;
  
  create policy "Allow authenticated uploads to email-assets"
  on storage.objects
  for insert
  to authenticated
  with check ( bucket_id = 'email-assets' );
commit;

begin;
  drop policy if exists "Allow service_role uploads to email-assets" on storage.objects;
  
  create policy "Allow service_role uploads to email-assets"
  on storage.objects
  for all
  to service_role
  using ( bucket_id = 'email-assets' )
  with check ( bucket_id = 'email-assets' );
commit;