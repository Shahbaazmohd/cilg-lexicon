#!/usr/bin/env node

import { readFileSync, existsSync } from 'fs';
import { join } from 'path';
import { createClient } from '@supabase/supabase-js';

// Manually load .env file
function loadEnvFile() {
  try {
    // Try both .env and ad.env
    const envPath = join(process.cwd(), 'ad.env');
    const dotEnvPath = join(process.cwd(), '.env');
    
    let filePath = null;
    if (existsSync(envPath)) {
      filePath = envPath;
      console.log('📄 Found ad.env file');
    } else if (existsSync(dotEnvPath)) {
      filePath = dotEnvPath;
      console.log('📄 Found .env file');
    }
    
    if (filePath) {
      const envContent = readFileSync(filePath, 'utf8');
      const lines = envContent.split('\n');
      
      lines.forEach(line => {
        const trimmed = line.trim();
        if (trimmed && !trimmed.startsWith('#')) {
          const [key, ...valueParts] = trimmed.split('=');
          if (key && valueParts.length > 0) {
            const value = valueParts.join('=');
            process.env[key] = value;
          }
        }
      });
      
      console.log('✅ Environment file loaded successfully');
    } else {
      console.log('❌ No environment file found (.env or ad.env)');
    }
  } catch (error) {
    console.log('⚠️  Error loading environment file:', error.message);
  }
}

// Load environment variables first
loadEnvFile();

// Configuration
const SUPABASE_URL = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL || "https://qclktzhkhgtcspocqqhr.supabase.co";
const SUPABASE_ANON_KEY = process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY;

if (!SUPABASE_ANON_KEY) {
  console.error('❌ SUPABASE_ANON_KEY environment variable is required');
  console.log('\nAvailable environment variables:');
  Object.keys(process.env).forEach(key => {
    if (key.includes('SUPABASE')) {
      console.log(`  ${key}: ${process.env[key]?.substring(0, 30)}...`);
    }
  });
  process.exit(1);
}

// Create Supabase client
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function testSupabaseAuth() {
  try {
    console.log('🧪 Testing Supabase Auth Service');
    console.log('================================\n');
    
    // Test 1: Basic connection
    console.log('1️⃣ Testing basic connection...');
    const { data, error } = await supabase
      .from('admin_users')
      .select('count')
      .limit(1);
    
    if (error) {
      console.error('❌ Connection failed:', error.message);
      return;
    }
    console.log('✅ Connection successful');
    
    // Test 2: Auth service health
    console.log('\n2️⃣ Testing auth service...');
    try {
      // This should return a 401 (not authenticated) not a 500
      const { data: authData, error: authError } = await supabase.auth.getUser();
      
      if (authError && authError.message.includes('Invalid JWT')) {
        console.log('✅ Auth service responding (expected 401 for unauthenticated)');
      } else if (authError) {
        console.error('❌ Auth service error:', authError.message);
      } else {
        console.log('✅ Auth service working');
      }
    } catch (authException) {
      console.error('❌ Auth service exception:', authException.message);
    }
    
    // Test 3: Check if user exists in auth.users
    console.log('\n3️⃣ Checking auth.users table...');
    const { data: users, error: usersError } = await supabase.auth.admin.listUsers();
    
    if (usersError) {
      console.log('ℹ️  Cannot list users (need service role key):', usersError.message);
    } else {
      console.log('✅ Auth users table accessible');
      const user = users.users.find(u => u.email === 'usllscilg@gmail.com');
      if (user) {
        console.log('✅ User found in auth.users:', user.email);
      } else {
        console.log('⚠️  User not found in auth.users');
      }
    }
    
    console.log('\n🎯 Test Complete!');
    
  } catch (error) {
    console.error('❌ Unexpected error:', error.message);
  }
}

async function main() {
  await testSupabaseAuth();
}

main().catch(console.error);
