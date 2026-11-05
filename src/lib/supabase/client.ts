import { createBrowserClient } from '@supabase/ssr';

const defaultSupabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://vqnbypdytxkmqgdsbswv.supabase.co';
const defaultSupabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.dummy_anon_key';

export const createClient = () => {
  return createBrowserClient(defaultSupabaseUrl, defaultSupabaseAnonKey);
};

// Keep a singleton for backward compatibility in places where it isn't called as a hook
export const supabase = createBrowserClient(defaultSupabaseUrl, defaultSupabaseAnonKey);
