#!/usr/bin/env node

/**
 * Setup script to create admin user in Supabase
 * 
 * This script creates an admin user in Supabase Auth and automatically
 * populates the admin_users table through the database trigger.
 * 
 * Usage:
 * 1. Set your Supabase service role key in the environment variables
 * 2. Run: node scripts/setup-admin-user.js
 * 
 * Environment variables needed:
 * - SUPABASE_URL: Your Supabase project URL
 * - SUPABASE_SERVICE_ROLE_KEY: Your Supabase service role key
 */

import { createClient } from '@supabase/supabase-js';

// Configuration
const SUPABASE_URL = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL || "https://qclktzhkhgtcspocqqhr.supabase.co";
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_SERVICE_ROLE_KEY) {
  console.error('❌ SUPABASE_SERVICE_ROLE_KEY environment variable is required');
  console.log('\nTo set it up:');
  console.log('1. Go to your Supabase project dashboard');
  console.log('2. Navigate to Settings > API');
  console.log('3. Copy the "service_role" key (not the anon key)');
  console.log('4. Set the environment variable:');
  console.log('   export SUPABASE_SERVICE_ROLE_KEY="your_service_role_key"');
  process.exit(1);
}

// Create Supabase client with service role key
const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

async function createAdminUser() {
  try {
    console.log('🚀 Setting up admin user...');
    
    // Create admin user
    const { data: userData, error: userError } = await supabase.auth.admin.createUser({
      email: 'admin@cilg.com',
      password: 'Admin#2025!Secure',
      email_confirm: true,
      user_metadata: {
        name: 'Administrator',
        role: 'admin'
      }
    });

    if (userError) {
      console.error('❌ Error creating user:', userError.message);
      return;
    }

    console.log('✅ Admin user created successfully');
    console.log('   User ID:', userData.user.id);
    console.log('   Email:', userData.user.email);
    
    // Wait a moment for the trigger to execute
    console.log('⏳ Waiting for database trigger to populate admin_users table...');
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Verify admin user was added to admin_users table
    const { data: adminUser, error: adminError } = await supabase
      .from('admin_users')
      .select('*')
      .eq('user_id', userData.user.id)
      .single();

    if (adminError) {
      console.error('❌ Error verifying admin user:', adminError.message);
      console.log('   The user was created but may not have been added to admin_users table');
      console.log('   Check if the database trigger is working properly');
      return;
    }

    console.log('✅ Admin user verified in admin_users table');
    console.log('   Role:', adminUser.role);
    console.log('   Active:', adminUser.is_active);
    console.log('   Email:', adminUser.email);
    
    console.log('\n🎉 Setup complete!');
    console.log('\nLogin credentials:');
    console.log('   Email: admin@cilg.com');
    console.log('   Password: Admin#2025!Secure');
    console.log('\n⚠️  IMPORTANT: Change the password after first login!');
    
  } catch (error) {
    console.error('❌ Unexpected error:', error.message);
  }
}

async function createModeratorUser() {
  try {
    console.log('\n🚀 Setting up moderator user...');
    
    // Create moderator user
    const { data: userData, error: userError } = await supabase.auth.admin.createUser({
      email: 'moderator@cilg.com',
      password: 'Moderator#2025!Secure',
      email_confirm: true,
      user_metadata: {
        name: 'Moderator',
        role: 'moderator'
      }
    });

    if (userError) {
      console.error('❌ Error creating moderator user:', userError.message);
      return;
    }

    console.log('✅ Moderator user created successfully');
    console.log('   User ID:', userData.user.id);
    console.log('   Email:', userData.user.email);
    
    // Wait a moment for the trigger to execute
    console.log('⏳ Waiting for database trigger to populate admin_users table...');
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Verify moderator user was added to admin_users table
    const { data: adminUser, error: adminError } = await supabase
      .from('admin_users')
      .select('*')
      .eq('user_id', userData.user.id)
      .single();

    if (adminError) {
      console.error('❌ Error verifying moderator user:', adminError.message);
      return;
    }

    console.log('✅ Moderator user verified in admin_users table');
    console.log('   Role:', adminUser.role);
    console.log('   Active:', adminUser.is_active);
    console.log('   Email:', adminUser.email);
    
    console.log('\n🎉 Moderator setup complete!');
    console.log('\nLogin credentials:');
    console.log('   Email: moderator@cilg.com');
    console.log('   Password: Moderator#2025!Secure');
    console.log('\n⚠️  IMPORTANT: Change the password after first login!');
    
  } catch (error) {
    console.error('❌ Unexpected error:', error.message);
  }
}

async function main() {
  console.log('🔐 Supabase Admin User Setup');
  console.log('=============================\n');
  
  await createAdminUser();
  await createModeratorUser();
  
  console.log('\n📚 Next steps:');
  console.log('1. Run the database migration: supabase/migrations/20250101000008-create-admin-users-table.sql');
  console.log('2. Test the login at /admin/login');
  console.log('3. Change the default passwords');
  console.log('4. Remove or secure this script file');
}

main().catch(console.error);
