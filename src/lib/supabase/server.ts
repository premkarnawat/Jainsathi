import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { cookies } from 'next/headers';

const defaultSupabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://vqnbypdytxkmqgdsbswv.supabase.co';
const defaultSupabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.dummy_anon_key';

export function createClient() {
  const cookieStore = cookies();

  return createServerClient(
    defaultSupabaseUrl,
    defaultSupabaseAnonKey,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
        set(name: string, value: string, options: CookieOptions) {
          try {
            cookieStore.set({ name, value, ...options });
          } catch (error) {
            // The `set` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing user sessions.
          }
        },
        remove(name: string, options: CookieOptions) {
          try {
            cookieStore.set({ name, value: '', ...options });
          } catch (error) {
            // The `remove` method was called from a Server Component.
          }
        },
      },
    }
  );
}

// For bypass-RLS operations where required (e.g. background jobs, webhooks, or admin operations)
export function createAdminClient() {
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || defaultSupabaseAnonKey;
  return createServerClient(
    defaultSupabaseUrl,
    serviceRoleKey,
    {
      cookies: {
        get() { return undefined; },
        set() {},
        remove() {},
      },
    }
  );
}

// Backward compatibility alias for existing API routes
export const createServerSupabaseClient = createClient;
