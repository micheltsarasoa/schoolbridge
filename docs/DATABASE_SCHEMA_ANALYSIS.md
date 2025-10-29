# SchoolBridge Database Schema Analysis

**Last Updated:** 2025-10-29

---

## 📊 Overview

The SchoolBridge database is designed to support an **offline-first school management platform** for Madagascar, with **15 main models** organized into 6 functional domains.

### Key Statistics
- **Total Models**: 15
- **Total Enums**: 6
- **Total Relations**: 28
- **Total Indexes**: 35
- **Primary Users**: ~5,000-10,000 per school
- **Supported Languages**: 4 (French, English, Malagasy, Spanish)

---

## 🎯 Domain Architecture

### 1. User Management Domain
**Purpose**: Handle authentication, authorization, and user relationships

#### Models (5):
1. **User** - Core user entity
2. **Account** - OAuth/social login accounts
3. **Session** - Active user sessions
4. **VerificationToken** - Email/phone verification
5. **UserRelationship** - Parent-student associations

#### Key Features:
- ✅ Multi-role support (5 roles)
- ✅ Email & phone authentication
- ✅ Account lockout protection
- ✅ Failed login attempt tracking
- ✅ Language preference per user
- ✅ OAuth integration ready

#### User Roles:
```typescript
enum UserRole {
  ADMIN                 // School administrators
  EDUCATIONAL_MANAGER   // Responsable pédagogique
  TEACHER              // Course creators
  STUDENT              // Course consumers
  PARENT               // Student monitors
}
```

#### Security Features:
- `failedLoginAttempts` - Tracks login failures
- `lockedUntil` - Temporary account locks
- `emailVerified` / `phoneVerified` - Verification status
- `lastLogin` - Activity tracking

---

### 2. School Management Domain
**Purpose**: Multi-tenant school configuration and settings

#### Models (2):
1. **School** - School entity
2. **SchoolConfig** - School-specific settings

#### Key Features:
- ✅ Multi-school support
- ✅ Unique school codes
- ✅ Download permissions per content type
- ✅ Configurable sync frequency
- ✅ Storage limits per school

#### Configuration Options:
```typescript
{
  allowVideoDownload: boolean       // Default: true
  allowPdfDownload: boolean         // Default: true
  allowInteractiveDownload: boolean // Default: true
  syncFrequencyHours: number        // Default: 24 hours
  maxDownloadSizeMB: number         // Default: 100 MB
}
```

---

### 3. Course Management Domain
**Purpose**: Handle course creation, validation, and versioning

#### Models (5):
1. **Course** - Main course entity
2. **CourseContent** - Course modules/sections
3. **CourseValidation** - Validation workflow
4. **ContentVersion** - Version history
5. **CourseAssignment** - Student/class assignments

#### Course Lifecycle:
```
DRAFT → UNDER_REVIEW → APPROVED → PUBLISHED → ARCHIVED
```

#### Content Types:
```typescript
enum ContentType {
  TEXT         // Rich text content
  VIDEO        // Video files
  PDF          // PDF documents
  INTERACTIVE  // Interactive modules
  QUIZ         // Assessments
}
```

#### Key Features:
- ✅ Multi-language course support
- ✅ Validation workflow (teacher → educational manager)
- ✅ Version control with history
- ✅ Offline-first design
- ✅ Content sequencing with timing
- ✅ File size tracking

#### Unique Course Features:
- **Time-based content display**:
  - `appearsAfterSeconds` - Delayed content reveal
  - `disappearsAfterSeconds` - Temporary content
- **Offline availability**: `offlineAvailable` flag per content block
- **File references**: External storage links
- **Flexible content data**: JSON field for rich content

---

### 4. Progress Tracking Domain
**Purpose**: Monitor student learning progress

#### Models (1):
1. **StudentProgress** - Per-course progress tracking

#### Tracked Metrics:
```typescript
{
  completionPercentage: number   // 0-100%
  timeSpentMinutes: number       // Total time investment
  lastAccessed: DateTime         // Last activity
  currentModule: string          // Current position
}
```

#### Key Features:
- ✅ Real-time progress tracking
- ✅ Time spent analytics
- ✅ Module-level positioning
- ✅ Unique constraint: one progress record per student-course pair

#### Use Cases:
- **Student Dashboard**: Show course completion status
- **Parent Dashboard**: Monitor child's learning
- **Teacher Analytics**: Track class engagement
- **Gamification** (Future): Badge unlocking based on completion

---

### 5. Parent-Teacher Communication Domain
**Purpose**: Facilitate offline-friendly parent instructions

#### Models (2):
1. **ParentInstruction** - Instructions from teachers
2. **ParentInstructionCompletion** - Parent acknowledgments

