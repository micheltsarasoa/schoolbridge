# SchoolBridge Page Content Checklist

**Purpose:** Definitive list of what belongs on each page and sidebar
**Status:** Implementation blueprint
**Last Updated:** 2025-10-31

---

## 🔗 DEVELOPER GUIDE

**For detailed implementation specs with code examples, see:**
👉 **[PAGE_CONTENT_CHECKLIST_DETAILED.md](./PAGE_CONTENT_CHECKLIST_DETAILED.md)**

The detailed guide includes:
- Complete API endpoints with request/response examples
- Database models and queries
- Button actions and event handlers
- Form validation with Zod schemas
- State management patterns
- Component specifications
- Error handling strategies
- Code snippets ready to use

---

## 📱 STUDENT SECTION

### Sidebar Navigation (`/src/components/student-sidebar.tsx`)

```
┌─ SchoolBridge Logo
│
├─ 📊 Dashboard → /student/dashboard
│
├─ 📚 My Courses → /student/courses
│  ├─ Mathematics (dynamic from DB)
│  ├─ Science (dynamic from DB)
│  ├─ Languages (dynamic from DB)
│  └─ View All Courses
│
├─ 📝 Exams → /student/exams
│
├─ 🧩 Quizzes → /student/quizzes
│
├─ 📋 Assignments → /student/assignments
│
├─ 🗓️ Planning → /student/planning
│
├─ 📈 Forecast → /student/forecast
│
├─ 🏆 Results & Badges → /student/results-badges
│
├─ 🔔 Notifications → /notifications
│
└─ 👤 Profile (dropdown)
   ├─ Profile → /profile
   ├─ Settings → /student/settings
   ├─ Digital ID Card → /student/id-card
   └─ Logout
```

### Page: `/student/dashboard`

**Top Row - Overview Cards:**
- [ ] Attendance Rate (percentage, icon)
- [ ] Quizzes Completed (X/Y total)
- [ ] Days Until Year End (countdown)
- [ ] Average Grade (percentage/letter grade)
- [ ] Upcoming Deadlines (count)

**Section: Today's Schedule**
- [ ] Current/next class card with:
  - Subject name
  - Teacher name
  - Time (start-end)
  - Room/location
  - Countdown to start
- [ ] Today's full schedule (list)
- [ ] Button: "View Full Week" → /student/planning

**Section: My Courses**
- [ ] Tab filters: All | Mathematics | Science | Languages | History
- [ ] Course cards (4-6 visible):
  - Course title
  - Teacher name + avatar
  - Progress bar (% complete)
  - Next assignment due date
  - "Continue Learning" button
- [ ] Button: "View All Courses" → /student/courses

**Section: Assignments & Quizzes**
- [ ] Tabs: To Do | In Progress | Completed
- [ ] Assignment cards:
  - Assignment title
  - Course name
  - Due date (with urgency indicator)
  - Status badge
  - Points/grade
- [ ] Empty state message if none

**Section: Upcoming Exams**
- [ ] Exam cards (next 3):
  - Subject
  - Date & time
  - Preparation status (Not Started | Studying | Ready)
  - "Study Resources" button
- [ ] Link: "View All Exams" → /student/exams

### Page: `/student/courses`

**Header:**
- [ ] Page title: "My Courses"
- [ ] Filter dropdown: All Subjects | Mathematics | Science | etc.
- [ ] Search bar
- [ ] View toggle: Grid | List

**Course Grid/List:**
- [ ] Course card for each enrolled course:
  - Course thumbnail/icon
  - Course title
  - Subject badge
  - Teacher name
  - Progress circle (%)
  - Last accessed date
  - "Continue" button
  - Offline download icon (if downloaded)
- [ ] Empty state if no courses

**Sidebar Filter Panel:**
- [ ] By Subject (checkboxes)
- [ ] By Progress (0-25%, 25-50%, 50-75%, 75-100%)
- [ ] Downloaded Only (toggle)

### Page: `/student/exams`

**Header:**
- [ ] Tabs: Upcoming | Past | All

**Exam List:**
- [ ] Exam cards:
  - Subject + exam name
  - Date & time
  - Duration
  - Location (if in-person)
  - Topics covered (list)
  - Preparation status selector
  - Study materials link
  - Grade (if past exam)

### Page: `/student/quizzes`

**Header:**
- [ ] Tabs: To Do | In Progress | Completed
- [ ] Filter: All Subjects | [Dynamic subjects]

**Quiz List:**
- [ ] Quiz cards:
  - Quiz title
  - Course name
  - Due date / Completed date
  - Time limit
  - Questions count
  - Score (if completed)
  - "Start Quiz" / "Resume" / "Review" button
  - Attempt count (e.g., "Attempt 2 of 3")

### Page: `/student/assignments`

**Header:**
- [ ] Tabs: To Do | Submitted | Graded
- [ ] Sort: Due Date | Subject | Priority

**Assignment List:**
- [ ] Assignment cards:
  - Title
  - Course
  - Due date (with countdown)
  - Priority badge (High/Medium/Low)
  - Submission status
  - Grade (if graded)
  - Feedback (if graded)
  - "View Details" / "Submit" button
  - File attachments

