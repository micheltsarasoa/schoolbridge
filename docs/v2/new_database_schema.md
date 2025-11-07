Here's the Prisma schema that maps to your comprehensive course JSON structure:

```prisma
// schema.prisma

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model Course {
  id          String   @id @default(cuid())
  uuid        String   @unique
  title       String
  slug        String   @unique
  subtitle    String?
  description String?
  language    String
  level       CourseLevel
  status      CourseStatus
  publishedAt DateTime?
  lastUpdatedAt DateTime
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  // Relations
  categoryId  String
  category    Category @relation(fields: [categoryId], references: [id])
  instructorId String
  instructor  Instructor @relation(fields: [instructorId], references: [id])
  priceId     String?
  price       Price? @relation(fields: [priceId], references: [id])
  promoVideo  PromoVideo?
  version     Version?
  statistics  Statistics?
  certificates Certificate?
  
  // Arrays and JSON fields
  features        String[]
  requirements    String[]
  targetAudience  String[]
  learningObjectives String[]
  tags           String[]
  captions       Json? // Array of caption objects

  // Relations to other models
  sections     Section[]
  faqs         FAQ[]
  enrollments  Enrollment[]
  reviews      Review[]

  // Indexes
  @@index([slug])
  @@index([status])
  @@index([publishedAt])
  @@index([instructorId])
}

model Category {
  id          String   @id @default(cuid())
  name        String
  description String?
  
  // Self-relation for subcategories
  parentId    String?
  parent      Category? @relation("CategoryToSubcategory", fields: [parentId], references: [id])
  subcategories Category[] @relation("CategoryToSubcategory")
  
  courses     Course[]
  
  @@unique([name, parentId])
}

model Instructor {
  id           String   @id @default(cuid())
  name         String
  title        String?
  biography    String?
  avatar       String?
  rating       Float?
  totalStudents Int?    @default(0)
  totalCourses Int?     @default(0)
  website      String?
  social       Json?    // Social media links
  
  courses      Course[]
  
  // Indexes
  @@index([name])
}

model Price {
  id                  String   @id @default(cuid())
  amount              Float
  currency            String   @default("USD")
  discountPrice       Float?
  discountPercentage  Float?
  discountExpiresAt   DateTime?
  
  course              Course?
  
  // Subscription pricing
  subscriptionMonthly   Float?
  subscriptionAnnual    Float?
  subscriptionSavings   Float?
  
  // Enterprise pricing
  teamMinUsers         Int?
  teamPricePerUser     Float?
  
  createdAt           DateTime @default(now())
}

model PromoVideo {
  id        String   @id @default(cuid())
  url       String
  duration  Int?     // in seconds
  thumbnail String?
  
  courseId  String   @unique
  course    Course   @relation(fields: [courseId], references: [id])
}

model Version {
  id                String   @id @default(cuid())
  current           String
  publishedVersions String[]
  
  courseId          String   @unique
  course            Course   @relation(fields: [courseId], references: [id])
}

model Statistics {
  id                          String   @id @default(cuid())
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
  
  courseId          String   @unique
  course            Course   @relation(fields: [courseId], references: [id])
}

model Certificate {
  id                      String   @id @default(cuid())
  available               Boolean  @default(false)
  completionPercentage    Int?     @default(100)
  quizzesRequired         Boolean  @default(true)
  minimumQuizScore        Int?     @default(70)
  
  courseId          String   @unique
  course            Course   @relation(fields: [courseId], references: [id])
}

model Section {
  id                  String   @id @default(cuid())
  title               String
  description         String?
  order               Int
  totalLectures       Int      @default(0)
  totalDuration       Int      @default(0) // in seconds
  durationFormatted   String?
  
  courseId            String
  course              Course   @relation(fields: [courseId], references: [id])
  lectures            Lecture[]
  
  // Index for ordering
  @@index([courseId, order])
}

model Lecture {
  id              String       @id @default(cuid())
  title           String
  description     String?
  type            LectureType
  order           Int
  duration        Int?         // in seconds
  durationFormatted String?
  isPreview       Boolean      @default(false)
  isFree          Boolean      @default(false)
  
  sectionId       String
  section         Section      @relation(fields: [sectionId], references: [id])
  
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
  
  // Indexes
  @@index([sectionId, order])
  @@index([type])
}

model Video {
  id              String   @id @default(cuid())
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
  
  lectureId       String   @unique
  lecture         Lecture  @relation(fields: [lectureId], references: [id])
}

model Article {
  id                    String   @id @default(cuid())
  content               String?  // HTML content
  contentHtml           String?
  estimatedReadingTime  Int?     // in seconds
  wordCount             Int?
  images                Json?    // Array of image objects
  updatedAt             DateTime @updatedAt
  
  lectureId       String   @unique
  lecture         Lecture  @relation(fields: [lectureId], references: [id])
}

model Quiz {
  id                    String   @id @default(cuid())
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
  
  lectureId       String   @unique
  lecture         Lecture  @relation(fields: [lectureId], references: [id])
  
  questions       Question[]
  attempts        QuizAttempt[]
}

model Question {
  id              String         @id @default(cuid())
  order           Int
  type            QuestionType
  question        String
  points          Int            @default(20)
  options         Json?          // Array of option objects
  correctAnswer   Boolean?       // For true/false questions
  acceptedAnswers String[]?      // For fill-in-the-blank
  orderingItems   Json?          // For ordering questions
  explanation     String?
  hint            String?
  partialCredit   Boolean        @default(false)
  
  quizId          String
  quiz            Quiz           @relation(fields: [quizId], references: [id])
  
  @@index([quizId, order])
}

model QuizAttempt {
  id              String   @id @default(cuid())
  attemptNumber   Int
  startedAt       DateTime?
  submittedAt     DateTime?
  score           Float?
  pointsEarned    Int?
  pointsPossible  Int?
  percentage      Float?
  passed          Boolean?
  timeSpent       Int?     // in seconds
  answers         Json?    // Array of answer objects
  
  quizId          String
  quiz            Quiz     @relation(fields: [quizId], references: [id])
  userId          String
  user            User     @relation(fields: [userId], references: [id])
  
  @@index([quizId, userId])
  @@index([submittedAt])
}

model CodingExercise {
  id                String   @id @default(cuid())
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
  
  lectureId         String   @unique
  lecture           Lecture  @relation(fields: [lectureId], references: [id])
  
  submissions       CodingSubmission[]
}

model CodingSubmission {
  id                String   @id @default(cuid())
  code              String
  submittedAt       DateTime @default(now())
  testsPassed       Int      @default(0)
  testsTotal        Int      @default(0)
  passed            Boolean  @default(false)
  output            String?
  error             String?
  
  codingExerciseId  String
  codingExercise    CodingExercise @relation(fields: [codingExerciseId], references: [id])
  userId            String
  user              User     @relation(fields: [userId], references: [id])
  
  @@index([codingExerciseId, userId])
  @@index([submittedAt])
}

model Assignment {
  id                String   @id @default(cuid())
  title             String?
  description       String?
  instructions      String?  // HTML content
  allowedFileTypes  String[]
  maxFileSize       Int?     // in bytes
  dueDate           DateTime?
  rubric            Json?    // Array of rubric items
  
  lectureId         String   @unique
  lecture           Lecture  @relation(fields: [lectureId], references: [id])
  
  submissions       AssignmentSubmission[]
}

model AssignmentSubmission {
  id              String   @id @default(cuid())
  files           Json?    // Array of file objects
  submittedAt     DateTime @default(now())
  grade           Float?
  feedback        String?
  status          SubmissionStatus @default(SUBMITTED)
  
  assignmentId    String
  assignment      Assignment @relation(fields: [assignmentId], references: [id])
  userId          String
  user            User     @relation(fields: [userId], references: [id])
  
  @@index([assignmentId, userId])
}

model Project {
  id                String   @id @default(cuid())
  title             String?
  description       String?
  complexity        String?  // beginner, intermediate, advanced
  technologies      String[]
  learningObjectives String[]
  milestones        Json?    // Array of milestone objects
  submission        Json?    // Submission requirements
  
  lectureId         String   @unique
  lecture           Lecture  @relation(fields: [lectureId], references: [id])
}

model Resource {
  id              String   @id @default(cuid())
  title           String
  type            ResourceType
  fileSize        Int?     // in bytes
  fileSizeFormatted String?
  url             String
  downloadable    Boolean  @default(true)
  
  lectureId       String
  lecture         Lecture  @relation(fields: [lectureId], references: [id])
  
  @@index([lectureId])
}

model FAQ {
  id          String   @id @default(cuid())
  question    String
  answer      String
  helpful     Int      @default(0)
  notHelpful  Int      @default(0)
  createdAt   DateTime @default(now())
  
  courseId    String
  course      Course   @relation(fields: [courseId], references: [id])
  
  @@index([courseId])
}

model Review {
  id          String   @id @default(cuid())
  rating      Int      // 1-5
  title       String?
  content     String?
  helpful     Int      @default(0)
  notHelpful  Int      @default(0)
  createdAt   DateTime @default(now())
  
  courseId    String
  course      Course   @relation(fields: [courseId], references: [id])
  userId      String
  user        User     @relation(fields: [userId], references: [id])
  
  @@unique([courseId, userId])
  @@index([courseId, rating])
}

// User and Progress models

model User {
  id          String   @id @default(cuid())
  email       String   @unique
  name        String?
  avatar      String?
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  
  enrollments Enrollment[]
  progress    LectureProgress[]
  notes       Note[]
  quizAttempts QuizAttempt[]
  codingSubmissions CodingSubmission[]
  assignmentSubmissions AssignmentSubmission[]
}

model Enrollment {
  id                  String   @id @default(cuid())
  enrolledAt          DateTime @default(now())
  lastAccessedAt      DateTime?
  progressPercentage  Float    @default(0)
  completedLectures   Int      @default(0)
  totalTimeSpent      Int      @default(0) // in seconds
  certificateEarned   Boolean  @default(false)
  favorited           Boolean  @default(false)
  archived            Boolean  @default(false)
  
  courseId    String
  course      Course   @relation(fields: [courseId], references: [id])
  userId      String
  user        User     @relation(fields: [userId], references: [id])
  
  // Current lecture tracking
  currentLectureId    String?
  currentLecture      Lecture? @relation(fields: [currentLectureId], references: [id])
  
  @@unique([courseId, userId])
  @@index([userId])
  @@index([courseId])
}

model LectureProgress {
  id                  String   @id @default(cuid())
  completed           Boolean  @default(false)
  completedAt         DateTime?
  lastPosition        Int?     @default(0) // for videos, in seconds
  watchedPercentage   Float?   @default(0)
  
  // For quizzes
  attempts            Int?     @default(0)
  bestScore           Float?   @default(0)
  passed              Boolean? @default(false)
  
  lectureId   String
  lecture     Lecture  @relation(fields: [lectureId], references: [id])
  userId      String
  user        User     @relation(fields: [userId], references: [id])
  
  @@unique([lectureId, userId])
  @@index([userId])
  @@index([lectureId])
}

model Note {
  id          String   @id @default(cuid())
  content     String
  timestamp   Int?     // for videos, in seconds
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  
  lectureId   String
  lecture     Lecture  @relation(fields: [lectureId], references: [id])
  userId      String
  user        User     @relation(fields: [userId], references: [id])
  
  @@index([lectureId, userId])
  @@index([userId])
}

// Enums

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
```

