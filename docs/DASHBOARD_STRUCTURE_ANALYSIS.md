# SchoolBridge Dashboard Structure Analysis

**Date:** 2025-10-30
**Status:** Current Implementation vs Recommended Structure
**Context:** Offline-first educational platform for Madagascar

---

## 📊 Executive Summary

**Current State:** MVP with basic dashboards and navigation for Student, Teacher, Parent, and Admin roles.
**Recommendation Scope:** Comprehensive feature set based on educational platform best practices.
**Approach:** Phased implementation prioritizing core features while maintaining offline-first capabilities.

---

## 🎯 Role-by-Role Analysis

### 1. 👨‍🎓 STUDENT DASHBOARD

#### ✅ Currently Implemented

**Sidebar Navigation:**
- Dashboard
- Email 
- Courses (with hierarchical submenu: Math > Algebra, Science > Physics/Chemistry)
- Quizzes
- Todo
- Planning
- Forecast
- Results & Badges
- Profile (bottom section)
- Notifications (bottom section)

**Pages Status:**
- ✅ `/student/dashboard` - EXISTS (placeholder)
- ✅ `/student/courses` - EXISTS (placeholder)
- 🔳 `/student/email`
- ✅ `/student/quizzes` - EXISTS (placeholder)
- ✅ `/student/todo` - EXISTS (placeholder)
- ✅ `/student/planning` - EXISTS (placeholder)
- ✅ `/student/forecast` - EXISTS (placeholder)
- ✅ `/student/results-badges` - EXISTS (placeholder)

**API Support:**
- ✅ `/api/courses` - Course listing
- ✅ `/api/progress` - Student progress tracking
- ✅ `/api/assignments` - Assignment management
- ✅ `/api/notifications` - Notifications

#### 🎯 Recommended Additions

**Sidebar:**
```
📊 Dashboard
📬 Inbox
📚 Courses
   ├── Sciences
   ├── Languages & Arts
   ├── Maths
   ├── Civic & Morals
   ├── Social Studies
   ├── Special Topics
   ├── Technologies
   └── View All Courses
🗓️ Planning (existing)
📝 Exams & Result (NEW - renamed from Quizzes)
🧩 Quizzes (NEW - separate from exams)
🏆 Results & Badges (existing)
📋 Todos (existing)
💹 Forecast


🔔 Support
🤝 Feedback

👤 Profile
   ├── Settings (NEW)
   ├── Digital ID Card (NEW)
   └── Logout
```

**Dashboard Content Priorities:**

**Phase 1 (Immediate - Sprint 2-3):**
- [ ] Overview cards: Attendance %, Average Grade, Upcoming Deadlines
- [ ] Today's schedule (integrate with Planning)
- [ ] Course progress cards with percentage
- [ ] Upcoming assignments (priority sorted)

**Phase 2 (Sprint 4-5):**
- [ ] Quizzes: To Do, In Progress, Completed tabs
- [ ] Weekly timetable preview
- [ ] Next class countdown timer

**Phase 3 (Sprint 6+):**
- [ ] Days until end of year
- [ ] Exams section with preparation status
- [ ] Achievement/badge showcase

#### 💡 Recommendations

**KEEP:**
- Hierarchical course navigation (good UX)
- Forecast feature (unique predictor)
- Combined Results & Badges (motivational)
- Simple notification preview in sidebar

**ADD (Priority Order):**
1. **Separate Exams from Quizzes** - Different assessment types need different workflows
2. **Digital ID Card** - Important for Madagascar context (offline proof of enrollment)
3. **Settings submenu** - User preferences, language, offline storage management
4. **Attendance tracking** - Critical for school administration

**MODIFY:**
- Make course submenu **dynamic from database** (not hardcoded Math/Science)
- Add **offline indicators** to show which content is downloaded

**DEFER:**
- Complex grade prediction algorithms (keep Forecast simple for now)
- Gamification beyond basic badges (add in Phase 3)

---

### 2. 👨‍👩‍👧‍👦 PARENT DASHBOARD

#### ✅ Currently Implemented

**Sidebar Navigation:**
- Dashboard
- My Children
- Notifications
- Profile (bottom section)

