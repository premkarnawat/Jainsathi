import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

// Routes that require user authentication
const PROTECTED_ROUTES = [
  '/dashboard',
  '/profile',
  '/matches',
  '/search',
  '/interests',
  '/connections',
  '/saved',
  '/preferences',
  '/settings',
];

// Routes that authenticated users should be redirected away from
const AUTH_ROUTES = ['/login', '/register'];

/**
 * Fast local JWT decoder to verify session validity in Edge Runtime
 * without making external network calls.
 * This completely eliminates 504 MIDDLEWARE_INVOCATION_TIMEOUT.
 */
function extractSessionFromCookies(cookies: { name: string; value: string }[]): {
  accessToken: string | null;
  payload: any | null;
  isExpired: boolean;
} {
  try {
    const authCookies = cookies
      .filter(
        (c) =>
          (c.name.startsWith('sb-') && c.name.includes('-auth-token')) ||
          c.name === 'supabase-auth-token'
      )
      .sort((a, b) => a.name.localeCompare(b.name));

    if (authCookies.length === 0) {
      return { accessToken: null, payload: null, isExpired: true };
    }

    let rawVal = authCookies.map((c) => c.value).join('');
    if (!rawVal) {
      return { accessToken: null, payload: null, isExpired: true };
    }

    if (rawVal.startsWith('base64-')) {
      try {
        rawVal = atob(rawVal.substring(7));
      } catch {
        // fallback to rawVal
      }
    }

    let parsed: any = null;
    try {
      parsed = JSON.parse(rawVal);
    } catch {
      try {
        parsed = JSON.parse(decodeURIComponent(rawVal));
      } catch {
        if (rawVal.split('.').length === 3) {
          parsed = { access_token: rawVal };
        }
      }
    }

    let accessToken: string | null = null;
    if (parsed) {
      if (Array.isArray(parsed) && parsed[0]) {
        accessToken = parsed[0];
      } else if (typeof parsed === 'object') {
        accessToken = parsed.access_token || parsed.token || null;
      } else if (typeof parsed === 'string' && parsed.split('.').length === 3) {
        accessToken = parsed;
      }
    }

    if (!accessToken || typeof accessToken !== 'string' || accessToken.split('.').length !== 3) {
      return { accessToken: null, payload: null, isExpired: true };
    }

    const parts = accessToken.split('.');
    const b64 = parts[1].replace(/-/g, '+').replace(/_/g, '/');
    const jsonStr = atob(b64);
    const payload = JSON.parse(jsonStr);

    const nowSec = Math.floor(Date.now() / 1000);
    // Give a 15-second grace window
    const isExpired = payload.exp ? payload.exp <= nowSec + 15 : false;

    return { accessToken, payload, isExpired };
  } catch {
    return { accessToken: null, payload: null, isExpired: true };
  }
}

export async function updateSession(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // 1. Check Route Type
  const isProtectedRoute = PROTECTED_ROUTES.some(
    (route) => pathname === route || pathname.startsWith(route + '/')
  );
  const isAuthRoute = AUTH_ROUTES.some(
    (route) => pathname === route || pathname.startsWith(route + '/')
  );
  const isAdminRoute = pathname.startsWith('/admin') && pathname !== '/admin/login';

  // Fast path: if not a protected, auth, or admin route, pass through immediately (0ms latency, zero network)
  if (!isProtectedRoute && !isAuthRoute && !isAdminRoute) {
    return NextResponse.next();
  }

  // 2. Cookie Local Inspection: 0ms Edge JWT decoding without network I/O
  const allCookies = request.cookies.getAll();
  const { payload, isExpired } = extractSessionFromCookies(allCookies);

  // CASE A: User has an active, unexpired session token
  if (payload && !isExpired) {
    if (isAuthRoute) {
      // Authenticated users should not see /login or /register
      const dashboardUrl = request.nextUrl.clone();
      dashboardUrl.pathname = '/dashboard';
      return NextResponse.redirect(dashboardUrl);
    }

    // For admin routes, verify admin email if available in token
    if (isAdminRoute && payload.email) {
      const email = payload.email.toLowerCase();
      const isAdminEmail =
        email === 'admin@jainsaathi.com' ||
        email === 'admin@jainsaathi.in' ||
        payload.app_metadata?.role === 'admin' ||
        payload.app_metadata?.role === 'super_admin';

      if (!isAdminEmail && payload.role !== 'service_role') {
        const adminLoginUrl = request.nextUrl.clone();
        adminLoginUrl.pathname = '/admin/login';
        return NextResponse.redirect(adminLoginUrl);
      }
    }

    return NextResponse.next();
  }

  // CASE B: No token exists at all
  if (!payload) {
    if (isAdminRoute) {
      const adminLoginUrl = request.nextUrl.clone();
      adminLoginUrl.pathname = '/admin/login';
      return NextResponse.redirect(adminLoginUrl);
    }
    if (isProtectedRoute) {
      const loginUrl = request.nextUrl.clone();
      loginUrl.pathname = '/login';
      return NextResponse.redirect(loginUrl);
    }
    return NextResponse.next();
  }

  // CASE C: Token is present but expired — attempt refresh with strict 1.2s AbortSignal
  let supabaseResponse = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  const supabaseUrl =
    process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://vqnbypdytxkmqgdsbswv.supabase.co';
  const supabaseAnonKey =
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.dummy_anon_key';

  const abortController = new AbortController();
  const timeoutId = setTimeout(() => {
    try {
      abortController.abort();
    } catch {
      // ignore
    }
  }, 1200);

  let refreshedUser: any = null;
  try {
    const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
      global: {
        fetch: (url: RequestInfo | URL, options: RequestInit = {}) => {
          return fetch(url, {
            ...options,
            signal: abortController.signal,
          });
        },
      },
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value;
        },
        set(name: string, value: string, options: CookieOptions) {
          request.cookies.set({
            name,
            value,
            ...options,
          });
          supabaseResponse = NextResponse.next({
            request: {
              headers: request.headers,
            },
          });
          supabaseResponse.cookies.set({
            name,
            value,
            ...options,
          });
        },
        remove(name: string, options: CookieOptions) {
          request.cookies.set({
            name,
            value: '',
            ...options,
          });
          supabaseResponse = NextResponse.next({
            request: {
              headers: request.headers,
            },
          });
          supabaseResponse.cookies.set({
            name,
            value: '',
            ...options,
          });
        },
      },
    });

    const { data } = await supabase.auth.getUser();
    refreshedUser = data?.user ?? null;
  } catch {
    refreshedUser = null;
  } finally {
    clearTimeout(timeoutId);
  }

  if (refreshedUser) {
    if (isAuthRoute) {
      const dashboardUrl = request.nextUrl.clone();
      dashboardUrl.pathname = '/dashboard';
      return NextResponse.redirect(dashboardUrl);
    }
    return supabaseResponse;
  }

  // Token expired and refresh failed
  if (isAdminRoute) {
    const adminLoginUrl = request.nextUrl.clone();
    adminLoginUrl.pathname = '/admin/login';
    return NextResponse.redirect(adminLoginUrl);
  }

  if (isProtectedRoute) {
    const loginUrl = request.nextUrl.clone();
    loginUrl.pathname = '/login';
    return NextResponse.redirect(loginUrl);
  }

  return supabaseResponse;
}
