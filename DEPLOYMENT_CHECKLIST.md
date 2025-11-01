# Database Schema Improvements - Deployment Checklist

**Date**: 2025-11-01
**Change Type**: Database Schema Enhancement
**Impact Level**: High
**Breaking Changes**: Frontend code updates required

---

## Pre-Deployment Verification (Complete Before Proceeding)

### 1. Review Documentation

- [ ] Read `/docs/reports/2025-11-01_database_schema_improvements.md` (main report)
- [ ] Understand changes in `Technical Details` section
- [ ] Review `Deployment Considerations` section
- [ ] Check `Developer Handoff Notes` for integration patterns
- [ ] Review `/docs/reports/CHANGE_REPORT_INDEX.md` for quick reference

### 2. Database Backup

```bash
# Create backup of production database
pg_dump $DATABASE_URL > backup_2025_11_01_pre_schema_changes.sql

# Store in secure location with timestamp
# Backup size: [your backup size]
# Backup location: [your backup location]
```

- [ ] Production database backed up
- [ ] Backup verified for integrity
- [ ] Backup location documented
- [ ] Recovery procedure tested

### 3. Local Testing

```bash
# Test migrations locally in development environment
cd C:\Users\jms\OneDrive - SPC CONSULTANTS\source\repos\schoolbridge

# Reset local database to clean state
npx prisma migrate reset --force

# Verify Prisma Client generation
npx prisma generate

# Verify TypeScript compilation
npm run build

# Check for compilation errors
npm run type-check
```

- [ ] Local migrations apply without errors
- [ ] Prisma Client generated successfully
- [ ] TypeScript compilation passes
- [ ] No type errors in generated types

### 4. Seed Data Testing

```bash
# Test course seed data in local environment
npx ts-node prisma/seeds/run-course-seed.ts

# Verify all data created successfully
npx prisma studio  # Open Prisma Studio to inspect
```

- [ ] Seed script runs without errors
- [ ] 3 courses created with expected content
- [ ] 5 students enrolled
- [ ] Student progress records created
- [ ] Sample submissions created
- [ ] All enum values used correctly

### 5. Schema Validation

```bash
# Verify schema structure
npx prisma db execute --stdin

# Check enum types in PostgreSQL
SELECT typname, typtype
FROM pg_type
WHERE typname IN ('ValidationStatus', 'AttendanceStatus', 'SubmissionStatus', 'ContentType')
ORDER BY typname;

# Check migration history
npx prisma migrate status
```

- [ ] All migrations show as pending
- [ ] Expected 2 migrations to apply:
  - `20251101021319_add_lesson_and_assignment_content_types`
  - `20251101022636_add_missing_enums_and_fields`
- [ ] No conflicting migrations detected

### 6. Team Notification

- [ ] Notify frontend team about enum changes
- [ ] Point to integration guide: `/docs/ENUM_FIX_SUMMARY.md`
- [ ] Schedule review meeting if needed
- [ ] Provide API update checklist

---

## Staging Environment Deployment

### Step 1: Prepare Staging Database

```bash
# Create staging database backup (if updating existing)
pg_dump $STAGING_DATABASE_URL > staging_backup_2025_11_01.sql

# Clear staging database if clean slate (optional)
# Only if no important data exists
# psql $STAGING_DATABASE_URL -c "DROP SCHEMA public CASCADE; CREATE SCHEMA public;"
```

- [ ] Staging backup created
- [ ] Database ready for migration

### Step 2: Apply Migrations

```bash
# SSH to staging environment
ssh [staging-host]

# Navigate to project
cd /path/to/schoolbridge

# Pull latest code
git pull origin main

# Apply migrations
npx prisma migrate deploy

# Verify migrations applied
npx prisma migrate status

# Generate updated Prisma Client
npx prisma generate
```

- [ ] Migrations executed successfully
- [ ] Migration files created in database
- [ ] Prisma Client regenerated
- [ ] No migration errors in logs

### Step 3: Seed Data (Optional, for Testing)

