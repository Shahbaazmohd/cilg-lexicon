-- Create team-images bucket for storing team member photos
INSERT INTO storage.buckets (id, name, public) VALUES ('team-images', 'team-images', true)
ON CONFLICT (id) DO NOTHING;

-- Create policy to allow public read access to team-images bucket (only if it doesn't exist)
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'objects' 
        AND policyname = 'Public Access' 
        AND schemaname = 'storage'
    ) THEN
        CREATE POLICY "Public Access" ON storage.objects FOR SELECT USING (bucket_id = 'team-images');
    END IF;
END $$;

-- Create policy to allow authenticated users to upload team member images (only if it doesn't exist)
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'objects' 
        AND policyname = 'Authenticated users can upload team member images' 
        AND schemaname = 'storage'
    ) THEN
        CREATE POLICY "Authenticated users can upload team member images" ON storage.objects 
        FOR INSERT WITH CHECK (
            bucket_id = 'team-images' 
            AND auth.role() = 'authenticated'
        );
    END IF;
END $$;

-- Create policy to allow authenticated users to update team member images (only if it doesn't exist)
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'objects' 
        AND policyname = 'Authenticated users can update team member images' 
        AND schemaname = 'storage'
    ) THEN
        CREATE POLICY "Authenticated users can update team member images" ON storage.objects 
        FOR UPDATE USING (
            bucket_id = 'team-images' 
            AND auth.role() = 'authenticated'
        );
    END IF;
END $$;

-- Create policy to allow authenticated users to delete team member images (only if it doesn't exist)
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'objects' 
        AND policyname = 'Authenticated users can delete team member images' 
        AND schemaname = 'storage'
    ) THEN
        CREATE POLICY "Authenticated users can delete team member images" ON storage.objects 
        FOR DELETE USING (
            bucket_id = 'team-images' 
            AND auth.role() = 'authenticated'
        );
    END IF;
END $$; 