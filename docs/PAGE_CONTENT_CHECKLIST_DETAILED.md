# SchoolBridge Page Content Checklist - DETAILED IMPLEMENTATION GUIDE

**Purpose:** Complete development specifications for each page with buttons, actions, data sources, and APIs
**Status:** Ready for implementation
**Last Updated:** 2025-10-31

---

## 📖 HOW TO USE THIS DOCUMENT

Each page section includes:
- **UI Components:** What to display
- **Buttons/Actions:** Interactive elements and their behavior
- **API Endpoints:** Which routes to call
- **Data Models:** Database tables/models to query
- **State Management:** Local state requirements
- **Validation:** Form validation rules
- **Error Handling:** Error states and messages

---

## 📱 STUDENT SECTION

### Page: `/student/dashboard`

#### **UI Layout**

**Top Row - Overview Cards (5 cards):**

| Card | Component | Data Source | API Endpoint | Calculation |
|------|-----------|-------------|--------------|-------------|
| Attendance Rate | `Card` with percentage | `Attendance` model | `GET /api/attendance?studentId={id}` | `(present / total) * 100` |
| Quizzes Completed | `Card` with fraction | `Submission` model | `GET /api/submissions?studentId={id}&type=QUIZ` | Count completed vs total |
| Days Until Year End | `Card` with countdown | `SchoolConfig` model | `GET /api/school/config` | Calculate from `academicYearEnd` |
| Average Grade | `Card` with percentage | `Submission` model | `GET /api/submissions?studentId={id}` | Average of all graded submissions |
| Upcoming Deadlines | `Card` with count | `Assignment` model | `GET /api/assignments?studentId={id}&status=PENDING` | Count assignments with due date < 7 days |

**Section: Today's Schedule**

```typescript
// Component: TodaysSchedule.tsx
interface ClassSchedule {
  id: string;
  subject: string;
  teacher: { name: string; avatar: string };
  startTime: Date;
  endTime: Date;
  room: string;
}

// API Endpoint
GET /api/schedule/today?studentId={id}

// Data Model: Class (join with User for teacher info)
// Returns: Array<ClassSchedule>
```

**Buttons:**
- `"View Full Week"` → Navigate to `/student/planning`
- `"Continue Learning"` (on course cards) → Navigate to `/student/courses/[courseId]`

**Section: My Courses (Tab Component)**

```typescript
// API Endpoint
GET /api/courses?studentId={id}&enrolled=true

// Data Model: Course, StudentProgress
// Filter by subject tabs: "All" | "Mathematics" | "Science" | "Languages"

// State Management
const [selectedTab, setSelectedTab] = useState("All");
const [courses, setCourses] = useState<Course[]>([]);

// Fetch courses when tab changes
useEffect(() => {
  fetchCourses(selectedTab);
}, [selectedTab]);
```

**Course Card Structure:**
```typescript
interface CourseCard {
  title: string;
  teacherName: string;
  teacherAvatar: string;
  progress: number; // 0-100
  nextAssignmentDue: Date | null;
  courseId: string;
}
```

**Buttons:**
- `"Continue Learning"` → `router.push(\`/student/courses/\${courseId}\`)`
- `"View All Courses"` → `router.push('/student/courses')`

**Section: Assignments & Quizzes (Tabs Component)**

```typescript
// API Endpoint
GET /api/assignments?studentId={id}&status={TO_DO|IN_PROGRESS|COMPLETED}

// Data Model: Assignment, Submission
```

**Assignment Card:**
```typescript
interface AssignmentCard {
  id: string;
  title: string;
  courseName: string;
  dueDate: Date;
  status: "TO_DO" | "IN_PROGRESS" | "COMPLETED";
  points: number;
  grade: number | null;
}
```

**Buttons:**
- `"View Details"` → Navigate to `/student/assignments/[id]`
- `"Submit"` → Open submission modal/page

**Empty State:**
```typescript
{assignments.length === 0 && (
  <EmptyState
    icon={<CheckCircle />}
    title="No assignments pending"
    description="You're all caught up!"
  />
)}
```

---

### Page: `/student/courses`

#### **Header Section**

```typescript
// Components: Input, Select, ToggleGroup
const [searchQuery, setSearchQuery] = useState("");
const [subjectFilter, setSubjectFilter] = useState("All");
const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
```

**API Endpoint:**
```
GET /api/courses?studentId={id}&search={query}&subject={subject}
```

**Data Model:** `Course`, `StudentProgress`, `User` (teacher)

**Filters:**
- Search bar: Filter by course title (debounced)
- Subject dropdown: "All" | "Mathematics" | "Science" | "Languages" | "History"
- View toggle: Grid view or List view

#### **Course Grid/List**

```typescript
interface CourseDisplay {
  id: string;
  thumbnail: string;
  title: string;
  subject: string;
  teacherName: string;
  teacherAvatar: string;
  progressPercentage: number;
  lastAccessedDate: Date;
  isDownloaded: boolean; // For offline mode
}
```