#### Instruction Statuses:
```typescript
enum InstructionStatus {
  PENDING       // Not yet addressed
  COMPLETED     // Successfully completed
  SKIPPED       // Parent chose to skip
  NEEDS_HELP    // Parent requests assistance
}
```

#### Key Features:
- ✅ Urgent flag for priority instructions
- ✅ Expiration dates
- ✅ Multiple parents per instruction
- ✅ Completion tracking with notes
- ✅ Offline-first design

#### Example Use Cases:
- "Please ensure your child completes Module 3 by Friday"
- "Parent-teacher conference scheduled for next week"
- "Additional practice materials attached"

---

### 6. System Features Domain
**Purpose**: Cross-cutting system functionality

#### Models (2):
1. **Notification** - User notifications
2. **AuditLog** - Security and compliance logging

#### Notification Types:
```typescript
enum NotificationType {
  COURSE_ASSIGNED      // New course available
  GRADE_POSTED         // Assessment results
  PARENT_INSTRUCTION   // New instruction
  COURSE_VALIDATED     // Validation approved
  COURSE_REJECTED      // Validation rejected
  ASSIGNMENT_DUE       // Deadline reminder
  SYSTEM_ALERT         // System messages
  MESSAGE_RECEIVED     // Direct messages
}
```

#### Notification Priorities:
```typescript
enum NotificationPriority {
  LOW      // Can wait
  NORMAL   // Standard
  HIGH     // Important
  URGENT   // Immediate attention
}
```

#### Audit Logging Features:
- ✅ User action tracking
- ✅ Before/after value storage
- ✅ IP and user agent logging
- ✅ Flexible metadata (JSON)
- ✅ Entity-type agnostic

#### Audited Actions:
- User authentication
- Course creation/modification
- Grade submissions
- Content downloads
- Permission changes
- Data exports

---

## 🔗 Relationship Map

### User Relationships
```
User (1) → (N) Account              // OAuth accounts
User (1) → (N) Session              // Active sessions
User (1) → (N) Course               // Created courses
User (1) → (N) StudentProgress      // Learning progress
User (1) → (N) Notification         // User notifications
User (1) → (N) AuditLog             // Activity logs
User (M) ← (N) UserRelationship     // Parent-student links
```

### Course Relationships
```
Course (1) → (N) CourseContent      // Course modules
Course (1) → (N) CourseValidation   // Validation history
Course (1) → (N) ContentVersion     // Version history
Course (1) → (N) CourseAssignment   // Student assignments
Course (1) → (N) StudentProgress    // Progress tracking
Course (N) ← (1) School             // School courses
Course (N) ← (1) User (Teacher)     // Course creator
```

### School Relationships
```
School (1) → (N) User               // School members
School (1) → (N) Course             // School courses
School (1) → (1) SchoolConfig       // School settings
```

---

## 📈 Scalability Analysis

### Expected Data Volumes (per school)

| Model | Users | Records/User | Total Records | Growth Rate |
|-------|-------|--------------|---------------|-------------|
| User | 1 school | 1,000-5,000 | 1,000-5,000 | Steady |
| Course | Per teacher | 5-20 | 500-2,000 | Moderate |
| CourseContent | Per course | 10-50 | 5,000-100,000 | High |
| StudentProgress | Per enrollment | 5-20 | 5,000-100,000 | High |
| Notification | Per user | 10-100/day | High volume | Very High |
| AuditLog | Per action | 50-200/day | High volume | Very High |

### Performance Optimization

#### Existing Indexes (35 total):
✅ Primary keys (all models)
✅ Foreign keys (all relations)
✅ Composite indexes for queries:
- `[userId, read, createdAt]` - Notification queries
- `[courseId, contentOrder]` - Content sequencing
- `[userId, createdAt]` - Audit log queries
- `[entityType, entityId]` - Entity lookups

#### Future Index Recommendations:
- `[User.schoolId, User.role]` - School admin queries
- `[Course.schoolId, Course.status]` - Course filtering
- `[StudentProgress.courseId, StudentProgress.completionPercentage]` - Analytics

---

## 🚨 Critical Design Decisions

### 1. Offline-First Architecture

**Design Choices**:
- `offlineAvailable` flags on content
- `lastAccessed` timestamps for sync prioritization
- `syncFrequencyHours` configurable per school
- Local-first data with eventual consistency

**Sync Strategy**:
```
1. User downloads prioritized courses
2. Progress tracked locally
3. Periodic sync when online
4. Conflict resolution via timestamps
```

### 2. Multi-Language Support

**Implementation**:
- User language preference: `languagePreference`
- Course language: `language` field
- Supported languages: FR (French), EN (English), MG (Malagasy), ES (Spanish)