**Pages Status:**
- ✅ `/parent/dashboard` - EXISTS (placeholder)
- ✅ `/parent/children` - EXISTS (placeholder)
- ✅ `/parent/notifications` - EXISTS (placeholder)

**API Support:**
- ✅ `/api/admin/relationships` - Parent-child linking
- ✅ `/api/notifications` - Notifications
- ⚠️ Limited child-specific progress APIs

#### 🎯 Recommended Additions

**Sidebar:**
```
----
👥 My Children (collapsed)
   ├── [Child 1 Name] (NEW - dynamic)
   ├── [Child 2 Name] (NEW - dynamic)
   └── Add Another Child (NEW)
----
📊 Dashboard
📬 Inbox
📚 Academic Progress (NEW)
   ├── Grades & Reports
   ├── Attendance
   └── Course Overview
🗓️ School Calendar (NEW)
📋 Permission & Forms (NEW)
🏫 School Communication (NEW)
   ├── Notices & Alerts
   ├── Newsletters
   └── Teacher Messages

💰 Fees & Payments (DEFER - not MVP)

🔔 Support
🤝 Feedback

👤 Profile
   ├── Family Settings
   ├── Communication Preferences
   └── Logout
```

**Dashboard Content Priorities:**

**Phase 1 (Sprint 6 - Parent Features):**
- [ ] Child switcher (multi-child support)
- [ ] Recent grades per child
- [ ] Attendance summary
- [ ] Unread school notices

**Phase 2 (Sprint 7-8):**
- [ ] Academic summary across all children
- [ ] Upcoming parent-teacher meetings
- [ ] Permission slip workflow
- [ ] Teacher message center

**Phase 3 (Future):**
- [ ] School calendar integration
- [ ] Financial overview (fees/payments)
- [ ] EOTC (Education Outside the Classroom) forms
- [ ] Report card viewer

#### 💡 Recommendations

**KEEP:**
- Simple 3-item navigation (good starting point)
- My Children as central hub
- Notifications prominence

**ADD (Priority Order):**
1. **Child switcher in dashboard** - Critical for multi-child parents
2. **Academic Progress view** - Main parent concern
3. **School Communication** - Essential for offline announcements
4. **Digital permission slips** - Reduce paper in Madagascar context

**MODIFY:**
- Expand My Children to show **quick child selector** in sidebar
- Add **offline notice board** for school announcements

**DEFER:**
- Payment/fees (not all schools will use this)
- Complex newsletters (start with simple notices)
- EOTC forms (specific to New Zealand, adapt for Madagascar)

**REMOVE FROM RECOMMENDATION:**
- Fees & Payments (make optional module, not core)

---

### 3. 👩‍🏫 TEACHER DASHBOARD

#### ✅ Currently Implemented

**Sidebar Navigation:**
- Dashboard
- Courses (with hierarchical submenu)
- Quizzes
- Todo
- Planning
- Forecast
- Results & Badges
- Profile (bottom section)
- Notifications (bottom section)

**Pages Status:**
- ✅ `/teacher/dashboard` - EXISTS (placeholder)
- ✅ `/teacher/courses` - EXISTS (placeholder)
- ✅ `/teacher/quizzes` - EXISTS (placeholder)
- ✅ `/teacher/todo` - EXISTS (placeholder)
- ✅ `/teacher/planning` - EXISTS (placeholder)
- ✅ `/teacher/forecast` - EXISTS (placeholder)
- ✅ `/teacher/results-badges` - EXISTS (placeholder)

**API Support:**
- ✅ `/api/courses` - Course CRUD
- ✅ `/api/courses/[id]/content` - Content management
- ✅ `/api/assignments` - Assignment CRUD
- ✅ `/api/progress/stats` - Class analytics
- ⚠️ No grading API yet
- ⚠️ No attendance API yet

#### 🎯 Recommended Additions