**Buttons:**
- `"Continue"` → `router.push(\`/student/courses/\${courseId}\`)`
- Download icon (if offline feature enabled) → Trigger course download

**Sidebar Filter Panel:**
```typescript
// Filter state
const [filters, setFilters] = useState({
  subjects: [],
  progressRange: null,
  downloadedOnly: false
});

// Apply filters
const filteredCourses = courses.filter(course => {
  // Filter logic here
});
```

---

### Page: `/student/assignments`

#### **Header Tabs**

```typescript
// Tabs: "To Do" | "Submitted" | "Graded"
const [activeTab, setActiveTab] = useState<"TO_DO" | "SUBMITTED" | "GRADED">("TO_DO");

// API Endpoint
GET /api/assignments?studentId={id}&status={activeTab}

// Sort dropdown
const [sortBy, setSortBy] = useState<"dueDate" | "subject" | "priority">("dueDate");
```

#### **Assignment Card Detail**

```typescript
interface AssignmentDetail {
  id: string;
  title: string;
  description: string;
  courseName: string;
  courseId: string;
  dueDate: Date;
  priority: "HIGH" | "MEDIUM" | "LOW";
  submissionStatus: "NOT_STARTED" | "IN_PROGRESS" | "SUBMITTED" | "GRADED";
  grade: number | null;
  maxGrade: number;
  feedback: string | null;
  attachments: FileAttachment[];
}

interface FileAttachment {
  id: string;
  name: string;
  url: string;
  size: number;
  type: string;
}
```

**Buttons:**
- `"View Details"` → Open assignment detail modal
- `"Submit"` → Open submission form
  ```typescript
  const handleSubmit = async () => {
    const formData = new FormData();
    formData.append('assignmentId', assignmentId);
    formData.append('studentId', studentId);
    formData.append('files', files);

    const response = await fetch('/api/submissions', {
      method: 'POST',
      body: formData
    });

    if (response.ok) {
      toast.success('Assignment submitted successfully!');
      router.refresh();
    }
  };
  ```

**Countdown Display:**
```typescript
// For due date countdown
const getCountdown = (dueDate: Date) => {
  const now = new Date();
  const diff = dueDate.getTime() - now.getTime();
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));

  if (days > 1) return `${days} days left`;
  if (days === 1) return 'Due tomorrow';
  if (hours > 0) return `${hours} hours left`;
  return 'Due soon!';
};
```

---

### Page: `/student/attendance` (View Only)

**Not in sidebar, but accessible via dashboard or /student/attendance**

```typescript
// API Endpoint
GET /api/attendance?studentId={id}&startDate={start}&endDate={end}

// Data Model: Attendance

interface AttendanceRecord {
  id: string;
  date: Date;
  present: boolean;
  notes: string | null;
  classId: string;
  className: string;
}
```

**Display Components:**
- **Calendar View:** Use `<Calendar>` component with color-coded days
  - Green: Present
  - Red: Absent
  - Yellow: Late
  - Blue: Excused

**Statistics Cards:**
```typescript
interface AttendanceStats {
  totalDays: number;
  presentDays: number;
  absentDays: number;
  lateDays: number;
  attendanceRate: number; // percentage
}
```

---

### Page: `/student/settings`

#### **Form Sections**

```typescript
// API Endpoints
GET /api/profile
PUT /api/profile
```

**Profile Picture Upload:**
```typescript
const handlePhotoUpload = async (file: File) => {
  const formData = new FormData();
  formData.append('photo', file);

  const response = await fetch('/api/profile/upload-photo', {
    method: 'POST',
    body: formData
  });

  if (response.ok) {
    const { photoUrl } = await response.json();
    setProfilePhoto(photoUrl);
    toast.success('Profile photo updated!');
  }
};
```

**Settings Form:**
```typescript
interface StudentSettings {
  displayName: string;
  language: "en" | "fr";
  notifications: {
    email: boolean;
    inApp: boolean;
    assignmentReminders: boolean;
  };
  offline: {
    autoDownload: boolean;
    storageUsedMB: number;
  };
}

// Validation with Zod
const settingsSchema = z.object({
  displayName: z.string().min(2).max(50),
  language: z.enum(["en", "fr"]),
  // ... other fields
});
```

**Buttons:**
- `"Save Changes"` → `PUT /api/profile` with form data
- `"Clear Downloaded Content"` → Clear IndexedDB storage
- `"Export My Data"` → `GET /api/profile/export` (GDPR compliance)
- `"Delete Account"` → Show confirmation dialog → `DELETE /api/profile`

---

## 👨‍🏫 TEACHER SECTION

### Page: `/teacher/dashboard`

#### **Top Row - Quick Stats Cards**