Key Features of this Prisma Schema:

1. Comprehensive Course Structure

· Full course metadata with categories and instructors
· Flexible pricing models (one-time, subscription, enterprise)
· Version control and statistics tracking

2. Rich Content Types

· Multiple lecture types (video, article, quiz, coding exercise, assignment, project)
· Nested curriculum with sections and lectures
· Support for resources and attachments

3. Advanced Assessment System

· Multiple question types
· Quiz attempts with scoring
· Coding exercises with test cases
· Assignment submissions with grading

4. User Progress Tracking

· Detailed enrollment and progress tracking
· Lecture completion status
· Video watch positions
· Note-taking capabilities

5. Social Features

· Reviews and ratings
· FAQ system
· Helpful votes

6. Scalable Design

· Proper indexing for performance
· Flexible JSON fields for complex data
· Cascading relations with proper constraints

7. Type Safety

· Enums for fixed value sets
· Proper relation constraints
· Unique constraints where needed

This schema provides a solid foundation for building a full-featured learning platform with all the capabilities shown in your JSON structure, while maintaining database performance and data integrity.

Here's a comprehensive Next.js + Prisma example for adding a lesson with quiz functionality step by step:

1. Prisma Schema (Additions for Lessons/Quizzes)

```prisma
// Add to your existing schema
model Lesson {
  id          String   @id @default(cuid())
  title       String
  description String?
  content     String?  // HTML content
  order       Int
  type        LessonType
  duration    Int?     // in minutes
  isPublished Boolean  @default(false)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  courseId    String
  course      Course   @relation(fields: [courseId], references: [id])
  
  // Relations for different content types
  video       Video?
  quiz        Quiz?
  assignment  Assignment?
  
  // Progress tracking
  progress    LessonProgress[]

  @@index([courseId, order])
}

enum LessonType {
  VIDEO
  ARTICLE
  QUIZ
  ASSIGNMENT
  LIVE_SESSION
}
```

