# Admin Authentication System Setup Guide

## Overview
This guide will help you set up a secure admin authentication system using Supabase Auth with JWT tokens, Row Level Security (RLS), and role-based access control.

## Prerequisites
- Supabase project with Auth enabled
- Node.js installed
- Access to your Supabase project dashboard

## Step 1: Database Migration

### Option A: Fresh Setup (Recommended)
If you haven't run any admin migrations before:

```bash
# Apply the migration directly
supabase db push
```

### Option B: Resolve Existing Conflicts
If you encounter policy conflicts (like "policy already exists"):

1. **Run the cleanup script first:**
```bash
# Connect to your Supabase database and run:
psql -h your-project-ref.supabase.co -U postgres -d postgres -f scripts/cleanup-admin-migration.sql
```

2. **Then apply the main migration:**
```bash
supabase db push
```

### Option C: Manual SQL Execution
If you prefer to run SQL manually:

1. Go to your Supabase Dashboard → SQL Editor
2. Run the contents of `supabase/migrations/20250101000008-create-admin-users-table.sql`

## Step 2: Create Initial Admin Users

Run the setup script to create your first admin users:

```bash
# Install dependencies if needed
npm install

# Run the setup script
node scripts/setup-admin-user.js
```

**Default credentials created:**
- **Admin**: `admin@cilg.com` / `admin123`
- **Moderator**: `moderator@cilg.com` / `moderator123`

**⚠️ Important:** Change these passwords immediately after first login!

## Step 3: Environment Variables

Ensure your `.env` file contains:

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

## Step 4: Test the System

1. **Start your development server:**
```bash
npm run dev
```

2. **Test admin login:**
   - Navigate to `/admin/login`
   - Use the credentials from Step 2
   - Verify you're redirected to `/admin/dashboard`

3. **Test route protection:**
   - Try accessing `/admin/dashboard` without login
   - Verify you're redirected to login page

## Troubleshooting

### Common Errors

#### 1. Policy Already Exists
**Error:** `ERROR: 42710: policy "Users can view own admin record" for table "admin_users" already exists`

**Solution:**
```bash
# Run the cleanup script first
psql -h your-project-ref.supabase.co -U postgres -d postgres -f scripts/cleanup-admin-migration.sql

# Then run the main migration
supabase db push
```

#### 2. Table Already Exists
**Error:** `ERROR: 42710: relation "admin_users" already exists`

**Solution:**
```sql
-- Drop the existing table and recreate
DROP TABLE IF EXISTS admin_users CASCADE;
-- Then run the migration again
```

#### 3. Function Already Exists
**Error:** `ERROR: 42710: function "handle_new_admin_user()" already exists`

**Solution:**
```sql
-- Drop existing functions
DROP FUNCTION IF EXISTS handle_new_admin_user();
DROP FUNCTION IF EXISTS update_admin_last_sign_in();
-- Then run the migration again
```

### Manual Verification

Check if the migration was applied correctly:

```sql
-- Verify table exists
SELECT * FROM information_schema.tables WHERE table_name = 'admin_users';

-- Verify policies exist
SELECT * FROM pg_policies WHERE tablename = 'admin_users';

-- Verify triggers exist
SELECT * FROM information_schema.triggers WHERE event_object_table = 'admin_users';
```

## Configuration Options

### Role-Based Access Control

The system supports two roles:
- **Admin**: Full access to all admin functions
- **Moderator**: Limited access (can be customized)

### Customizing Admin Emails

To change which emails automatically become admin users, modify the trigger function:

```sql
-- Update the email patterns in the trigger function
CREATE OR REPLACE FUNCTION handle_new_admin_user()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.email IN ('your-admin@domain.com', 'your-moderator@domain.com') THEN
        -- ... rest of function
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

## Security Features

- **JWT Tokens**: Secure, time-limited authentication
- **Row Level Security**: Database-level access control
- **Role-Based Access**: Granular permission system
- **Automatic Expiration**: Sessions expire automatically
- **XSS Protection**: No client-side session storage
- **CSRF Protection**: Built-in Supabase security

## Monitoring and Logging

### View Admin Activity
```sql
-- Check recent admin logins
SELECT 
    au.user_id,
    u.email,
    au.role,
    au.last_sign_in,
    au.is_active
FROM admin_users au
JOIN auth.users u ON au.user_id = u.id
ORDER BY au.last_sign_in DESC;
```

### Audit Trail
```sql
-- View admin user changes (if you add audit logging)
SELECT * FROM admin_users 
WHERE updated_at > NOW() - INTERVAL '7 days'
ORDER BY updated_at DESC;
```

## Deployment Considerations

### Production Environment
1. **Change default passwords** immediately
2. **Use strong passwords** for admin accounts
3. **Enable 2FA** if available
4. **Monitor login attempts** for suspicious activity
5. **Regular security audits** of admin access

### Environment Variables
Ensure all sensitive keys are properly set in production:
- `SUPABASE_SERVICE_ROLE_KEY` (keep secret)
- `VITE_SUPABASE_URL` (can be public)
- `VITE_SUPABASE_ANON_KEY` (can be public)

## Migration from Old System

If you're upgrading from the previous `sessionService`:

1. **Backup existing data** (if any)
2. **Run the new migration**
3. **Update components** to use `authService`
4. **Test thoroughly** before removing old code
5. **Remove old session management** code

## Support

If you encounter issues:

1. Check the troubleshooting section above
2. Verify your Supabase project configuration
3. Check the browser console for errors
4. Review the Supabase logs in your dashboard
5. Ensure all environment variables are set correctly

## Next Steps

After successful setup:

1. **Customize the admin dashboard** for your needs
2. **Add more admin features** as required
3. **Implement user management** if needed
4. **Add audit logging** for compliance
5. **Set up monitoring** and alerts

---

**Note:** This system provides enterprise-grade security while maintaining ease of use. The JWT-based authentication with RLS policies ensures that even if someone gains access to your frontend code, they cannot bypass the security measures implemented at the database level.