```typescript
// API Endpoint
GET /api/teacher/stats?teacherId={id}&date={today}

interface TeacherStats {
  classesToday: number;
  pendingGrading: number;
  absentStudentsToday: number;
  upcomingDeadlines: number;
}
```

**Data Sources:**
| Stat | Model | Query |
|------|-------|-------|
| Classes Today | `Class` | Filter by teacherId and today's schedule |
| Pending Grading | `Submission` | Count where `teacherId` and `graded = false` |
| Absent Students Today | `Attendance` | Count where `present = false` and `date = today` |
| Upcoming Deadlines | `Assignment` | Count where `teacherId` and `dueDate < 7 days` |

#### **Section: Grading Queue**

```typescript
// API Endpoint
GET /api/teacher/grading-queue?teacherId={id}&priority={URGENT|PENDING|ALL}

interface GradingQueueItem {
  submissionId: string;
  studentName: string;
  studentAvatar: string;
  assignmentTitle: string;
  courseName: string;
  submittedDate: Date;
  daysWaiting: number;
}

// Calculate urgency
const getUrgencyBadge = (daysWaiting: number) => {
  if (daysWaiting > 5) return { label: "Urgent", variant: "destructive" };
  if (daysWaiting > 2) return { label: "Soon", variant: "warning" };
  return { label: "New", variant: "default" };
};
```

**Buttons:**
- `"Grade Now"` → Open grading interface (modal or navigate to `/teacher/grading/[submissionId]`)
- `"View All Pending"` → Navigate to `/teacher/grading`

#### **Section: Class Performance Alerts**

```typescript
// API Endpoint
GET /api/teacher/alerts?teacherId={id}

interface PerformanceAlert {
  type: "STUDENT" | "CLASS";
  severity: "HIGH" | "MEDIUM" | "LOW";
  studentId?: string;
  studentName?: string;
  classId?: string;
  className?: string;
  alertType: "FALLING_BEHIND" | "ABSENT_FREQUENTLY" | "LOW_GRADE" | "CLASS_AVG_LOW";
  message: string;
  recommendation: string;
}
```

**Buttons:**
- `"View Details"` → Navigate to student/class analytics page
- `"Contact Parent"` → Open messaging interface

#### **Quick Actions (Floating Action Button)**

```typescript
const quickActions = [
  { icon: <Plus />, label: "Create Assignment", action: () => router.push('/teacher/assessments/create') },
  { icon: <CheckSquare />, label: "Take Attendance", action: () => router.push('/teacher/attendance') },
  { icon: <Bell />, label: "Send Announcement", action: () => setAnnouncementModalOpen(true) },
  { icon: <FolderOpen />, label: "Access Resources", action: () => router.push('/teacher/resources') },
];
```

---

### Page: `/teacher/grading`

#### **Grading Queue Table**

```typescript
// API Endpoint
GET /api/submissions?teacherId={id}&status={TO_GRADE|GRADED|RESUBMISSION}

interface SubmissionForGrading {
  id: string;
  student: {
    id: string;
    name: string;
    avatar: string;
  };
  assignment: {
    id: string;
    title: string;
    maxGrade: number;
    rubric?: Rubric;
  };
  class: {
    id: string;
    name: string;
  };
  submittedDate: Date;
  files: FileAttachment[];
  studentAnswer?: string;
}
```

#### **Grading Interface (Modal/Sidebar)**

```typescript
// Components: Dialog, Textarea, Input, Button

const GradingInterface = ({ submission }: { submission: SubmissionForGrading }) => {
  const [grade, setGrade] = useState<number | null>(null);
  const [feedback, setFeedback] = useState("");
  const [rubricScores, setRubricScores] = useState<Record<string, number>>({});

  const handleSubmitGrade = async () => {
    const response = await fetch(`/api/submissions/${submission.id}/grade`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        grade,
        feedback,
        rubricScores,
        gradedById: teacherId
      })
    });

    if (response.ok) {
      toast.success('Grade submitted successfully!');
      router.refresh();
    } else {
      toast.error('Failed to submit grade');
    }
  };

  return (
    <Dialog>
      {/* Grading UI */}
      <Input
        type="number"
        max={submission.assignment.maxGrade}
        value={grade}
        onChange={(e) => setGrade(Number(e.target.value))}
        placeholder="Enter grade"
      />
      <Textarea
        value={feedback}
        onChange={(e) => setFeedback(e.target.value)}
        placeholder="Provide feedback..."
      />
      {/* Rubric scoring if applicable */}
      <Button onClick={handleSubmitGrade}>Submit Grade</Button>
      <Button variant="outline" onClick={handleSaveDraft}>Save Draft</Button>
    </Dialog>
  );
};
```

**API Endpoint:**
```
POST /api/submissions/{id}/grade
Body: {
  grade: number,
  feedback: string,
  rubricScores: Record<string, number>,
  gradedById: string
}
```

