#!/usr/bin/env node

import { readFileSync, existsSync } from 'fs';
import { join } from 'path';
import { createClient } from '@supabase/supabase-js';

// Load environment file
function loadEnvFile() {
  const envPath = join(process.cwd(), 'ad.env');
  if (existsSync(envPath)) {
    const envContent = readFileSync(envPath, 'utf8');
    const lines = envContent.split('\n');
    lines.forEach(line => {
      const trimmed = line.trim();
      if (trimmed && !trimmed.startsWith('#')) {
        const [key, ...valueParts] = trimmed.split('=');
        if (key && valueParts.length > 0) {
          process.env[key] = valueParts.join('=');
        }
      }
    });
    console.log('✅ Environment loaded');
  }
}

loadEnvFile();

const supabaseAdmin = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function grantAdminAccess() {
  console.log('🔐 Granting Admin Access\n');
  
  const userEmail = 'usllscilg@gmail.com';
  
  // Step 1: Get user details from auth.users
  console.log('1️⃣ Getting user details...');
  try {
    const { data: users, error } = await supabaseAdmin.auth.admin.listUsers();
    if (error) {
      console.error('❌ Cannot access auth.users:', error.message);
      return;
    }
    
    const user = users.users.find(u => u.email === userEmail);
    if (!user) {
      console.error('❌ User not found in auth.users');
      return;
    }
    
    console.log('✅ User found:', user.email);
    console.log('   ID:', user.id);
    console.log('   Email confirmed:', user.email_confirmed_at ? 'Yes' : 'No');
    
    // Step 2: Insert user into admin_users table
    console.log('\n2️⃣ Adding user to admin_users table...');
    const { data: insertData, error: insertError } = await supabaseAdmin
      .from('admin_users')
      .insert({
        user_id: user.id,
        email: user.email,
        role: 'admin',
        is_active: true
      })
      .select()
      .single();
    
    if (insertError) {
      if (insertError.code === '23505') {
        console.log('ℹ️  User already exists in admin_users (duplicate key)');
        console.log('   Checking current status...');
        
        // Check current status
        const { data: currentUser, error: checkError } = await supabaseAdmin
          .from('admin_users')
          .select('*')
          .eq('user_id', user.id)
          .single();
        
        if (checkError) {
          console.error('❌ Error checking current status:', checkError.message);
          return;
        }
        
        console.log('✅ Current admin status:');
        console.log('   Role:', currentUser.role);
        console.log('   Active:', currentUser.is_active);
        console.log('   Last sign in:', currentUser.last_sign_in);
        
      } else {
        console.error('❌ Error inserting user:', insertError.message);
        return;
      }
    } else {
      console.log('✅ User successfully added to admin_users table');
      console.log('   Role:', insertData.role);
      console.log('   Active:', insertData.is_active);
    }
    
    // Step 3: Verify the result
    console.log('\n3️⃣ Verifying admin access...');
    const { data: verifyData, error: verifyError } = await supabaseAdmin
      .from('admin_users')
      .select('*')
      .eq('user_id', user.id)
      .single();
    
    if (verifyError) {
      console.error('❌ Verification failed:', verifyError.message);
      return;
    }
    
    console.log('✅ Admin access verified:');
    console.log('   User ID:', verifyData.user_id);
    console.log('   Email:', verifyData.email);
    console.log('   Role:', verifyData.role);
    console.log('   Active:', verifyData.is_active);
    
    console.log('\n🎉 Admin access granted successfully!');
    console.log('💡 You should now be able to log in as admin in your React app');
    
  } catch (error) {
    console.error('❌ Unexpected error:', error.message);
  }
}

grantAdminAccess().catch(console.error);