```bash
# Seed realistic test data
npx ts-node prisma/seeds/run-course-seed.ts

# Verify data created
npx prisma studio
```

- [ ] Courses seeded successfully
- [ ] Test data available for QA
- [ ] Progress records created
- [ ] Submissions visible in database

### Step 4: Application Rebuild

```bash
# Install dependencies
npm install

# Build application
npm run build

# Start application
npm start
```

- [ ] Build completes without errors
- [ ] No TypeScript compilation errors
- [ ] Application starts successfully
- [ ] Database connection confirmed

### Step 5: Staging Verification

```bash
# Run application tests
npm test

# Run integration tests
npm run test:integration

# Manual testing checklist:
# 1. Login as different user roles
# 2. Check database enum values are valid
# 3. Verify no GraphQL/API errors
# 4. Check application logs for warnings
```

- [ ] All tests pass
- [ ] No database errors in logs
- [ ] Enum validation working correctly
- [ ] Application performance acceptable

---

## Frontend Integration (Parallel Work)

### Required Updates

**Frontend teams must complete these updates before production deployment:**

#### 1. Attendance Component Updates

**Files to update**: `src/app/teacher/attendance/page.tsx`

```typescript
// Update imports
import { AttendanceStatus } from '@/generated/prisma';

// Update field references from:
// attendance.present (boolean)
// to:
// attendance.status (enum)

// Update type signatures
const handleStatusChange = (
  studentId: string,
  status: AttendanceStatus  // Changed from string
) => {
  // implementation
};

// Update status values
AttendanceStatus.PRESENT   // instead of 'Present'
AttendanceStatus.ABSENT    // instead of 'Absent'
AttendanceStatus.LATE      // instead of 'Late'
AttendanceStatus.EXCUSED   // instead of 'Excused'
```

- [ ] Attendance component updated
- [ ] All status references use enums
- [ ] TypeScript compiles without errors
- [ ] Component tested with new enum values

#### 2. Submission Component Updates

**Files to update**: Any submission-related components

```typescript
// Update imports
import { SubmissionStatus } from '@/generated/prisma';

// Use status field
if (submission.status === SubmissionStatus.PENDING) {
  // Show "Not submitted"
} else if (submission.status === SubmissionStatus.SUBMITTED) {
  // Show "Awaiting grade"
} else if (submission.status === SubmissionStatus.GRADED) {
  // Show grade
}
```

- [ ] Submission components updated
- [ ] Status display logic updated
- [ ] TypeScript compiles without errors
- [ ] Component tested with various statuses

#### 3. Course Validation Component Updates

**Files to update**: Any validation-related components

```typescript
// Update imports
import { ValidationStatus } from '@/generated/prisma';

// Use enum values
validation.status === ValidationStatus.APPROVED
validation.status === ValidationStatus.CHANGES_REQUESTED
validation.status === ValidationStatus.REJECTED
```

- [ ] Validation components updated
- [ ] String comparisons replaced with enums
- [ ] TypeScript compiles without errors
- [ ] Component tested with all validation states

#### 4. API Routes Updates

**Files to update**: API route handlers

```typescript
// Import enums
import {
  AttendanceStatus,
  SubmissionStatus,
  ValidationStatus
} from '@/generated/prisma';

// Validate enum values
const validStatuses = Object.values(AttendanceStatus);
if (!validStatuses.includes(request.status)) {
  throw new BadRequest('Invalid attendance status');
}

// Set enum values correctly
await db.submission.update({
  where: { id: submissionId },
  data: {
    status: SubmissionStatus.GRADED,  // Use enum
    gradedAt: new Date(),
  }
});
```

- [ ] API routes updated for attendance
- [ ] API routes updated for submissions
- [ ] API routes updated for validation
- [ ] Enum validation added to request handlers

### Frontend Testing Checklist

- [ ] TypeScript compilation passes
- [ ] Attendance recording works with all 4 statuses
- [ ] Submission status displays correctly
- [ ] Course validation uses correct status values
- [ ] No runtime errors with enum values
- [ ] All UI components reflect enum changes
- [ ] API responses validated against enums