2. API Route - Create Lesson with Quiz

```typescript
// app/api/courses/[courseId]/lessons/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/prisma';

export async function POST(
  request: NextRequest,
  { params }: { params: { courseId: string } }
) {
  try {
    const session = await getServerSession();
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const courseId = params.courseId;
    const data = await request.json();

    // Verify user owns the course
    const course = await prisma.course.findFirst({
      where: {
        id: courseId,
        instructor: {
          user: {
            email: session.user.email
          }
        }
      }
    });

    if (!course) {
      return NextResponse.json({ error: 'Course not found' }, { status: 404 });
    }

    // Create lesson with transaction to handle related data
    const result = await prisma.$transaction(async (tx) => {
      // Get the next order number
      const lastLesson = await tx.lesson.findFirst({
        where: { courseId },
        orderBy: { order: 'desc' }
      });
      const nextOrder = (lastLesson?.order || 0) + 1;

      // Create the lesson
      const lesson = await tx.lesson.create({
        data: {
          title: data.title,
          description: data.description,
          content: data.content,
          order: nextOrder,
          type: data.type,
          duration: data.duration,
          courseId,
          isPublished: data.isPublished || false,
        }
      });

      // Handle quiz creation if type is QUIZ
      if (data.type === 'QUIZ' && data.quiz) {
        await tx.quiz.create({
          data: {
            title: data.quiz.title,
            description: data.quiz.description,
            passingScore: data.quiz.passingScore,
            timeLimit: data.quiz.timeLimit,
            attemptsAllowed: data.quiz.attemptsAllowed,
            lessonId: lesson.id,
            questions: {
              create: data.quiz.questions.map((q: any, index: number) => ({
                order: index + 1,
                type: q.type,
                question: q.question,
                points: q.points,
                options: q.options,
                correctAnswer: q.correctAnswer,
                acceptedAnswers: q.acceptedAnswers,
                explanation: q.explanation,
                hint: q.hint,
              }))
            }
          }
        });
      }

      // Handle video creation if type is VIDEO
      if (data.type === 'VIDEO' && data.video) {
        await tx.video.create({
          data: {
            url: data.video.url,
            duration: data.video.duration,
            thumbnail: data.video.thumbnail,
            lessonId: lesson.id,
          }
        });
      }

      return lesson;
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error creating lesson:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
```

