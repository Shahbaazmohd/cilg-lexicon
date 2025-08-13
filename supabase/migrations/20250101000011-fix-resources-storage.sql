-- Fix resources storage policies
-- This migration ensures proper RLS policies are in place for the resources bucket

-- Drop existing storage policies if they exist
DROP POLICY IF EXISTS "Anyone can view resource files" ON storage.objects;
DROP POLICY IF EXISTS "Admins can upload resource files" ON storage.objects;
DROP POLICY IF EXISTS "Admins can update resource files" ON storage.objects;
DROP POLICY IF EXISTS "Admins can delete resource files" ON storage.objects;

-- Create comprehensive storage policies for resources
CREATE POLICY "Anyone can view resource files" 
ON storage.objects FOR SELECT 
USING (bucket_id = 'resources');

CREATE POLICY "Admins can upload resource files" 
ON storage.objects FOR INSERT 
WITH CHECK (bucket_id = 'resources');

CREATE POLICY "Admins can update resource files" 
ON storage.objects FOR UPDATE 
USING (bucket_id = 'resources');

CREATE POLICY "Admins can delete resource files" 
ON storage.objects FOR DELETE 
USING (bucket_id = 'resources');

-- Note: Storage bucket configuration should be done through Supabase Dashboard
-- Go to Storage > Buckets > Create bucket named 'resources' with public access