**Sidebar:**
```
📊 Dashboard
📬 Inbox
👥 My Classes (NEW - better than "Courses" for teachers)
   ├── [Class 1 - dynamic]
   ├── [Class 2 - dynamic]
   └── [Class 3 - dynamic]
📚 Teaching Resources (NEW)
   ├── Lesson Plans
   ├── Teaching Materials
   └── Shared Resources
📝 Assessments (NEW - replaces/expands Quizzes)
   ├── Create Quiz/Test
   ├── Grade Assignments
   ├── Rubrics
   └── Assessment Library
📊 Analytics & Reports (NEW - expands Results & Badges)
   ├── Student Performance
   ├── Class Analytics
   └── Progress Reports
🗓️ Teacher Planner (existing Planning)
   ├── Daily Schedule
   └── Weekly Planning
🏫 School Management (NEW)
   └── Attendance
💹 Forecast


🔔 Support
🤝 Feedback

👤 Profile
   ├── Teacher Settings
   ├── Digital Staff ID
   └── Logout
```

**Dashboard Content Priorities:**

**Phase 1 (Sprint 4-5 - Course System):**
- [ ] Today's classes with timings
- [ ] Quick attendance taking
- [ ] Pending grading queue
- [ ] Today's lesson plans

**Phase 2 (Sprint 6-7):**
- [ ] Students needing attention (struggling)
- [ ] Assignment submission statistics
- [ ] Class performance alerts
- [ ] Upcoming week schedule

**Phase 3 (Sprint 8+):**
- [ ] Assessment results trends
- [ ] Quick actions (create assignment, send announcement)
- [ ] Frequently used resources
- [ ] Student absence today

#### 💡 Recommendations

**KEEP:**
- Hierarchical navigation
- Planning/Forecast (useful for teachers too)
- Todo list (teacher task management)
- Results & Badges (teacher achievements)

**ADD (Priority Order):**
1. **My Classes view** - Group students by class, not just courses
2. **Attendance module** - Critical missing feature
3. **Grading interface** - Essential teacher workflow
4. **Teaching Resources library** - For offline content prep
5. **Analytics dashboard** - Data-driven teaching

**MODIFY:**
- Rename "Courses" → **"My Classes"** for teacher context
- Split "Quizzes" into **"Assessments"** (broader: quizzes, tests, assignments)
- Expand "Results & Badges" → **"Analytics & Reports"**

**DEFER:**
- Complex rubric builder (start with simple grading)
- Staff collaboration features (add after core features)
- Advanced analytics (start with basic stats)

---

### 4. 👨‍💼 ADMIN DASHBOARD

#### ✅ Currently Implemented

**Sidebar Navigation:**
- Dashboard
- Users Management
- Schools Management
- Relationships (parent-child linking)
- Profile (assumed in layout)

**Pages Status:**
- ✅ `/admin/dashboard` - EXISTS (with charts)
- ✅ `/admin/schools` - EXISTS (CRUD)
- ✅ `/admin/schools/[id]/config` - EXISTS
- ✅ `/admin/users/bulk-import` - EXISTS
- ✅ `/admin/relationships` - EXISTS

**API Support:**
- ✅ `/api/admin/users` - User CRUD
- ✅ `/api/admin/schools` - School CRUD
- ✅ `/api/admin/relationships` - Relationship management
- ✅ `/api/admin/reports/counts` - Basic analytics
- ⚠️ No permission management API
- ⚠️ No audit log API (model exists but no UI)
- ⚠️ No system configuration API

#### 🎯 Recommended Additions

**Sidebar:**
```
📊 Dashboard
👥 User Management (existing)
   ├── Students
   ├── Parents
   ├── Teachers
   └── Staff (NEW)
🏫 School Management (existing)
   ├── Academic Structure (NEW)
   ├── Course Management (NEW)
   ├── Timetable Management (NEW)
   └── Grade Levels (NEW)
📊 System Analytics (NEW - expand current)
   ├── Platform Usage
   ├── Academic Performance
   ├── Attendance Analytics
   └── Custom Reports
⚙️ System Configuration (NEW)
   ├── Global Settings
   ├── Permission Management
   ├── Notification Templates
   └── Integration Settings
📋 Forms & Approvals (NEW)
   ├── Form Builder
   ├── Pending Approvals
   └── Approval Workflows
🔔 Notifications
👤 Profile
   ├── Admin Settings
   ├── Audit Logs (NEW - model exists!)
   └── Logout
```

