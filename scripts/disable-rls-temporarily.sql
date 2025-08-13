-- Temporary RLS Disable to Fix Admin Login
-- Run this in your Supabase SQL Editor to get admin login working immediately

-- Step 1: Disable RLS temporarily
ALTER TABLE admin_users DISABLE ROW LEVEL SECURITY;

-- Step 2: Verify RLS is disabled
SELECT 
    schemaname,
    tablename,
    rowsecurity
FROM pg_tables 
WHERE tablename = 'admin_users';

-- Step 3: Test access to admin_users table
SELECT 'RLS Disabled - Testing Access' as status;
SELECT * FROM admin_users WHERE email = 'usllscilg@gmail.com';

-- Step 4: Grant full permissions to authenticated users
GRANT ALL ON admin_users TO authenticated;

-- Step 5: Verify permissions
SELECT 
    grantee,
    privilege_type,
    is_grantable
FROM information_schema.role_table_grants 
WHERE table_name = 'admin_users';

-- IMPORTANT: After running this, test your admin login
-- If it works, you can re-enable RLS later with proper policies
-- To re-enable RLS later, run:
-- ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;
