// Course Builder Types
// These types are for the frontend course creation interface

export type LectureType = 'VIDEO' | 'ARTICLE' | 'QUIZ' | 'CODING_EXERCISE' | 'ASSIGNMENT' | 'PROJECT';
export type QuestionType = 'MULTIPLE_CHOICE' | 'MULTIPLE_ANSWER' | 'TRUE_FALSE' | 'FILL_BLANK' | 'ORDERING';
export type CourseLevel = 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED' | 'ALL_LEVELS';
export type CourseType = 'LECTURE' | 'ONLINE' | 'HYBRID';
export type CourseStatus = 'DRAFT' | 'PUBLISHED' | 'ARCHIVED' | 'UNPUBLISHED';
export type Language = 'FR' | 'MG' | 'EN';
export type ContentQuality = 'LOW' | 'MEDIUM' | 'HIGH' | 'ULTRA';
export type ResourceType = 'PDF' | 'DOCUMENT' | 'PRESENTATION' | 'SPREADSHEET' | 'IMAGE' | 'AUDIO' | 'VIDEO' | 'ARCHIVE' | 'CODE' | 'EXTERNAL_LINK' | 'TEXT';

// Question Types
export interface Question {
  id: string;
  order: number;
  type: QuestionType;
  question: string;
  points: number;
  partialCredit: boolean;
  
  // For MULTIPLE_CHOICE and MULTIPLE_ANSWER
  options?: string[];
  
  // For MULTIPLE_CHOICE (single value) or MULTIPLE_ANSWER (array of values) or TRUE_FALSE (boolean)
  correctAnswer?: string | string[] | boolean;
  
  // For FILL_BLANK - accepted answers
  acceptedAnswers?: string[];
  
  // For ORDERING - items to be ordered
  orderingItems?: Array<{ id: string; text: string; correctOrder: number }>;
  
  // Optional fields
  explanation?: string;
  hint?: string;
}

export interface QuizData {
  title?: string;
  description?: string;
  passingScore: number;
  totalPoints?: number;
  timeLimit?: number;
  attemptsAllowed: number;
  shuffleQuestions: boolean;
  shuffleAnswers: boolean;
  showCorrectAnswers: boolean;
  showCorrectAnswersAfter: string;
  questionCount?: number;
  questions: Question[];
}

// Resource Type
export interface Resource {
  id: string;
  title: string;
  type: ResourceType;
  fileSize?: number;
  fileSizeFormatted?: string;
  url: string;
  downloadable: boolean;
}

// Lecture Data Types
export interface VideoData {
  url?: string;
  hlsUrl?: string;
  dashUrl?: string;
  thumbnail?: string;
  thumbnailSprite?: string;
  captions?: any;
  uploadedAt?: string;
  processedAt?: string;
  status?: string;
  defaultQuality: ContentQuality;
  offlineOptimized: boolean;
  duration?: number;
  durationFormatted?: string;
}

export interface ArticleData {
  content: string;
  contentHtml: string;
  wordCount: number;
  estimatedReadingTime?: number;
  images?: any;
}

export interface CodingExerciseData {
  title?: string;
  instructions: string;
  starterCode?: string;
  language: string;
  expectedOutput?: string;
  testCases: Array<{
    id: string;
    input: string;
    expectedOutput: string;
    isHidden?: boolean;
  }>;
  hints: string[];
  solution?: string;
  allowSubmission: boolean;
  maxSubmissions?: number;
}

export interface AssignmentData {
  title?: string;
  description?: string;
  instructions: string;
  allowedFileTypes: string[];
  maxFileSize: number;
  dueDate?: string;
  rubric?: any;
}

export interface ProjectData {
  title?: string;
  description: string;
  complexity: string;
  technologies: string[];
  learningObjectives: string[];
  milestones: Array<{
    id: string;
    title: string;
    description: string;
    order: number;
  }>;
  submission?: any;
}

// Lecture Type
export interface Lecture {
  id: string;
  title: string;
  description: string;
  type: LectureType;
  order: number;
  duration?: number;
  durationFormatted?: string;
  isPreview: boolean;
  isFree: boolean;
  offlineAvailable: boolean;
  downloadPriority?: number;
  sizeBytes?: bigint;
  estimatedDataUsage?: string;
  
  // Type-specific data
  video?: VideoData;
  article?: ArticleData;
  quiz?: QuizData;
  codingExercise?: CodingExerciseData;
  assignment?: AssignmentData;
  project?: ProjectData;
  
  // Resources
  resources: Resource[];
}

// Section Type
export interface Section {
  id: string;
  title: string;
  description: string;
  order: number;
  totalLectures?: number;
  totalDuration?: number;
  durationFormatted?: string;
  lectures: Lecture[];
}

// Course Type
export interface Course {
  id: string;
  uuid?: string;
  title: string;
  slug?: string;
  subtitle?: string;
  description?: string;
  language: Language;
  level: CourseLevel;
  contentType: CourseType;
  status: CourseStatus;
  
  // Optional metadata
  publishedAt?: string;
  lastUpdatedAt?: string;
  createdAt: string;
  updatedAt: string;
  
  // IDs
  categoryId?: string;
  instructorId?: string;
  schoolId?: string;
  
  // Flags
  isPublic?: boolean;
  requiresOnline?: boolean;
  offlineAvailable?: boolean;
  
  // Arrays
  features?: string[];
  requirements?: string[];
  targetAudience?: string[];
  learningObjectives?: string[];
  tags?: string[];
  
  // Additional data
  captions?: any;
  totalSizeBytes?: bigint;
  downloadPriority?: number;
  estimatedDataUsage?: string;
  
  // Sections
  sections: Section[];
}

// API Response Types
export interface CourseCreateRequest {
  course: Partial<Course>;
}

export interface CourseUpdateRequest {
  course: Partial<Course>;
}

export interface CourseResponse {
  success: boolean;
  message?: string;
  course?: Course;
  error?: string;
}