**Dashboard Content Priorities:**

**Phase 1 (Current - Enhance existing):**
- [ ] Active users count (real-time)
- [ ] Platform health metrics
- [ ] Recent user registrations
- [ ] Quick bulk actions

**Phase 2 (Sprint 3 - User Management):**
- [ ] Pending account approvals
- [ ] System alerts
- [ ] User role distribution chart
- [ ] School-wise statistics

**Phase 3 (Sprint 5+):**
- [ ] Platform engagement metrics
- [ ] Academic performance overview
- [ ] Attendance rates across schools
- [ ] System maintenance tasks
- [ ] Audit log viewer

#### 💡 Recommendations

**KEEP:**
- Current structure (well-organized)
- Bulk import (essential for Madagascar context)
- Relationships management (unique feature)
- Dashboard charts (already good)

**ADD (Priority Order):**
1. **Audit Log Viewer** - Model exists, just needs UI!
2. **Permission Management** - RBAC configuration
3. **System Configuration** - Global settings panel
4. **Academic Structure** - Manage classes, subjects, academic years
5. **Platform Analytics** - Usage statistics

**MODIFY:**
- Group User Management by **role tabs** (Students, Parents, Teachers, Staff)
- Add **School-wise filtering** to most admin views

**DEFER:**
- Complex form builder (use simple forms first)
- Advanced approval workflows (start with simple approve/reject)
- Integration settings (add when integrations are built)

**CRITICAL MISSING:**
- **No Admin sidebar component** - Need to create `/src/components/admin-sidebar.tsx`

---

### 5. 🎓 EDUCATIONAL MANAGER DASHBOARD (NEW ROLE)

#### ❌ Not Currently Implemented

**Assessment:** This is a **strategic role** not yet in the SchoolBridge schema.

#### 🎯 Recommendation

**DEFER to Phase 4+** (After Sprint 12)

**Rationale:**
- Not in current Prisma schema (would need new UserRole)
- Overlaps with Admin for small schools
- More relevant for multi-school deployments
- Can be built as Admin role extension initially

**If Implemented Later:**
- Create as **EDUCATIONAL_MANAGER** role
- Focus on: Curriculum oversight, Teacher performance, Strategic KPIs
- Build on top of existing Admin analytics
- Target: District-level administrators in Madagascar

---

## 🗂️ Missing Pages & Components Analysis

### Critical Missing Items

#### 1. Admin Sidebar Component
**Status:** ❌ MISSING
**Impact:** HIGH
**Current:** Admin layout uses generic navbar, not role-specific sidebar
**Action:** Create `/src/components/admin-sidebar.tsx`

#### 2. Attendance System
**Status:** ⚠️ MODEL EXISTS, NO UI/API
**Impact:** CRITICAL
**Database:** Attendance model exists in schema
**Action Required:**
- `/api/attendance` - Take/view attendance
- `/teacher/attendance` - Teacher attendance interface
- `/admin/attendance` - School-wide attendance reports
- `/parent/[child]/attendance` - Parent view

#### 3. Grading Interface
**Status:** ⚠️ SUBMISSION MODEL EXISTS, NO GRADING UI
**Impact:** HIGH
**Database:** Submission model with grade field exists
**Action Required:**
- `/api/submissions/[id]/grade` - Grading API
- `/teacher/grading` - Teacher grading queue
- `/student/submissions` - Student view of graded work

#### 4. Digital ID Cards
**Status:** ❌ NOT IMPLEMENTED
**Impact:** MEDIUM
**Context:** Useful for offline proof of enrollment (Madagascar context)
**Action Required:**
- `/api/profile/id-card` - Generate ID card data
- `/student/profile/id-card` - Student ID view
- `/teacher/profile/id-card` - Teacher ID view
- Consider QR code generation for verification

#### 5. School Calendar
**Status:** ⚠️ ACADEMIC YEAR MODEL EXISTS, NO CALENDAR UI
**Impact:** MEDIUM
**Database:** AcademicYear model exists
**Action Required:**
- `/api/calendar` - Events API
- `/calendar` - Shared calendar view
- Integrate with Planning pages

