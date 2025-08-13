// Admin-specific Supabase client with service role key
// This client bypasses RLS policies and has full database access
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://qclktzhkhgtcspocqqhr.supabase.co";
const SUPABASE_SERVICE_ROLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFjbGt0emhraGd0Y3Nwb2NxcWhyIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MzAwOTMxMSwiZXhwIjoyMDY4NTg1MzExfQ.HzqI3cVw0U6AEnV-kWOmSmeyM7yCMG0rrNNHswKpgdE";

// Create admin client with service role key
export const adminSupabase = createClient<Database>(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

// Note: This client should only be used for admin operations
// It bypasses RLS policies and has full database access