### Page: `/student/planning`

**Weekly View:**
- [ ] Week selector (prev/next arrows, date range)
- [ ] Grid: Days (columns) x Time slots (rows)
- [ ] Class blocks:
  - Subject name
  - Teacher
  - Room
  - Color-coded by subject
- [ ] Today highlighted
- [ ] Toggle: Week | Month view

**Upcoming Deadlines:**
- [ ] List of assignments/exams in next 7 days
- [ ] Due date
- [ ] Subject

### Page: `/student/forecast`

**Grade Predictor:**
- [ ] Current GPA display (large)
- [ ] Subject-wise predicted grades:
  - Subject name
  - Current grade
  - Predicted final grade (based on trend)
  - Confidence level
  - Improvement suggestions
- [ ] Grade trend chart (line graph over time)
- [ ] Disclaimer: "Predictions based on current performance"

### Page: `/student/results-badges`

**Tabs: Results | Badges**

**Results Tab:**
- [ ] Overall GPA card
- [ ] Subject cards:
  - Subject name
  - Current grade
  - Trend indicator (↑↓→)
  - Recent assessments list
  - Grade breakdown chart

**Badges Tab:**
- [ ] Earned badges grid:
  - Badge icon
  - Badge name
  - Earned date
  - Description
- [ ] Locked badges (grayed out):
  - Badge preview
  - Requirements to unlock
  - Progress bar

### Page: `/student/settings`

**Sections:**
- [ ] Profile Picture upload
- [ ] Display Name
- [ ] Language preference (French/English)
- [ ] Notification preferences:
  - Email notifications (toggle)
  - In-app notifications (toggle)
  - Assignment reminders (toggle)
- [ ] Offline Settings:
  - Storage used (MB)
  - Auto-download courses (toggle)
  - "Clear Downloaded Content" button
- [ ] Privacy:
  - "Export My Data" button
  - "Delete Account" button (with confirmation)

### Page: `/student/id-card`

**Digital ID Card Display:**
- [ ] School logo
- [ ] Student photo
- [ ] Full name
- [ ] Student ID number
- [ ] Class/grade
- [ ] School name
- [ ] Valid from/to dates
- [ ] QR code (for scanning)
- [ ] "Download as PDF" button
- [ ] "Share" button

---

## 👨‍🏫 TEACHER SECTION

### Sidebar Navigation (`/src/components/teacher-sidebar.tsx`)

```
┌─ SchoolBridge Logo
│
├─ 📊 Dashboard → /teacher/dashboard
│
├─ 👥 My Classes → /teacher/classes
│  ├─ Class 9A (dynamic from DB)
│  ├─ Class 10B (dynamic from DB)
│  └─ View All Classes
│
├─ 📚 Courses → /teacher/courses
│
├─ 📝 Assessments → /teacher/assessments (dropdown)
│  ├─ Create Quiz/Test → /teacher/assessments/create
│  ├─ Grade Assignments → /teacher/grading
│  ├─ Rubrics → /teacher/rubrics
│  └─ Assessment Library → /teacher/assessments
│
├─ 📊 Analytics & Reports → /teacher/analytics
│
├─ 🗓️ Planning → /teacher/planning
│
├─ 📚 Teaching Resources → /teacher/resources
│
├─ ✓ Attendance → /teacher/attendance
│
├─ 🔔 Notifications → /notifications
│
└─ 👤 Profile (dropdown)
   ├─ Profile → /profile
   ├─ Settings → /teacher/settings
   ├─ Digital Staff ID → /teacher/id-card
   └─ Logout
```

### Page: `/teacher/dashboard`

**Top Row - Quick Stats:**
- [ ] Classes Today (count)
- [ ] Pending Grading (count)
- [ ] Absent Students Today (count)
- [ ] Upcoming Deadlines (count)

**Section: Today's Schedule**
- [ ] Current/next class card:
  - Class name
  - Subject
  - Time
  - Room
  - Student count
  - "Take Attendance" button
  - "View Lesson Plan" link
- [ ] Remaining classes today (list)

**Section: Grading Queue**
- [ ] Tabs: Urgent | Pending | All
- [ ] Submission cards:
  - Student name + avatar
  - Assignment title
  - Course
  - Submitted date
  - Time waiting
  - "Grade Now" button
- [ ] Empty state message
- [ ] Link: "View All Pending" → /teacher/grading

**Section: Class Performance Alerts**
- [ ] Student attention cards:
  - Student name
  - Alert type (Falling behind | Absent frequently | Low grade)
  - Class
  - Recommendation
  - "View Details" link
- [ ] Class-wide alerts:
  - Class name
  - Alert (e.g., "Average quiz score below target")
  - "View Analytics" link

**Section: This Week**
- [ ] Calendar mini-view (week)
- [ ] Upcoming assessments
- [ ] Upcoming meetings
- [ ] Administrative deadlines

**Quick Actions (Floating Action Buttons):**
- [ ] + Create Assignment
- [ ] ✓ Take Attendance
- [ ] 📢 Send Announcement
- [ ] 📁 Access Resources

