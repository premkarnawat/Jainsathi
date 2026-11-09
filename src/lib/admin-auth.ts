import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { query } from '@/lib/db';

export interface AdminUser {
  id: string;
  auth_id: string;
  email: string | null;
  phone: string;
  full_name: string;
  role: 'admin' | 'super_admin' | 'moderator';
}

export type AdminAuthResult =
  | { authorized: true; admin: AdminUser }
  | { authorized: false; response: NextResponse };

/**
 * Authoritative Server-Side Admin Session Guard
 * Validates Supabase JWT cookie and verifies role against database.
 * Rejects unauthenticated callers with 401 Unauthorized.
 * Rejects unauthorized users with 403 Forbidden.
 */
export async function requireAdminSession(): Promise<AdminAuthResult> {
  try {
    const supabase = createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return {
        authorized: false,
        response: NextResponse.json(
          { success: false, error: 'Authentication required. Please log in as an administrator.' },
          { status: 401 }
        ),
      };
    }

    // Direct database query to verify role
    let dbUser: AdminUser | null = null;
    try {
      const rows = await query<AdminUser>(
        `SELECT id, auth_id, email, phone, full_name, role 
         FROM users 
         WHERE auth_id = $1 LIMIT 1;`,
        [user.id]
      );
      if (rows && rows.length > 0) {
        dbUser = rows[0];
      }
    } catch (dbErr) {
      console.warn('[Admin Guard DB Lookup Warning]', dbErr);
    }

    // Check authoritative role or system admin email
    const adminEmail = process.env.ADMIN_EMAIL || 'admin@jainsaathi.com';
    const isEmailAdmin = user.email && user.email.toLowerCase() === adminEmail.toLowerCase();
    const role = (dbUser?.role || '').toLowerCase();
    const isRoleAdmin = role === 'admin' || role === 'super_admin' || role === 'moderator';

    if (!isRoleAdmin && !isEmailAdmin) {
      return {
        authorized: false,
        response: NextResponse.json(
          { success: false, error: 'Access denied. Administrator privileges required.' },
          { status: 403 }
        ),
      };
    }

    const adminIdentity: AdminUser = dbUser || {
      id: user.id,
      auth_id: user.id,
      email: user.email || adminEmail,
      phone: user.phone || '',
      full_name: 'Administrator',
      role: 'super_admin',
    };

    return {
      authorized: true,
      admin: adminIdentity,
    };
  } catch (error: any) {
    console.error('[Admin Guard Exception]', error);
    return {
      authorized: false,
      response: NextResponse.json(
        { success: false, error: 'Internal authorization error.' },
        { status: 500 }
      ),
    };
  }
}
