// schema.prisma

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

// ========== COURSE MANAGEMENT ==========
model Course {
  id                String   @id @default(cuid())
  uuid              String   @unique
  title             String
  slug              String   @unique
  subtitle          String?
  description       String?
  language          String
  level             CourseLevel
  
  // Timestamps
  publishedAt       DateTime?
  lastUpdatedAt     DateTime
  createdAt         DateTime @default(now())
  updatedAt         DateTime @updatedAt

  // Relations
  categoryId        String
  category          Category @relation(fields: [categoryId], references: [id])
  instructorId      String
  instructor        Instructor @relation(fields: [instructorId], references: [id])
  promoVideo        PromoVideo?
  version           Version?
  statistics        Statistics?
  certificates      Certificate?
  schoolId          String?
  school            School?   @relation(fields: [schoolId], references: [id])

  // Content configuration
  contentType       CourseType   @default(HYBRID)

  // Status and workflow
  status            CourseStatus  @default(DRAFT)
  isPublic          Boolean       @default(false)
  requiresOnline    Boolean       @default(false)

  // Arrays and JSON fields
  features          String[]
  requirements      String[]
  targetAudience    String[]
  learningObjectives String[]
  tags              String[]
  captions          Json? // Array of caption objects

  // Size management
  totalSizeBytes    BigInt?
  offlineAvailable  Boolean @default(true)
  downloadPriority  Int     @default(5)  // 1-10
  estimatedDataUsage String? // "2.5 GB"

  // Relations to other models
  faqs              FAQ[]
  enrollments       CourseEnrollment[]
  reviews           Review[]
  grades            Grade[]

  // Course content
  sections          Section[]
  assignments       Assignment[]
  validations       CourseValidation[]

  // Indexes
  @@index([slug])
  @@index([status])
  @@index([publishedAt])
  @@index([instructorId])
}

model CourseValidation {
  id          String      @id @default(uuid())
  
  // Reviewer and status
  reviewerId  String
  status      ValidationStatus @default(PENDING)
  feedback    String?
  suggestions Json?       // Structured suggestions
  reviewedAt  DateTime?
  
  // Course relation
  courseId    String
  course      Course      @relation(fields: [courseId], references: [id])
  reviewer    User        @relation(fields: [reviewerId], references: [id])
  
  // Timestamps
  createdAt   DateTime    @default(now())
  
  // Indexes and constraints
  @@unique([courseId, reviewerId])
  @@map("course_validations")
}

model Version {
  id                String   @id @default(cuid())
  
  // Version info
  current           String
  publishedVersions String[]
  
  // Course relation
  courseId          String   @unique
  course            Course   @relation(fields: [courseId], references: [id])
}

model Category {
  id          String   @id @default(cuid())
  name        String
  description String?
  
  // Self-relation for subcategories
  parentId    String?
  parent      Category? @relation("CategoryToSubcategory", fields: [parentId], references: [id])
  subcategories Category[] @relation("CategoryToSubcategory")
  
  // Relations
  courses     Course[]
  
  // Indexes and constraints
  @@unique([name, parentId])
}

model Statistics {
  id                          String   @id @default(cuid())
  
  // Course statistics
  totalSections               Int      @default(0)
  totalLectures               Int      @default(0)
  totalQuizzes                Int      @default(0)
  totalAssignments            Int      @default(0)
  totalArticles               Int      @default(0)
  totalDownloadableResources  Int      @default(0)
  totalDuration               Int      @default(0) // in seconds
  totalDurationFormatted      String?
  totalStudents               Int      @default(0)
  totalReviews                Int      @default(0)
  averageRating               Float?   @default(0)
  ratingDistribution          Json?    // JSON object for rating counts
  completionRate              Float?   @default(0)
  lastMonthEnrollments        Int      @default(0)
  
  // Course relation
  courseId          String   @unique
  course            Course   @relation(fields: [courseId], references: [id])
}

model Certificate {
  id                      String   @id @default(cuid())
  
  // Certificate properties
  available               Boolean  @default(false)
  completionPercentage    Int?     @default(100)
  quizzesRequired         Boolean  @default(true)
  minimumQuizScore        Int?     @default(70)
  
  // Course relation
  courseId          String   @unique
  course            Course   @relation(fields: [courseId], references: [id])
}



model Section {
  id                  String   @id @default(cuid())
  title               String
  description         String?
  order               Int
  
  // Section statistics
  totalLectures       Int      @default(0)
  totalDuration       Int      @default(0) // in seconds
  durationFormatted   String?
  
  // Course relation
  courseId            String
  course              Course   @relation(fields: [courseId], references: [id])
  
  // Content
  lectures            Lecture[]
  
  // Index for ordering
  @@index([courseId, order])
}

