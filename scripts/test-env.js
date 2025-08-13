#!/usr/bin/env node

import { readFileSync, existsSync } from 'fs';
import { join } from 'path';

console.log('🔍 Environment Variable Test');
console.log('=============================\n');

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

// Load environment variables
loadEnvFile();

// Check all possible environment variable names
const envVars = [
  'VITE_SUPABASE_URL',
  'VITE_SUPABASE_ANON_KEY', 
  'SUPABASE_URL',
  'SUPABASE_ANON_KEY',
  'SUPABASE_SERVICE_ROLE_KEY'
];

console.log('\n📋 Environment Variables After Loading:');
envVars.forEach(varName => {
  const value = process.env[varName];
  if (value) {
    console.log(`✅ ${varName}: ${value.substring(0, 30)}...`);
  } else {
    console.log(`❌ ${varName}: Not found`);
  }
});

console.log('\n📁 Current working directory:', process.cwd());
console.log('🔧 Node.js version:', process.version);
