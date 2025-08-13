#!/usr/bin/env node

/**
 * Debug script to identify admin system issues
 * 
 * This script will check all components of the admin system
 * and identify exactly what's wrong.
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

async function debugAdminSystem() {
  console.log('🔍 Debugging Admin System');
  console.log('==========================\n');
  
  try {
    // 1. Check Supabase connection
    console.log('1️⃣ Checking Supabase connection...');
    const { data: health, error: healthError } = await supabase.from('admin_users').select('count').limit(1);
    if (healthError) {
      console.log('❌ Connection error:', healthError.message);
    } else {
      console.log('✅ Supabase connection working');
    }
    
    // 2. Check if admin_users table exists
    console.log('\n2️⃣ Checking admin_users table...');
    try {
      const { data: tableCheck, error: tableError } = await supabase
        .from('admin_users')
        .select('*')
        .limit(1);
      
      if (tableError) {
        console.log('❌ Table error:', tableError.message);
        if (tableError.message.includes('relation "admin_users" does not exist')) {
          console.log('   → The admin_users table does not exist!');
          console.log('   → You need to run the database migration first');
        }
      } else {
        console.log('✅ admin_users table exists');
      }
    } catch (e) {
      console.log('❌ Table check failed:', e.message);
    }
    
    // 3. Check auth users
    console.log('\n3️⃣ Checking auth users...');
    try {
      const { data: users, error: usersError } = await supabase.auth.admin.listUsers();
      
      if (usersError) {
        console.log('❌ Auth users error:', usersError.message);
      } else {
        console.log(`✅ Found ${users.users.length} auth users`);
        users.users.forEach(user => {
          console.log(`   - ${user.email} (${user.id}) - Created: ${user.created_at}`);
        });
        
        // Check if your user exists
        const yourUser = users.users.find(u => u.email === 'usllscilg@gmail.com');
        if (yourUser) {
          console.log(`✅ Your user found: ${yourUser.email} (${yourUser.id})`);
        } else {
          console.log('❌ Your user (usllscilg@gmail.com) not found in auth.users');
        }
      }
    } catch (e) {
      console.log('❌ Auth check failed:', e.message);
    }
    
    // 4. Check admin_users table contents
    console.log('\n4️⃣ Checking admin_users table contents...');
    try {
      const { data: adminUsers, error: adminError } = await supabase
        .from('admin_users')
        .select('*');
      
      if (adminError) {
        console.log('❌ Admin users query error:', adminError.message);
      } else {
        if (adminUsers && adminUsers.length > 0) {
          console.log(`✅ Found ${adminUsers.length} admin users:`);
          adminUsers.forEach(admin => {
            console.log(`   - ${admin.email} (${admin.user_id}) - Role: ${admin.role} - Active: ${admin.is_active}`);
          });
        } else {
          console.log('⚠️  admin_users table is empty');
        }
      }
    } catch (e) {
      console.log('❌ Admin users check failed:', e.message);
    }
    
    // 5. Check RLS policies
    console.log('\n5️⃣ Checking RLS policies...');
    try {
      const { data: policies, error: policiesError } = await supabase
        .rpc('get_policies', { table_name: 'admin_users' });
      
      if (policiesError) {
        console.log('❌ RLS policies check error:', policiesError.message);
        console.log('   → This might mean RLS is not properly configured');
      } else {
        console.log('✅ RLS policies check passed');
      }
    } catch (e) {
      console.log('⚠️  RLS policies check failed (this might be normal):', e.message);
    }
    
    // 6. Test table permissions
    console.log('\n6️⃣ Testing table permissions...');
    try {
      const { data: testInsert, error: insertError } = await supabase
        .from('admin_users')
        .insert({
          user_id: '00000000-0000-0000-0000-000000000000', // Dummy UUID
          email: 'test@test.com',
          role: 'admin',
          is_active: true
        })
        .select();
      
      if (insertError) {
        console.log('❌ Insert permission error:', insertError.message);
      } else {
        console.log('✅ Insert permissions working');
        
        // Clean up test data
        await supabase
          .from('admin_users')
          .delete()
          .eq('email', 'test@test.com');
        console.log('✅ Test data cleaned up');
      }
    } catch (e) {
      console.log('❌ Permission test failed:', e.message);
    }
    
  } catch (error) {
    console.error('❌ Unexpected error during debugging:', error.message);
  }
}

async function main() {
  console.log('🚀 Starting comprehensive admin system debug...\n');
  
  await debugAdminSystem();
  
  console.log('\n📋 Debug Summary:');
  console.log('==================');
  console.log('Check the output above for any ❌ errors');
  console.log('Common issues:');
  console.log('1. Missing admin_users table → Run migration');
  console.log('2. Missing RLS policies → Check table setup');
  console.log('3. Permission issues → Check grants');
  console.log('4. User not in admin_users → Grant admin access');
  
  console.log('\n🔧 Next steps:');
  console.log('1. Fix any issues identified above');
  console.log('2. Run: supabase db push (if table missing)');
  console.log('3. Run: node scripts/grant-admin-access.js (if user missing)');
  console.log('4. Test login again');
}

main().catch(console.error);