model Lecture {
  id                String       @id @default(cuid())
  title             String
  description       String?
  type              LectureType
  order             Int
  duration          Int?         // in seconds
  durationFormatted String?
  isPreview         Boolean      @default(false)
  isFree            Boolean      @default(false)
  downloadPriority  Int?
  
  // Section relation
  sectionId         String
  section           Section      @relation(fields: [sectionId], references: [id])
  
  // Content type specific relations
  video           Video?
  article         Article?
  quiz            Quiz?
  codingExercise  CodingExercise?
  assignment      Assignment?
  project         Project?
  
  // User progress and interactions
  progress        LectureProgress[]
  notes           Note[]
  resources       Resource[]
  
  // Size & Bandwidth fields
  sizeBytes          BigInt?
  estimatedDataUsage String?
  offlineAvailable   Boolean @default(true)

  // CourseEnrollment relation
  courseEnrollments CourseEnrollment[] @relation("CourseEnrollmentToCurrentLecture")

  // Indexes
  @@index([sectionId, order])
  @@index([type])
}

model Video {
  id              String   @id @default(cuid())
  
  // Video properties
  versionId       String?
  version         Int?     @default(1)
  sources         Json?    // Array of video sources
  hlsUrl          String?
  dashUrl         String?
  thumbnail       String?
  thumbnailSprite String?
  captions        Json?    // Array of caption objects
  uploadedAt      DateTime?
  processedAt     DateTime?
  status          VideoStatus @default(PROCESSING)
  updateNotes     String?
  
  // Lecture relation
  lectureId       String   @unique
  lecture         Lecture  @relation(fields: [lectureId], references: [id])

  // Size & Bandwidth
  variants           ContentVariant[]  // Different quality versions
  defaultQuality     ContentQuality @default(MEDIUM)
  offlineOptimized   Boolean @default(false)
}

model Article {
  id                    String   @id @default(cuid())
  
  // Article properties
  content               String?  // HTML content
  contentHtml           String?
  estimatedReadingTime  Int?     // in seconds
  wordCount             Int?
  images                Json?    // Array of image objects
  
  // Timestamps
  updatedAt             DateTime @updatedAt
  
  // Lecture relation
  lectureId       String   @unique
  lecture         Lecture  @relation(fields: [lectureId], references: [id])
}

model Quiz {
  id                    String   @id @default(cuid())
  
  // Quiz properties
  title                 String?
  description           String?
  passingScore          Int?     @default(70)
  totalPoints           Int?     @default(100)
  timeLimit             Int?     // in seconds
  attemptsAllowed       Int?     @default(3)
  shuffleQuestions      Boolean  @default(false)
  shuffleAnswers        Boolean  @default(false)
  showCorrectAnswers    Boolean  @default(true)
  showCorrectAnswersAfter String? @default("submission")
  questionCount         Int?     @default(0)
  
  // Lecture relation
  lectureId       String   @unique
  lecture         Lecture  @relation(fields: [lectureId], references: [id])
  
  // Content
  questions       Question[]
  attempts        QuizAttempt[]
}

model Question {
  id              String         @id @default(cuid())
  order           Int
  type            QuestionType
  question        String
  points          Int            @default(20)
  
  // Question options
  options         Json?          // Array of option objects
  correctAnswer   Boolean?       // For true/false questions
  acceptedAnswers String[]      // For fill-in-the-blank
  orderingItems   Json?          // For ordering questions
  
  // Additional info
  explanation     String?
  hint            String?
  partialCredit   Boolean        @default(false)
  
  // Quiz relation
  quizId          String
  quiz            Quiz           @relation(fields: [quizId], references: [id])
  
  // Indexes
  @@index([quizId, order])
}

model QuizAttempt {
  id              String   @id @default(cuid())
  attemptNumber   Int
  
  // Timestamps
  startedAt       DateTime?
  submittedAt     DateTime?
  
  // Score
  score           Float?
  pointsEarned    Int?
  pointsPossible  Int?
  percentage      Float?
  passed          Boolean?
  timeSpent       Int?     // in seconds
  
  // Answers
  answers         Json?    // Array of answer objects
  
  // Relations
  quizId          String
  quiz            Quiz     @relation(fields: [quizId], references: [id])
  userId          String
  user            User     @relation(fields: [userId], references: [id])
  studentId       String?
  student         Student? @relation(fields: [studentId], references: [id])
  
  // Indexes
  @@index([quizId, userId])
  @@index([submittedAt])
}

model CodingExercise {
  id                String   @id @default(cuid())
  
  // Exercise properties
  title             String?
  instructions      String?
  starterCode       String?
  language          String?
  expectedOutput    String?
  testCases         Json?    // Array of test case objects
  hints             String[]
  solution          String?
  allowSubmission   Boolean  @default(true)
  maxSubmissions    Int?
  
  // Lecture relation
  lectureId         String   @unique
  lecture           Lecture  @relation(fields: [lectureId], references: [id])
  
  // Submissions
  submissions       CodingSubmission[]
}

