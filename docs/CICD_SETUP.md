# CI/CD Pipeline Setup

This document explains the continuous integration and continuous deployment (CI/CD) setup for SchoolBridge using GitHub Actions.

## Overview

SchoolBridge uses GitHub Actions for automated testing, building, and deployment. The CI/CD pipeline ensures code quality, runs tests, and automates deployments to production.

## Workflows

### 1. CI Workflow (`ci.yml`)

**Triggers**: Push to `main` or `develop`, and pull requests to these branches

**Jobs**:
- **Lint and Type Check**: Runs ESLint and TypeScript compiler
- **Build**: Builds the Next.js application
- **Test**: Runs unit tests with Jest
- **Security Scan**: Checks for vulnerabilities using npm audit and Snyk

**Configuration**:
```yaml
on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main, develop]
```

### 2. Deploy Workflow (`deploy.yml`)

**Triggers**: Push to `main` branch, or manual dispatch

**Jobs**:
- **Deploy to Production**: Runs migrations, builds app, and deploys to Vercel/Railway

**Steps**:
1. Run database migrations with Prisma
2. Build application with production environment variables
3. Deploy to hosting platform (Vercel or Railway)
4. Create Sentry release for error tracking
5. Send deployment notifications

### 3. PR Check Workflow (`pr-check.yml`)

**Triggers**: PR opened, synchronized, or reopened

**Jobs**:
- **PR Validation**: Validates PR title follows conventional commits
- Runs all CI checks (lint, type check, tests, build)
- Adds comment to PR on success

**PR Title Format**:
```
<type>(<scope>): <description>

Types: feat, fix, docs, style, refactor, perf, test, build, ci, chore
```

## Required Secrets

Configure these secrets in GitHub repository settings:

### General
- `DATABASE_URL` - PostgreSQL connection string
- `NEXTAUTH_URL` - NextAuth URL (production URL)
- `NEXTAUTH_SECRET` - NextAuth secret key

### Sentry
- `NEXT_PUBLIC_SENTRY_DSN` - Sentry DSN
- `SENTRY_ORG` - Sentry organization slug
- `SENTRY_PROJECT` - Sentry project name
- `SENTRY_AUTH_TOKEN` - Sentry authentication token

### Deployment (Vercel)
- `VERCEL_TOKEN` - Vercel API token
- `VERCEL_ORG_ID` - Vercel organization ID
- `VERCEL_PROJECT_ID` - Vercel project ID

### Deployment (Railway - Alternative)
- `RAILWAY_TOKEN` - Railway API token

### Security (Optional)
- `SNYK_TOKEN` - Snyk authentication token for security scanning

## Setup Instructions

### 1. Configure GitHub Secrets

1. Go to GitHub repository → **Settings** → **Secrets and variables** → **Actions**
2. Click **New repository secret**
3. Add each secret listed above with appropriate values

### 2. Enable GitHub Actions

GitHub Actions is enabled by default for new repositories. Verify:
1. Go to **Actions** tab in your repository
2. Ensure workflows are not disabled

### 3. Configure Branch Protection (Optional but Recommended)

1. Go to **Settings** → **Branches**
2. Add rule for `main` branch:
   - ✅ Require pull request before merging
   - ✅ Require status checks to pass before merging
   - ✅ Require branches to be up to date before merging
   - Select required status checks:
     - Lint and Type Check
     - Build Application
     - Run Tests
     - PR Validation

### 4. Set up Deployment Platform

#### Option A: Vercel