### Page: `/teacher/classes`

**Header:**
- [ ] Page title: "My Classes"
- [ ] Filter: Current Term | All Terms
- [ ] "+ Add Class" button (if admin)

**Class Cards:**
- [ ] For each class:
  - Class name (e.g., "9A - Mathematics")
  - Subject
  - Student count
  - Schedule (days/times)
  - Average performance (%)
  - Recent activity
  - Actions:
    - "View Students"
    - "Take Attendance"
    - "View Analytics"

**Class Detail View (expandable):**
- [ ] Student list table:
  - Name
  - Photo
  - Attendance rate
  - Current grade
  - Last submission
  - Quick actions (message, view profile)

### Page: `/teacher/courses`

**Header:**
- [ ] Tabs: My Courses | All Courses | Drafts
- [ ] "+ Create Course" button

**Course Cards:**
- [ ] Course thumbnail
- [ ] Course title
- [ ] Subject
- [ ] Enrolled students count
- [ ] Completion rate (avg %)
- [ ] Last updated
- [ ] Status (Published/Draft)
- [ ] Actions:
  - "Edit Content"
  - "View Analytics"
  - "Duplicate"
  - "Archive"

### Page: `/teacher/grading`

**Header:**
- [ ] Tabs: To Grade | Graded | Resubmissions
- [ ] Sort: Due Date | Submission Date | Student
- [ ] Filter: All Classes | [Class names]

**Submission List:**
- [ ] Submission cards:
  - Student name + avatar
  - Assignment title
  - Class
  - Submitted date
  - Submission status
  - Files attached
  - "Grade" button

**Grading Interface (modal/sidebar):**
- [ ] Student info
- [ ] Assignment details
- [ ] Submission content viewer
- [ ] Rubric (if applicable)
- [ ] Grade input (number/percentage)
- [ ] Feedback textarea
- [ ] File attachments preview
- [ ] "Save Draft" button
- [ ] "Submit Grade" button
- [ ] "Request Resubmission" button

### Page: `/teacher/assessments`

**Header:**
- [ ] Tabs: All | Quizzes | Tests | Assignments
- [ ] "+ Create Assessment" button

**Assessment Library:**
- [ ] Assessment cards:
  - Title
  - Type (Quiz/Test/Assignment)
  - Course
  - Questions/tasks count
  - Used in X classes
  - Last used date
  - Actions:
    - "Use"
    - "Edit"
    - "Duplicate"
    - "Preview"
    - "Delete"

### Page: `/teacher/assessments/create`

**Assessment Builder:**
- [ ] Basic Info:
  - Title
  - Type (Quiz/Test/Assignment)
  - Course
  - Due date
  - Time limit (if quiz/test)
  - Instructions
- [ ] Questions Section:
  - Question type selector (Multiple Choice, True/False, Short Answer, Essay)
  - Add question button
  - Question editor
  - Points per question
  - Reorder questions (drag-drop)
- [ ] Settings:
  - Randomize questions (toggle)
  - Show correct answers after (toggle)
  - Allow multiple attempts (toggle, max attempts)
  - Passing grade (%)
- [ ] Rubric Builder (for assignments):
  - Criteria list
  - Point values
  - Descriptions
- [ ] Preview button
- [ ] "Save Draft" | "Publish" buttons

### Page: `/teacher/attendance`

**Header:**
- [ ] Date picker (defaults to today)
- [ ] Class selector dropdown

**Attendance Taker:**
- [ ] Student list:
  - Photo
  - Name
  - Student ID
  - Attendance status buttons: Present | Absent | Late | Excused
  - Notes field
- [ ] "Mark All Present" button
- [ ] "Save Attendance" button

**Attendance Report (separate tab):**
- [ ] Date range selector
- [ ] Class selector
- [ ] Attendance table:
  - Student names (rows)
  - Dates (columns)
  - Color-coded status cells
  - Attendance rate per student (%)
- [ ] Export as CSV button

### Page: `/teacher/analytics`

**Overview Tab:**
- [ ] Overall statistics cards:
  - Total students taught
  - Average class performance
  - Assessments graded this week
  - Average attendance rate
- [ ] Performance trend chart (line graph)

**Class Analytics Tab:**
- [ ] Class selector
- [ ] Class performance overview:
  - Average grade
  - Grade distribution chart (histogram)
  - Top performers (list)
  - Students needing attention (list)
- [ ] Assessment performance:
  - Recent assessments table
  - Average scores
  - Completion rates

**Student Analytics Tab:**
- [ ] Student selector (search/dropdown)
- [ ] Individual student report:
  - Overall grade
  - Grade trend (line chart)
  - Assessment history (table)
  - Attendance rate
  - Submission timeliness
  - Participation notes

### Page: `/teacher/planning`

**Week View:**
- [ ] Week selector
- [ ] Lesson plan grid:
  - Days x Class periods
  - Lesson title
  - Topics covered
  - Resources needed
  - Homework assigned
- [ ] "+ Add Lesson Plan" button