**Validation:**
```typescript
const gradeSchema = z.object({
  grade: z.number().min(0).max(submission.assignment.maxGrade),
  feedback: z.string().min(10, "Feedback should be at least 10 characters"),
  rubricScores: z.record(z.number()).optional()
});
```

**Buttons:**
- `"Save Draft"` → Save grade without notifying student
- `"Submit Grade"` → Finalize and notify student
- `"Request Resubmission"` → Change submission status and notify student

---

### Page: `/teacher/attendance`

**✅ ALREADY IMPLEMENTED** (see `src/app/teacher/attendance/page.tsx`)

#### **Current Implementation:**

```typescript
// API Endpoint (already exists)
POST /api/attendance
Body: {
  studentId: string,
  classId: string,
  status: "Present" | "Absent" | "Late" | "Excused",
  date: Date
}
```

#### **Enhancements Needed:**

1. **Replace Dummy Data with Real Data:**
```typescript
// Instead of hardcoded data, fetch from API:
useEffect(() => {
  const fetchClasses = async () => {
    const response = await fetch(`/api/teacher/classes?teacherId=${session.user.id}`);
    const data = await response.json();
    setClasses(data.classes);
  };

  fetchClasses();
}, []);

// Fetch students when class selected
useEffect(() => {
  if (selectedClass) {
    const fetchStudents = async () => {
      const response = await fetch(`/api/classes/${selectedClass}/students`);
      const data = await response.json();
      setStudents(data.students);
    };

    fetchStudents();
  }
}, [selectedClass]);
```

2. **Add Date Picker:**
```typescript
const [selectedDate, setSelectedDate] = useState(new Date());

// Update API call to include date
await fetch('/api/attendance', {
  method: 'POST',
  body: JSON.stringify({ ...data, date: selectedDate })
});
```

3. **Add Toast Notifications:**
```typescript
import { toast } from 'sonner';

const saveAttendance = async () => {
  try {
    // ... save logic
    toast.success('Attendance saved successfully!');
  } catch (error) {
    toast.error('Failed to save attendance');
  }
};
```

4. **Bulk Actions:**
```typescript
const markAllPresent = () => {
  const allPresent = students.reduce((acc, student) => {
    acc[student.id] = 'Present';
    return acc;
  }, {});
  setAttendance(allPresent);
};

// Button
<Button onClick={markAllPresent}>Mark All Present</Button>
```

---

### Page: `/teacher/assessments/create`

#### **Assessment Builder Form**

```typescript
// API Endpoint
POST /api/assessments
Body: CreateAssessmentDTO

interface CreateAssessmentDTO {
  title: string;
  type: "QUIZ" | "TEST" | "ASSIGNMENT";
  courseId: string;
  dueDate: Date;
  timeLimit?: number; // minutes
  instructions: string;
  questions: Question[];
  settings: AssessmentSettings;
}

interface Question {
  id: string;
  type: "MULTIPLE_CHOICE" | "TRUE_FALSE" | "SHORT_ANSWER" | "ESSAY";
  questionText: string;
  points: number;
  options?: string[]; // for MC and T/F
  correctAnswer?: string | string[];
  order: number;
}

interface AssessmentSettings {
  randomizeQuestions: boolean;
  showAnswersAfter: boolean;
  allowMultipleAttempts: boolean;
  maxAttempts?: number;
  passingGrade: number;
}
```

#### **Form Builder Components**

```typescript
const [assessment, setAssessment] = useState<CreateAssessmentDTO>({
  title: "",
  type: "QUIZ",
  courseId: "",
  dueDate: new Date(),
  instructions: "",
  questions: [],
  settings: {
    randomizeQuestions: false,
    showAnswersAfter: false,
    allowMultipleAttempts: false,
    passingGrade: 60
  }
});

// Add question handler
const addQuestion = (type: Question['type']) => {
  const newQuestion: Question = {
    id: generateId(),
    type,
    questionText: "",
    points: 1,
    order: assessment.questions.length + 1
  };

  setAssessment(prev => ({
    ...prev,
    questions: [...prev.questions, newQuestion]
  }));
};

// Drag and drop reorder
const onDragEnd = (result) => {
  if (!result.destination) return;

  const items = Array.from(assessment.questions);
  const [reorderedItem] = items.splice(result.source.index, 1);
  items.splice(result.destination.index, 0, reorderedItem);

  setAssessment(prev => ({
    ...prev,
    questions: items.map((q, idx) => ({ ...q, order: idx + 1 }))
  }));
};
```

**Buttons:**
- `"Add Question"` → Add new question to list
- `"Preview"` → Open preview modal showing student view
- `"Save Draft"` → `POST /api/assessments` with `status: "DRAFT"`
- `"Publish"` → `POST /api/assessments` with `status: "PUBLISHED"`

