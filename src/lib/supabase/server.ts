// ========================================================
// JAINSAATHI SERVER-SIDE SUPABASE ARCHITECTURE
// ========================================================

import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://jainsaathi-matrimony.supabase.co';
// Secret key used ONLY on backend API routes / server actions
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.dummy_service_role_key';
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.dummy_anon_key';

/**
 * Creates a privileged server-side Supabase client for admin/service operations
 * (Payment verification, entitlement updates, notification triggers)
 */
export function createServerSupabaseClient() {
  return createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}

/**
 * Creates a standard anon Supabase client for server-side user context queries
 */
export function createAnonymousServerClient() {
  return createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
}
