-- Create events-images storage bucket for event images
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'events-images',
  'events-images',
  true,
  5242880, -- 5MB limit
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/jpg']
) ON CONFLICT (id) DO NOTHING;

-- Set up RLS policies for events-images bucket
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'objects' 
        AND policyname = 'Public Access for events-images' 
        AND schemaname = 'storage'
    ) THEN
        CREATE POLICY "Public Access for events-images" ON storage.objects
          FOR SELECT USING (bucket_id = 'events-images');
    END IF;
END $$;

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'objects' 
        AND policyname = 'Authenticated users can upload event images' 
        AND schemaname = 'storage'
    ) THEN
        CREATE POLICY "Authenticated users can upload event images" ON storage.objects
          FOR INSERT WITH CHECK (
            bucket_id = 'events-images' 
            AND auth.role() = 'authenticated'
          );
    END IF;
END $$;

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'objects' 
        AND policyname = 'Authenticated users can update event images' 
        AND schemaname = 'storage'
    ) THEN
        CREATE POLICY "Authenticated users can update event images" ON storage.objects
          FOR UPDATE USING (
            bucket_id = 'events-images' 
            AND auth.role() = 'authenticated'
          );
    END IF;
END $$;

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'objects' 
        AND policyname = 'Authenticated users can delete event images' 
        AND schemaname = 'storage'
    ) THEN
        CREATE POLICY "Authenticated users can delete event images" ON storage.objects
          FOR DELETE USING (
            bucket_id = 'events-images' 
            AND auth.role() = 'authenticated'
          );
    END IF;
END $$;