model CodingSubmission {
  id                String   @id @default(cuid())
  code              String
  
  // Timestamps
  submittedAt       DateTime @default(now())
  
  // Test results
  testsPassed       Int      @default(0)
  testsTotal        Int      @default(0)
  passed            Boolean  @default(false)
  output            String?
  error             String?
  
  // Relations
  codingExerciseId  String
  codingExercise    CodingExercise @relation(fields: [codingExerciseId], references: [id])
  userId            String
  user              User     @relation(fields: [userId], references: [id])
  studentId         String?
  student           Student? @relation(fields: [studentId], references: [id])
  
  // Indexes
  @@index([codingExerciseId, userId])
  @@index([submittedAt])
}

model Assignment {
  id                String   @id @default(cuid())
  
  // Assignment properties
  title             String?
  description       String?
  instructions      String?  // HTML content
  allowedFileTypes  String[]
  maxFileSize       Int?     // in bytes
  dueDate           DateTime?
  rubric            Json?    // Array of rubric items
  
  // Lecture relation
  lectureId         String   @unique
  lecture           Lecture  @relation(fields: [lectureId], references: [id])
  
  // Relations
  grades            Grade[]
  submissions       AssignmentSubmission[]
}

model AssignmentSubmission {
  id              String   @id @default(cuid())
  files           Json?    // Array of file objects
  
  // Timestamps
  submittedAt     DateTime @default(now())
  
  // Grading
  grade           Float?
  feedback        String?
  status          SubmissionStatus @default(SUBMITTED)
  
  // Relations
  assignmentId    String
  assignment      Assignment @relation(fields: [assignmentId], references: [id])
  userId          String
  user            User     @relation(fields: [userId], references: [id])
  studentId       String?
  student         Student? @relation(fields: [studentId], references: [id])
  
  // Indexes
  @@index([assignmentId, userId])
}

model Project {
  id                String   @id @default(cuid())
  
  // Project properties
  title             String?
  description       String?
  complexity        String?  // beginner, intermediate, advanced
  technologies      String[]
  learningObjectives String[]
  milestones        Json?    // Array of milestone objects
  submission        Json?    // Submission requirements
  
  // Lecture relation
  lectureId         String   @unique
  lecture           Lecture  @relation(fields: [lectureId], references: [id])
}

model Resource {
  id              String   @id @default(cuid())
  title           String
  type            ResourceType
  
  // File properties
  fileSize        Int?     // in bytes
  fileSizeFormatted String?
  url             String
  downloadable    Boolean  @default(true)
  
  // Lecture relation
  lectureId       String
  lecture         Lecture  @relation(fields: [lectureId], references: [id])
  
  // Indexes
  @@index([lectureId])
}

model FAQ {
  id          String   @id @default(cuid())
  question    String
  answer      String
  
  // Feedback
  helpful     Int      @default(0)
  notHelpful  Int      @default(0)
  
  // Timestamps
  createdAt   DateTime @default(now())
  
  // Course relation
  courseId    String
  course      Course   @relation(fields: [courseId], references: [id])
  
  // Indexes
  @@index([courseId])
}

model Review {
  id          String   @id @default(cuid())
  rating      Int      // 1-5
  title       String?
  content     String?
  
  // Feedback
  helpful     Int      @default(0)
  notHelpful  Int      @default(0)
  
  // Timestamps
  createdAt   DateTime @default(now())
  
  // Relations
  courseId    String
  course      Course   @relation(fields: [courseId], references: [id])
  userId      String
  user        User     @relation(fields: [userId], references: [id])
  
  // Indexes and constraints
  @@unique([courseId, userId])
  @@index([courseId, rating])
}

model PromoVideo {
  id        String   @id @default(cuid())
  
  // Video properties
  url       String
  duration  Int?     // in seconds
  thumbnail String?
  
  // Course relation
  courseId  String   @unique
  course    Course   @relation(fields: [courseId], references: [id])
}