**Lesson Plan Editor:**
- [ ] Class
- [ ] Date & period
- [ ] Lesson title
- [ ] Learning objectives
- [ ] Topics/activities
- [ ] Resources/materials
- [ ] Homework
- [ ] Notes
- [ ] File attachments

### Page: `/teacher/resources`

**Header:**
- [ ] Tabs: My Resources | Shared | Favorites
- [ ] "+ Upload Resource" button
- [ ] Search bar

**Resource Library:**
- [ ] Resource cards:
  - Title
  - Type (Document, Video, Worksheet, etc.)
  - Subject
  - Uploaded by
  - Upload date
  - File size
  - Download count
  - Actions:
    - "Download"
    - "Share with Teachers"
    - "Add to Favorites"
    - "Delete"

### Page: `/teacher/settings`

**Sections:**
- [ ] Profile Picture
- [ ] Display Name
- [ ] Subject Specialization
- [ ] Language preference
- [ ] Notification preferences:
  - New submissions (toggle)
  - Student messages (toggle)
  - Class reminders (toggle)
- [ ] Grading Preferences:
  - Default grade scale (% / Letter / Points)
  - Late submission policy
- [ ] Privacy settings

### Page: `/teacher/id-card`

**Digital Staff ID Card:**
- [ ] School logo
- [ ] Teacher photo
- [ ] Full name
- [ ] Staff ID number
- [ ] Subject(s) taught
- [ ] School name
- [ ] Valid from/to dates
- [ ] QR code
- [ ] "Download as PDF" button

---

## 👨‍👩‍👧‍👦 PARENT SECTION

### Sidebar Navigation (`/src/components/parent-sidebar.tsx`)

```
┌─ SchoolBridge Logo
│
├─ 📊 Dashboard → /parent/dashboard
│
├─ 👥 My Children → /parent/children
│  ├─ [Child 1 Name] → /parent/children/[childId]
│  ├─ [Child 2 Name] → /parent/children/[childId]
│  └─ + Add Child → /parent/children/add
│
├─ 📚 Academic Progress → /parent/academic (dropdown)
│  ├─ Grades & Reports → /parent/academic/grades
│  ├─ Attendance → /parent/academic/attendance
│  └─ Courses → /parent/academic/courses
│
├─ 💬 Communication → /parent/messages
│  ├─ Teacher Messages → /parent/messages
│  ├─ School Notices → /parent/notices
│  └─ Newsletters → /parent/newsletters
│
├─ 📋 Forms & Permissions → /parent/forms
│
├─ 🗓️ School Calendar → /calendar
│
├─ 🔔 Notifications → /notifications
│
└─ 👤 Profile (dropdown)
   ├─ Family Profile → /profile
   ├─ Settings → /parent/settings
   └─ Logout
```

### Page: `/parent/dashboard`

**Child Switcher:**
- [ ] Tabs/dropdown for each child
- [ ] Currently selected child highlighted

**Top Row - Child Overview (for selected child):**
- [ ] Attendance Rate
- [ ] Average Grade
- [ ] Pending Assignments
- [ ] Unread Messages

**Section: Recent Grades**
- [ ] Table/list:
  - Subject
  - Assessment name
  - Grade/score
  - Date
  - Teacher comment (if any)
- [ ] Link: "View All Grades" → /parent/academic/grades

**Section: Attendance Summary**
- [ ] This week attendance (Present/Absent/Late per day)
- [ ] Attendance rate chart (monthly)
- [ ] Link: "View Full Attendance" → /parent/academic/attendance

**Section: Upcoming Events**
- [ ] Event cards (next 5):
  - Event name
  - Date & time
  - Type (Exam, Parent-Teacher Meeting, School Event)
  - Action button (if applicable)

**Section: School Notices**
- [ ] Latest 3 notices:
  - Notice title
  - Date posted
  - Priority badge (if urgent)
  - Read/Unread indicator
  - "Read More" button
- [ ] Link: "View All Notices" → /parent/notices

**Section: Teacher Messages**
- [ ] Recent messages (3):
  - Teacher name
  - Subject line
  - Preview text
  - Date
  - Unread indicator
- [ ] Link: "View All Messages" → /parent/messages

**Section: Pending Actions**
- [ ] Permission forms to sign
- [ ] RSVP for events
- [ ] Fees to pay (if applicable)

### Page: `/parent/children`

**Header:**
- [ ] Page title: "My Children"
- [ ] "+ Add Another Child" button (link request)

**Child Cards:**
- [ ] For each child:
  - Photo
  - Name
  - Student ID
  - Class/Grade
  - School name
  - Current attendance rate
  - Current average grade
  - "View Details" button → /parent/children/[childId]

**Link Verification Status:**
- [ ] Verified children (normal display)
- [ ] Pending verification (with badge)
- [ ] Rejected (with reason + re-request button)

### Page: `/parent/children/[childId]`

**Tabs: Overview | Academic | Attendance | Behavior**

**Overview Tab:**
- [ ] Child info card (photo, name, class, school)
- [ ] Current stats:
  - Attendance rate
  - Average grade
  - Assignments completed
  - Upcoming assessments
