import { type NextRequest, NextResponse } from 'next/server';
import { updateSession } from '@/lib/supabase/middleware';

export async function middleware(request: NextRequest) {
  // Update user's auth session with timeout & route-awareness
  return await updateSession(request);
}

export const config = {
  /*
   * Explicitly match ONLY protected application routes, admin portal, and auth pages.
   * Public marketing pages (/, /pricing, /privacy, /terms, /contact, /help),
   * static assets, and API routes are NOT intercepted by Edge middleware.
   * This completely prevents 504 MIDDLEWARE_INVOCATION_TIMEOUT on Vercel.
   */
  matcher: [
    '/dashboard/:path*',
    '/profile/:path*',
    '/matches/:path*',
    '/search/:path*',
    '/interests/:path*',
    '/connections/:path*',
    '/saved/:path*',
    '/preferences/:path*',
    '/settings/:path*',
    '/admin/:path*',
    '/login',
    '/register',
  ],
};