// ========== CORE USER MANAGEMENT ==========
// User 
model User {
  id                String    @id @default(uuid())
  email             String    @unique
  phone             String?
  firstName         String
  lastName          String
  password          String?   // Null for OAuth users
  role              UserRole
  language          Language  @default(FR)
  avatar            String?
  
  // Verification
  verified          Boolean   @default(false)
  verificationCode  String?
  codeExpires       DateTime?

  // Timestamps
  createdAt       DateTime  @default(now())
  updatedAt       DateTime  @updatedAt
  lastLoginAt     DateTime?

  // User relationships
  studentProfile        Student?
  parentProfile         Parent?
  instructorProfile     Instructor?
  administratorProfile  Admin?
  
  // Account settings
  sessions        Session[]

  // Relations
  schoolId              String?
  school                School?   @relation(fields: [schoolId], references: [id])
  courseEnrollments     CourseEnrollment[]
  lectureProgress       LectureProgress[]
  notes                 Note[]
  quizAttempts          QuizAttempt[]
  codingSubmissions     CodingSubmission[]
  assignmentSubmissions AssignmentSubmission[]
  reviews               Review[]
  courseValidations     CourseValidation[]
  notifications         Notification[]
  auditLogs             AuditLog[]
  offlineSyncs          OfflineSync[]
  downloadQueues        DownloadQueue[]
  offlineContents       OfflineContent[]
  networkUsages         NetworkUsage[]
  networkPreference     UserNetworkPreference?
}

model Session {
  id           String   @id @default(uuid())
  sessionToken String   @unique
  expires      DateTime
  
  // User relation
  userId       String
  user         User     @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@map("sessions")
}

// ========== SCHOOL MANAGEMENT ==========
model School {
  id        String   @id @default(uuid())
  name      String
  code      String   @unique // School identification code
  address   String?
  city      String?
  country   String   @default("Madagascar")
  timezone  String   @default("Indian/Antananarivo")
  
  // Configuration
  config    Json?    // School-specific settings
  
  // Timestamps
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  
  // Relations
  users     User[]
  courses   Course[]
  classes   Class[]
  academicPeriods AcademicPeriod[]
  servers         SchoolServer[]
  
  @@map("schools")
}

model Grade {
  id           String   @id @default(uuid())

  // Student reference
  studentId    String
  student      Student  @relation(fields: [studentId], references: [id])
  
  // The actual grade
  score        Decimal  // Actual score
  maxScore     Decimal  // Maximum possible score
  percentage  Float?   // Calculated: (score/maxScore) * 100
  letterGrade String?  // "A", "B+", "C", etc.

  // Context
  academicPeriod String?  // "Term 1 2024", "Semester 1"
  gradedBy    String?   // Instructor/teacher ID - Who graded it
  gradedAt    DateTime @default(now())

  // Additional info
  feedback     String?

  assignmentId String?
  assignment   Assignment? @relation(fields: [assignmentId], references: [id])

  gradableType String?
  gradableId   String?
  courseId     String?
  course       Course?  @relation(fields: [courseId], references: [id])
  classId      String?
  class        Class?   @relation(fields: [classId], references: [id])
  
  @@index([studentId])
  @@index([gradableType, gradableId])
  @@index([courseId])
  @@index([classId])
  @@map("grades")
}

model AcademicPeriod {
  id        String @id @default(uuid())
  name      String  // "Term 1", "Semester 1"
  startDate DateTime
  endDate   DateTime
  
  // School relation
  schoolId  String
  school    School @relation(fields: [schoolId], references: [id])

  classes   Class[]
}

// ========== PROFILE MODELS ==========
model Student {
  id        String   @id @default(uuid())
  studentId String?  @unique // School-specific student ID
  gradeLevel String? // e.g., "CP", "CE1", "6ème", "Terminale"
  birthDate DateTime?
  
  // User relation
  userId    String   @unique
  user      User     @relation(fields: [userId], references: [id])

  // Application relationships
  enrollments           CourseEnrollment[]
  progress              LectureProgress[]
  notes                 Note[]
  quizAttempts          QuizAttempt[]
  codingSubmissions     CodingSubmission[]
  assignmentSubmissions AssignmentSubmission[]
  grades                Grade[]
  parents               ParentStudent[]
  classEnrollments      ClassEnrollment[]

  // Configuration
  config    Json?    // settings
  @@map("students")
}

model Instructor {
  id           String   @id @default(cuid())
  title        String?
  biography    String?
  rating       Float?
  totalStudents Int?    @default(0)
  totalCourses Int?     @default(0)
  website      String?
  social       Json?    // Social media links
  
  // User relation
  userId    String  @unique
  user      User     @relation(fields: [userId], references: [id])
  
  // Relations
  courses      Course[]
  classes      Class[]

  // Configuration
  config    Json?    // settings
}

model Parent {
  id     String @id @default(uuid())

  // User relation
  userId String @unique
  user   User   @relation(fields: [userId], references: [id])
  
  // Child relationships
  children ParentStudent[]
  
  // Configuration
  config    Json?    // parent settings
  @@map("parents")
}

model ParentStudent {
  id        String   @id @default(uuid())
  relationship String @default("parent") // parent, guardian, etc.
  isVerified Boolean @default(false)
  
  // Relations
  parentId  String
  parent    Parent  @relation(fields: [parentId], references: [id])
  studentId String
  student   Student @relation(fields: [studentId], references: [id])
  
  // Indexes and constraints
  @@unique([parentId, studentId])
  @@map("parent_students")
}

