-- Create hero-images storage bucket
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'hero-images',
  'hero-images',
  true,
  5242880, -- 5MB limit
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/jpg']
);

-- Set up RLS policies for hero-images bucket
CREATE POLICY "Public Access" ON storage.objects
  FOR SELECT USING (bucket_id = 'hero-images');

CREATE POLICY "Authenticated users can upload hero images" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'hero-images' 
    AND auth.role() = 'authenticated'
  );

CREATE POLICY "Authenticated users can update hero images" ON storage.objects
  FOR UPDATE USING (
    bucket_id = 'hero-images' 
    AND auth.role() = 'authenticated'
  );

CREATE POLICY "Authenticated users can delete hero images" ON storage.objects
  FOR DELETE USING (
    bucket_id = 'hero-images' 
    AND auth.role() = 'authenticated'
  ); 