**Frontend work can proceed in parallel with database deployment.**

---

## Production Deployment

### Pre-Production Checks

```bash
# Verify all staging tests passed
# Run production migration dry-run
npx prisma migrate resolve --rolled-back [migration-name]  # TEST ONLY

# Get confirmation from all teams
# - Database team: migrations validated
# - Frontend team: code updates ready
# - QA team: testing plan complete
# - DevOps team: deployment ready
```

- [ ] All staging tests passed
- [ ] Frontend changes code-reviewed and approved
- [ ] QA testing completed
- [ ] Production backup created
- [ ] Rollback procedure tested
- [ ] All stakeholders notified

### Production Database Migration

```bash
# SSH to production environment
ssh [production-host]

# Create pre-migration backup
pg_dump $PROD_DATABASE_URL > prod_backup_2025_11_01_pre_migration.sql

# Verify backup
pg_restore --list prod_backup_2025_11_01_pre_migration.sql | head

# Navigate to project
cd /path/to/schoolbridge

# Pull latest code with migrations
git pull origin main

# Apply migrations (will take ~30 seconds)
npx prisma migrate deploy

# Verify status
npx prisma migrate status

# Generate updated Prisma Client
npx prisma generate
```

- [ ] Production backup created
- [ ] Backup verified
- [ ] Migrations applied to production
- [ ] Zero errors in migration output
- [ ] Migration status shows all applied

### Production Application Deployment

```bash
# Install dependencies
npm install

# Build application
npm run build

# Test build
npm test:build

# Deploy with frontend changes
# (Frontend team deploys simultaneously)
npm run deploy

# Verify application health
npm run health-check

# Monitor logs
tail -f logs/application.log
tail -f logs/error.log
```

- [ ] Production build successful
- [ ] No TypeScript errors
- [ ] Application starts without errors
- [ ] Database connection established
- [ ] Migrations verified in database

### Post-Deployment Verification

```bash
# Verify enum types in production
SELECT typname FROM pg_type
WHERE typname IN ('ValidationStatus', 'AttendanceStatus', 'SubmissionStatus');

# Test enum constraints
SELECT COUNT(*) FROM "Attendance" WHERE status = 'INVALID_VALUE';  -- Should error

# Verify no constraint violations
SELECT COUNT(*) FROM "Submission" WHERE status IS NULL;  -- Should be 0
SELECT COUNT(*) FROM "Attendance" WHERE status IS NULL;  -- Should be 0

# Check data integrity
SELECT status, COUNT(*) FROM "Attendance" GROUP BY status;
SELECT status, COUNT(*) FROM "Submission" GROUP BY status;
SELECT status, COUNT(*) FROM "CourseValidation" GROUP BY status;
```

- [ ] Enum types created in production
- [ ] No null status values found
- [ ] All existing data valid
- [ ] Constraints working correctly

### Monitoring for 24 Hours

```bash
# Monitor application errors
# Check logs for: "Invalid enum value", "type violation", etc.

# Monitor database
# Check for: constraint violations, failed inserts, slow queries

# Monitor API responses
# Check for: 500 errors, validation errors, type mismatches

# Monitor user reports
# Check for: unexpected behavior, missing data, UI issues
```

- [ ] Monitor error logs continuously
- [ ] Watch for enum-related errors
- [ ] Track performance metrics
- [ ] Verify user-facing functionality

---

## Rollback Procedure (If Needed)

### Immediate Rollback (First 24 Hours)

```bash
# If critical issue detected, rollback immediately

# SSH to production
ssh [production-host]

# Stop application
npm stop

# Restore previous database
pg_restore --clean --if-exists prod_backup_2025_11_01_pre_migration.sql

# Git revert to previous commit
git revert [last-commit]

# Rebuild with previous code
npm install
npm run build

# Start application
npm start

# Verify previous schema active
npx prisma migrate status

# Notify team
# Send alert to: #database-alerts, #devops-alerts
```