model Admin {
  id        String @id @default(uuid())
  role      AdminRole  // SUPER_ADMIN, SCHOOL_ADMIN, CONTENT_MODERATOR
  permissions Json?
  
  // User relation
  userId    String @unique
  user      User   @relation(fields: [userId], references: [id])
}

// ========== CLASS & ENROLLMENT ==========
model Class {
  id          String   @id @default(uuid())
  name        String
  degreeLevel DegreeLevel
  subject     String?
  
  // School relation
  schoolId    String?
  school      School?   @relation(fields: [schoolId], references: [id])
  
  // Relations
  instructors      Instructor[]
  enrollments      ClassEnrollment[]
  assignments      Assignment[]
  grades           Grade[]
  academicPeriodId String
  academicPeriod   AcademicPeriod @relation(fields: [academicPeriodId], references: [id])
  @@map("classes")
}

model ClassEnrollment {
  id          String   @id @default(uuid())
  enrolledAt  DateTime @default(now())
  
  // Relations
  classId     String
  class     Class    @relation(fields: [classId], references: [id])
  studentId   String
  student   Student  @relation(fields: [studentId], references: [id])
  
  // Indexes and constraints
  @@unique([classId, studentId])
  @@map("class_enrollments")
}

model CourseEnrollment {
  id                  String   @id @default(cuid())
  
  // Timestamps
  enrolledAt          DateTime @default(now())
  lastAccessedAt      DateTime?
  
  // Progress
  progressPercentage  Float    @default(0)
  completedLectures   Int      @default(0)
  totalTimeSpent      Int      @default(0) // in seconds
  certificateEarned   Boolean  @default(false)
  
  // User settings
  favorited           Boolean  @default(false)
  archived            Boolean  @default(false)
  
  // Relations
  courseId    String
  course      Course   @relation(fields: [courseId], references: [id])
  userId      String
  user        User     @relation(fields: [userId], references: [id])
  studentId   String?
  student     Student? @relation(fields: [studentId], references: [id])
  
  // Current lecture tracking
  currentLectureId    String?
  currentLecture      Lecture? @relation(name: "CourseEnrollmentToCurrentLecture", fields: [currentLectureId], references: [id])
  
  // Indexes and constraints
  @@unique([courseId, userId])
  @@index([userId])
  @@index([courseId])
}

// ========== PROGRESS TRACKING ==========
model LectureProgress {
  id                  String   @id @default(cuid())
  
  // Progress
  completed           Boolean  @default(false)
  completedAt         DateTime?
  lastActivityAt      DateTime?
  lastPosition        Int?     @default(0) // for videos, in seconds
  watchedPercentage   Float?   @default(0)
  
  // For quizzes
  attempts            Int?     @default(0)
  bestScore           Float?   @default(0)
  passed              Boolean? @default(false)
  
  // Relations
  lectureId   String
  lecture     Lecture  @relation(fields: [lectureId], references: [id])
  userId      String
  user        User     @relation(fields: [userId], references: [id])
  studentId   String?
  student     Student? @relation(fields: [studentId], references: [id])
  
  // Indexes and constraints
  @@unique([lectureId, userId])
  @@index([userId])
  @@index([lectureId])
}

// ========== USER CONTENTS ==========
model Note {
  id          String   @id @default(cuid())
  content     String
  timestamp   Int?     // for videos, in seconds
  
  // Timestamps
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  
  // Relations
  lectureId   String
  lecture     Lecture  @relation(fields: [lectureId], references: [id])
  userId      String
  user        User     @relation(fields: [userId], references: [id])
  studentId   String?
  student     Student? @relation(fields: [studentId], references: [id])
  
  // Indexes
  @@index([lectureId, userId])
  @@index([userId])
}

// ========== OFFLINE SYNC ==========
model OfflineSync {
  id          String   @id @default(uuid())
  deviceId    String
  lastSyncAt  DateTime
  pendingChanges Json? // Changes waiting to be synced

  // User relation
  userId      String
  user        User     @relation(fields: [userId], references: [id])

  // Indexes and constraints
  @@unique([userId, deviceId])
  @@map("offline_syncs")
}

// ========== AUDIT & MONITORING ==========
model AuditLog {
  id          String   @id @default(uuid())
  action      String   // e.g., "CREATE_COURSE", "UPDATE_GRADE", "DELETE_USER"
  entityType  String   // e.g., "Course", "Grade", "User"
  entityId    String
  oldValue    Json?    // Previous state
  newValue    Json?    // New state
  ipAddress   String?
  userAgent   String?
  metadata    Json?    // Additional context
  
  // Timestamps
  createdAt   DateTime @default(now())

  // User relation
  userId      String?
  user        User?    @relation(fields: [userId], references: [id])

  // Indexes
  @@index([userId, createdAt])
  @@index([entityType, entityId])
  @@index([action, createdAt])
  @@map("audit_logs")
}