#### 6. Parent-Teacher Communication
**Status:** ❌ NOT IMPLEMENTED
**Impact:** HIGH
**Current:** Only notifications exist
**Action Required:**
- `/api/messages` - Messaging API
- `/parent/messages` - Parent inbox
- `/teacher/messages` - Teacher inbox
- Consider offline message queue

### Placeholder Pages Needing Implementation

All role-specific pages exist but are **placeholders**. Priority order:

**Sprint 2-3 (Authentication & User Management):**
1. `/profile/page.tsx` - User profile editor
2. `/student/dashboard` - Student overview
3. `/teacher/dashboard` - Teacher overview
4. `/parent/dashboard` - Parent overview

**Sprint 4 (Course System):**
5. `/student/courses` - Course catalog
6. `/teacher/courses` - Course management
7. `/api/courses` - Enhanced with content

**Sprint 5 (Assessments):**
8. `/student/quizzes` - Quiz taking interface
9. `/teacher/quizzes` - Quiz creation/grading
10. `/student/todo` - Assignment list
11. `/teacher/todo` - Teacher task list

**Sprint 6 (Parent Features):**
12. `/parent/children` - Child management
13. `/parent/[child]/progress` - Child progress view

**Sprint 7+ (Advanced Features):**
14. `/student/planning` - Schedule view
15. `/teacher/planning` - Lesson planner
16. `/student/forecast` - Grade predictor
17. `/student/results-badges` - Achievements

---

## 📋 Implementation Recommendations

### Phase 1: Foundation (Current - Sprint 2-3)
**Focus:** User management, basic navigation, authentication

**Priorities:**
1. ✅ Create admin sidebar component
2. ✅ Implement working profile pages
3. ✅ Enhance dashboards with real data
4. ✅ Add settings pages for all roles

### Phase 2: Core Academic Features (Sprint 4-6)
**Focus:** Courses, assignments, parent features

**Priorities:**
1. ✅ Course catalog and player
2. ✅ Assignment creation and submission
3. ✅ Grading interface
4. ✅ Parent-child progress tracking

### Phase 3: Classroom Management (Sprint 7-8)
**Focus:** Attendance, communication, planning

**Priorities:**
1. ✅ Attendance system (all roles)
2. ✅ Teacher-parent messaging
3. ✅ Planning/scheduling tools
4. ✅ School calendar integration

### Phase 4: Offline & Enhancements (Sprint 9+)
**Focus:** Offline capabilities, analytics, gamification

**Priorities:**
1. ✅ Offline content downloads
2. ✅ Advanced analytics
3. ✅ Badges and achievements
4. ✅ Digital ID cards

---

## 🎯 Simplified Recommendations Summary

### What to Keep
- ✅ Current hierarchical navigation structure
- ✅ Role-specific layouts
- ✅ Placeholder pages (good structure)
- ✅ Existing API routes

### What to Add Immediately (Sprint 2-3)
1. **Admin sidebar** component
2. **Settings** submenu for all roles
3. **Attendance** module (model exists!)
4. **Grading** interface (model exists!)
5. Enhanced **dashboard** content with real data

### What to Add Soon (Sprint 4-6)
1. **Digital ID cards** (offline context)
2. **Academic Progress** views (parent)
3. **My Classes** view (teacher)
4. **School Communication** (parent)
5. **Teaching Resources** (teacher)

### What to Defer (Sprint 8+)
1. Fees & Payments
2. Complex form builder
3. EOTC forms
4. Educational Manager role
5. Advanced gamification

### What to Remove from Recommendations
1. ❌ Fees & Payments (make optional, not core)
2. ❌ EOTC forms (New Zealand-specific)
3. ❌ Educational Manager (not in schema)

---

## 📊 Database Schema Alignment

