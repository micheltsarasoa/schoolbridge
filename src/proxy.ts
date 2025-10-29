import createMiddleware from 'next-intl/middleware';
import { locales } from './i18n/request';

export default createMiddleware({
  // A list of all locales that are supported
  locales,

  // Used when no locale matches
  defaultLocale: 'fr',

  // Always use the default locale
  localePrefix: 'as-needed'
});

export const config = {
  // Match all pathnames except for
  // - API routes
  // - _next (Next.js internals)
  // - _vercel (Vercel internals)
  // - files with extensions (e.g. favicon.ico)
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)'
]
};
