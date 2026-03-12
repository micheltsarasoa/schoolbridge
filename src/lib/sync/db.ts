import Dexie, { Table } from 'dexie';

// --- Type Definitions for Database Stores ---

// Base interface for syncable entities
export interface SyncableEntity {
  id?: number; // IndexedDB Auto-incremented primary key
  clientId: string; // Unique client ID for local record identification (& indexed)
  clientUpdatedAt: Date; // Timestamp of last client update (indexed)
  isDeleted: boolean; // Flag for soft deletion (indexed)
}

// Read-Only Models (Using string UUIDs for server IDs)
export interface Course {
  id: string; // Server-side primary key (UUID)
  name: string;
  // ... other course fields
}

export interface CourseContent {
  id: string; // Server-side primary key (UUID)
  courseId: string;
  content: string; // e.g., lesson text, media URLs
  // ... other content fields
}

// Syncable Models (Relational IDs must be strings/UUIDs)
export interface StudentProgress extends SyncableEntity {
  courseId: string; // Indexed (UUID)
  lessonId: string; // Indexed (UUID) - Assuming Lesson/Lecture IDs are UUIDs based on schema
  progressData: string; // Encrypted data placeholder
}

export interface Note extends SyncableEntity {
  lectureId: string; // Indexed (using lectureId instead of generic courseId index, based on prisma model relation)
  content: string; // Encrypted data placeholder
}

export interface QuizAttempt extends SyncableEntity {
  quizId: string; // Indexed (UUID)
  attemptNumber: number;
  // Raw JSON representation of submitted answers for questions (e.g., Map<questionId, answer>)
  answers: Record<string, any>;
  status: 'IN_PROGRESS' | 'SUBMITTED' | 'SCORED';
  attemptData: string; // Encrypted data placeholder
}

// Local State Models
export interface DownloadQueueItem {
  id?: number;
  path: string;
  url: string;
  status: 'pending' | 'downloading' | 'complete' | 'failed';
}

export interface OfflineContent {
  url: string; // Primary key
  blob: Blob;
  mimeType: string;
}

export interface OfflineSyncState {
  id?: number;
  lastSuccessfulSync: Date;
  entityName: string;
}

// --- Dexie Database Definition ---

export class SchoolBridgeOfflineDB extends Dexie {
  // Read-Only Stores
  courses!: Table<Course>;
  courseContent!: Table<CourseContent>;

  // Syncable Stores
  studentProgress!: Table<StudentProgress>;
  notes!: Table<Note>;
  quizAttempts!: Table<QuizAttempt>;

  // Local State Stores
  downloadQueue!: Table<DownloadQueueItem>;
  offlineContent!: Table<OfflineContent>;
  offlineSyncs!: Table<OfflineSyncState>;

  constructor() {
    super('SchoolBridgeOfflineDB');
    this.version(1).stores({
      // Read-Only Stores
      // Schema: [primary key], [other indexes]
      courses: '&id',
      courseContent: '&id, courseId',

      // Syncable Stores (Require ++id, &clientId, clientUpdatedAt, isDeleted)
      // Schema: ++id, &clientId, courseId, lessonId, clientUpdatedAt, isDeleted
      studentProgress: '++id, &clientId, courseId, lessonId, clientUpdatedAt, isDeleted',
      // Schema: ++id, &clientId, lectureId, clientUpdatedAt, isDeleted
      notes: '++id, &clientId, lectureId, clientUpdatedAt, isDeleted',
      // Schema: ++id, &clientId, quizId, clientUpdatedAt, isDeleted
      quizAttempts: '++id, &clientId, quizId, clientUpdatedAt, isDeleted',

      // Local State Stores
      downloadQueue: '++id',
      offlineContent: '&url', // indexed by url, must be unique
      offlineSyncs: '++id, &entityName', // indexed by entityName, must be unique
    });
  }
}

export const db = new SchoolBridgeOfflineDB();