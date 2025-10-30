
import { defineRouting } from 'next-intl/routing';

export const routing = defineRouting({
  locales: ['en', 'fr'], // A list of all locales that are supported
  defaultLocale: 'fr' // Used when no locale matches
});