model Notification {
  id          String           @id @default(uuid())
  type        NotificationType
  title       String
  message     String
  data        Json?            // Additional notification data
  read        Boolean          @default(false)
  readAt      DateTime?
  actionUrl   String?          // Link to related resource
  priority    NotificationPriority @default(NORMAL)
  
  // Timestamps
  createdAt   DateTime         @default(now())
  expiresAt   DateTime?

  // User relation
  userId      String
  user        User             @relation(fields: [userId], references: [id])

  // Indexes
  @@index([userId, read, createdAt])
  @@index([type, createdAt])
  @@map("notifications")
}

// ========== SCHOOL NETWORK INFRASTRUCTURE ==========

model SchoolServer {
  id              String   @id @default(uuid())
  serverName      String
  ipAddress       String?
  macAddress      String?
  
  // Server capacity and status
  storageCapacity Int      // in GB
  storageUsed     Int      @default(0) // in GB
  status          ServerStatus @default(ACTIVE)
  lastPingAt      DateTime?
  
  // Network configuration
  isMainServer    Boolean  @default(false)
  canServeContent Boolean  @default(true)
  maxConcurrentUsers Int   @default(100)
  
  // Sync configuration
  syncWithCloud   Boolean  @default(true)
  syncSchedule    String?  // cron expression for scheduled syncs
  lastSyncAt      DateTime?
  nextSyncAt      DateTime?
  
  // Timestamps
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt
  
  // Relations
  schoolId        String
  school          School   @relation(fields: [schoolId], references: [id])
  cachedContent   ContentCache[]
  syncLogs        ServerSyncLog[]
  
  // Indexes
  @@index([schoolId])
  @@index([status])
  @@map("school_servers")
}

model ContentCache {
  id              String   @id @default(uuid())
  contentType     CachedContentType
  contentId       String   // ID of the course, lecture, video, etc.
  
  // Cache metadata
  priority        CachePriority @default(MEDIUM)
  sizeInBytes     BigInt
  version         String
  checksum        String?  // for integrity verification
  
  // Cache status
  status          CacheStatus @default(PENDING)
  downloadProgress Float   @default(0) // 0-100
  cachedAt        DateTime?
  lastAccessedAt  DateTime?
  accessCount     Int      @default(0)
  
  // Expiry and cleanup
  expiresAt       DateTime?
  pinned          Boolean  @default(false) // prevent auto-cleanup
  
  // Relations
  serverId        String
  server          SchoolServer @relation(fields: [serverId], references: [id])
  
  // Indexes and constraints
  @@unique([serverId, contentType, contentId])
  @@index([serverId, status])
  @@index([contentType, contentId])
  @@index([lastAccessedAt])
  @@map("content_cache")
}

model ServerSyncLog {
  id              String   @id @default(uuid())
  syncType        SyncType
  
  // Sync details
  startedAt       DateTime @default(now())
  completedAt     DateTime?
  status          SyncStatus @default(IN_PROGRESS)
  
  // Statistics
  itemsSynced     Int      @default(0)
  itemsFailed     Int      @default(0)
  totalSize       BigInt   @default(0) // in bytes
  
  // Error tracking
  errors          Json?    // Array of error objects
  
  // Relations
  serverId        String
  server          SchoolServer @relation(fields: [serverId], references: [id])
  
  // Indexes
  @@index([serverId, startedAt])
  @@index([status])
  @@map("server_sync_logs")
}

// ========== BANDWIDTH-CONSCIOUS CONTENT ==========

model ContentVariant {
  id              String   @id @default(uuid())
  contentType     String   // "video", "image", "document"
  contentId       String   // ID of parent content
  
  // Variant specifications
  quality         ContentQuality
  resolution      String?  // e.g., "1920x1080", "1280x720", "640x360"
  bitrate         Int?     // in kbps
  codec           String?
  format          String?  // e.g., "mp4", "webm", "jpg", "png"
  
  // File information
  url             String
  sizeInBytes     BigInt
  sizeFormatted   String   // e.g., "45.3 MB", "2.1 GB"
  duration        Int?     // in seconds, for videos/audio
  
  // Optimization flags
  isDefault       Boolean  @default(false)
  recommendedFor  NetworkSpeed[]
  
  // Timestamps
  createdAt       DateTime @default(now())
  
  // Relations
  videoId         String?
  video           Video?   @relation(fields: [videoId], references: [id])
  
  // Indexes and constraints
  @@unique([contentType, contentId, quality])
  @@index([contentType, contentId])
  @@map("content_variants")
}

