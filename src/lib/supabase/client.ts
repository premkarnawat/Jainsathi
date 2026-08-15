import { createBrowserClient } from '@supabase/ssr';

export const createClient = () => {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
};

// Keep a singleton for backward compatibility in places where it isn't called as a hook
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://jainsaathi-matrimony.supabase.co';
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.dummy_anon_key';
export const supabase = createBrowserClient(SUPABASE_URL, SUPABASE_ANON_KEY);
