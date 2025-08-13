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

async function resetUserPassword() {
  console.log('🔐 Resetting User Password\n');
  
  const userEmail = 'usllscilg@gmail.com';
  const newPassword = 'NewPassword123!'; // Simple password for testing
  
  console.log('📝 Resetting password for:', userEmail);
  console.log('🔑 New password will be:', newPassword);
  console.log('');
  
  try {
    // Step 1: Get user ID
    console.log('1️⃣ Getting user ID...');
    const { data: users, error: usersError } = await supabaseAdmin.auth.admin.listUsers();
    if (usersError) {
      console.error('❌ Cannot access auth.users:', usersError.message);
      return;
    }
    
    const user = users.users.find(u => u.email === userEmail);
    if (!user) {
      console.error('❌ User not found');
      return;
    }
    
    console.log('✅ User found, ID:', user.id);
    
    // Step 2: Update user password
    console.log('\n2️⃣ Updating user password...');
    const { data: updateData, error: updateError } = await supabaseAdmin.auth.admin.updateUserById(
      user.id,
      { password: newPassword }
    );
    
    if (updateError) {
      console.error('❌ Password update failed:', updateError.message);
      return;
    }
    
    console.log('✅ Password updated successfully!');
    
    // Step 3: Test the new password
    console.log('\n3️⃣ Testing new password...');
    const supabase = createClient(
      process.env.VITE_SUPABASE_URL,
      process.env.VITE_SUPABASE_ANON_KEY
    );
    
    const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
      email: userEmail,
      password: newPassword
    });
    
    if (signInError) {
      console.error('❌ Sign in with new password failed:', signInError.message);
      console.log('💡 The issue might be deeper than just the password');
    } else {
      console.log('✅ Sign in with new password successful!');
      console.log('   User ID:', signInData.user.id);
      console.log('   Session created:', signInData.session ? 'Yes' : 'No');
      
      // Test admin verification
      console.log('\n4️⃣ Testing admin verification...');
      const { data: adminVerify, error: adminVerifyError } = await supabase
        .from('admin_users')
        .select('*')
        .eq('user_id', signInData.user.id)
        .single();
      
      if (adminVerifyError) {
        console.error('❌ Admin verification failed:', adminVerifyError.message);
      } else {
        console.log('✅ Admin verification successful!');
        console.log('   Role:', adminVerify.role);
        console.log('   Active:', adminVerify.is_active);
        
        console.log('\n🎉 COMPLETE SUCCESS!');
        console.log('💡 You can now log in with:');
        console.log('   Email:', userEmail);
        console.log('   Password:', newPassword);
      }
    }
    
  } catch (error) {
    console.error('❌ Unexpected error:', error.message);
  }
}

resetUserPassword().catch(console.error);
