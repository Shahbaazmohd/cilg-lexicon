#!/usr/bin/env node

/**
 * Script to grant admin access to an existing Supabase user
 * 
 * This script adds an existing user to the admin_users table
 * so they can access admin features.
 * 
 * Usage:
 * 1. Set your Supabase service role key in environment variables
 * 2. Run: node scripts/grant-admin-access.js
 * 
 * Environment variables needed:
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

async function grantAdminAccess(email, role = 'admin') {
  try {
    console.log(`🚀 Granting ${role} access to: ${email}`);
    
    // First, find the user in auth.users
    const { data: users, error: userError } = await supabase.auth.admin.listUsers();
    
    if (userError) {
      console.error('❌ Error listing users:', userError.message);
      return;
    }
    
    // Find the specific user by email
    const user = users.users.find(u => u.email === email);
    
    if (!user) {
      console.error(`❌ User with email ${email} not found in auth.users`);
      console.log('Available users:');
      users.users.forEach(u => console.log(`  - ${u.email} (${u.id})`));
      return;
    }
    
    console.log(`✅ Found user: ${user.email} (${user.id})`);
    
    // Check if user already exists in admin_users table
    const { data: existingAdmin, error: checkError } = await supabase
      .from('admin_users')
      .select('*')
      .eq('user_id', user.id)
      .single();
    
    if (existingAdmin) {
      console.log(`⚠️  User already has admin access with role: ${existingAdmin.role}`);
      console.log('Updating role to:', role);
      
      // Update existing admin user
      const { error: updateError } = await supabase
        .from('admin_users')
        .update({ 
          role: role,
          updated_at: new Date().toISOString()
        })
        .eq('user_id', user.id);
      
      if (updateError) {
        console.error('❌ Error updating admin user:', updateError.message);
        return;
      }
      
      console.log('✅ Admin user role updated successfully');
    } else {
      console.log('Creating new admin user record...');
      
      // Insert new admin user
      const { error: insertError } = await supabase
        .from('admin_users')
        .insert({
          user_id: user.id,
          email: user.email,
          role: role,
          is_active: true
        });
      
      if (insertError) {
        console.error('❌ Error creating admin user:', insertError.message);
        return;
      }
      
      console.log('✅ Admin user created successfully');
    }
    
    // Verify the admin user was created/updated
    const { data: adminUser, error: verifyError } = await supabase
      .from('admin_users')
      .select('*')
      .eq('user_id', user.id)
      .single();
    
    if (verifyError) {
      console.error('❌ Error verifying admin user:', verifyError.message);
      return;
    }
    
    console.log('\n🎉 Admin access granted successfully!');
    console.log('\nAdmin user details:');
    console.log('   User ID:', adminUser.user_id);
    console.log('   Email:', adminUser.email);
    console.log('   Role:', adminUser.role);
    console.log('   Active:', adminUser.is_active);
    console.log('   Created:', adminUser.created_at);
    
    console.log('\n📚 Next steps:');
    console.log('1. Test login at /admin/login with your email');
    console.log('2. You should now have access to admin features');
    console.log('3. Change your password if needed');
    
  } catch (error) {
    console.error('❌ Unexpected error:', error.message);
  }
}

async function main() {
  console.log('🔐 Grant Admin Access to Existing User');
  console.log('=======================================\n');
  
  // Grant admin access to your email
  await grantAdminAccess('usllscilg@gmail.com', 'admin');
  
  console.log('\n✨ Process complete!');
}

main().catch(console.error);
