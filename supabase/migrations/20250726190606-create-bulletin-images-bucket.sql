-- Create bulletin-images storage bucket
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'bulletin-images',
  'bulletin-images',
  true,
  10485760, -- 10MB limit for bulletin images
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/jpg', 'image/gif']
);

-- Set up RLS policies for bulletin-images bucket
-- Public read access for bulletin images
CREATE POLICY "Public Access to Bulletin Images" ON storage.objects
  FOR SELECT USING (bucket_id = 'bulletin-images');

-- Allow anyone to upload (since admin auth is handled via localStorage)
CREATE POLICY "Anyone can upload bulletin images" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'bulletin-images');

-- Allow anyone to update (since admin auth is handled via localStorage)
CREATE POLICY "Anyone can update bulletin images" ON storage.objects
  FOR UPDATE USING (bucket_id = 'bulletin-images');

-- Allow anyone to delete (since admin auth is handled via localStorage)
CREATE POLICY "Anyone can delete bulletin images" ON storage.objects
  FOR DELETE USING (bucket_id = 'bulletin-images'); 