**Future Enhancements**:
- Content translations (same course, multiple languages)
- RTL language support
- Language fallback chains

### 3. Role-Based Access Control (RBAC)

**Role Hierarchy**:
```
ADMIN (highest)
  ↓
EDUCATIONAL_MANAGER
  ↓
TEACHER
  ↓
STUDENT / PARENT (lowest)
```

**Permissions Design** (to be implemented):
- Course creation: TEACHER, EDUCATIONAL_MANAGER, ADMIN
- Course validation: EDUCATIONAL_MANAGER, ADMIN
- Course viewing: STUDENT (assigned), TEACHER (created), ADMIN (all)
- Progress viewing: STUDENT (own), PARENT (children), TEACHER (class), ADMIN (all)

### 4. Content Versioning

**Why Version Control?**:
- Track course evolution
- Rollback capability
- Audit trail for educational content
- Compliance requirements

**Version Strategy**:
- Each edit creates new version
- Version numbers increment
- Full content snapshot per version
- Change description required

### 5. Validation Workflow

**Workflow**:
```
Teacher creates → DRAFT
Teacher submits → UNDER_REVIEW
Manager reviews → APPROVED / CHANGES_REQUESTED
Teacher publishes → PUBLISHED
Admin archives → ARCHIVED
```

**Key Features**:
- Feedback and suggestions stored
- Multiple review cycles
- Historical validation records
- Reviewer accountability

---

## 🔒 Security Considerations

### Authentication Security
- ✅ Password hashing (bcrypt - to be implemented)
- ✅ Failed login attempt tracking
- ✅ Account lockout mechanism
- ✅ Email/phone verification
- ✅ Session management
- ⚠️ 2FA support (future enhancement)

### Data Privacy
- ✅ Audit logging for compliance
- ✅ Soft deletes (SetNull on user deletion)
- ✅ IP and user agent tracking
- ⚠️ GDPR compliance (data export/deletion - to be implemented)
- ⚠️ COPPA compliance (age verification - to be implemented)

### Access Control
- ✅ School-based data isolation
- ✅ Role-based permissions
- ✅ Cascading deletes configured
- ⚠️ Row-level security (RLS) - consider for future

---

## 📊 Query Patterns & Optimization

### Most Common Queries

#### 1. Student Dashboard
```sql
-- Get assigned courses with progress
SELECT c.*, sp.completionPercentage, sp.lastAccessed
FROM Course c
JOIN CourseAssignment ca ON c.id = ca.courseId
LEFT JOIN StudentProgress sp ON c.id = sp.courseId AND sp.studentId = ?
WHERE ca.studentId = ?
ORDER BY sp.lastAccessed DESC
```

#### 2. Teacher Course Management
```sql
-- Get courses with validation status
SELECT c.*, cv.status, cv.feedbackText
FROM Course c
LEFT JOIN CourseValidation cv ON c.id = cv.courseId
WHERE c.teacherId = ?
ORDER BY c.updatedAt DESC
```

#### 3. Parent Progress Monitoring
```sql
-- Get child's progress across all courses
SELECT c.title, sp.completionPercentage, sp.timeSpentMinutes, sp.lastAccessed
FROM StudentProgress sp
JOIN Course c ON sp.courseId = c.id
JOIN UserRelationship ur ON sp.studentId = ur.studentId
WHERE ur.parentId = ?
ORDER BY sp.lastAccessed DESC
```

#### 4. Educational Manager Dashboard
```sql
-- Get courses pending review
SELECT c.*, u.name as teacherName
FROM Course c
JOIN User u ON c.teacherId = u.id
WHERE c.status = 'UNDER_REVIEW' AND c.schoolId = ?
ORDER BY c.updatedAt ASC
```

### Optimization Opportunities

1. **Materialized Views** (future):
   - School-wide progress summaries
   - Course popularity rankings
   - Teacher performance metrics

2. **Caching Strategy**:
   - Course metadata (rarely changes)
   - School configuration (static)
   - User profiles (low update frequency)

3. **Partitioning** (for scale):
   - AuditLog by date (monthly partitions)
   - Notification by date (weekly partitions)

---

## 🔄 Migration Strategy

### Phase 1: Core Models (Sprint 1-2)
✅ User, Account, Session
✅ School, SchoolConfig
⏳ Initial data seeding

### Phase 2: Course System (Sprint 3-5)
- Course, CourseContent
- CourseValidation, ContentVersion
- CourseAssignment

### Phase 3: Progress & Communication (Sprint 6-7)
- StudentProgress
- ParentInstruction, ParentInstructionCompletion

### Phase 4: System Features (Sprint 8+)
- Notification
- AuditLog

---

## 🚀 Future Enhancements

### Potential New Models

