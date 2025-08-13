#!/usr/bin/env node

import { createClient } from '@supabase/supabase-js';

// Configuration
const SUPABASE_URL = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL || "https://qclktzhkhgtcspocqqhr.supabase.co";
const SUPABASE_ANON_KEY = process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY;

if (!SUPABASE_ANON_KEY) {
  console.error('❌ SUPABASE_ANON_KEY environment variable is required');
  console.log('\nTo set it up:');
  console.log('1. Go to your Supabase project dashboard');
  console.log('2. Navigate to Settings > API');
  console.log('3. Copy the "anon" key');
  console.log('4. Set the environment variable:');
  console.log('   export SUPABASE_ANON_KEY="your_anon_key"');
  process.exit(1);
}

// Create Supabase client with anon key (same as your app)
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function debugLoginFlow() {
  try {
    console.log('🔍 Debugging Admin Login Flow');
    console.log('================================\n');
    
    // Step 1: Check if admin_users table exists
    console.log('1️⃣ Checking admin_users table...');
    const { data: tableCheck, error: tableError } = await supabase
      .from('admin_users')
      .select('count')
      .limit(1);
    
    if (tableError) {
      console.error('❌ Table access error:', tableError.message);
      return;
    }
    console.log('✅ Table access successful');
    
    // Step 2: Check if your user exists in admin_users
    console.log('\n2️⃣ Checking admin user record...');
    const { data: adminUser, error: adminError } = await supabase
      .from('admin_users')
      .select('*')
      .eq('email', 'usllscilg@gmail.com')
      .single();
    
    if (adminError) {
      console.error('❌ Admin user lookup error:', adminError.message);
      return;
    }
    
    if (adminUser) {
      console.log('✅ Admin user found:', {
        id: adminUser.id,
        user_id: adminUser.user_id,
        email: adminUser.email,
        role: adminUser.role,
        is_active: adminUser.is_active
      });
    } else {
      console.log('⚠️  No admin user record found');
      return;
    }
    
    // Step 3: Check if user exists in auth.users
    console.log('\n3️⃣ Checking auth user...');
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError) {
      console.log('ℹ️  Not authenticated yet (this is normal)');
    } else if (user) {
      console.log('✅ Authenticated user:', {
        id: user.id,
        email: user.email
      });
    }
    
    // Step 4: Test admin verification query
    console.log('\n4️⃣ Testing admin verification query...');
    if (adminUser) {
      const { data: verifyData, error: verifyError } = await supabase
        .from('admin_users')
        .select('role, is_active')
        .eq('user_id', adminUser.user_id)
        .single();
      
      if (verifyError) {
        console.error('❌ Verification query error:', verifyError.message);
        return;
      }
      
      console.log('✅ Verification query successful:', verifyData);
    }
    
    console.log('\n🎯 Debug Complete!');
    console.log('\n📋 Summary:');
    console.log('   - Table access: ✅');
    console.log('   - Admin user record: ✅');
    console.log('   - Verification query: ✅');
    console.log('\n💡 If all above are ✅, the issue might be in the frontend code.');
    
  } catch (error) {
    console.error('❌ Unexpected error:', error.message);
  }
}

async function main() {
  await debugLoginFlow();
}

main().catch(console.error);