model DownloadQueue {
  id              String   @id @default(uuid())
  deviceId        String
  
  // Content to download
  contentType     String   // "course", "lecture", "video", "resource"
  contentId       String
  variantQuality  ContentQuality @default(MEDIUM)
  
  // Queue management
  priority        DownloadPriority @default(NORMAL)
  status          DownloadStatus @default(QUEUED)
  progress        Float    @default(0) // 0-100
  
  // Download constraints
  wifiOnly        Boolean  @default(true)
  scheduledFor    DateTime?
  
  // Size and timing
  estimatedSize   BigInt?
  downloadedSize  BigInt   @default(0)
  startedAt       DateTime?
  completedAt     DateTime?
  
  // Error handling
  retryCount      Int      @default(0)
  maxRetries      Int      @default(3)
  lastError       String?
  
  // Relations
  userId          String
  user            User     @relation(fields: [userId], references: [id])
  
  // Timestamps
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt
  
  // Indexes
  @@index([userId, status])
  @@index([status, priority])
  @@index([scheduledFor])
  @@map("download_queue")
}

model OfflineContent {
  id              String   @id @default(uuid())
  deviceId        String
  
  // Content reference
  contentType     String
  contentId       String
  variantQuality  ContentQuality?
  
  // Storage information
  localPath       String?  // Path on device storage
  sizeInBytes     BigInt
  downloadedAt    DateTime
  lastAccessedAt  DateTime
  accessCount     Int      @default(0)
  
  // Expiry and management
  expiresAt       DateTime?
  pinned          Boolean  @default(false)
  autoDelete      Boolean  @default(true)
  
  // Sync status
  needsUpdate     Boolean  @default(false)
  cloudVersion    String?
  localVersion    String?
  
  // Relations
  userId          String
  user            User     @relation(fields: [userId], references: [id])
  
  // Indexes and constraints
  @@unique([userId, deviceId, contentType, contentId])
  @@index([userId, deviceId])
  @@index([expiresAt])
  @@index([lastAccessedAt])
  @@map("offline_content")
}

model NetworkUsage {
  id              String   @id @default(uuid())
  deviceId        String
  
  // Usage tracking
  date            DateTime @default(now()) @db.Date
  dataDownloaded  BigInt   @default(0) // in bytes
  dataUploaded    BigInt   @default(0) // in bytes
  
  // Breakdown by type
  videoData       BigInt   @default(0)
  documentData    BigInt   @default(0)
  imageData       BigInt   @default(0)
  otherData       BigInt   @default(0)
  
  // Connection type
  connectionType  ConnectionType
  
  // Relations
  userId          String
  user            User     @relation(fields: [userId], references: [id])
  
  // Indexes and constraints
  @@unique([userId, deviceId, date, connectionType])
  @@index([userId, date])
  @@map("network_usage")
}

model UserNetworkPreference {
  id              String   @id @default(uuid())
  
  // Download preferences
  autoDownload    Boolean  @default(false)
  wifiOnlyDownload Boolean @default(true)
  maxDailyData    Int?     // in MB, null = unlimited
  
  // Quality preferences by connection type
  wifiQuality     ContentQuality @default(HIGH)
  cellularQuality ContentQuality @default(LOW)
  
  // Content priorities
  prioritizeVideos   Boolean @default(true)
  prioritizeQuizzes  Boolean @default(true)
  prioritizeArticles Boolean @default(true)
  
  // Sync preferences
  syncSchedule    String?  // e.g., "night", "weekend", "manual"
  syncWindowStart Int?     // hour of day (0-23)
  syncWindowEnd   Int?     // hour of day (0-23)
  
  // Storage management
  autoDeleteWatched Boolean @default(false)
  keepDuration    Int?     @default(30) // days to keep content
  maxStorageGB    Int?     // max local storage to use
  
  // Relations
  userId          String   @unique
  user            User     @relation(fields: [userId], references: [id])
  
  // Timestamps
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt
  
  @@map("user_network_preferences")
}

// ========== ENUMS ==========
enum DegreeLevel {
  // Preschool / École maternelle
  PS   /// ~3 years old (Preschool - Petite Section)
  MS   /// ~4 years old (Preschool - Moyenne Section)
  GS   /// ~5 years old (Preschool - Grande Section)

  // Primary School / École élémentaire
  CP      /// ~6 years old (1st grade - Cours Préparatoire)
  CE1     /// ~7 years old (2nd grade - Cours Élémentaire 1)
  CE2     /// ~8 years old (3rd grade - Cours Élémentaire 2)
  CM1     /// ~9 years old (4th grade - Cours Moyen 1)
  CM2     /// ~10 years old (5th grade - Cours Moyen 2)

