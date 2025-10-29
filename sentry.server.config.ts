import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,

  // Adjust this value in production, or use tracesSampler for greater control
  tracesSampleRate: 1.0,

  // Setting this option to true will print useful information to the console while you're setting up Sentry.
  debug: false,

  // Environment
  environment: process.env.NODE_ENV,

  // Release tracking
  release: process.env.NEXT_PUBLIC_SENTRY_RELEASE,

  // Additional configuration for server-side
  beforeSend(event) {
    // Filter out errors from development
    if (process.env.NODE_ENV === 'development') {
      return null;
    }
    return event;
  },

  // Server-specific integrations
  integrations: [
    // Add custom integrations here if needed
  ],

  // Ignore certain errors
  ignoreErrors: [
    'ECONNREFUSED',
    'ETIMEDOUT',
    'ENOTFOUND',
  ],
});