**Validation:**
```typescript
const assessmentSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters"),
  type: z.enum(["QUIZ", "TEST", "ASSIGNMENT"]),
  courseId: z.string().uuid(),
  dueDate: z.date().min(new Date(), "Due date must be in the future"),
  instructions: z.string().min(10),
  questions: z.array(questionSchema).min(1, "Add at least one question"),
  settings: z.object({
    passingGrade: z.number().min(0).max(100)
  })
});
```

---

## 👨‍👩‍👧‍👦 PARENT SECTION

### Page: `/parent/dashboard`

#### **Child Switcher Component**

```typescript
// API Endpoint
GET /api/parent/children?parentId={id}

interface ChildProfile {
  id: string;
  name: string;
  avatar: string;
  studentId: string;
  class: string;
  school: string;
}

// Component
const ChildSwitcher = ({ children, selectedChildId, onChildChange }) => {
  return (
    <Tabs value={selectedChildId} onValueChange={onChildChange}>
      {children.map(child => (
        <TabsTrigger key={child.id} value={child.id}>
          <Avatar src={child.avatar} />
          {child.name}
        </TabsTrigger>
      ))}
    </Tabs>
  );
};
```

#### **Dashboard Data for Selected Child**

```typescript
// API Endpoint
GET /api/parent/child-overview?childId={selectedChildId}

interface ChildOverview {
  attendanceRate: number;
  averageGrade: number;
  pendingAssignments: number;
  unreadMessages: number;
  recentGrades: GradeRecord[];
  attendanceSummary: AttendanceSummary;
  upcomingEvents: Event[];
  schoolNotices: Notice[];
}
```

**Recent Grades Table:**
```typescript
// Data Model: Submission (join with Assignment, Course)
<Table>
  <TableHeader>
    <TableRow>
      <TableHead>Subject</TableHead>
      <TableHead>Assessment</TableHead>
      <TableHead>Grade</TableHead>
      <TableHead>Date</TableHead>
      <TableHead>Comment</TableHead>
    </TableRow>
  </TableHeader>
  <TableBody>
    {recentGrades.map(grade => (
      <TableRow key={grade.id}>
        <TableCell>{grade.courseName}</TableCell>
        <TableCell>{grade.assignmentTitle}</TableCell>
        <TableCell>
          <Badge variant={getGradeVariant(grade.score)}>
            {grade.score}/{grade.maxScore}
          </Badge>
        </TableCell>
        <TableCell>{format(grade.date, 'MMM dd, yyyy')}</TableCell>
        <TableCell>{grade.teacherComment}</TableCell>
      </TableRow>
    ))}
  </TableBody>
</Table>
```

**Buttons:**
- `"View All Grades"` → Navigate to `/parent/academic/grades?childId={id}`
- `"View Full Attendance"` → Navigate to `/parent/academic/attendance?childId={id}`
- `"Read More"` (on notices) → Navigate to `/parent/notices/[noticeId]`
- `"View All Messages"` → Navigate to `/parent/messages`

---

### Page: `/parent/messages`

**✅ TO BE IMPLEMENTED** (Message model needs to be created)

#### **Database Model Needed:**

```prisma
// Add to schema.prisma
model Message {
  id          String   @id @default(cuid())
  senderId    String
  sender      User     @relation("SentMessages", fields: [senderId], references: [id])
  recipientId String
  recipient   User     @relation("ReceivedMessages", fields: [recipientId], references: [id])
  subject     String
  body        String   @db.Text
  read        Boolean  @default(false)
  starred     Boolean  @default(false)
  archived    Boolean  @default(false)
  parentId    String?  // For threading
  parent      Message? @relation("MessageThread", fields: [parentId], references: [id])
  replies     Message[] @relation("MessageThread")
  attachments Json?    // Array of file URLs
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}
```

#### **API Endpoints Needed:**

```
GET /api/messages?userId={id}&folder={INBOX|SENT|ARCHIVED}
POST /api/messages
PATCH /api/messages/{id}/read
PATCH /api/messages/{id}/archive
DELETE /api/messages/{id}
```

#### **Message List Component**

```typescript
// State
const [messages, setMessages] = useState<Message[]>([]);
const [activeTab, setActiveTab] = useState<"INBOX" | "SENT" | "ARCHIVED">("INBOX");

// Fetch messages
useEffect(() => {
  const fetchMessages = async () => {
    const response = await fetch(`/api/messages?userId=${userId}&folder=${activeTab}`);
    const data = await response.json();
    setMessages(data.messages);
  };

  fetchMessages();
}, [activeTab]);
```

**Message Card:**
```typescript
interface MessageCard {
  id: string;
  sender: {
    name: string;
    avatar: string;
    role: string;
  };
  subject: string;
  preview: string; // First 100 chars of body
  timestamp: Date;
  read: boolean;
  starred: boolean;
  hasAttachments: boolean;
}
```

