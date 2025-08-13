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

// Create both clients for different operations
const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_ANON_KEY
);

const supabaseAdmin = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function deleteAndRecreateUser(userEmail, userPassword) {
  console.log('\n🔄 Attempting to delete and recreate user...');
  
  try {
    // Step 1: Get current user ID
    const { data: users, error: listError } = await supabaseAdmin.auth.admin.listUsers();
    if (listError) {
      console.error('❌ Cannot list users for deletion:', listError.message);
      return false;
    }
    
    const existingUser = users.users.find(u => u.email === userEmail);
    if (!existingUser) {
      console.log('ℹ️  User not found, will create new one');
    } else {
      console.log('🗑️  Deleting existing user:', existingUser.id);
      
      // Step 2: Delete existing user
      const { error: deleteError } = await supabaseAdmin.auth.admin.deleteUser(existingUser.id);
      if (deleteError) {
        console.error('❌ Failed to delete user:', deleteError.message);
        console.log('   Error Code:', deleteError.code || 'N/A');
        return false;
      }
      console.log('✅ User deleted successfully');
    }
    
    // Step 3: Create new user
    console.log('👤 Creating new user...');
    const { data: newUser, error: createError } = await supabaseAdmin.auth.admin.createUser({
      email: userEmail,
      password: userPassword,
      email_confirm: true
    });
    
    if (createError) {
      console.error('❌ Failed to create new user:', createError.message);
      console.log('   Error Code:', createError.code || 'N/A');
      console.log('   Error Details:', createError.details || 'N/A');
      return false;
    }
    
    console.log('✅ New user created successfully');
    console.log('   ID:', newUser.user.id);
    console.log('   Email:', newUser.user.email);
    
    // Step 4: Add user to admin_users table
    console.log('🔐 Adding user to admin_users table...');
    const { data: adminInsert, error: adminError } = await supabaseAdmin
      .from('admin_users')
      .insert({
        user_id: newUser.user.id,
        email: userEmail,
        role: 'admin',
        is_active: true
      })
      .select()
      .single();
    
    if (adminError) {
      if (adminError.code === '23505') {
        console.log('ℹ️  User already exists in admin_users (duplicate key)');
      } else {
        console.error('❌ Failed to add user to admin_users:', adminError.message);
        console.log('   Error Code:', adminError.code || 'N/A');
        return false;
      }
    } else {
      console.log('✅ User added to admin_users table');
      console.log('   Role:', adminInsert.role);
      console.log('   Active:', adminInsert.is_active);
    }
    
    return true;
    
  } catch (error) {
    console.error('❌ Error during user recreation:', error.message);
    return false;
  }
}

