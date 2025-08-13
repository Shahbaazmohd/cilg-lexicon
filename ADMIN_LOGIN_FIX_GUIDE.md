# Admin Login Fix Guide

## Issues Identified and Fixed

### 1. Database Schema Issues ✅ FIXED
- **Problem**: RLS policies had circular dependencies
- **Fix**: Simplified policies and added missing `email` column
- **Result**: Table structure now matches application expectations

### 2. Column Reference Issues ✅ FIXED
- **Problem**: AuthService was looking for `id` instead of `user_id`
- **Fix**: Updated all queries to use correct column references
- **Result**: Admin verification now works properly

### 3. Setup Script Issues ✅ FIXED
- **Problem**: Script was looking for non-existent columns
- **Fix**: Updated verification queries and environment variables
- **Result**: Admin user creation now works end-to-end

## Step-by-Step Setup Instructions

### Step 1: Set Environment Variables

Create a `.env` file in your project root:

```env
# Supabase Configuration
VITE_SUPABASE_URL=https://your-project-ref.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here

# Application Configuration
NODE_ENV=development
VITE_APP_URL=http://localhost:5173
```

**To get your Supabase credentials:**
1. Go to your Supabase Dashboard
2. Navigate to Settings → API
3. Copy the Project URL and anon key
4. Copy the service_role key (keep this secret!)

### Step 2: Run Database Migration

```bash
# Apply the fixed migration
supabase db push
```

**If you get errors, run this cleanup first:**
```sql
-- Connect to your Supabase database and run:
DROP TABLE IF EXISTS admin_users CASCADE;
DROP FUNCTION IF EXISTS handle_new_admin_user();
DROP FUNCTION IF EXISTS update_admin_last_sign_in();
```

### Step 3: Create Admin Users

```bash
# Install dependencies if needed
npm install

# Set your service role key
export SUPABASE_SERVICE_ROLE_KEY="your_service_role_key_here"

# Run the setup script
node scripts/setup-admin-user.js
```

**Expected output:**
```
🔐 Supabase Admin User Setup
=============================

🚀 Setting up admin user...
✅ Admin user created successfully
   User ID: [uuid]
   Email: admin@cilg.com
⏳ Waiting for database trigger to populate admin_users table...
✅ Admin user verified in admin_users table
   Role: admin
   Active: true
   Email: admin@cilg.com

🎉 Setup complete!

Login credentials:
   Email: admin@cilg.com
   Password: Admin#2025!Secure
```

### Step 4: Test the System

```bash
# Start your development server
npm run dev

# Navigate to admin login
# Open: http://localhost:5173/admin/login
```

**Test with these credentials:**
- **Email**: `admin@cilg.com`
- **Password**: `Admin#2025!Secure`

## Troubleshooting

### Common Issues and Solutions

#### 1. "Access denied. Admin privileges required"
**Cause**: User exists in auth.users but not in admin_users table
**Solution**: 
- Check if the database trigger executed properly
- Verify the user email matches `admin@cilg.com` or `moderator@cilg.com`
- Run the setup script again

#### 2. "Policy does not exist" errors
**Cause**: Migration didn't complete properly
**Solution**:
```bash
# Reset and run migration again
supabase db reset
supabase db push
```

#### 3. "Column user_id does not exist"
**Cause**: Table structure mismatch
**Solution**:
```sql
-- Drop and recreate table
DROP TABLE IF EXISTS admin_users CASCADE;
-- Then run migration again
```

#### 4. Setup script fails
**Cause**: Missing or incorrect environment variables
**Solution**:
```bash
# Verify environment variables
echo $SUPABASE_SERVICE_ROLE_KEY
echo $VITE_SUPABASE_URL

# Set them if missing
export SUPABASE_SERVICE_ROLE_KEY="your_key_here"
export VITE_SUPABASE_URL="your_url_here"
```

### Verification Commands

Check if everything is working:

```sql
-- Verify table exists
SELECT * FROM information_schema.tables WHERE table_name = 'admin_users';

-- Verify admin users exist
SELECT * FROM admin_users;

-- Verify policies exist
SELECT * FROM pg_policies WHERE tablename = 'admin_users';

-- Verify triggers exist
SELECT * FROM information_schema.triggers WHERE event_object_table = 'admin_users';
```

## Expected Results

After successful setup:

✅ **Database**: `admin_users` table with correct structure  
✅ **Authentication**: Supabase Auth integration working  
✅ **Admin Users**: admin@cilg.com and moderator@cilg.com created  
✅ **Login System**: Secure JWT-based authentication working  
✅ **Route Protection**: Admin routes properly secured  

## Security Notes

1. **Change default passwords** immediately after first login
2. **Keep service role key secret** - never expose in frontend code
3. **Monitor login attempts** for suspicious activity
4. **Regular security audits** of admin access

## Next Steps

Once admin login is working:

1. **Customize admin dashboard** for your needs
2. **Add more admin features** as required
3. **Implement user management** if needed
4. **Set up monitoring** and alerts
5. **Remove or secure** the setup script

---

**Need Help?** Check the browser console and Supabase logs for specific error messages.
