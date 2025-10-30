import { NextRequest, NextResponse } from 'next/server';

const protectedRoutes = [
  '/admin',
  '/teacher',
  '/student',
  '/parent',
  '/profile',
  '/notifications',
  '/dashboard',
];

const publicRoutes = [
  '/login',
  '/register',
  '/request-password-reset',
  '/reset-password',
  '/',
];

export default async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Check if the current path is a protected route
  const isProtectedRoute = protectedRoutes.some(route =>
    pathname.startsWith(route)
  );

  const isPublicRoute = publicRoutes.some(route =>
    pathname === route || pathname.startsWith(route)
  );

  // For protected routes, check authentication via cookie
  if (isProtectedRoute) {
    const token = request.cookies.get('authjs.session-token') ||
                  request.cookies.get('__Secure-authjs.session-token');

    if (!token) {
      // Redirect to login if not authenticated
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('callbackUrl', pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes - accessible from Postman)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, sitemap.xml, robots.txt (metadata files)
     * - *.png, *.jpg, *.jpeg, *.gif, *.svg, *.ico, *.webp (image files)
     * - *.css, *.js (static assets)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|.*\\.(?:png|jpg|jpeg|gif|svg|ico|webp|css|js)).*)'
  ]
};