1. Sign up at [vercel.com](https://vercel.com)
2. Import GitHub repository
3. Get Vercel credentials:
   ```bash
   # Install Vercel CLI
   npm i -g vercel

   # Login and link project
   vercel login
   vercel link

   # Get credentials from .vercel/project.json
   cat .vercel/project.json
   ```
4. Add secrets to GitHub (VERCEL_TOKEN, VERCEL_ORG_ID, VERCEL_PROJECT_ID)

#### Option B: Railway

1. Sign up at [railway.app](https://railway.app)
2. Create new project from GitHub repository
3. Get Railway token from account settings
4. Add `RAILWAY_TOKEN` to GitHub secrets
5. Uncomment Railway deployment step in `deploy.yml`

### 5. Configure Database Migrations

Ensure your `DATABASE_URL` secret points to your production database:
```
postgresql://user:password@host:port/database?sslmode=require
```

## Workflow Status Badges

Add status badges to your README:

```markdown
![CI](https://github.com/micheltsarasoa/schoolbridge/workflows/CI/badge.svg)
![Deploy](https://github.com/micheltsarasoa/schoolbridge/workflows/Deploy/badge.svg)
```

## Local Testing

Test workflows locally using [act](https://github.com/nektos/act):

```bash
# Install act
brew install act  # macOS
choco install act # Windows

# Run CI workflow
act -j lint-and-type-check

# Run with secrets
act -s GITHUB_TOKEN=your_token
```

## Deployment Process

### Automatic Deployment

1. Push code to `main` branch:
   ```bash
   git push origin main
   ```
2. GitHub Actions automatically:
   - Runs CI checks
   - Builds application
   - Runs database migrations
   - Deploys to production
   - Creates Sentry release

### Manual Deployment

Trigger deployment manually from GitHub:
1. Go to **Actions** → **Deploy** workflow
2. Click **Run workflow**
3. Select branch and click **Run workflow**

## Monitoring

### View Workflow Runs

1. Go to **Actions** tab
2. Select workflow to view runs
3. Click on run to see details and logs

### Notifications

Configure GitHub notifications:
1. Go to **Settings** → **Notifications**
2. Enable notifications for workflow runs
3. Configure delivery method (email, web, mobile)

## Troubleshooting

### Build Failures

**Check**:
- Build logs in GitHub Actions
- Environment variables are set correctly
- Dependencies are installed properly

**Common Issues**:
- Missing environment variables
- Type errors in code
- Failed tests

### Deployment Failures

**Check**:
- Deployment platform status
- Database migrations completed successfully
- Secrets are configured correctly

**Common Issues**:
- Invalid deployment credentials
- Database connection errors
- Build errors

### Migration Failures

**Check**:
- Database connection string is correct
- Database user has proper permissions
- Migration files are valid

**Fix**:
```bash
# Reset migrations locally
npx prisma migrate reset

# Generate new migration
npx prisma migrate dev --name fix_migration

# Push to production
git push origin main
```

## Best Practices

1. **Always run CI checks locally** before pushing:
   ```bash
   npm run lint
   npm test
   npm run build
   ```

2. **Use feature branches** and pull requests for all changes

3. **Write meaningful commit messages** following conventional commits

4. **Keep secrets secure** - never commit `.env` files

5. **Monitor workflow runs** and fix failures immediately

6. **Review deployment logs** after each production deployment

7. **Test migrations** in development before deploying

## Environment-Specific Configuration

### Development
- Runs on: Local machine
- Database: Development database
- Environment: `.env.local`

### Staging (Optional)
- Runs on: Separate hosting instance
- Database: Staging database
- Triggered by: Push to `develop` branch

### Production
- Runs on: Production hosting (Vercel/Railway)
- Database: Production database
- Triggered by: Push to `main` branch

## Continuous Improvement

### Add Coverage Reporting

```yaml
- name: Upload coverage
  uses: codecov/codecov-action@v4
  with:
    token: ${{ secrets.CODECOV_TOKEN }}
```

### Add Lighthouse CI

```yaml
- name: Lighthouse CI
  uses: treosh/lighthouse-ci-action@v10
  with:
    urls: 'https://schoolbridge.app'
```

### Add Dependency Updates

Use Dependabot or Renovate for automated dependency updates:
```yaml
# .github/dependabot.yml
version: 2
updates:
  - package-ecosystem: "npm"
    directory: "/"
    schedule:
      interval: "weekly"
```

## Resources

- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Vercel Deployment Guide](https://vercel.com/docs/deployments/overview)
- [Railway Deployment Guide](https://docs.railway.app/deploy/deployments)
- [Prisma Migrations](https://www.prisma.io/docs/concepts/components/prisma-migrate)
- [Conventional Commits](https://www.conventionalcommits.org/)

## Support

For issues with CI/CD:
1. Check workflow logs in GitHub Actions
2. Review this documentation
3. Check platform-specific documentation (Vercel/Railway)
4. Open an issue in the repository