- [ ] Application stopped
- [ ] Database restored from backup
- [ ] Code reverted
- [ ] Application restarted
- [ ] Team notified
- [ ] Incident documented

### Post-Rollback

```bash
# Run diagnostics
npm run diagnostics

# Identify issue
# Review logs for error cause

# Create fix
# Develop solution to address problem

# Test thoroughly
# In staging environment

# Re-deploy
# Follow deployment procedure again
```

- [ ] Issue identified
- [ ] Root cause documented
- [ ] Fix developed
- [ ] Fix tested in staging
- [ ] Ready for re-deployment

---

## Post-Deployment Documentation

### Success Verification

- [ ] All migrations applied
- [ ] Enum types created in database
- [ ] No data loss occurred
- [ ] Application performs normally
- [ ] Frontend code updated and deployed
- [ ] All tests passing
- [ ] Users report normal functionality
- [ ] Zero enum-related errors in logs

### Documentation Updates

- [ ] Update deployment runbooks
- [ ] Document any issues encountered
- [ ] Update team training materials
- [ ] Add enum usage to coding standards
- [ ] Update API documentation
- [ ] Update database documentation

### Team Communication

```
Subject: Database Schema Improvements - Deployment Complete

The following changes have been successfully deployed to production:

- 2 new enums: ValidationStatus, AttendanceStatus
- 1 enhanced enum: ContentType (added LESSON, ASSIGNMENT)
- 3 models updated with type-safe status fields
- Complete database documentation available

Frontend code updates deployed simultaneously.

Changes are now live in production.

See: /docs/reports/2025-11-01_database_schema_improvements.md for details.
```

- [ ] Deployment notification sent
- [ ] Team trained on enum usage
- [ ] Documentation updated
- [ ] Success criteria documented

---

## Sign-Off

### Technical Lead Sign-Off

**Name**: ___________________________
**Date**: ___________________________
**Signature**: ___________________________

- [ ] Changes reviewed and approved
- [ ] Risk assessment acceptable
- [ ] Deployment plan sound
- [ ] Ready for production deployment

### DevOps Lead Sign-Off

**Name**: ___________________________
**Date**: ___________________________
**Signature**: ___________________________

- [ ] Infrastructure ready
- [ ] Deployment procedures tested
- [ ] Monitoring configured
- [ ] Rollback procedure ready

### Product Owner Sign-Off

**Name**: ___________________________
**Date**: ___________________________
**Signature**: ___________________________

- [ ] Business requirements met
- [ ] No blocking concerns
- [ ] Approved for deployment
- [ ] Communicated to stakeholders

---

## Timeline Summary

| Phase | Duration | Status |
|-------|----------|--------|
| Analysis & Planning | Complete | ✅ |
| Development | Complete | ✅ |
| Documentation | Complete | ✅ |
| Staging Deployment | 1-2 hours | ⏳ |
| Frontend Integration | 2-4 hours | ⏳ |
| Testing | 4-8 hours | ⏳ |
| Production Deployment | 30 minutes | ⏳ |
| Verification | 1 hour | ⏳ |
| Monitoring | 24 hours | ⏳ |

**Total Timeline**: 1-2 days from approval to full deployment

---

## Contact Information

**Questions About**:
- **Report**: See `/docs/reports/2025-11-01_database_schema_improvements.md`
- **Frontend Integration**: See `/docs/ENUM_FIX_SUMMARY.md`
- **Database Changes**: See `/docs/database-structure.md`
- **Migrations**: See `/docs/enum-analysis.md`

**Support Available**:
- Technical questions: [Technical Lead]
- Deployment issues: [DevOps Lead]
- Integration issues: [Frontend Lead]
- Emergency issues: [On-call Engineer]

---

**Checklist Version**: 1.0
**Created**: 2025-11-01
**Status**: Ready for Use
**Last Updated**: 2025-11-01

Print this checklist and check off items as you complete them.
