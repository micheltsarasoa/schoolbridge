# Sentry Error Tracking Setup

This document explains how Sentry is configured for error tracking in SchoolBridge.

## Overview

Sentry is integrated into the SchoolBridge application to:
- Track and monitor errors in production
- Capture client-side and server-side exceptions
- Record user sessions for debugging
- Monitor application performance
- Receive alerts when errors occur

## Configuration Files

### 1. Sentry Configuration Files

- **sentry.client.config.ts** - Client-side error tracking configuration
- **sentry.server.config.ts** - Server-side error tracking configuration
- **sentry.edge.config.ts** - Edge runtime error tracking configuration

### 2. Next.js Configuration

The `next.config.ts` file is wrapped with `withSentryConfig` to enable:
- Automatic source map uploads
- React component annotations
- Tunnel route for ad-blocker circumvention
- Automatic error instrumentation

## Setup Instructions

### 1. Create a Sentry Account

1. Go to [https://sentry.io](https://sentry.io)
2. Sign up for a free account
3. Create a new project and select "Next.js" as the platform

### 2. Get Your DSN

1. Navigate to **Settings** → **Projects** → **[Your Project]** → **Client Keys (DSN)**
2. Copy your DSN (it looks like: `https://xxxxx@xxxxx.ingest.sentry.io/xxxxx`)

### 3. Configure Environment Variables

Add the following to your `.env.local` file:

```bash
# Required: Your Sentry DSN
NEXT_PUBLIC_SENTRY_DSN="https://xxxxx@xxxxx.ingest.sentry.io/xxxxx"

# Optional: For source map uploads
SENTRY_ORG="your-organization-slug"
SENTRY_PROJECT="schoolbridge"
SENTRY_AUTH_TOKEN="your-auth-token"

# Optional: Release tracking
NEXT_PUBLIC_SENTRY_RELEASE="v1.0.0"
```

### 4. Get Auth Token (Optional - for Production)

For production deployments with source map uploads:

1. Go to **Settings** → **Auth Tokens**
2. Create a new token with `project:releases` and `org:read` permissions
3. Add it to your environment variables as `SENTRY_AUTH_TOKEN`

## Features

### Error Filtering

- **Development Mode**: Errors are not sent to Sentry in development (configured in `beforeSend`)
- **Ignored Errors**: Browser extensions and network errors are filtered out
- **Custom Error Boundaries**: You can wrap components with error boundaries

### Session Replay

- **Enabled**: Session replay is configured for debugging
- **Privacy**: All text and media are masked by default
- **Sample Rate**: 10% of sessions are recorded (100% for error sessions)

### Performance Monitoring

- **Trace Sample Rate**: 100% (adjust in production based on volume)
- **Automatic Instrumentation**: API routes and page loads are automatically tracked

### Source Maps

- **Uploaded**: Source maps are uploaded to Sentry for better stack traces
- **Hidden**: Source maps are hidden from client bundles in production

## Usage

### Manual Error Capture

```typescript
import * as Sentry from '@sentry/nextjs';

try {
  // Your code
} catch (error) {
  Sentry.captureException(error);
}
```

### Setting User Context

```typescript
import * as Sentry from '@sentry/nextjs';

Sentry.setUser({
  id: user.id,
  email: user.email,
  username: user.name,
});
```

### Adding Breadcrumbs

```typescript
import * as Sentry from '@sentry/nextjs';

Sentry.addBreadcrumb({
  category: 'auth',
  message: 'User logged in',
  level: 'info',
});
```

### Setting Tags

```typescript
import * as Sentry from '@sentry/nextjs';

Sentry.setTag('school_id', schoolId);
Sentry.setTag('user_role', userRole);
```

## Production Deployment

### Environment Variables

Ensure these are set in your production environment (Vercel, Railway, etc.):

```bash
NEXT_PUBLIC_SENTRY_DSN="your-production-dsn"
SENTRY_ORG="your-org"
SENTRY_PROJECT="schoolbridge"
SENTRY_AUTH_TOKEN="your-auth-token"
NODE_ENV="production"
```

### Vercel Deployment

Sentry automatically integrates with Vercel:
1. Add environment variables in Vercel dashboard
2. Enable automatic Vercel Cron Monitors (already configured)
3. Source maps are uploaded during build

### Release Tracking

Releases are tracked automatically using:
- Git commit SHA (if available)
- `NEXT_PUBLIC_SENTRY_RELEASE` environment variable
- Sentry release management

## Monitoring

### Dashboard

View your errors at: `https://sentry.io/organizations/[your-org]/issues/`

### Alerts

Configure alerts in Sentry:
1. Go to **Alerts** → **Create Alert**
2. Set conditions (e.g., new error, error frequency)
3. Choose notification channel (email, Slack, etc.)

### Performance

View performance metrics at: `https://sentry.io/organizations/[your-org]/performance/`

## Best Practices

1. **Don't Log Sensitive Data**: Ensure PII is not sent to Sentry
2. **Set Context**: Always set user context and tags for better debugging
3. **Use Error Boundaries**: Wrap components to catch React errors
4. **Monitor Quotas**: Check your Sentry quota usage regularly
5. **Review Errors**: Regularly review and triage errors in Sentry dashboard

## Troubleshooting

### Errors Not Appearing

1. Check `NEXT_PUBLIC_SENTRY_DSN` is set correctly
2. Verify you're not in development mode (errors are filtered)
3. Check Sentry project settings and DSN validity

### Source Maps Not Uploading

1. Verify `SENTRY_AUTH_TOKEN` is set with correct permissions
2. Check `SENTRY_ORG` and `SENTRY_PROJECT` match your Sentry settings
3. Review build logs for source map upload errors

### High Event Volume

1. Adjust `tracesSampleRate` in config files
2. Adjust `replaysSessionSampleRate` to lower value
3. Add more error filters in `beforeSend` callback

## Resources

- [Sentry Next.js Documentation](https://docs.sentry.io/platforms/javascript/guides/nextjs/)
- [Sentry Best Practices](https://docs.sentry.io/product/best-practices/)
- [Sentry Performance Monitoring](https://docs.sentry.io/product/performance/)
- [Sentry Session Replay](https://docs.sentry.io/product/session-replay/)

## Support

For issues or questions:
- Check [Sentry Community Forum](https://forum.sentry.io/)
- Contact Sentry Support (paid plans)
- Review [Sentry Discord](https://discord.gg/sentry)
