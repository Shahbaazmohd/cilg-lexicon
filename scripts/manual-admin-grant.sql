-- Manual SQL script to grant admin access to existing user
-- Run this in your Supabase SQL Editor

-- First, find your user ID from auth.users table
-- Replace 'usllscilg@gmail.com' with your actual email if different
SELECT id, email, created_at FROM auth.users WHERE email = 'usllscilg@gmail.com';

-- After you get the user ID, run this to grant admin access:
-- (Replace 'YOUR_USER_ID_HERE' with the actual UUID from the query above)

-- Option 1: Insert new admin user (if they don't exist)
INSERT INTO admin_users (user_id, email, role, is_active)
VALUES (
    'YOUR_USER_ID_HERE',  -- Replace with actual UUID
    'usllscilg@gmail.com',
    'admin',
    true
)
ON CONFLICT (user_id) DO UPDATE SET
    role = EXCLUDED.role,
    is_active = EXCLUDED.is_active,
    updated_at = NOW();

-- Option 2: Update existing admin user (if they already exist)
-- UPDATE admin_users 
-- SET role = 'admin', is_active = true, updated_at = NOW()
-- WHERE user_id = 'YOUR_USER_ID_HERE';

-- Verify the admin user was created/updated
SELECT * FROM admin_users WHERE email = 'usllscilg@gmail.com';

-- Check RLS policies are working
-- This should return your user if everything is set up correctly
SELECT * FROM admin_users WHERE user_id = auth.uid();
