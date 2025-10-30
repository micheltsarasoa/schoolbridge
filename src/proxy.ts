import createMiddleware from 'next-intl/middleware';
import { locales } from './i18n/request';
import { auth } from './auth'; // Assuming auth.ts exports the auth middleware
import { NextResponse } from 'next/server';

const protectedRoutes = [
  '/admin',
  '/profile',
  '/notifications',
  '/schools',
  '/relationships',
  '/users',
  '/bulk-import',
];

export default async function middleware(request: Request) {
  const { pathname } = request.nextUrl;

  // Check if the current path is a protected route
  const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route));

  // Run NextAuth's authentication middleware first
  const authResponse = await auth(request);

  // If the user is not authenticated and tries to access a protected route, redirect to login
  if (isProtectedRoute && !authResponse.auth) {
    const url = new URL('/login', request.url);
    url.searchParams.set('callbackUrl', pathname);
    return NextResponse.redirect(url);
  }

  // Otherwise, proceed with next-intl middleware
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
  // - files with extensions (e.g. favicon.ico)
  matcher: ['/((?!api|en/login|en/register|fr/login|fr/register|_next|_vercel|.*\\..*).*)']
};
