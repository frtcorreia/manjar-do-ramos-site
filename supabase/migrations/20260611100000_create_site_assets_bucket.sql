-- Create public bucket for site assets (logo, etc.)
INSERT INTO storage.buckets (id, name, public)
VALUES ('site-assets', 'site-assets', true)
ON CONFLICT (id) DO NOTHING;

-- Allow anyone to read files from the bucket
CREATE POLICY "Public read access" ON storage.objects
  FOR SELECT
  USING (bucket_id = 'site-assets');

-- Allow authenticated users to upload/update/delete
CREATE POLICY "Authenticated upload" ON storage.objects
  FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'site-assets');

CREATE POLICY "Authenticated update" ON storage.objects
  FOR UPDATE
  TO authenticated
  USING (bucket_id = 'site-assets');

CREATE POLICY "Authenticated delete" ON storage.objects
  FOR DELETE
  TO authenticated
  USING (bucket_id = 'site-assets');