- [ ] Recent activity feed

**Academic Tab:**
- [ ] Grade summary by subject
- [ ] Recent assessments table
- [ ] Grade trend chart
- [ ] Link: "View Full Academic Report"

**Attendance Tab:**
- [ ] Monthly calendar view
  - Color-coded days (Present/Absent/Late)
- [ ] Attendance statistics
- [ ] Absence notes/reasons

**Behavior Tab:**
- [ ] Teacher notes/comments
- [ ] Achievements/awards
- [ ] Areas for improvement

### Page: `/parent/academic/grades`

**Header:**
- [ ] Child selector (if multiple children)
- [ ] Filter: All Subjects | [Subject names]
- [ ] Date range selector

**Grades Table:**
- [ ] Columns:
  - Subject
  - Assessment name
  - Type (Quiz/Test/Assignment)
  - Score
  - Grade
  - Date
  - Teacher
  - Comments
- [ ] Sort by: Date | Subject | Grade

**Grade Summary:**
- [ ] Overall GPA/average
- [ ] Subject-wise averages
- [ ] Grade distribution chart

### Page: `/parent/academic/attendance`

**Header:**
- [ ] Child selector
- [ ] View toggle: Month | Term | Year

**Attendance Calendar:**
- [ ] Calendar grid
- [ ] Days color-coded:
  - Green: Present
  - Red: Absent
  - Yellow: Late
  - Blue: Excused
- [ ] Legend

**Attendance Statistics:**
- [ ] Total days: X
- [ ] Present: X (%)
- [ ] Absent: X (%)
- [ ] Late: X (%)
- [ ] Excused: X (%)

**Absence Details:**
- [ ] List of absences with dates and reasons

### Page: `/parent/academic/courses`

**Header:**
- [ ] Child selector

**Enrolled Courses List:**
- [ ] Course cards:
  - Course name
  - Subject
  - Teacher name
  - Class average
  - Child's grade in course
  - Progress percentage
  - "View Details" button

**Course Detail View:**
- [ ] Course info
- [ ] Teacher contact
- [ ] Upcoming assignments
- [ ] Recent grades in this course
- [ ] Course materials (if shared with parents)

### Page: `/parent/messages`

**Tabs: Inbox | Sent | Archived**

**Message List:**
- [ ] Message cards:
  - Teacher name + avatar
  - Subject line
  - Preview text
  - Date/time
  - Unread badge
  - Star (important)
  - Actions: Archive, Delete

**Message View:**
- [ ] Sender info
- [ ] Subject
- [ ] Full message body
- [ ] Attachments (if any)
- [ ] Reply button
- [ ] Message thread

