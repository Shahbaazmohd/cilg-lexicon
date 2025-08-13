# Quick Resolution Guide: Policy Conflict Error

## The Problem
You encountered this error:
```
ERROR: 42710: policy "Users can view own admin record" for table "admin_users" already exists
```

## What This Means
The database migration was partially run before, and some policies already exist. The `CREATE POLICY` statements are failing because they're trying to create policies that already exist.

## Quick Fix (Choose One Option)

### Option 1: Clean Slate (Recommended)
```bash
# 1. Connect to your Supabase database
psql -h your-project-ref.supabase.co -U postgres -d postgres

# 2. Drop the existing table completely
DROP TABLE IF EXISTS admin_users CASCADE;

# 3. Exit psql
\q

# 4. Run the migration again
supabase db push
```

### Option 2: Cleanup Script
```bash
# 1. Run the cleanup script
psql -h your-project-ref.supabase.co -U postgres -d postgres -f scripts/cleanup-admin-migration.sql

# 2. Run the migration again
supabase db push
```

### Option 3: Manual SQL (via Supabase Dashboard)
1. Go to your Supabase Dashboard → SQL Editor
2. Run this cleanup SQL:
```sql
-- Drop existing policies
DROP POLICY IF EXISTS "Admins can manage all admin users" ON admin_users;
DROP POLICY IF EXISTS "Users can view own admin record" ON admin_users;
DROP POLICY IF EXISTS "Only admins can insert new admin users" ON admin_users;
DROP POLICY IF EXISTS "Only admins can update admin users" ON admin_users;
DROP POLICY IF EXISTS "Only admins can delete admin users" ON admin_users;

-- Drop existing triggers
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP TRIGGER IF EXISTS update_admin_last_sign_in_trigger ON auth.users;

-- Drop existing functions
DROP FUNCTION IF EXISTS handle_new_admin_user();
DROP FUNCTION IF EXISTS update_admin_last_sign_in();
```
3. Then run the main migration file content

## After Resolution
Once the migration runs successfully:

1. **Create admin users:**
```bash
node scripts/setup-admin-user.js
```

2. **Test the system:**
```bash
npm run dev
# Navigate to /admin/login
```

## Why This Happened
- The migration was run before but didn't complete fully
- Some policies/triggers were created but others failed
- PostgreSQL doesn't allow duplicate policy names

## Prevention
- Always run migrations from a clean state
- Use `DROP TABLE IF EXISTS` before creating new tables
- Check for existing objects before creating new ones

## Still Having Issues?
If none of the above work:

1. Check your Supabase project logs
2. Verify you have the correct database permissions
3. Ensure your migration file is up to date
4. Try running the migration in smaller chunks

---

**Need Help?** Check the full `ADMIN_AUTHENTICATION_SETUP.md` for detailed troubleshooting steps.