#### 1. Grade/Assessment System
```prisma
model Grade {
  id            String   @id @default(uuid())
  studentId     String
  courseId      String
  assignmentId  String?
  score         Float
  maxScore      Float
  gradedBy      String
  gradedAt      DateTime
  feedback      String?
}
```

#### 2. Discussion/Forum
```prisma
model Discussion {
  id        String   @id @default(uuid())
  courseId  String
  authorId  String
  title     String
  content   String
  createdAt DateTime @default(now())

  replies   DiscussionReply[]
}
```

#### 3. Skill Tracking (Post-MVP)
```prisma
model Skill {
  id          String @id @default(uuid())
  name        String
  description String
  category    String

  progress SkillProgress[]
}

model SkillProgress {
  studentId     String
  skillId       String
  level         Int
  lastPracticed DateTime

  @@id([studentId, skillId])
}
```

#### 4. Badge/Achievement System (Gamification)
```prisma
model Badge {
  id          String @id @default(uuid())
  name        String
  description String
  iconUrl     String
  criteria    Json

  earned BadgeEarned[]
}

model BadgeEarned {
  studentId String
  badgeId   String
  earnedAt  DateTime @default(now())

  @@id([studentId, badgeId])
}
```

### Schema Evolution Recommendations

1. **Add Full-Text Search**:
   - Course titles/descriptions
   - User names
   - Instruction text

2. **Add Soft Deletes**:
   - `deletedAt DateTime?` on critical models
   - Retain data for audit/compliance

3. **Add Tenant Isolation**:
   - Row-level security policies
   - Separate databases per large school

4. **Add Analytics Tables**:
   - Daily aggregations
   - Pre-computed metrics
   - Reporting optimization

---

## 📝 Naming Conventions

### Current Patterns
- **Models**: PascalCase (User, Course, StudentProgress)
- **Fields**: camelCase (completionPercentage, createdAt)
- **Relations**: Descriptive names (coursesCreated, instructionsGiven)
- **Enums**: UPPER_SNAKE_CASE values, PascalCase names

### Best Practices
✅ Consistent timestamp fields: `createdAt`, `updatedAt`
✅ Boolean prefixes: `is`, `has`, `can`, `allow`
✅ Relationship clarity: `teacherId` (not just `teacher`)
✅ Plural relations: `courses`, `users`, `notifications`

---

## 🎯 Data Integrity Rules

### Constraints

#### Unique Constraints (6):
1. `User.email` - Prevent duplicate accounts
2. `User.phone` - Prevent duplicate accounts
3. `School.code` - Unique school identifiers
4. `UserRelationship[parentId, studentId]` - One relationship per pair
5. `StudentProgress[studentId, courseId]` - One progress per enrollment
6. `ParentInstructionCompletion[instructionId, parentId]` - One completion per parent

#### Foreign Key Actions:
- **Cascade Delete**: Sessions, Accounts, Progress (child data)
- **Restrict Delete**: Course teachers, Reviewers (maintain referential integrity)
- **Set Null**: School users, Audit log users (preserve records)

---

## 📚 Documentation Quality

### What's Well Documented:
✅ Enum values explained
✅ Field purposes clear
✅ Relationships mapped
✅ Indexes optimized

### Areas for Improvement:
⚠️ Add field-level comments
⚠️ Document business rules
⚠️ Add example queries
⚠️ Create ER diagram

---

## 🔧 Development Tools

### Recommended Prisma Commands

```bash
# Generate Prisma Client
npx prisma generate

# Create migration
npx prisma migrate dev --name <migration-name>

# Apply migrations (production)
npx prisma migrate deploy

# Reset database (development only!)
npx prisma migrate reset

# Open Prisma Studio (GUI)
npx prisma studio

# Validate schema
npx prisma validate

# Format schema
npx prisma format
```

---

## 📊 Summary

### Strengths
✅ **Well-structured** - Clear domain separation
✅ **Scalable** - Proper indexing and relationships
✅ **Flexible** - JSON fields for extensibility
✅ **Secure** - Audit logging and access control
✅ **Offline-ready** - Designed for low connectivity
✅ **Multi-tenant** - School isolation built-in

### Potential Concerns
⚠️ **Notification volume** - May need archival strategy
⚠️ **Audit log growth** - Consider partitioning
⚠️ **Content storage** - Large JSON fields may impact performance
⚠️ **Sync complexity** - Offline conflict resolution needs careful implementation

### Next Steps
1. Implement authentication using this schema (Sprint 2)
2. Create seed data for development
3. Set up Prisma Studio for admin interface
4. Write integration tests for complex queries
5. Document API endpoints that use these models

---

**Generated:** 2025-10-29 | **Version:** 1.0