**Compose Message:**
- [ ] To: Teacher selector (filtered by children's teachers)
- [ ] Subject
- [ ] Message body (rich text)
- [ ] Attach file button
- [ ] Send button

### Page: `/parent/notices`

**Header:**
- [ ] Filter: All | Urgent | My School | Class-specific
- [ ] Search bar

**Notice List:**
- [ ] Notice cards:
  - Title
  - School/sender
  - Date posted
  - Priority badge
  - Read/unread
  - Preview text
  - "Read More" button

**Notice Detail:**
- [ ] Full notice content
- [ ] Attachments (PDFs, images)
- [ ] Action button (RSVP, Acknowledge, Sign)
- [ ] Mark as read

### Page: `/parent/forms`

**Tabs: Pending | Submitted | All**

**Form List:**
- [ ] Form cards:
  - Form title
  - Type (Permission Slip, Medical, EOTC, etc.)
  - Due date
  - Status (Pending/Submitted)
  - "Complete Form" / "View Submitted" button

**Form View/Fill:**
- [ ] Form title and description
- [ ] Form fields (dynamic)
- [ ] Child selector (if multiple)
- [ ] Digital signature field
- [ ] "Submit" button
- [ ] "Save Draft" button

### Page: `/parent/settings`

**Sections:**
- [ ] Family Profile:
  - Parent name(s)
  - Email
  - Phone
  - Address
- [ ] Communication Preferences:
  - Email notifications (toggle)
  - SMS notifications (toggle)
  - App push notifications (toggle)
  - Frequency (Daily digest / Immediate)
- [ ] Language preference
- [ ] Children linked (list with verification status)
- [ ] Privacy:
  - "Export Family Data" button
  - "Delete Account" button

---

## 👨‍💼 ADMIN SECTION

### Sidebar Navigation (`/src/components/admin-sidebar.tsx` - **NEEDS TO BE CREATED**)

```
┌─ SchoolBridge Logo
│
├─ 📊 Dashboard → /admin/dashboard
│
├─ 👥 User Management → /admin/users (dropdown)
│  ├─ All Users → /admin/users
│  ├─ Students → /admin/users?role=STUDENT
│  ├─ Parents → /admin/users?role=PARENT
│  ├─ Teachers → /admin/users?role=TEACHER
│  ├─ Staff → /admin/users?role=STAFF
│  └─ Bulk Import → /admin/users/bulk-import
│
├─ 🏫 School Management → /admin/schools (dropdown)
│  ├─ Schools → /admin/schools
│  ├─ Classes → /admin/classes
│  ├─ Subjects → /admin/subjects
│  ├─ Academic Years → /admin/academic-years
│  └─ Timetables → /admin/timetables
│
├─ 🔗 Relationships → /admin/relationships
│
├─ 📚 Course Management → /admin/courses
│
├─ 📊 System Analytics → /admin/analytics (dropdown)
│  ├─ Platform Usage → /admin/analytics/usage
│  ├─ Academic Performance → /admin/analytics/academic
│  ├─ Attendance Reports → /admin/analytics/attendance
│  └─ Custom Reports → /admin/analytics/custom
│
├─ ⚙️ System Configuration → /admin/config (dropdown)
│  ├─ Global Settings → /admin/config/settings
│  ├─ Permissions → /admin/config/permissions
│  ├─ Notification Templates → /admin/config/notifications
│  └─ Audit Logs → /admin/config/audit-logs
│
├─ 🔔 Notifications → /notifications
│
└─ 👤 Profile (dropdown)
   ├─ Admin Profile → /profile
   ├─ Settings → /admin/settings
   └─ Logout
```

### Page: `/admin/dashboard`

**Top Row - System Health:**
- [ ] Active Users Now (real-time count)
- [ ] Total Users (all time)
- [ ] Total Schools
- [ ] Platform Uptime (%)

**Second Row - Today's Activity:**
- [ ] New Registrations Today
- [ ] Courses Accessed Today
- [ ] Active Sessions
- [ ] System Alerts (count)

**Section: User Distribution**
- [ ] Pie chart:
  - Students
  - Teachers
  - Parents
  - Staff
  - Admins
- [ ] Total count per role

**Section: School-wise Statistics**
- [ ] Table:
  - School name
  - Total students
  - Total teachers
  - Active courses
  - Avg attendance rate
  - Actions (View, Configure)

**Section: Recent Activity**
- [ ] Activity feed (last 50):
  - User joined
  - Course created
  - Relationship verified
  - System configuration changed
  - Timestamp
  - User/admin who performed action

**Section: Pending Tasks**
- [ ] Pending user approvals (if enabled)
- [ ] Pending relationship verifications
- [ ] Flagged content/reports
- [ ] System maintenance tasks

**Section: Platform Analytics**
- [ ] User growth chart (line graph, 30 days)
- [ ] Course creation trend
- [ ] Engagement metrics (daily active users)

**Quick Actions (Floating):**
- [ ] + Add User
- [ ] + Add School
- [ ] 📢 Send System Announcement
- [ ] 📊 Generate Report

### Page: `/admin/users`

**Header:**
- [ ] Tabs: All | Students | Parents | Teachers | Staff
- [ ] Search bar (name, email, ID)
- [ ] Filter dropdown: School | Role | Status (Active/Inactive)
- [ ] "+ Add User" button

**User Table:**
- [ ] Columns:
  - Photo
  - Name
  - Email
  - Role badge
  - School
  - Status (Active/Inactive/Locked)
  - Created date
  - Last login
  - Actions (Edit, Delete, Impersonate, View Audit)
- [ ] Pagination
- [ ] Bulk actions checkbox:
  - Bulk activate/deactivate
  - Bulk delete
  - Bulk email

**User Details (modal/sidebar):**
- [ ] User info (editable)
- [ ] Role selector
- [ ] School assignment
- [ ] Password reset button
- [ ] Account lock/unlock toggle
- [ ] Activity log (recent logins)
- [ ] Linked relationships (if parent)
- [ ] Enrolled courses (if student)
- [ ] Taught courses (if teacher)

### Page: `/admin/users/bulk-import`

**Current Status:** ✅ EXISTS

**Import Interface:**
- [ ] File upload (CSV/Excel)
- [ ] Template download button (sample CSV)
- [ ] Import preview table
- [ ] Validation errors display
- [ ] Mapping fields:
  - CSV column → Database field
  - Role assignment
  - School assignment
- [ ] Conflict resolution options:
  - Skip duplicates
  - Update existing
  - Create all as new
- [ ] "Import" button
- [ ] Import progress bar
- [ ] Results summary (success/failed counts)

### Page: `/admin/schools`

**Current Status:** ✅ EXISTS (with CRUD)

**School List:**
- [ ] School cards or table:
  - Logo
  - Name
  - Address
  - Student count
  - Teacher count
  - Status (Active/Inactive)
  - Actions (Edit, Configure, View Details, Delete)

**Add/Edit School Form:**
- [ ] Name
- [ ] Address
- [ ] Contact email
- [ ] Contact phone
- [ ] Logo upload
- [ ] Status toggle
- [ ] Configuration link → /admin/schools/[id]/config

### Page: `/admin/schools/[schoolId]/config`

**Current Status:** ✅ EXISTS

**Configuration Sections:**
- [ ] General Settings:
  - School name
  - Academic year start/end
  - Time zone
- [ ] Features Enabled:
  - Attendance tracking (toggle)
  - Grading system (toggle)
  - Parent portal (toggle)
  - Offline mode (toggle)
- [ ] Grading Scale:
  - Scale type (Percentage / Letter / Points)
  - Passing grade
  - Grade boundaries (A/B/C/D/F)
- [ ] Notification Settings:
  - Email notifications (toggle)
  - SMS notifications (toggle)
  - Template customization
- [ ] Branding:
  - School logo
  - Primary color
  - Secondary color

### Page: `/admin/relationships`

**Current Status:** ✅ EXISTS

**Tabs: Pending | Verified | Rejected | All**

**Relationship List:**
- [ ] Relationship cards/table:
  - Parent name
  - Child name
  - Requested date
  - Status badge (Pending/Verified/Rejected)
  - Actions (Verify, Reject, View Details)

**Relationship Detail:**
- [ ] Parent info
- [ ] Child info
- [ ] Verification documents (if uploaded)
- [ ] Admin notes
- [ ] Verification history
- [ ] "Verify" / "Reject" buttons with reason field

### Page: `/admin/classes`

**Header:**
- [ ] School filter
- [ ] "+ Add Class" button

**Class List:**
- [ ] Class cards:
  - Class name (e.g., "9A")
  - School
  - Student count
  - Assigned teachers
  - Actions (Edit, View Students, Delete)

**Add/Edit Class Form:**
- [ ] Class name
- [ ] School
- [ ] Grade level
- [ ] Assign students (multi-select)
- [ ] Assign teacher(s)

### Page: `/admin/subjects`

**Header:**
- [ ] School filter
- [ ] "+ Add Subject" button

**Subject List:**
- [ ] Table:
  - Subject name
  - School
  - Courses count
  - Actions (Edit, Delete)

**Add/Edit Subject Form:**
- [ ] Subject name
- [ ] School
- [ ] Description

### Page: `/admin/academic-years`

**Header:**
- [ ] School filter
- [ ] "+ Add Academic Year" button

**Academic Year List:**
- [ ] Cards/table:
  - Year name (e.g., "2024-2025")
  - School
  - Start date
  - End date
  - Active status (badge)
  - Actions (Edit, Set Active, Delete)

**Add/Edit Form:**
- [ ] Year name
- [ ] School
- [ ] Start date
- [ ] End date
- [ ] "Set as Active" toggle

### Page: `/admin/courses`

**Header:**
- [ ] Filter: School | Subject | Status (Draft/Published)
- [ ] Search
- [ ] "+ Create Course" button

**Course List:**
- [ ] Course table:
  - Title
  - Subject
  - School
  - Creator (teacher)
  - Enrolled students
  - Status
  - Created date
  - Actions (View, Edit, Delete, Duplicate)

### Page: `/admin/analytics/usage`

**Platform Usage Dashboard:**
- [ ] Time range selector (Today | Week | Month | Year | Custom)
- [ ] Active users chart (line graph)
- [ ] Page views chart
- [ ] Feature usage breakdown (pie chart):
  - Courses accessed
  - Quizzes taken
  - Assignments submitted
  - Messages sent
- [ ] Peak usage times (heatmap)
- [ ] Device breakdown (Desktop/Mobile/Tablet)

### Page: `/admin/analytics/academic`

**Academic Performance Overview:**
- [ ] School selector
- [ ] Overall statistics:
  - Average GPA across all students
  - Course completion rate
  - Assessment completion rate
- [ ] Subject-wise performance (bar chart)
- [ ] Grade distribution (histogram)
- [ ] Top performing classes/students
- [ ] Struggling students (intervention needed)

### Page: `/admin/analytics/attendance`

**Attendance Reports:**
- [ ] School selector
- [ ] Date range
- [ ] Overall attendance rate (%)
- [ ] Attendance trend (line chart)
- [ ] Class-wise attendance table
- [ ] Students with low attendance (< threshold)
- [ ] Export report button

### Page: `/admin/config/settings`

**Global System Settings:**
- [ ] Site Settings:
  - Platform name
  - Logo
  - Default language
  - Time zone
- [ ] Registration Settings:
  - Allow public registration (toggle)
  - Require email verification (toggle)
  - Auto-approve users (toggle)
  - Default role for new users
- [ ] Security Settings:
  - Session timeout (minutes)
  - Password requirements
  - Max login attempts
  - Account lockout duration
- [ ] Email Settings:
  - SMTP server
  - From email
  - Test email button
- [ ] Storage Settings:
  - Max upload size (MB)
  - Allowed file types
  - Storage limit per user

### Page: `/admin/config/permissions`

**Role-Based Access Control:**
- [ ] Role selector (dropdown)
- [ ] Permissions checklist for selected role:
  - User Management (Create, Read, Update, Delete)
  - School Management (CRUD)
  - Course Management (CRUD)
  - Analytics (View)
  - System Config (Edit)
  - Audit Logs (View)
  - etc.
- [ ] "Save Permissions" button

### Page: `/admin/config/audit-logs`

**Critical Feature:** ✅ MODEL EXISTS, NEEDS UI

**Audit Log Viewer:**
- [ ] Filters:
  - Date range
  - User (who performed action)
  - Action type (Create/Update/Delete/Login/etc.)
  - Entity type (User/Course/School/etc.)
  - IP address
- [ ] Search bar
- [ ] Log table:
  - Timestamp
  - User
  - Action
  - Entity type
  - Entity ID
  - IP address
  - Details (JSON viewer in modal)
- [ ] Export logs (CSV/JSON)
- [ ] Pagination

### Page: `/admin/settings`

**Admin User Settings:**
- [ ] Profile info
- [ ] Language preference
- [ ] Notification preferences
- [ ] Two-factor authentication setup
- [ ] API keys (if applicable)

---

## 🌐 SHARED PAGES

### Page: `/profile`

**Used by:** All roles

**Profile Display:**
- [ ] Cover photo (optional)
- [ ] Profile photo (editable)
- [ ] Full name
- [ ] Email (verified badge)
- [ ] Phone (if provided)
- [ ] Role badge
- [ ] School (if applicable)
- [ ] Member since date

**Edit Mode:**
- [ ] Editable fields (name, photo, contact info)
- [ ] Change password section:
  - Current password
  - New password
  - Confirm password
- [ ] Language preference
- [ ] "Save Changes" button

**Role-Specific Additions:**
- **Student:** Class, Student ID, Enrolled courses
- **Teacher:** Subjects taught, Classes
- **Parent:** Children linked
- **Admin:** Admin level, Permissions

### Page: `/notifications`

**Used by:** All roles

**Header:**
- [ ] Tabs: All | Unread | Announcements | Messages | System
- [ ] Mark all as read button
- [ ] Settings icon → notification preferences

**Notification List:**
- [ ] Notification cards:
  - Icon (type-specific)
  - Title
  - Message preview
  - Timestamp
  - Read/unread indicator
  - Action button (if applicable, e.g., "View Assignment")
  - Delete icon

**Notification Types:**
- Assignment due/graded
- New message
- School announcement
- Attendance marked
- System update
- Relationship verified
- Course published

### Page: `/calendar` (Shared Calendar)

**Used by:** Students, Parents, Teachers

**Header:**
- [ ] View toggle: Month | Week | Day
- [ ] Date picker
- [ ] Filter: All | My Events | School Events | Classes

**Calendar Display:**
- [ ] Calendar grid
- [ ] Events:
  - Classes (color-coded by subject)
  - Exams
  - Assignments due
  - School events
  - Holidays
  - Parent-teacher meetings
- [ ] Event detail popover:
  - Title
  - Date/time
  - Location
  - Description
  - Attendees (if applicable)

**Event Creation (Teachers/Admins only):**
- [ ] "+ Add Event" button
- [ ] Event form:
  - Title
  - Type (Class/Exam/Event/Meeting/Holiday)
  - Date/time
  - Duration
  - Location
  - Description
  - Notify attendees (toggle)

---

## ✅ IMPLEMENTATION PRIORITY MATRIX

### CRITICAL (Sprint 2-3) - Build First
1. ✅ Admin sidebar component (`admin-sidebar.tsx`)
2. ✅ Student dashboard with real data
3. ✅ Teacher dashboard with real data
4. ✅ Parent dashboard with child switcher
5. ✅ Attendance UI (model exists!)
6. ✅ Grading interface (model exists!)
7. ✅ Profile page (all roles)
8. ✅ Settings pages (all roles)

### HIGH (Sprint 4-5) - Build Next
9. ✅ Course catalog and detail pages
10. ✅ Assignment creation and submission
11. ✅ Quiz interface
12. ✅ Parent academic progress views
13. ✅ Teacher analytics
14. ✅ Admin analytics dashboards
15. ✅ Calendar/scheduling

### MEDIUM (Sprint 6-7) - Add After Core
16. ✅ Digital ID cards
17. ✅ Teacher-parent messaging
18. ✅ School notices/newsletters
19. ✅ Forms and permissions
20. ✅ Teaching resources library
21. ✅ Audit log viewer

### LOW (Sprint 8+) - Enhancement Features
22. ✅ Student forecast (grade predictor)
23. ✅ Badges and achievements
24. ✅ Advanced analytics
25. ✅ Custom reports
26. ✅ Bulk operations enhancements

---

## 📝 NOTES

**Offline-First Considerations:**
- All pages should have offline fallback states
- Downloaded content should be clearly marked
- Sync status indicators on dashboards
- Queue pending actions when offline

**Mobile Responsiveness:**
- Sidebar should collapse on mobile
- Tables should be horizontally scrollable or card-based
- Touch-friendly buttons (min 44x44px)
- Simplified mobile navigation

**Accessibility:**
- All icons should have aria-labels
- Color-blind friendly color schemes
- Keyboard navigation support
- Screen reader compatibility

**Performance:**
- Lazy load images and charts
- Paginate long lists
- Cache frequently accessed data
- Optimize for low-end devices (Madagascar context)

---

**Document Version:** 1.0
**Last Updated:** 2025-10-30
**Ready for Development:** YES
