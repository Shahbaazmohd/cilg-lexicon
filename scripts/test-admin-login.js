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

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_ANON_KEY
);

const supabaseAdmin = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function testAdminLogin() {
  console.log('🧪 Testing Admin Login Flow\n');
  
  // Check if user exists in auth.users
  console.log('1️⃣ Checking auth.users...');
  try {
    const { data: users, error } = await supabaseAdmin.auth.admin.listUsers();
    if (error) {
      console.error('❌ Cannot access auth.users:', error.message);
      return;
    }
    
    const user = users.users.find(u => u.email === 'usllscilg@gmail.com');
    if (user) {
      console.log('✅ User found:', user.email);
      console.log('   ID:', user.id);
    } else {
      console.log('❌ User not found in auth.users');
      return;
    }
  } catch (error) {
    console.error('❌ Error:', error.message);
    return;
  }
  
  // Check admin_users table
  console.log('\n2️⃣ Checking admin_users table...');
  try {
    const { data: adminUser, error } = await supabaseAdmin
      .from('admin_users')
      .select('*')
      .eq('email', 'usllscilg@gmail.com')
      .single();
    
    if (error) {
      if (error.code === 'PGRST116') {
        console.log('❌ User not in admin_users table');
        console.log('💡 This explains the "Database error granting user"!');
      } else {
        console.error('❌ Error:', error.message);
      }
      return;
    }
    
    console.log('✅ Admin user found:', adminUser.role);
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
  
  console.log('\n🎯 Test complete');
}

testAdminLogin().catch(console.error);
