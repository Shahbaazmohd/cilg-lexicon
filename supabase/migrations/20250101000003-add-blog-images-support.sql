-- Add image_url column to blog_posts table
ALTER TABLE public.blog_posts
ADD COLUMN image_url TEXT;

COMMENT ON COLUMN public.blog_posts.image_url IS 'URL of the featured image for the blog post';

-- Create blog-images storage bucket for blog post images
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'blog-images',
  'blog-images',
  true,
  5242880, -- 5MB limit
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/jpg']
) ON CONFLICT (id) DO NOTHING;

-- Set up RLS policies for blog-images bucket
-- Drop existing policies if they exist to avoid conflicts
DROP POLICY IF EXISTS "Public Access" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can upload blog images" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can update blog images" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can delete blog images" ON storage.objects;

-- Create new policies
CREATE POLICY "Public Access" ON storage.objects
  FOR SELECT USING (bucket_id = 'blog-images');

CREATE POLICY "Anyone can upload blog images" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'blog-images'
  );

CREATE POLICY "Anyone can update blog images" ON storage.objects
  FOR UPDATE USING (
    bucket_id = 'blog-images'
  );

CREATE POLICY "Anyone can delete blog images" ON storage.objects
  FOR DELETE USING (
    bucket_id = 'blog-images'
  ); 