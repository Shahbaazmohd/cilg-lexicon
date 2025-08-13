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

// Create the SAME client your React app uses (anon key, not service role)
const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_ANON_KEY
);

async function testReactLoginFlow() {
  console.log('🧪 Testing React App Login Flow\n');
  
  const userEmail = 'usllscilg@gmail.com';
  const userPassword = 'UniversitySchoolofLaw&LegalStudies@110089!!';
  
  console.log('📝 Testing with email:', userEmail);
  console.log('⚠️  Note: You need to provide your actual password\n');
  
  // Step 1: Sign in (this is what your React app does)
  console.log('1️⃣ Attempting sign in...');
  try {
    const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
      email: userEmail,
      password: userPassword
    });
    
    if (signInError) {
      console.error('❌ Sign in failed:', signInError.message);
      console.log('💡 This is the root cause - authentication failed');
      return;
    }
    
    console.log('✅ Sign in successful!');
    console.log('   User ID:', signInData.user.id);
    console.log('   Session created:', signInData.session ? 'Yes' : 'No');
    
    // Step 2: Now test the admin verification (this is what was failing)
    console.log('\n2️⃣ Testing admin verification...');
    try {
      const { data: adminVerify, error: adminVerifyError } = await supabase
        .from('admin_users')
        .select('*')
        .eq('user_id', signInData.user.id)
        .single();
      
      if (adminVerifyError) {
        console.error('❌ Admin verification failed:', adminVerifyError.message);
        console.log('💡 This is the "Database error granting user" you were seeing!');
        
        // Let's see what the exact error is
        console.log('\n🔍 Error details:');
        console.log('   Code:', adminVerifyError.code);
        console.log('   Message:', adminVerifyError.message);
        console.log('   Details:', adminVerifyError.details);
        
        return;
      }
      
      console.log('✅ Admin verification successful!');
      console.log('   Role:', adminVerify.role);
      console.log('   Active:', adminVerify.is_active);
      
      console.log('\n🎉 Complete login flow successful!');
      console.log('💡 Your React app should work now');
      
    } catch (verifyError) {
      console.error('❌ Admin verification exception:', verifyError.message);
    }
    
  } catch (signInException) {
    console.error('❌ Sign in exception:', signInException.message);
  }
}

async function main() {
  await testReactLoginFlow();
}

main().catch(console.error);