### Well-Supported Features
- ✅ User management (User model)
- ✅ School management (School model)
- ✅ Courses (Course, CourseContent models)
- ✅ Progress tracking (StudentProgress model)
- ✅ Assignments (Submission model)
- ✅ Attendance (Attendance model)
- ✅ Classes (Class model)
- ✅ Academic years (AcademicYear model)
- ✅ Relationships (UserRelationship model)
- ✅ Audit logs (AuditLog model)

### Needs New Models
- ⚠️ Messages/Communication (need Message model)
- ⚠️ Calendar Events (need Event model)
- ⚠️ Badges/Achievements (need Badge, UserBadge models)
- ⚠️ Forms/Permissions (need Form, FormSubmission models)
- ⚠️ Notifications (Notification model exists but basic)

---

## 🌍 Madagascar Context Considerations

### Offline-First Priorities
1. **Digital ID cards** - Offline proof of enrollment
2. **Downloaded course content** - Offline learning
3. **Offline attendance** - Sync when online
4. **Offline messaging queue** - Store messages for sync
5. **Minimal data payloads** - Low bandwidth consideration

### Scalability for Low-Resource Settings
1. **Simple interfaces** - Low-end device support
2. **Progressive enhancement** - Core features work offline
3. **Bulk operations** - Import/export for data management
4. **Lightweight assets** - Optimize images/media
5. **SMS fallback** - For notifications (future)

### Cultural/Educational Adaptations
1. **French language support** - Primary language (next-intl ready)
2. **Multiple children per parent** - Common in Madagascar
3. **Community school model** - Multi-grade classrooms
4. **Limited teacher resources** - Resource sharing important
5. **Paper reduction** - Digital forms critical

---

## ✅ Final Recommendations

### Immediate Actions (Next 2 Weeks)
1. Create `src/components/admin-sidebar.tsx`
2. Implement settings pages for all roles
3. Build attendance UI (model ready)
4. Build grading UI (model ready)
5. Enhance dashboards with real data from APIs

### Short-term (Sprint 2-3)
1. Add Digital ID card feature
2. Implement parent-teacher messaging
3. Create school calendar
4. Build academic progress views
5. Add "My Classes" for teachers

### Medium-term (Sprint 4-6)
1. Offline content downloads
2. Advanced analytics
3. Badge/achievement system
4. Teaching resource library
5. Form builder for permissions

### Long-term (Sprint 7+)
1. Educational Manager role (if multi-school)
2. Payment integration (optional)
3. Advanced sync conflict resolution
4. SMS notification fallback
5. Mobile app version

---

## 📁 File Structure Gaps

### Missing Components
```
src/components/
├── admin-sidebar.tsx          ❌ CRITICAL
├── settings/                  ❌ NEW
│   ├── student-settings.tsx
│   ├── teacher-settings.tsx
│   ├── parent-settings.tsx
│   └── admin-settings.tsx
├── attendance/                ❌ NEW
│   ├── attendance-taker.tsx
│   ├── attendance-calendar.tsx
│   └── attendance-report.tsx
├── grading/                   ❌ NEW
│   ├── grading-queue.tsx
│   ├── submission-viewer.tsx
│   └── rubric-editor.tsx
└── id-card/                   ❌ NEW
    ├── student-id-card.tsx
    ├── teacher-id-card.tsx
    └── qr-generator.tsx
```

### Missing API Routes
```
src/app/api/
├── attendance/                ⚠️ MODEL EXISTS
│   ├── route.ts              (take attendance)
│   ├── [id]/route.ts         (update attendance)
│   └── stats/route.ts        (attendance reports)
├── submissions/               ⚠️ MODEL EXISTS
│   └── [id]/
│       └── grade/route.ts    (grade submission)
├── messages/                  ❌ NEW MODEL NEEDED
│   ├── route.ts              (send message)
│   └── [id]/route.ts         (view/reply)
├── calendar/                  ⚠️ PARTIAL (AcademicYear exists)
│   ├── route.ts              (events CRUD)
│   └── [id]/route.ts
└── badges/                    ❌ NEW MODEL NEEDED
    ├── route.ts              (badge definitions)
    └── award/route.ts        (award badge)
```

---

**Document prepared by:** Claude Code
**Last updated:** 2025-10-30
**Next review:** After Sprint 2 completion
