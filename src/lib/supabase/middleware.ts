import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

// Routes that require authentication
const PROTECTED_ROUTES = [
  '/dashboard', '/profile', '/matches', '/search',
  '/interests', '/connections', '/saved', '/preferences', '/settings',
];

// Routes that authenticated users should be redirected away from
const AUTH_ROUTES = ['/login', '/register'];

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
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

  // refreshing the auth token
  const { data: { user } } = await supabase.auth.getUser();

  // Enforce 10-day secure session lifespan
  let isActiveSession = !!user;
  if (user && user.last_sign_in_at) {
    const lastSignIn = new Date(user.last_sign_in_at).getTime();
    const tenDaysInMs = 10 * 24 * 60 * 60 * 1000;
    if (Date.now() - lastSignIn > tenDaysInMs) {
      await supabase.auth.signOut();
      isActiveSession = false;
    }
  }

  const pathname = request.nextUrl.pathname;

  // Protect Admin Routes
  const isAdminRoute = pathname.startsWith('/admin') && pathname !== '/admin/login';
  
  if (isAdminRoute) {
    if (!isActiveSession) {
      const adminLoginUrl = request.nextUrl.clone();
      adminLoginUrl.pathname = '/admin/login';
      return NextResponse.redirect(adminLoginUrl);
    }
    
    // Check if user has admin role in public.users
    const { data: dbUser } = await supabase
      .from('users')
      .select('role')
      .eq('auth_id', user.id)
      .single();
      
    if (!dbUser || (dbUser.role !== 'admin' && dbUser.role !== 'super_admin')) {
      const dashboardUrl = request.nextUrl.clone();
      dashboardUrl.pathname = '/dashboard';
      return NextResponse.redirect(dashboardUrl);
    }
  }

  // Redirect authenticated users away from login/register to dashboard
  if (isActiveSession && AUTH_ROUTES.some(route => pathname.startsWith(route))) {
    const dashboardUrl = request.nextUrl.clone();
    dashboardUrl.pathname = '/dashboard';
    return NextResponse.redirect(dashboardUrl);
  }

  // Redirect unauthenticated users from protected routes to login
  if (!isActiveSession && PROTECTED_ROUTES.some(route => pathname.startsWith('/' + route.slice(1)))) {
    const loginUrl = request.nextUrl.clone();
    loginUrl.pathname = '/login';
    if (!user && !isActiveSession) {
       // Just unauthenticated
    } else if (user && !isActiveSession) {
       loginUrl.searchParams.set('reason', 'session_expired');
    }
    return NextResponse.redirect(loginUrl);
  }

  return supabaseResponse;
}
