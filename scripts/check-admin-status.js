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

async function checkAdminStatus() {
  console.log('🔍 Checking Admin User Status\n');
  
  const userEmail = 'usllscilg@gmail.com';
  const userId = 'badd18c3-f20a-4365-9d7d-948a62ff6ef1';
  
  // Check 1: User in auth.users
  console.log('1️⃣ Checking auth.users...');
  try {
    const { data: users, error } = await supabaseAdmin.auth.admin.listUsers();
    if (error) {
      console.error('❌ Cannot access auth.users:', error.message);
      return;
    }
    
    const user = users.users.find(u => u.email === userEmail);
    if (user) {
      console.log('✅ User found in auth.users:');
      console.log('   ID:', user.id);
      console.log('   Email:', user.email);
      console.log('   Email confirmed:', user.email_confirmed_at ? 'Yes' : 'No');
      console.log('   Created:', user.created_at);
    } else {
      console.log('❌ User not found in auth.users');
      return;
    }
  } catch (error) {
    console.error('❌ Error:', error.message);
    return;
  }
  
  // Check 2: User in admin_users table
  console.log('\n2️⃣ Checking admin_users table...');
  try {
    const { data: adminUser, error } = await supabaseAdmin
      .from('admin_users')
      .select('*')
      .eq('user_id', userId)
      .single();
    
    if (error) {
      console.error('❌ Error querying admin_users:', error.message);
      return;
    }
    
    console.log('✅ User found in admin_users:');
    console.log('   User ID:', adminUser.user_id);
    console.log('   Email:', adminUser.email);
    console.log('   Role:', adminUser.role);
    console.log('   Active:', adminUser.is_active);
    console.log('   Created:', adminUser.created_at);
    console.log('   Last sign in:', adminUser.last_sign_in);
    
    // Check for potential issues
    if (adminUser.email !== userEmail) {
      console.log('⚠️  EMAIL MISMATCH: admin_users.email != auth.users.email');
      console.log('   admin_users.email:', adminUser.email);
      console.log('   auth.users.email:', userEmail);
    }
    
    if (!adminUser.is_active) {
      console.log('⚠️  USER INACTIVE: is_active = false');
    }
    
    if (adminUser.role !== 'admin') {
      console.log('⚠️  WRONG ROLE: role =', adminUser.role);
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
  
  // Check 3: Test the exact query that fails in login
  console.log('\n3️⃣ Testing the exact login verification query...');
  try {
    // This is the exact query your React app runs during login
    const { data: loginVerify, error: loginError } = await supabaseAdmin
      .from('admin_users')
      .select('*')
      .eq('user_id', userId)
      .eq('is_active', true)
      .single();
    
    if (loginError) {
      console.log('❌ Login verification query failed:', loginError.message);
      console.log('   This explains the "Database error granting user"!');
    } else {
      console.log('✅ Login verification query successful');
      console.log('   Role:', loginVerify.role);
      console.log('   Active:', loginVerify.is_active);
    }
    
  } catch (error) {
    console.error('❌ Error testing login query:', error.message);
  }
  
  console.log('\n🎯 Status check complete');
}

checkAdminStatus().catch(console.error);