async function testSessionCreation() {
  console.log('🔍 Testing Session Creation Process\n');
  
  const userEmail = 'usllscilg@gmail.com';
  const userPassword = 'NewPassword123!';
  
  console.log('📝 Testing with:', userEmail);
  console.log('🔑 Password:', userPassword);
  console.log('');
  
  try {
    // Test 1: Check if user exists and is accessible
    console.log('1️⃣ Checking user accessibility...');
    const { data: users, error: usersError } = await supabaseAdmin.auth.admin.listUsers();
    
    if (usersError) {
      console.error('❌ Cannot list users:', usersError.message);
      console.log('   Error Code:', usersError.code || 'N/A');
      console.log('   Error Details:', usersError.details || 'N/A');
      return;
    }
    
    const user = users.users.find(u => u.email === userEmail);
    if (user) {
      console.log('✅ User accessible via admin API');
      console.log('   ID:', user.id);
      console.log('   Email confirmed:', user.email_confirmed_at ? 'Yes' : 'No');
      console.log('   Created:', user.created_at);
      console.log('   Banned until:', user.banned_until || 'Not banned');
      
      // Check if user is banned
      if (user.banned_until) {
        console.log('⚠️  User is banned - this will prevent login');
        console.log('🔄 Attempting to unban user...');
        
        const { error: unbanError } = await supabaseAdmin.auth.admin.updateUserById(
          user.id,
          { banned_until: null }
        );
        
        if (unbanError) {
          console.error('❌ Failed to unban user:', unbanError.message);
        } else {
          console.log('✅ User unbanned successfully');
        }
      }
    } else {
      console.log('❌ User not found in auth.users');
      console.log('🔄 Will create new user in next step');
    }
    
    // Test 2: Try to create a session
    console.log('\n2️⃣ Testing session creation...');
    let signInSuccessful = false;
    let retryCount = 0;
    const maxRetries = 1;
    
    while (!signInSuccessful && retryCount <= maxRetries) {
      if (retryCount > 0) {
        console.log(`   🔄 Retry attempt ${retryCount}...`);
      }
      
      try {
        console.log('   📝 Calling signInWithPassword...');
        const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
          email: userEmail,
          password: userPassword
        });
        
        if (signInError) {
          console.error('   ❌ signInWithPassword failed:', signInError.message);
          console.log('   🔍 Error details:');
          console.log('      Code:', signInError.code || 'N/A');
          console.log('      Message:', signInError.message);
          console.log('      Details:', signInError.details || 'N/A');
          console.log('      Hint:', signInError.hint || 'N/A');
          
          // Check if this is a "Database error granting user" issue
          if (signInError.message.includes('Database error granting user')) {
            console.log('\n💡 DIAGNOSIS: This is a Supabase Auth service issue');
            console.log('   The error "Database error granting user" suggests:');
            console.log('   1. Supabase Auth service has internal database issues');
            console.log('   2. User account might be corrupted at the Auth level');
            console.log('   3. Session creation process is failing');
            
            if (retryCount < maxRetries) {
              console.log('\n🛠️  SOLUTION: Attempting to delete and recreate user account...');
              const recreationSuccess = await deleteAndRecreateUser(userEmail, userPassword);
              
              if (recreationSuccess) {
                console.log('✅ User recreation successful, retrying sign-in...');
                retryCount++;
                continue;
              } else {
                console.log('❌ User recreation failed');
                break;
              }
            } else {
              console.log('\n❌ Maximum retries reached. Manual intervention required.');
              break;
            }
          } else {
            console.log('\n💡 Different error identified, not a database issue');
            break;
          }
        } else {
          console.log('   ✅ signInWithPassword successful!');
          console.log('      User ID:', signInData.user.id);
          console.log('      Session created:', signInData.session ? 'Yes' : 'No');
          signInSuccessful = true;
          
          // Test 3: Verify admin access works
          console.log('\n3️⃣ Testing admin verification...');
          try {
            const { data: adminVerify, error: adminVerifyError } = await supabase
              .from('admin_users')
              .select('*')
              .eq('user_id', signInData.user.id)
              .single();
            
            if (adminVerifyError) {
              console.error('   ❌ Admin verification failed:', adminVerifyError.message);
              console.log('      Error Code:', adminVerifyError.code || 'N/A');
            } else {
              console.log('   ✅ Admin verification successful!');
              console.log('      Role:', adminVerify.role);
              console.log('      Active:', adminVerify.is_active);
              
              console.log('\n🎉 COMPLETE SUCCESS!');
              console.log('💡 Your admin login is now working');
              console.log('📧 Email:', userEmail);
              console.log('🔑 Password:', userPassword);
            }
          } catch (verifyError) {
            console.error('   ❌ Admin verification exception:', verifyError.message);
          }
          
          break;
        }
        
      } catch (signInException) {
        console.error('   ❌ signInWithPassword exception:', signInException.message);
        console.log('   🔍 Exception details:', signInException);
        break;
      }
    }
    
    if (!signInSuccessful) {
      console.log('\n❌ Session creation failed after all attempts');
      console.log('💡 Next steps:');
      console.log('   1. Check Supabase service status');
      console.log('   2. Verify environment variables');
      console.log('   3. Contact Supabase support if issue persists');
    }
    
  } catch (error) {
    console.error('❌ Unexpected error in testSessionCreation:', error.message);
    console.log('   Error Stack:', error.stack);
  }
  
  console.log('\n🎯 Session creation test complete');
}

// Main execution with proper error handling
async function main() {
  try {
    await testSessionCreation();
    console.log('\n✅ Script completed successfully');
    process.exit(0);
  } catch (error) {
    console.error('\n❌ Script failed with error:', error.message);
    process.exit(1);
  }
}

main();