3. Lesson Creation Form Component

```typescript
// components/lesson/CreateLessonForm.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface CreateLessonFormProps {
  courseId: string;
}

export default function CreateLessonForm({ courseId }: CreateLessonFormProps) {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [lessonType, setLessonType] = useState<'VIDEO' | 'ARTICLE' | 'QUIZ' | 'ASSIGNMENT'>('VIDEO');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    content: '',
    duration: 0,
    isPublished: false,
    quiz: {
      title: '',
      description: '',
      passingScore: 70,
      timeLimit: 1800, // 30 minutes in seconds
      attemptsAllowed: 3,
      questions: [] as any[],
    },
    video: {
      url: '',
      duration: 0,
      thumbnail: '',
    }
  });

  // Step 1: Basic Info
  const Step1 = () => (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Lesson Basics</h3>
      
      <div>
        <label className="block text-sm font-medium mb-2">Lesson Type</label>
        <select 
          value={lessonType}
          onChange={(e) => setLessonType(e.target.value as any)}
          className="w-full p-2 border rounded"
        >
          <option value="VIDEO">Video Lesson</option>
          <option value="ARTICLE">Article</option>
          <option value="QUIZ">Quiz</option>
          <option value="ASSIGNMENT">Assignment</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Title</label>
        <input
          type="text"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          className="w-full p-2 border rounded"
          placeholder="Enter lesson title"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Description</label>
        <textarea
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          className="w-full p-2 border rounded"
          rows={3}
          placeholder="Brief description of what students will learn"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Duration (minutes)</label>
        <input
          type="number"
          value={formData.duration}
          onChange={(e) => setFormData({ ...formData, duration: parseInt(e.target.value) })}
          className="w-full p-2 border rounded"
        />
      </div>
    </div>
  );

  // Step 2: Content based on type
  const Step2 = () => {
    if (lessonType === 'QUIZ') {
      return <QuizBuilder formData={formData} setFormData={setFormData} />;
    }
    
    if (lessonType === 'VIDEO') {
      return (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Video Details</h3>
          <div>
            <label className="block text-sm font-medium mb-2">Video URL</label>
            <input
              type="url"
              value={formData.video.url}
              onChange={(e) => setFormData({
                ...formData,
                video: { ...formData.video, url: e.target.value }
              })}
              className="w-full p-2 border rounded"
              placeholder="https://example.com/video.mp4"
            />
          </div>
        </div>
      );
    }

    return (
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Content</h3>
        <div>
          <label className="block text-sm font-medium mb-2">Lesson Content</label>
          <textarea
            value={formData.content}
            onChange={(e) => setFormData({ ...formData, content: e.target.value })}
            className="w-full p-2 border rounded"
            rows={10}
            placeholder="Enter your lesson content here..."
          />
        </div>
      </div>
    );
  };

  // Step 3: Review and Publish
  const Step3 = () => (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Review Lesson</h3>
      <div className="bg-gray-50 p-4 rounded">
        <h4 className="font-semibold">{formData.title}</h4>
        <p className="text-sm text-gray-600">{formData.description}</p>
        <div className="mt-2 text-sm">
          <span className="font-medium">Type:</span> {lessonType}
          <br />
          <span className="font-medium">Duration:</span> {formData.duration} minutes
        </div>
        
        {lessonType === 'QUIZ' && formData.quiz.questions.length > 0 && (
          <div className="mt-4">
            <h5 className="font-medium">Quiz: {formData.quiz.questions.length} questions</h5>
            <ul className="list-disc list-inside text-sm">
              {formData.quiz.questions.map((q, i) => (
                <li key={i}>{q.question}</li>
              ))}
            </ul>
          </div>
        )}
      </div>

      <div className="flex items-center">
        <input
          type="checkbox"
          id="publish"
          checked={formData.isPublished}
          onChange={(e) => setFormData({ ...formData, isPublished: e.target.checked })}
          className="mr-2"
        />
        <label htmlFor="publish">Publish immediately</label>
      </div>
    </div>
  );

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      const response = await fetch(`/api/courses/${courseId}/lessons`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          type: lessonType,
        }),
      });

      if (response.ok) {
        router.refresh();
        router.push(`/instructor/courses/${courseId}/lessons`);
      } else {
        throw new Error('Failed to create lesson');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to create lesson');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-2">Create New Lesson</h2>
        <div className="flex space-x-4">
          {[1, 2, 3].map((stepNumber) => (
            <div
              key={stepNumber}
              className={`flex items-center ${
                stepNumber === step ? 'text-blue-600 font-semibold' : 'text-gray-500'
              }`}
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  stepNumber === step
                    ? 'bg-blue-600 text-white'
                    : stepNumber < step
                    ? 'bg-green-500 text-white'
                    : 'bg-gray-300'
                }`}
              >
                {stepNumber}
              </div>
              <span className="ml-2">
                {stepNumber === 1 && 'Basics'}
                {stepNumber === 2 && 'Content'}
                {stepNumber === 3 && 'Review'}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md">
        {step === 1 && <Step1 />}
        {step === 2 && <Step2 />}
        {step === 3 && <Step3 />}

        <div className="flex justify-between mt-8">
          <button
            onClick={() => setStep(step - 1)}
            disabled={step === 1}
            className="px-4 py-2 border rounded disabled:opacity-50"
          >
            Previous
          </button>
          
          {step < 3 ? (
            <button
              onClick={() => setStep(step + 1)}
              className="px-4 py-2 bg-blue-600 text-white rounded"
            >
              Next
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="px-4 py-2 bg-green-600 text-white rounded disabled:opacity-50"
            >
              {isSubmitting ? 'Creating...' : 'Create Lesson'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
```

4. Quiz Builder Component

```typescript
// components/lesson/QuizBuilder.tsx
'use client';

import { useState } from 'react';

interface QuizBuilderProps {
  formData: any;
  setFormData: (data: any) => void;
}

export default function QuizBuilder({ formData, setFormData }: QuizBuilderProps) {
  const [currentQuestion, setCurrentQuestion] = useState<any>({
    type: 'MULTIPLE_CHOICE',
    question: '',
    points: 10,
    options: [],
    correctAnswer: null,
    explanation: '',
    hint: '',
  });

  const addQuestion = () => {
    if (!currentQuestion.question.trim()) {
      alert('Please enter a question');
      return;
    }

    const newQuestion = { ...currentQuestion };
    
    // Validate based on question type
    if (newQuestion.type === 'MULTIPLE_CHOICE' && !newQuestion.correctAnswer) {
      alert('Please select a correct answer');
      return;
    }

    setFormData({
      ...formData,
      quiz: {
        ...formData.quiz,
        questions: [...formData.quiz.questions, newQuestion],
      },
    });

    // Reset current question
    setCurrentQuestion({
      type: 'MULTIPLE_CHOICE',
      question: '',
      points: 10,
      options: [],
      correctAnswer: null,
      explanation: '',
      hint: '',
    });
  };

  const addOption = () => {
    setCurrentQuestion({
      ...currentQuestion,
      options: [
        ...currentQuestion.options,
        { id: `opt_${Date.now()}`, text: '', isCorrect: false },
      ],
    });
  };

  const updateOption = (index: number, field: string, value: any) => {
    const newOptions = [...currentQuestion.options];
    newOptions[index] = { ...newOptions[index], [field]: value };
    
    setCurrentQuestion({
      ...currentQuestion,
      options: newOptions,
    });
  };

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold">Build Your Quiz</h3>

      {/* Quiz Settings */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-2">Quiz Title</label>
          <input
            type="text"
            value={formData.quiz.title}
            onChange={(e) => setFormData({
              ...formData,
              quiz: { ...formData.quiz, title: e.target.value }
            })}
            className="w-full p-2 border rounded"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Passing Score (%)</label>
          <input
            type="number"
            min="0"
            max="100"
            value={formData.quiz.passingScore}
            onChange={(e) => setFormData({
              ...formData,
              quiz: { ...formData.quiz, passingScore: parseInt(e.target.value) }
            })}
            className="w-full p-2 border rounded"
          />
        </div>
      </div>

      {/* Question Builder */}
      <div className="border rounded-lg p-4">
        <h4 className="font-semibold mb-4">Add Question</h4>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Question Type</label>
            <select
              value={currentQuestion.type}
              onChange={(e) => setCurrentQuestion({
                ...currentQuestion,
                type: e.target.value,
                options: e.target.value === 'TRUE_FALSE' ? [
                  { id: 'true', text: 'True', isCorrect: false },
                  { id: 'false', text: 'False', isCorrect: false },
                ] : []
              })}
              className="w-full p-2 border rounded"
            >
              <option value="MULTIPLE_CHOICE">Multiple Choice</option>
              <option value="TRUE_FALSE">True/False</option>
              <option value="FILL_BLANK">Fill in the Blank</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Question</label>
            <textarea
              value={currentQuestion.question}
              onChange={(e) => setCurrentQuestion({
                ...currentQuestion,
                question: e.target.value
              })}
              className="w-full p-2 border rounded"
              rows={3}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Points</label>
            <input
              type="number"
              value={currentQuestion.points}
              onChange={(e) => setCurrentQuestion({
                ...currentQuestion,
                points: parseInt(e.target.value)
              })}
              className="w-full p-2 border rounded"
            />
          </div>

          {/* Options for Multiple Choice */}
          {(currentQuestion.type === 'MULTIPLE_CHOICE' || currentQuestion.type === 'TRUE_FALSE') && (
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-sm font-medium">Options</label>
                {currentQuestion.type === 'MULTIPLE_CHOICE' && (
                  <button
                    type="button"
                    onClick={addOption}
                    className="text-sm bg-blue-600 text-white px-2 py-1 rounded"
                  >
                    Add Option
                  </button>
                )}
              </div>
              
              {currentQuestion.options.map((option: any, index: number) => (
                <div key={option.id} className="flex items-center space-x-2 mb-2">
                  <input
                    type="text"
                    value={option.text}
                    onChange={(e) => updateOption(index, 'text', e.target.value)}
                    className="flex-1 p-2 border rounded"
                    placeholder="Option text"
                  />
                  <input
                    type="radio"
                    name="correctAnswer"
                    checked={option.isCorrect}
                    onChange={(e) => {
                      const newOptions = currentQuestion.options.map((opt: any, i: number) => ({
                        ...opt,
                        isCorrect: i === index
                      }));
                      setCurrentQuestion({
                        ...currentQuestion,
                        options: newOptions,
                        correctAnswer: option.id
                      });
                    }}
                  />
                  <span className="text-sm">Correct</span>
                </div>
              ))}
            </div>
          )}

          {/* Fill in the Blank */}
          {currentQuestion.type === 'FILL_BLANK' && (
            <div>
              <label className="block text-sm font-medium mb-2">Accepted Answers (comma separated)</label>
              <input
                type="text"
                value={currentQuestion.acceptedAnswers?.join(', ') || ''}
                onChange={(e) => setCurrentQuestion({
                  ...currentQuestion,
                  acceptedAnswers: e.target.value.split(',').map(s => s.trim())
                })}
                className="w-full p-2 border rounded"
                placeholder="JavaScript, JS, javascript"
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-medium mb-2">Explanation (Optional)</label>
            <textarea
              value={currentQuestion.explanation}
              onChange={(e) => setCurrentQuestion({
                ...currentQuestion,
                explanation: e.target.value
              })}
              className="w-full p-2 border rounded"
              rows={2}
              placeholder="Explain why the correct answer is right"
            />
          </div>

          <button
            type="button"
            onClick={addQuestion}
            className="w-full bg-green-600 text-white py-2 rounded"
          >
            Add Question
          </button>
        </div>
      </div>

      {/* Questions List */}
      {formData.quiz.questions.length > 0 && (
        <div>
          <h4 className="font-semibold mb-4">
            Questions ({formData.quiz.questions.length})
          </h4>
          <div className="space-y-3">
            {formData.quiz.questions.map((q: any, index: number) => (
              <div key={index} className="border rounded p-3">
                <div className="flex justify-between">
                  <span className="font-medium">Q{index + 1}: {q.question}</span>
                  <span className="text-sm text-gray-600">{q.points} pts</span>
                </div>
                <div className="text-sm text-gray-600 mt-1">
                  Type: {q.type.replace('_', ' ')}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
```

5. API Route for Taking Quiz

```typescript
// app/api/lessons/[lessonId]/quiz/attempt/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/prisma';

export async function POST(
  request: NextRequest,
  { params }: { params: { lessonId: string } }
) {
  try {
    const session = await getServerSession();
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const lessonId = params.lessonId;
    const { answers } = await request.json();

    // Get user and quiz
    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    });

    const quiz = await prisma.quiz.findFirst({
      where: { lessonId },
      include: {
        questions: {
          orderBy: { order: 'asc' }
        }
      }
    });

    if (!quiz || !user) {
      return NextResponse.json({ error: 'Quiz not found' }, { status: 404 });
    }

    // Calculate score
    let totalPoints = 0;
    let earnedPoints = 0;

    const gradedAnswers = await Promise.all(
      quiz.questions.map(async (question) => {
        const userAnswer = answers.find((a: any) => a.questionId === question.id);
        let isCorrect = false;
        let pointsEarned = 0;

        totalPoints += question.points;

        if (userAnswer) {
          switch (question.type) {
            case 'MULTIPLE_CHOICE':
              isCorrect = userAnswer.selectedOption === question.correctAnswer;
              break;
            case 'TRUE_FALSE':
              isCorrect = userAnswer.answer === question.correctAnswer;
              break;
            case 'FILL_BLANK':
              isCorrect = question.acceptedAnswers?.includes(userAnswer.answer);
              break;
          }

          pointsEarned = isCorrect ? question.points : 0;
          earnedPoints += pointsEarned;
        }

        return {
          questionId: question.id,
          selectedOptions: userAnswer?.selectedOptions,
          answer: userAnswer?.answer,
          isCorrect,
          pointsEarned,
        };
      })
    );

    const percentage = (earnedPoints / totalPoints) * 100;
    const passed = percentage >= quiz.passingScore;

    // Create quiz attempt
    const attempt = await prisma.quizAttempt.create({
      data: {
        attemptNumber: 1, // You'd calculate this based on previous attempts
        score: percentage,
        pointsEarned: earnedPoints,
        pointsPossible: totalPoints,
        percentage,
        passed,
        timeSpent: 0, // You'd calculate this from the frontend
        answers: gradedAnswers,
        quizId: quiz.id,
        userId: user.id,
        startedAt: new Date(),
        submittedAt: new Date(),
      }
    });

    // Update lesson progress
    await prisma.lessonProgress.upsert({
      where: {
        lessonId_userId: {
          lessonId,
          userId: user.id,
        }
      },
      update: {
        completed: passed,
        completedAt: passed ? new Date() : undefined,
        attempts: { increment: 1 },
        bestScore: Math.max(percentage),
        passed: passed ? true : undefined,
      },
      create: {
        completed: passed,
        completedAt: passed ? new Date() : undefined,
        attempts: 1,
        bestScore: percentage,
        passed,
        lessonId,
        userId: user.id,
      }
    });

    return NextResponse.json({
      attempt,
      score: percentage,
      passed,
      correctAnswers: gradedAnswers.filter(a => a.isCorrect).length,
      totalQuestions: quiz.questions.length,
    });
  } catch (error) {
    console.error('Error submitting quiz:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
```

6. Usage in Page Component

```typescript
// app/instructor/courses/[courseId]/lessons/new/page.tsx
import CreateLessonForm from '@/components/lesson/CreateLessonForm';

interface PageProps {
  params: {
    courseId: string;
  };
}

export default function NewLessonPage({ params }: PageProps) {
  return (
    <div>
      <CreateLessonForm courseId={params.courseId} />
    </div>
  );
}
```

Key Features:

1. Multi-step Form

· Step 1: Basic lesson info and type selection
· Step 2: Dynamic content based on lesson type
· Step 3: Review and publish

2. Quiz Builder

· Multiple question types
· Real-time preview
· Points system
· Explanation and hints

3. Database Transactions

· Atomic operations for related data
· Rollback on failure
· Data consistency

4. Progress Tracking

· Automatic progress updates
· Score calculation
· Completion tracking

5. Type Safety

· Full TypeScript support
· Prisma type generation
· Runtime validation

This implementation provides a complete, production-ready solution for creating lessons with quizzes in a Next.js application using Prisma.