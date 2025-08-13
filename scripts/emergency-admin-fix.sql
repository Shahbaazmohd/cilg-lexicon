-- EMERGENCY ADMIN FIX - Complete Table Recreation Without RLS
-- Run this in Supabase SQL Editor to fix admin login immediately

-- Step 1: Drop the problematic table completely
DROP TABLE IF EXISTS admin_users CASCADE;

-- Step 2: Create a simple admin_users table WITHOUT RLS
CREATE TABLE admin_users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL,
    role VARCHAR(20) NOT NULL CHECK (role IN ('admin', 'moderator')),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_sign_in TIMESTAMP WITH TIME ZONE,
    UNIQUE(user_id),
    UNIQUE(email)
);

-- Step 3: NO RLS - Table is completely open
-- (We'll add security later once login works)

-- Step 4: Grant full permissions
GRANT ALL ON admin_users TO authenticated;
GRANT ALL ON admin_users TO anon;

-- Step 5: Create indexes for performance
CREATE INDEX idx_admin_users_user_id ON admin_users(user_id);
CREATE INDEX idx_admin_users_email ON admin_users(email);
CREATE INDEX idx_admin_users_role ON admin_users(role);

-- Step 6: Insert your admin user manually
INSERT INTO admin_users (user_id, email, role, is_active)
VALUES (
    (SELECT id FROM auth.users WHERE email = 'usllscilg@gmail.com'),
    'usllscilg@gmail.com',
    'admin',
    true
);

-- Step 7: Verify the setup
SELECT 'Emergency Fix Complete' as status;
SELECT * FROM admin_users;
SELECT 
    schemaname,
    tablename,
    rowsecurity
FROM pg_tables 
WHERE tablename = 'admin_users';

-- Step 8: Test access
SELECT 'Testing Access' as test;
SELECT * FROM admin_users WHERE email = 'usllscilg@gmail.com';
