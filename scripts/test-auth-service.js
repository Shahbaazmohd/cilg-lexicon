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

// Create admin client for all operations to avoid "Auth session missing" errors
const supabaseAdmin = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function testAuthService() {
  console.log('🔍 Testing Supabase Auth Service\n');
  
  const userEmail = 'usllscilg@gmail.com';
  let userId = null;
  let userData = null;
  
  try {
    // Test 1: Check if user exists and status
    console.log('1️⃣ Checking user status in auth.users...');
    const { data: users, error: usersError } = await supabaseAdmin.auth.admin.listUsers();
    
    if (usersError) {
      console.error('❌ Cannot access auth.users:', usersError.message);
      console.log('   Error Code:', usersError.code || 'N/A');
      console.log('   Error Details:', usersError.details || 'N/A');
      console.log('   Error Hint:', usersError.hint || 'N/A');
      return;
    }
    
    userData = users.users.find(u => u.email === userEmail);
    if (userData) {
      userId = userData.id;
      console.log('✅ User found in auth.users:');
      console.log('   ID:', userData.id);
      console.log('   Email:', userData.email);
      console.log('   Email confirmed:', userData.email_confirmed_at ? 'Yes' : 'No');
      console.log('   Last sign in:', userData.last_sign_in_at || 'Never');
      console.log('   Banned until:', userData.banned_until || 'Not banned');
      console.log('   Confirmed at:', userData.email_confirmed_at || 'Not confirmed');
      console.log('   Created:', userData.created_at);
      
      // Check for potential issues
      if (!userData.email_confirmed_at) {
        console.log('⚠️  EMAIL NOT CONFIRMED - This could cause login issues');
      }
      
      if (userData.banned_until) {
        console.log('⚠️  USER IS BANNED - This will prevent login');
      }
      
    } else {
      console.log('❌ User not found in auth.users');
      return;
    }
    
    // Test 2: Try to get user by ID (using service role key)
    console.log('\n2️⃣ Testing getUserById...');
    if (userId) {
      try {
        const { data: userById, error: getUserError } = await supabaseAdmin.auth.admin.getUserById(userId);
        
        if (getUserError) {
          console.error('❌ getUserById failed:', getUserError.message);
          console.log('   Error Code:', getUserError.code || 'N/A');
          console.log('   Error Details:', getUserError.details || 'N/A');
        } else {
          console.log('✅ getUserById successful');
          console.log('   User ID:', userById.user.id);
          console.log('   Email:', userById.user.email);
        }
      } catch (error) {
        console.error('❌ getUserById exception:', error.message);
      }
    }
    
    // Test 3: Check if user can be updated (using service role key)
    console.log('\n3️⃣ Testing user update capability...');
    if (userId) {
      try {
        const { data: updateData, error: updateError } = await supabaseAdmin.auth.admin.updateUserById(
          userId,
          { email_confirm: true }
        );
        
        if (updateError) {
          console.log('ℹ️  Cannot update user (may need different permissions):', updateError.message);
          console.log('   Error Code:', updateError.code || 'N/A');
        } else {
          console.log('✅ User update successful');
        }
      } catch (error) {
        console.log('ℹ️  User update test failed:', error.message);
      }
    }
    
    // Test 4: Try to reset password (this might help with login issues)
    console.log('\n4️⃣ Testing password reset capability...');
    if (userId) {
      try {
        const { data: resetData, error: resetError } = await supabaseAdmin.auth.admin.generateLink({
          type: 'recovery',
          email: userEmail
        });
        
        if (resetError) {
          console.log('ℹ️  Cannot generate reset link:', resetError.message);
          console.log('   Error Code:', resetError.code || 'N/A');
        } else {
          console.log('✅ Password reset link generated');
          console.log('   This suggests the user account is accessible');
        }
      } catch (error) {
        console.log('ℹ️  Password reset test failed:', error.message);
      }
    }
    
    // Test 5: Check user metadata and app metadata
    console.log('\n5️⃣ Checking user metadata...');
    if (userData) {
      console.log('   App metadata:', JSON.stringify(userData.app_metadata || {}, null, 2));
      console.log('   User metadata:', JSON.stringify(userData.user_metadata || {}, null, 2));
      console.log('   Phone confirmed:', userData.phone_confirmed_at ? 'Yes' : 'No');
      console.log('   Confirmation sent at:', userData.confirmation_sent_at || 'Not sent');
    }
    
    console.log('\n🎯 Auth service test complete');
    console.log('\n💡 Based on the results, the issue might be:');
    console.log('   1. Email not confirmed');
    console.log('   2. User account corrupted');
    console.log('   3. Supabase Auth service issue');
    console.log('   4. Password mismatch');
    console.log('   5. User account needs password reset');
    
  } catch (error) {
    console.error('❌ Unexpected error in testAuthService:', error.message);
    console.log('   Error Stack:', error.stack);
  }
}

// Main execution with proper error handling
async function main() {
  try {
    await testAuthService();
    console.log('\n✅ Script completed successfully');
    process.exit(0);
  } catch (error) {
    console.error('\n❌ Script failed with error:', error.message);
    process.exit(1);
  }
}

main();
