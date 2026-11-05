import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

// Routes that require user authentication
const PROTECTED_ROUTES = [
  '/dashboard', '/profile', '/matches', '/search',
  '/interests', '/connections', '/saved', '/preferences', '/settings',
];

// Routes that authenticated users should be redirected away from
const AUTH_ROUTES = ['/login', '/register'];

export async function updateSession(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // 1. Check Route Type
  const isProtectedRoute = PROTECTED_ROUTES.some(route => pathname === route || pathname.startsWith(route + '/'));
  const isAuthRoute = AUTH_ROUTES.some(route => pathname === route || pathname.startsWith(route + '/'));
  const isAdminRoute = pathname.startsWith('/admin') && pathname !== '/admin/login';

  // Fast path: if not a protected, auth, or admin route, pass through immediately (0ms latency, zero network)
  if (!isProtectedRoute && !isAuthRoute && !isAdminRoute) {
    return NextResponse.next();
  }

  // 2. Cookie Pre-Check: Do any Supabase auth cookies exist in the request?
  const allCookies = request.cookies.getAll();
  const hasAuthCookie = allCookies.some(
    c => (c.name.startsWith('sb-') && c.name.includes('-auth-token')) || c.name === 'supabase-auth-token'
  );

  // If NO auth cookie exists:
  if (!hasAuthCookie) {
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
    // Visiting /login or /register with no session cookie: allow through
    return NextResponse.next();
  }

  // 3. User HAS an auth cookie: Initialize Supabase client and verify with a strict 2s timeout
  let supabaseResponse = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://vqnbypdytxkmqgdsbswv.supabase.co';
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.dummy_anon_key';

  const supabase = createServerClient(
    supabaseUrl,
    supabaseAnonKey,
    {
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
    }
  );

  // Refresh auth token with strict 2-second timeout to prevent 504 MIDDLEWARE_INVOCATION_TIMEOUT
  let user: any = null;
  try {
    const userPromise = supabase.auth.getUser();
    const timeoutPromise = new Promise<{ data: { user: null } }>((_, reject) =>
      setTimeout(() => reject(new Error('Auth verification timeout')), 2000)
    );
    const result = await Promise.race([userPromise, timeoutPromise]);
    user = result?.data?.user ?? null;
  } catch (err) {
    // If Supabase is slow or down, treat as unauthenticated rather than timing out the entire site
    user = null;
  }

  const isActiveSession = !!user;

  // 4. Route Redirection Logic
  if (isActiveSession) {
    // Redirect authenticated users away from /login and /register to /dashboard
    if (isAuthRoute) {
      const dashboardUrl = request.nextUrl.clone();
      dashboardUrl.pathname = '/dashboard';
      return NextResponse.redirect(dashboardUrl);
    }
    // Allow protected and admin routes through
    return supabaseResponse;
  } else {
    // Unauthenticated (or expired session)
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
}
