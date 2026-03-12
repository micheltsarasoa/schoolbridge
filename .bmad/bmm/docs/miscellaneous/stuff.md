 ---

  Schema Comparison: prisma/schema.prisma vs. docs/v2/new_database_schema.md

  The docs/v2/new_database_schema.md represents a massive expansion and re-architecture of your database. It introduces a full-fledged Learning Management System (LMS)
  data model, whereas prisma/schema.prisma is a much simpler user authentication and basic school association schema.

  1. Models Added in `new_database_schema.md` (LMS Core):

   * Course Management:
       * Course: Central model for courses with extensive fields (title, slug, description, language, level, status, content type, features, requirements, objectives,
         tags, captions, size, etc.).
       * CourseValidation: For content review workflow (reviewer, status, feedback).
       * Version: Course versioning.
       * Category: Course categories with self-referencing for subcategories.
       * Statistics: Detailed course statistics (lectures, quizzes, duration, students, reviews, ratings).
       * Certificate: Certificate availability and requirements.
   * Course Content:
       * Section: Organizes lectures within a course.
       * Lecture: Core content unit (video, article, quiz, coding exercise, assignment, project).
       * Video: Video-specific properties (sources, HLS/DASH URLs, thumbnails, status, variants).
       * Article: Article content (HTML, reading time, word count).
       * Quiz: Quiz properties (passing score, time limit, questions, attempts).
       * Question: Quiz questions (type, options, correct answers, explanation).
       * QuizAttempt: Records user attempts on quizzes.
       * CodingExercise: Programming exercise details (instructions, starter code, test cases).
       * CodingSubmission: User submissions for coding exercises.
       * Assignment: Assignment details (due date, file types, rubric).
       * AssignmentSubmission: User submissions for assignments.
       * Project: Project details (complexity, technologies, milestones).
       * Resource: Downloadable resources (PDF, document, video, etc.).
       * FAQ: Course-specific frequently asked questions.
       * Review: User reviews and ratings for courses.
       * PromoVideo: Promotional video details for courses.
   * Profile Models (Expanded User Roles):
       * Student: Student-specific details (student ID, grade level, birth date).
       * Instructor: Instructor-specific details (biography, rating, website, social links).
       * Parent: Parent-specific details.
       * ParentStudent: Join table for parent-student relationships.
       * Admin: Administrator roles and permissions.
   * Class & Enrollment:
       * Class: Represents a specific class offering (name, degree level, subject).
       * ClassEnrollment: Student enrollment in a class.
       * CourseEnrollment: Student enrollment in a course (progress, time spent, certificate status).
   * Progress Tracking:
       * LectureProgress: Detailed tracking of user progress within lectures.
   * User Contents:
       * Note: User-created notes within lectures.
   * Offline Sync & Network Infrastructure:
       * OfflineSync: Tracks device sync status.
       * AuditLog: Records system actions.
       * Notification: User notifications.
       * SchoolServer: Manages local school servers (storage, status, sync config).
       * ContentCache: Caching of content on school servers.
       * ServerSyncLog: Logs server synchronization.
       * ContentVariant: Different quality versions of content (e.g., video resolutions).
       * DownloadQueue: Manages content downloads for offline use.
       * OfflineContent: Tracks locally stored offline content.
       * NetworkUsage: Monitors network data usage.
       * UserNetworkPreference: User-specific network and download preferences.

  2. Models Modified/Replaced:
   * `User` Model:
       * Current (`schema.prisma`): id, name, email, emailVerified, image, hashedPassword, createdAt, updatedAt, role (simple Role enum), accounts, sessions, settings
         (Json), otp, schoolId, school.
       * Proposed (`new_database_schema.md`): id (now uuid()), email, phone, firstName, lastName, password, role (more detailed UserRole enum), language, avatar, verified,
         verificationCode, codeExpires, createdAt, updatedAt, lastLoginAt.
       * Key Changes: name split into firstName/lastName, emailVerified replaced by verified/verificationCode/codeExpires, image renamed to avatar, hashedPassword renamed
         to password, settings removed (likely moved to role-specific config fields), otp removed (functionality integrated into User verification), schoolId and school
         remain.
       * New Relations: Now links to Student?, Parent?, Instructor?, Admin? profiles, and many new LMS-specific relations (e.g., courseEnrollments, lectureProgress, notes,
         quizAttempts, codingSubmissions, assignmentSubmissions, reviews, courseValidations, notifications, auditLogs, offlineSyncs, downloadQueues, offlineContents,
         networkUsages, networkPreference).
   * `School` Model:
       * Current (`schema.prisma`): id, name, code, address, city, country, timezone, createdAt, updatedAt, users.
       * Proposed (`new_database_schema.md`): Adds config (Json), and new relations: courses, classes, academicPeriods, servers.
   * `Session` Model:
       * Current (`schema.prisma`): id, sessionToken, userId, expires, user.
       * Proposed (`new_database_schema.md`): id now uuid(), otherwise largely similar in core fields, but the User model it relates to is vastly different.
   * `OTP` Model:
       * Current (`schema.prisma`): id, email, code, expiresAt, userId, user.
       * Proposed (`new_database_schema.md`): This model is removed. OTP functionality is integrated directly into the User model (verificationCode, codeExpires).
   * `Account` Model:
       * Current (`schema.prisma`): id, userId, type, provider, providerAccountId, refresh_token, access_token, expires_at, token_type, scope, id_token, session_state,
         user.
       * Proposed (`new_database_schema.md`): This model is removed. The new schema does not explicitly define an Account model for OAuth providers. This implies a
         different authentication strategy or that this model is handled elsewhere.
   * `VerificationToken` Model:
       * Current (`schema.prisma`): identifier, token, expires.
       * Proposed (`new_database_schema.md`): This model is removed. Verification is handled by User.verificationCode and User.codeExpires.

  3. Enums Added/Modified:

   * `Role` Enum:
       * Current (`schema.prisma`): USER, ADMIN.
       * Proposed (`new_database_schema.md`): Replaced by UserRole (ADMIN, EDUCATIONAL_MANAGER, TEACHER, STUDENT, PARENT) and AdminRole (SUPER_ADMIN, SCHOOL_ADMIN,
         CONTENT_MODERATOR).
   * Many New Enums: CourseLevel, CourseStatus, LectureType, QuestionType, VideoStatus, ResourceType, SubmissionStatus, CourseType, ValidationStatus, ServerStatus,
     CachedContentType, CachePriority, CacheStatus, SyncType, SyncStatus, ContentQuality, NetworkSpeed, DownloadPriority, DownloadStatus, ConnectionType, NotificationType,
     NotificationPriority, DegreeLevel, Language.

  4. Internationalization Feature (Constraint: Not used for now):

   * The Course model has a language String field.
   * The User model has a language Language @default(FR) field.
   * Several models have Json? fields that could be used for internationalized content (e.g., captions in Course and Video, suggestions in CourseValidation,
     ratingDistribution in Statistics, social in Instructor, images in Article, options in Question, answers in QuizAttempt, testCases in CodingExercise, rubric in
     Assignment, milestones/submission in Project, metadata in AuditLog, data in Notification, errors in ServerSyncLog).
   * The Language enum is explicitly defined.

  ---

  Impact on Documentation Files:

  Given the monumental shift in the database schema, all specified documentation files will require significant updates.

  `docs/01. Project Charter.md`

   * Impact: High.
   * Required Changes:
       * Project Scope: The scope will dramatically expand from a basic user/school system to a full-fledged LMS with advanced features (offline, content management,
         multiple user roles, detailed progress tracking). This needs to be reflected.
       * Goals & Objectives: Update to include LMS-specific goals (e.g., "enable offline learning," "support diverse content types," "facilitate course validation").
       * Key Stakeholders: New roles like "Content Creator," "Course Reviewer," "Offline Sync Administrator" might need to be added.
       * High-Level Features: The list of features will grow exponentially.
       * Technical Overview: The database section will need a complete rewrite to mention the new, complex schema.
       * Success Metrics: Will need to include metrics related to course completion, content usage, offline sync success rates, etc.

  `docs/02. User Stories & User Cases Documents.md`

   * Impact: Extremely High (almost a complete rewrite).
   * Required Changes:
       * New User Roles: User stories for Student, Instructor, Parent, Educational Manager, Content Moderator, School Admin, Super Admin will need to be created. The
         current USER and ADMIN roles are insufficient.
       * New Functionality: User stories for every new feature introduced by the schema (e.g., "As an Instructor, I want to create a course with multiple sections and
         lectures," "As a Student, I want to download course content for offline access," "As a Parent, I want to view my child's progress and grades," "As a Content
         Moderator, I want to review and approve new courses").
       * Existing User Stories: Any existing user stories related to user management or school association will need to be updated to reflect the new User model structure
         and expanded School model.
       * User Flows: All user flows will be much more complex and will need to be re-mapped.

  `docs/03. Technical Architecture Document.md`

   * Impact: Extremely High (complete rewrite of the data layer and significant updates to other layers).
   * Required Changes:
       * Data Model Section: This section will require a complete overhaul. The new schema is vastly more complex. It will need to detail:
           * All new models and their relationships.
           * The rationale behind key design choices (e.g., polymorphic relations for Grade, explicit user profiles, offline-first design).
           * Explanation of new enums.
           * Indexing strategies for performance.
       * Authentication & Authorization: The shift from a simple Role enum to UserRole and AdminRole with separate profile models will require a detailed explanation of
         the new authentication and authorization flows. The removal of Account and VerificationToken models implies changes in how OAuth and email verification are
         handled.
       * Content Delivery: New sections on how video streaming, article rendering, quiz execution, and assignment submissions will work, especially considering
         ContentVariant and SchoolServer models.
       * Offline & Sync Architecture: A major new section detailing the architecture for offline content, caching, download queues, and synchronization (OfflineSync,
         SchoolServer, ContentCache, DownloadQueue, OfflineContent, NetworkUsage, UserNetworkPreference).
       * API Design: The API endpoints will need to be redesigned to interact with the new data models.
       * Internationalization (Constraint): While the feature won't be used now, the schema includes language fields. The document should note that the schema supports
         i18n, but the implementation is deferred.

  `docs/06. Implementation Guide & Getting Started.md` (lines 699-940, "9. Complete Project Structure")

   * Impact: High.
   * Required Changes:
       * Database Setup: The instructions for setting up the database will need to be updated to reflect the new, much larger schema. This includes running new migrations.
       * Data Seeding: Instructions for seeding the database will be significantly more complex, requiring data for all the new models (courses, sections, lectures, users
         with different profiles, schools, academic periods, etc.).
       * API Endpoints: Any examples or descriptions of API endpoints will need to be updated to reflect the new data structures and available operations.
       * Frontend Integration: If this section touches on how to interact with the data from the frontend, it will need to be updated to reflect the new data models and
         the expanded functionality.
       * Internationalization (Constraint): The guide should explicitly state that while language fields exist, i18n is not yet implemented and how to handle default
         language settings.

  ---

  Summary of Changes and Internationalization Constraint:

   * Schema: The new schema is a complete overhaul, transforming the project into a full-featured LMS.
   * Documentation: All specified documents will require extensive updates, ranging from minor field name changes to complete rewrites of architectural sections and user
     stories.
   * Internationalization: The schema supports internationalization with language fields and Json? fields that could hold localized content. The documentation should
     clearly state that while the schema is ready, the application-level implementation of i18n is deferred. This means any documentation referring to displaying content
     in multiple languages or user language preferences will need to be marked as "future feature" or "not yet implemented."

  This is a very ambitious and well-designed new schema, but it implies a massive amount of work beyond just the database layer.