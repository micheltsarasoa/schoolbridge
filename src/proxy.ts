import createMiddleware from 'next-intl/middleware';
import { locales } from './i18n/request';
import { NextRequest, NextResponse } from 'next/server';

const protectedRoutes = [
  '/admin',
  '/teacher',
  '/student',
  '/parent',
  '/profile',
  '/notifications',
  '/schools',
  '/relationships',
  '/users',
  '/bulk-import',
];

const publicRoutes = [
  '/login',
  '/register',
  '/request-password-reset',
  '/reset-password',
  '/',
];

export default async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Remove locale prefix for route matching
  const pathnameWithoutLocale = pathname.replace(/^\/(en|fr)/, '') || '/';

  // Check if the current path is a protected route
  const isProtectedRoute = protectedRoutes.some(route =>
    pathnameWithoutLocale.startsWith(route)
  );

  const isPublicRoute = publicRoutes.some(route =>
    pathnameWithoutLocale === route || pathnameWithoutLocale.startsWith(route)
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

  // Proceed with next-intl middleware for i18n routing
  const handleI18nRouting = createMiddleware({
    locales,
    defaultLocale: 'fr',
    localePrefix: 'as-needed',
  });

  const response = handleI18nRouting(request);
  return response;
}

export const config = {
  // Match all pathnames except for
  // - API routes
  // - _next (Next.js internals)
  // - _vercel (Vercel internals)
  // - Static files
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)']
};