**Buttons:**
- `"Reply"` → Open compose form with pre-filled recipient
- `"Archive"` → `PATCH /api/messages/{id}/archive`
- `"Delete"` → `DELETE /api/messages/{id}` with confirmation
- `"Star"` → `PATCH /api/messages/{id}/star`
- `"Compose Message"` → Open message form

#### **Compose Message Form**

```typescript
const ComposeMessage = () => {
  const [formData, setFormData] = useState({
    recipientId: "",
    subject: "",
    body: "",
    attachments: []
  });

  const handleSend = async () => {
    const response = await fetch('/api/messages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...formData,
        senderId: userId
      })
    });

    if (response.ok) {
      toast.success('Message sent successfully!');
      setComposeOpen(false);
    }
  };

  return (
    <Dialog>
      <Select
        label="To (Teacher)"
        options={childrenTeachers} // Fetch teachers of linked children
        value={formData.recipientId}
        onChange={(value) => setFormData(prev => ({ ...prev, recipientId: value }))}
      />
      <Input
        label="Subject"
        value={formData.subject}
        onChange={(e) => setFormData(prev => ({ ...prev, subject: e.target.value }))}
      />
      <Textarea
        label="Message"
        value={formData.body}
        onChange={(e) => setFormData(prev => ({ ...prev, body: e.target.value }))}
        rows={10}
      />
      <Button onClick={handleSend}>Send Message</Button>
    </Dialog>
  );
};
```

---

## 👨‍💼 ADMIN SECTION

### Page: `/admin/dashboard`

**✅ PARTIALLY IMPLEMENTED** (see `src/app/admin/dashboard/page.tsx`)

#### **System Health Cards**

```typescript
// API Endpoint
GET /api/admin/stats

interface AdminStats {
  activeUsersNow: number;
  totalUsers: number;
  totalSchools: number;
  platformUptime: number;
  newRegistrationsToday: number;
  coursesAccessedToday: number;
  activeSessions: number;
  systemAlerts: number;
}
```

**Data Sources:**
```typescript
// Query examples
const getActiveUsersNow = async () => {
  // Users with session activity in last 15 minutes
  return await prisma.session.count({
    where: {
      expires: { gt: new Date() },
      updatedAt: { gt: new Date(Date.now() - 15 * 60 * 1000) }
    }
  });
};

const getNewRegistrationsToday = async () => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return await prisma.user.count({
    where: {
      createdAt: { gte: today }
    }
  });
};
```

#### **User Distribution Chart**

```typescript
// API Endpoint
GET /api/admin/user-distribution

// Data Model: User (group by role)
const getUserDistribution = async () => {
  const distribution = await prisma.user.groupBy({
    by: ['role'],
    _count: {
      role: true
    }
  });

  return distribution.map(item => ({
    role: item.role,
    count: item._count.role
  }));
};

// Chart Component
import { Pie, PieChart } from "recharts";

<PieChart>
  <Pie
    data={userDistribution}
    dataKey="count"
    nameKey="role"
    cx="50%"
    cy="50%"
  />
</PieChart>
```

#### **School-wise Statistics Table**

```typescript
// API Endpoint
GET /api/admin/school-stats

interface SchoolStats {
  schoolId: string;
  schoolName: string;
  totalStudents: number;
  totalTeachers: number;
  activeCourses: number;
  avgAttendanceRate: number;
}

// Query
const getSchoolStats = async () => {
  const schools = await prisma.school.findMany({
    include: {
      users: {
        where: {
          role: { in: ['STUDENT', 'TEACHER'] }
        }
      },
      _count: {
        select: {
          courses: true
        }
      }
    }
  });

  // Calculate attendance rate per school
  // ... additional calculations
};
```

**Buttons:**
- `"View"` (on school row) → Navigate to `/admin/schools/[id]`
- `"Configure"` → Navigate to `/admin/schools/[id]/config`
- `"+ Add User"` (FAB) → Open user creation modal
- `"+ Add School"` (FAB) → Navigate to `/admin/schools/new`
- `"📢 Send System Announcement"` (FAB) → Open announcement modal
- `"📊 Generate Report"` (FAB) → Open report generator

---

### Page: `/admin/users`

**✅ IMPLEMENTED** (see `src/components/admin/UserTable.tsx`)

#### **Enhancements Needed:**

1. **Add Impersonate Feature:**
```typescript
// API Endpoint
POST /api/admin/impersonate
Body: { userId: string, adminId: string }

const handleImpersonate = async (userId: string) => {
  const confirmed = confirm(`Impersonate user ${userId}? This action will be logged.`);

  if (confirmed) {
    const response = await fetch('/api/admin/impersonate', {
      method: 'POST',
      body: JSON.stringify({ userId, adminId: session.user.id })
    });

    if (response.ok) {
      // Create audit log entry
      await prisma.auditLog.create({
        data: {
          action: 'IMPERSONATE',
          userId: session.user.id,
          targetUserId: userId,
          ipAddress: request.ip
        }
      });

      // Switch session
      router.push('/dashboard');
    }
  }
};
```

