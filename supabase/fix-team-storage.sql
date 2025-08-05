-- Fix Team Storage Setup (Run this in SQL Editor)

-- 1. Create team-images bucket if it doesn't exist
INSERT INTO storage.buckets (id, name, public) 
VALUES ('team-images', 'team-images', true)
ON CONFLICT (id) DO NOTHING;

-- 2. Drop existing conflicting policies (if any)
DROP POLICY IF EXISTS "Public Access" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can upload team member images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can update team member images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can delete team member images" ON storage.objects;

-- 3. Create new policies
CREATE POLICY "Public Access" ON storage.objects 
FOR SELECT USING (bucket_id = 'team-images');

CREATE POLICY "Authenticated users can upload team member images" ON storage.objects 
FOR INSERT WITH CHECK (
    bucket_id = 'team-images' 
    AND auth.role() = 'authenticated'
);

CREATE POLICY "Authenticated users can update team member images" ON storage.objects 
FOR UPDATE USING (
    bucket_id = 'team-images' 
    AND auth.role() = 'authenticated'
);

CREATE POLICY "Authenticated users can delete team member images" ON storage.objects 
FOR DELETE USING (
    bucket_id = 'team-images' 
    AND auth.role() = 'authenticated'
);

-- 4. Verify the setup
SELECT 
    'team-images bucket created' as status,
    EXISTS(SELECT 1 FROM storage.buckets WHERE id = 'team-images') as bucket_exists
UNION ALL
SELECT 
    'policies created' as status,
    COUNT(*) as policy_count
FROM pg_policies 
WHERE tablename = 'objects' 
AND schemaname = 'storage' 
AND policyname LIKE '%team member%'; 