  // Middle School / Collège
  SIXIEME     /// ~11 years old (6th grade)
  CINQUIEME   /// ~12 years old (7th grade)
  QUATRIEME   /// ~13 years old (8th grade)
  TROISIEME   /// ~14 years old (9th grade)

  // High School / Lycée
  SECONDE       /// ~15 years old (10th grade)
  PREMIERE      /// ~16 years old (11th grade - General track)
  TERMINALE     /// ~17 years old (12th grade - General track)

  // Higher Education / Enseignement supérieur
  L1    /// Bachelor's Degree (first year)
  L2    /// Bachelor's Degree (second year)  
  L3    /// Bachelor's Degree (third year)  
  M1    /// Master's Degree (1)
  M2    /// Master's Degree (2)
  PhD   /// PhD
  
}

enum Language {
  FR  // French
  MG  // Malagasy
  EN  // English
}

enum CourseLevel {
  BEGINNER
  INTERMEDIATE
  ADVANCED
  ALL_LEVELS
}

enum CourseStatus {
  DRAFT
  PUBLISHED
  ARCHIVED
  UNPUBLISHED
}

enum LectureType {
  VIDEO
  ARTICLE
  QUIZ
  CODING_EXERCISE
  ASSIGNMENT
  PROJECT
}

enum QuestionType {
  MULTIPLE_CHOICE
  MULTIPLE_ANSWER
  TRUE_FALSE
  FILL_BLANK
  ORDERING
}

enum VideoStatus {
  UPLOADING
  PROCESSING
  READY
  FAILED
}

enum ResourceType {
  PDF
  DOCUMENT
  PRESENTATION
  SPREADSHEET
  IMAGE
  AUDIO
  VIDEO
  ARCHIVE
  CODE
  EXTERNAL_LINK
  TEXT
}

enum SubmissionStatus {
  DRAFT
  SUBMITTED
  UNDER_REVIEW
  NEEDS_REVISION
  APPROVED
  REJECTED
}

enum CourseType {
  LECTURE
  ONLINE
  HYBRID
}

enum ValidationStatus {
  PENDING
  APPROVED
  CHANGES_REQUESTED
  REJECTED
}

enum ServerStatus {
  ACTIVE
  INACTIVE
  MAINTENANCE
  ERROR
}

enum CachedContentType {
  COURSE
  LECTURE
  VIDEO
  ARTICLE
  QUIZ
  RESOURCE
  IMAGE
  THUMBNAIL
}

enum CachePriority {
  CRITICAL  // Core curriculum
  HIGH      // Popular content
  MEDIUM    // Regular content
  LOW       // Optional/supplementary
}

enum CacheStatus {
  PENDING
  DOWNLOADING
  CACHED
  FAILED
  EXPIRED
}

enum SyncType {
  FULL
  INCREMENTAL
  PRIORITY
  MANUAL
}

enum SyncStatus {
  IN_PROGRESS
  COMPLETED
  FAILED
  CANCELLED
}

enum ContentQuality {
  LOW       // 360p, ~1 MB/min - for 2G/slow 3G
  MEDIUM    // 480p, ~2.5 MB/min - for 3G
  HIGH      // 720p, ~5 MB/min - for 4G/WiFi
  ULTRA     // 1080p+, ~10 MB/min - for fast WiFi
}

enum NetworkSpeed {
  SLOW_2G   // < 50 Kbps
  FAST_2G   // 50-100 Kbps
  SLOW_3G   // 100-400 Kbps
  FAST_3G   // 400-1000 Kbps
  SLOW_4G   // 1-5 Mbps
  FAST_4G   // 5-20 Mbps
  WIFI      // > 20 Mbps
}

enum DownloadPriority {
  URGENT    // Current lesson
  HIGH      // Next lessons
  NORMAL    // Course materials
  LOW       // Optional content
  BACKGROUND // Prefetch
}

enum DownloadStatus {
  QUEUED
  DOWNLOADING
  PAUSED
  COMPLETED
  FAILED
  CANCELLED
}

enum ConnectionType {
  WIFI
  CELLULAR_2G
  CELLULAR_3G
  CELLULAR_4G
  CELLULAR_5G
  ETHERNET
  OFFLINE
}

enum UserRole {
  ADMIN
  EDUCATIONAL_MANAGER
  TEACHER
  STUDENT
  PARENT
}

enum AdminRole {
  SUPER_ADMIN
  SCHOOL_ADMIN
  CONTENT_MODERATOR
}

enum NotificationType {
  COURSE_ASSIGNED
  GRADE_POSTED
  PARENT_INSTRUCTION
  COURSE_VALIDATED
  COURSE_REJECTED
  ASSIGNMENT_DUE
  SYSTEM_ALERT
  MESSAGE_RECEIVED
}

enum NotificationPriority {
  LOW
  NORMAL
  HIGH
  URGENT
}

