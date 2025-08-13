-- Cleanup script for admin_users migration conflicts
-- Run this if you encounter policy conflicts

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Admins can manage all admin users" ON admin_users;
DROP POLICY IF EXISTS "Users can view own admin record" ON admin_users;
DROP POLICY IF EXISTS "Only admins can insert new admin users" ON admin_users;
DROP POLICY IF EXISTS "Only admins can update admin users" ON admin_users;
DROP POLICY IF EXISTS "Only admins can delete admin users" ON admin_users;
DROP POLICY IF EXISTS "Only admins can insert admin users" ON admin_users;

-- Drop existing triggers if they exist
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP TRIGGER IF EXISTS update_admin_last_sign_in_trigger ON auth.users;

-- Drop existing functions if they exist
DROP FUNCTION IF EXISTS handle_new_admin_user();
DROP FUNCTION IF EXISTS update_admin_last_sign_in();

-- Drop existing indexes if they exist
DROP INDEX IF EXISTS admin_users_email_idx;
DROP INDEX IF EXISTS admin_users_role_idx;
DROP INDEX IF EXISTS admin_users_active_idx;
DROP INDEX IF EXISTS idx_admin_users_user_id;
DROP INDEX IF EXISTS idx_admin_users_role;
DROP INDEX IF EXISTS idx_admin_users_is_active;

-- Note: This script only drops policies, triggers, functions, and indexes
-- It does NOT drop the admin_users table itself
-- Run the main migration after this cleanup