2. **Add Bulk Actions:**
```typescript
const [selectedUsers, setSelectedUsers] = useState<string[]>([]);

const handleBulkActivate = async () => {
  await fetch('/api/admin/users/bulk-activate', {
    method: 'POST',
    body: JSON.stringify({ userIds: selectedUsers })
  });

  toast.success(`${selectedUsers.length} users activated`);
  router.refresh();
};

// Similar for bulk deactivate, bulk delete, bulk email
```

---

### Page: `/admin/config/audit-logs`

**✅ MODEL EXISTS** (see `prisma/schema.prisma`)

#### **Implementation Needed:**

```typescript
// API Endpoint
GET /api/admin/audit-logs?filters={...}

interface AuditLogEntry {
  id: string;
  timestamp: Date;
  userId: string;
  userName: string;
  action: string;
  entityType: string;
  entityId: string;
  ipAddress: string;
  details: Record<string, any>;
}

// Filters
interface AuditLogFilters {
  startDate?: Date;
  endDate?: Date;
  userId?: string;
  action?: string;
  entityType?: string;
  ipAddress?: string;
}
```

**Audit Log Table:**
```typescript
<DataTable
  columns={[
    { header: "Timestamp", accessorKey: "timestamp" },
    { header: "User", accessorKey: "userName" },
    { header: "Action", accessorKey: "action" },
    { header: "Entity", accessorKey: "entityType" },
    { header: "IP Address", accessorKey: "ipAddress" },
    {
      header: "Details",
      cell: ({ row }) => (
        <Button
          variant="ghost"
          onClick={() => openDetailsModal(row.original.details)}
        >
          View
        </Button>
      )
    }
  ]}
  data={auditLogs}
/>
```

**Buttons:**
- `"Export Logs"` → `GET /api/admin/audit-logs/export?format={CSV|JSON}`
- `"View Details"` → Open modal with JSON viewer

---

## 🌐 SHARED COMPONENTS

### **Profile Page** (`/profile`)

```typescript
// API Endpoints
GET /api/profile
PUT /api/profile
POST /api/profile/upload-photo
POST /api/profile/change-password
```

**Change Password Section:**
```typescript
const ChangePassword = () => {
  const [passwords, setPasswords] = useState({
    current: "",
    new: "",
    confirm: ""
  });

  const handleChangePassword = async () => {
    // Validation
    if (passwords.new !== passwords.confirm) {
      toast.error("Passwords don't match");
      return;
    }

    if (passwords.new.length < 8) {
      toast.error("Password must be at least 8 characters");
      return;
    }

    const response = await fetch('/api/profile/change-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        currentPassword: passwords.current,
        newPassword: passwords.new
      })
    });

    if (response.ok) {
      toast.success('Password changed successfully!');
      setPasswords({ current: "", new: "", confirm: "" });
    } else {
      const error = await response.json();
      toast.error(error.message || 'Failed to change password');
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Change Password</CardTitle>
      </CardHeader>
      <CardContent>
        <Input
          type="password"
          label="Current Password"
          value={passwords.current}
          onChange={(e) => setPasswords(prev => ({ ...prev, current: e.target.value }))}
        />
        <Input
          type="password"
          label="New Password"
          value={passwords.new}
          onChange={(e) => setPasswords(prev => ({ ...prev, new: e.target.value }))}
        />
        <Input
          type="password"
          label="Confirm New Password"
          value={passwords.confirm}
          onChange={(e) => setPasswords(prev => ({ ...prev, confirm: e.target.value }))}
        />
        <Button onClick={handleChangePassword}>Change Password</Button>
      </CardContent>
    </Card>
  );
};
```

---

## 📊 STATE MANAGEMENT PATTERNS

### **Using Zustand for Global State**

```typescript
// stores/useUserStore.ts
import { create } from 'zustand';

interface UserState {
  user: User | null;
  setUser: (user: User) => void;
  clearUser: () => void;
}

export const useUserStore = create<UserState>((set) => ({
  user: null,
  setUser: (user) => set({ user }),
  clearUser: () => set({ user: null })
}));

// Usage in components
const { user, setUser } = useUserStore();
```

### **Using React Query for Data Fetching**

```typescript
// Install: npm install @tanstack/react-query

// hooks/useCourses.ts
import { useQuery } from '@tanstack/react-query';

export const useCourses = (studentId: string) => {
  return useQuery({
    queryKey: ['courses', studentId],
    queryFn: async () => {
      const response = await fetch(`/api/courses?studentId=${studentId}`);
      if (!response.ok) throw new Error('Failed to fetch courses');
      return response.json();
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Usage
const { data: courses, isLoading, error } = useCourses(studentId);
```

