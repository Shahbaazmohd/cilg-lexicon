-- Comprehensive RLS Policy Fix for Admin System
-- Run this in your Supabase SQL Editor

-- Step 1: Drop all existing problematic policies
DROP POLICY IF EXISTS "Users can view own admin record" ON admin_users;
DROP POLICY IF EXISTS "Admins can manage all admin users" ON admin_users;
DROP POLICY IF EXISTS "Allow admin users access" ON admin_users;

-- Step 2: Temporarily disable RLS to test
ALTER TABLE admin_users DISABLE ROW LEVEL SECURITY;

-- Step 3: Verify we can access the table without RLS
SELECT 'Testing access without RLS' as status;
SELECT * FROM admin_users WHERE email = 'usllscilg@gmail.com';

-- Step 4: Create a simple, working RLS policy
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

-- Create a policy that allows all authenticated users to read admin_users
CREATE POLICY "Allow authenticated users to read admin_users" ON admin_users
    FOR SELECT USING (auth.role() = 'authenticated');

-- Create a policy that allows admins to manage admin_users
CREATE POLICY "Allow admins to manage admin_users" ON admin_users
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM admin_users au
            WHERE au.user_id = auth.uid() 
            AND au.role = 'admin' 
            AND au.is_active = true
        )
    );

-- Step 5: Grant necessary permissions
GRANT SELECT, INSERT, UPDATE, DELETE ON admin_users TO authenticated;
GRANT USAGE ON SCHEMA public TO authenticated;

-- Step 6: Test the policies
SELECT 'Testing RLS policies' as status;

-- This should work now
SELECT * FROM admin_users WHERE email = 'usllscilg@gmail.com';

-- Step 7: Verify policy creation
SELECT 
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd,
    qual,
    with_check
FROM pg_policies 
WHERE tablename = 'admin_users';

-- Step 8: Test with a dummy query to ensure RLS is working
-- (This simulates what the application does during login)
SELECT 
    'RLS Test' as test_name,
    CASE 
        WHEN auth.uid() IS NOT NULL THEN 'User authenticated'
        ELSE 'User not authenticated'
    END as auth_status,
    CASE 
        WHEN EXISTS (SELECT 1 FROM admin_users WHERE user_id = auth.uid()) THEN 'User found in admin_users'
        ELSE 'User not found in admin_users'
    END as admin_status;