---

## 🔒 AUTHENTICATION & AUTHORIZATION

### **Protected Routes Pattern**

```typescript
// middleware.ts
export function middleware(request: NextRequest) {
  const session = await auth();

  if (!session) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // Role-based access control
  const role = session.user.role;
  const path = request.nextUrl.pathname;

  if (path.startsWith('/admin') && role !== 'ADMIN') {
    return NextResponse.redirect(new URL('/unauthorized', request.url));
  }

  if (path.startsWith('/teacher') && role !== 'TEACHER') {
    return NextResponse.redirect(new URL('/unauthorized', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/teacher/:path*', '/student/:path*', '/parent/:path*']
};
```

---

## 🎨 UI COMPONENT LIBRARY

All components from **shadcn/ui** are available:

- `Button`, `Input`, `Textarea`, `Select`, `Checkbox`, `Switch`
- `Card`, `Dialog`, `Sheet`, `Popover`, `Dropdown`
- `Table`, `DataTable` (with sorting, filtering, pagination)
- `Tabs`, `Accordion`, `Collapsible`
- `Avatar`, `Badge`, `Separator`
- `Calendar`, `DatePicker`, `DateRangePicker`
- `Toast` (via Sonner)
- `Chart` (via Recharts)

---

## 📝 FORM VALIDATION

### **Using Zod + React Hook Form**

```typescript
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

const formSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  role: z.enum(['STUDENT', 'TEACHER', 'PARENT', 'ADMIN'])
});

type FormData = z.infer<typeof formSchema>;

const MyForm = () => {
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
      role: "STUDENT"
    }
  });

  const onSubmit = async (data: FormData) => {
    // API call
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>
      <Input {...form.register('email')} />
      {form.formState.errors.email && (
        <p className="text-red-500">{form.formState.errors.email.message}</p>
      )}
      {/* ... other fields */}
      <Button type="submit">Submit</Button>
    </form>
  );
};
```

---

## 🧪 ERROR HANDLING PATTERNS

```typescript
// API error handling
const handleApiError = (error: any) => {
  if (error.response) {
    // Server responded with error
    const status = error.response.status;

    switch (status) {
      case 400:
        toast.error('Invalid request. Please check your input.');
        break;
      case 401:
        toast.error('Unauthorized. Please log in.');
        router.push('/login');
        break;
      case 403:
        toast.error('Forbidden. You don\'t have permission.');
        break;
      case 404:
        toast.error('Resource not found.');
        break;
      case 500:
        toast.error('Server error. Please try again later.');
        break;
      default:
        toast.error('An error occurred.');
    }
  } else if (error.request) {
    // Request made but no response
    toast.error('Network error. Please check your connection.');
  } else {
    // Something else happened
    toast.error('An unexpected error occurred.');
  }
};

// Usage
try {
  const response = await fetch('/api/endpoint');
  if (!response.ok) throw new Error('API Error');
  const data = await response.json();
} catch (error) {
  handleApiError(error);
}
```

---

## 📦 DATA FETCHING BEST PRACTICES

### **Server Components (Next.js 14+)**

```typescript
// app/student/courses/page.tsx
import prisma from '@/lib/prisma';

async function getCourses(studentId: string) {
  const courses = await prisma.course.findMany({
    where: {
      students: {
        some: {
          id: studentId
        }
      }
    },
    include: {
      teacher: true,
      progress: {
        where: {
          studentId
        }
      }
    }
  });

  return courses;
}

export default async function CoursesPage() {
  const session = await auth();
  const courses = await getCourses(session.user.id);

  return <CourseList courses={courses} />;
}
```

### **Client Components with SWR**

```typescript
'use client';

import useSWR from 'swr';

const fetcher = (url: string) => fetch(url).then(r => r.json());

export default function CourseList() {
  const { data, error, isLoading } = useSWR('/api/courses', fetcher, {
    refreshInterval: 10000, // Refresh every 10 seconds
    revalidateOnFocus: true
  });

  if (isLoading) return <Skeleton />;
  if (error) return <ErrorState />;

  return <div>{/* render courses */}</div>;
}
```

---

## 🚀 PRIORITY IMPLEMENTATION ORDER

### **Week 1: Connect Real Data**
1. Replace attendance dummy data with API calls
2. Seed database with test data
3. Update dashboards with live data

### **Week 2: Grading System**
4. Implement grading API routes
5. Build teacher grading interface
6. Create student submissions view

### **Week 3: Settings & Profile**
7. Build settings pages for all roles
8. Implement profile edit functionality
9. Add photo upload feature

### **Week 4: Messaging & Auth**
10. Create Message model and API
11. Build parent-teacher messaging
12. Implement email verification
13. Add password reset flow

---

**Document Version:** 2.0
**Last Updated:** 2025-10-31
**Status:** Ready for Development ✅
