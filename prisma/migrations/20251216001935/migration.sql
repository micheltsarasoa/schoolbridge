/*
  Warnings:

  - You are about to drop the column `createdAt` on the `audit_logs` table. All the data in the column will be lost.
  - You are about to drop the column `entityId` on the `audit_logs` table. All the data in the column will be lost.
  - You are about to drop the column `entityType` on the `audit_logs` table. All the data in the column will be lost.
  - You are about to drop the column `ipAddress` on the `audit_logs` table. All the data in the column will be lost.
  - You are about to drop the column `newValue` on the `audit_logs` table. All the data in the column will be lost.
  - You are about to drop the column `oldValue` on the `audit_logs` table. All the data in the column will be lost.
  - You are about to drop the column `userAgent` on the `audit_logs` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `audit_logs` table. All the data in the column will be lost.
  - You are about to drop the column `classId` on the `class_enrollments` table. All the data in the column will be lost.
  - You are about to drop the column `enrolledAt` on the `class_enrollments` table. All the data in the column will be lost.
  - You are about to drop the column `studentId` on the `class_enrollments` table. All the data in the column will be lost.
  - You are about to drop the column `academicPeriodId` on the `classes` table. All the data in the column will be lost.
  - You are about to drop the column `degreeLevel` on the `classes` table. All the data in the column will be lost.
  - You are about to drop the column `schoolId` on the `classes` table. All the data in the column will be lost.
  - You are about to drop the column `accessCount` on the `content_cache` table. All the data in the column will be lost.
  - You are about to drop the column `cachedAt` on the `content_cache` table. All the data in the column will be lost.
  - You are about to drop the column `contentId` on the `content_cache` table. All the data in the column will be lost.
  - You are about to drop the column `contentType` on the `content_cache` table. All the data in the column will be lost.
  - You are about to drop the column `downloadProgress` on the `content_cache` table. All the data in the column will be lost.
  - You are about to drop the column `expiresAt` on the `content_cache` table. All the data in the column will be lost.
  - You are about to drop the column `lastAccessedAt` on the `content_cache` table. All the data in the column will be lost.
  - You are about to drop the column `serverId` on the `content_cache` table. All the data in the column will be lost.
  - You are about to drop the column `sizeInBytes` on the `content_cache` table. All the data in the column will be lost.
  - You are about to drop the column `contentId` on the `content_variants` table. All the data in the column will be lost.
  - You are about to drop the column `contentType` on the `content_variants` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `content_variants` table. All the data in the column will be lost.
  - You are about to drop the column `isDefault` on the `content_variants` table. All the data in the column will be lost.
  - You are about to drop the column `recommendedFor` on the `content_variants` table. All the data in the column will be lost.
  - You are about to drop the column `sizeFormatted` on the `content_variants` table. All the data in the column will be lost.
  - You are about to drop the column `sizeInBytes` on the `content_variants` table. All the data in the column will be lost.
  - You are about to drop the column `videoId` on the `content_variants` table. All the data in the column will be lost.
  - You are about to drop the column `courseId` on the `course_validations` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `course_validations` table. All the data in the column will be lost.
  - You are about to drop the column `feedback` on the `course_validations` table. All the data in the column will be lost.
  - You are about to drop the column `reviewedAt` on the `course_validations` table. All the data in the column will be lost.
  - You are about to drop the column `reviewerId` on the `course_validations` table. All the data in the column will be lost.
  - You are about to drop the column `completedAt` on the `download_queue` table. All the data in the column will be lost.
  - You are about to drop the column `contentId` on the `download_queue` table. All the data in the column will be lost.
  - You are about to drop the column `contentType` on the `download_queue` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `download_queue` table. All the data in the column will be lost.
  - You are about to drop the column `deviceId` on the `download_queue` table. All the data in the column will be lost.
  - You are about to drop the column `downloadedSize` on the `download_queue` table. All the data in the column will be lost.
  - You are about to drop the column `estimatedSize` on the `download_queue` table. All the data in the column will be lost.
  - You are about to drop the column `lastError` on the `download_queue` table. All the data in the column will be lost.
  - You are about to drop the column `maxRetries` on the `download_queue` table. All the data in the column will be lost.
  - You are about to drop the column `retryCount` on the `download_queue` table. All the data in the column will be lost.
  - You are about to drop the column `scheduledFor` on the `download_queue` table. All the data in the column will be lost.
  - You are about to drop the column `startedAt` on the `download_queue` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `download_queue` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `download_queue` table. All the data in the column will be lost.
  - You are about to drop the column `variantQuality` on the `download_queue` table. All the data in the column will be lost.
  - You are about to drop the column `wifiOnly` on the `download_queue` table. All the data in the column will be lost.
  - You are about to drop the column `academicPeriod` on the `grades` table. All the data in the column will be lost.
  - You are about to drop the column `assignmentId` on the `grades` table. All the data in the column will be lost.
  - You are about to drop the column `classId` on the `grades` table. All the data in the column will be lost.
  - You are about to drop the column `courseId` on the `grades` table. All the data in the column will be lost.
  - You are about to drop the column `gradableId` on the `grades` table. All the data in the column will be lost.
  - You are about to drop the column `gradableType` on the `grades` table. All the data in the column will be lost.
  - You are about to drop the column `gradedAt` on the `grades` table. All the data in the column will be lost.
  - You are about to drop the column `gradedBy` on the `grades` table. All the data in the column will be lost.
  - You are about to drop the column `letterGrade` on the `grades` table. All the data in the column will be lost.
  - You are about to drop the column `maxScore` on the `grades` table. All the data in the column will be lost.
  - You are about to drop the column `studentId` on the `grades` table. All the data in the column will be lost.
  - You are about to drop the column `connectionType` on the `network_usage` table. All the data in the column will be lost.
  - You are about to drop the column `dataDownloaded` on the `network_usage` table. All the data in the column will be lost.
  - You are about to drop the column `dataUploaded` on the `network_usage` table. All the data in the column will be lost.
  - You are about to drop the column `deviceId` on the `network_usage` table. All the data in the column will be lost.
  - You are about to drop the column `documentData` on the `network_usage` table. All the data in the column will be lost.
  - You are about to drop the column `imageData` on the `network_usage` table. All the data in the column will be lost.
  - You are about to drop the column `otherData` on the `network_usage` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `network_usage` table. All the data in the column will be lost.
  - You are about to drop the column `videoData` on the `network_usage` table. All the data in the column will be lost.
  - You are about to drop the column `actionUrl` on the `notifications` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `notifications` table. All the data in the column will be lost.
  - You are about to drop the column `expiresAt` on the `notifications` table. All the data in the column will be lost.
  - You are about to drop the column `readAt` on the `notifications` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `notifications` table. All the data in the column will be lost.
  - You are about to drop the column `accessCount` on the `offline_content` table. All the data in the column will be lost.
  - You are about to drop the column `autoDelete` on the `offline_content` table. All the data in the column will be lost.
  - You are about to drop the column `cloudVersion` on the `offline_content` table. All the data in the column will be lost.
  - You are about to drop the column `contentId` on the `offline_content` table. All the data in the column will be lost.
  - You are about to drop the column `contentType` on the `offline_content` table. All the data in the column will be lost.
  - You are about to drop the column `deviceId` on the `offline_content` table. All the data in the column will be lost.
  - You are about to drop the column `downloadedAt` on the `offline_content` table. All the data in the column will be lost.
  - You are about to drop the column `expiresAt` on the `offline_content` table. All the data in the column will be lost.
  - You are about to drop the column `lastAccessedAt` on the `offline_content` table. All the data in the column will be lost.
  - You are about to drop the column `localPath` on the `offline_content` table. All the data in the column will be lost.
  - You are about to drop the column `localVersion` on the `offline_content` table. All the data in the column will be lost.
  - You are about to drop the column `needsUpdate` on the `offline_content` table. All the data in the column will be lost.
  - You are about to drop the column `sizeInBytes` on the `offline_content` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `offline_content` table. All the data in the column will be lost.
  - You are about to drop the column `variantQuality` on the `offline_content` table. All the data in the column will be lost.
  - You are about to drop the column `deviceId` on the `offline_syncs` table. All the data in the column will be lost.
  - You are about to drop the column `lastSyncAt` on the `offline_syncs` table. All the data in the column will be lost.
  - You are about to drop the column `pendingChanges` on the `offline_syncs` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `offline_syncs` table. All the data in the column will be lost.
  - You are about to drop the column `isVerified` on the `parent_students` table. All the data in the column will be lost.
  - You are about to drop the column `parentId` on the `parent_students` table. All the data in the column will be lost.
  - You are about to drop the column `studentId` on the `parent_students` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `parents` table. All the data in the column will be lost.
  - You are about to drop the column `canServeContent` on the `school_servers` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `school_servers` table. All the data in the column will be lost.
  - You are about to drop the column `ipAddress` on the `school_servers` table. All the data in the column will be lost.
  - You are about to drop the column `isMainServer` on the `school_servers` table. All the data in the column will be lost.
  - You are about to drop the column `lastPingAt` on the `school_servers` table. All the data in the column will be lost.
  - You are about to drop the column `lastSyncAt` on the `school_servers` table. All the data in the column will be lost.
  - You are about to drop the column `macAddress` on the `school_servers` table. All the data in the column will be lost.
  - You are about to drop the column `maxConcurrentUsers` on the `school_servers` table. All the data in the column will be lost.
  - You are about to drop the column `nextSyncAt` on the `school_servers` table. All the data in the column will be lost.
  - You are about to drop the column `schoolId` on the `school_servers` table. All the data in the column will be lost.
  - You are about to drop the column `serverName` on the `school_servers` table. All the data in the column will be lost.
  - You are about to drop the column `storageCapacity` on the `school_servers` table. All the data in the column will be lost.
  - You are about to drop the column `storageUsed` on the `school_servers` table. All the data in the column will be lost.
  - You are about to drop the column `syncSchedule` on the `school_servers` table. All the data in the column will be lost.
  - You are about to drop the column `syncWithCloud` on the `school_servers` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `school_servers` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `schools` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `schools` table. All the data in the column will be lost.
  - You are about to drop the column `completedAt` on the `server_sync_logs` table. All the data in the column will be lost.
  - You are about to drop the column `itemsFailed` on the `server_sync_logs` table. All the data in the column will be lost.
  - You are about to drop the column `itemsSynced` on the `server_sync_logs` table. All the data in the column will be lost.
  - You are about to drop the column `serverId` on the `server_sync_logs` table. All the data in the column will be lost.
  - You are about to drop the column `startedAt` on the `server_sync_logs` table. All the data in the column will be lost.
  - You are about to drop the column `syncType` on the `server_sync_logs` table. All the data in the column will be lost.
  - You are about to drop the column `totalSize` on the `server_sync_logs` table. All the data in the column will be lost.
  - You are about to drop the column `sessionToken` on the `sessions` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `sessions` table. All the data in the column will be lost.
  - You are about to drop the column `birthDate` on the `students` table. All the data in the column will be lost.
  - You are about to drop the column `gradeLevel` on the `students` table. All the data in the column will be lost.
  - You are about to drop the column `studentId` on the `students` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `students` table. All the data in the column will be lost.
  - You are about to drop the column `autoDeleteWatched` on the `user_network_preferences` table. All the data in the column will be lost.
  - You are about to drop the column `autoDownload` on the `user_network_preferences` table. All the data in the column will be lost.
  - You are about to drop the column `cellularQuality` on the `user_network_preferences` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `user_network_preferences` table. All the data in the column will be lost.
  - You are about to drop the column `keepDuration` on the `user_network_preferences` table. All the data in the column will be lost.
  - You are about to drop the column `maxDailyData` on the `user_network_preferences` table. All the data in the column will be lost.
  - You are about to drop the column `maxStorageGB` on the `user_network_preferences` table. All the data in the column will be lost.
  - You are about to drop the column `prioritizeArticles` on the `user_network_preferences` table. All the data in the column will be lost.
  - You are about to drop the column `prioritizeQuizzes` on the `user_network_preferences` table. All the data in the column will be lost.
  - You are about to drop the column `prioritizeVideos` on the `user_network_preferences` table. All the data in the column will be lost.
  - You are about to drop the column `syncSchedule` on the `user_network_preferences` table. All the data in the column will be lost.
  - You are about to drop the column `syncWindowEnd` on the `user_network_preferences` table. All the data in the column will be lost.
  - You are about to drop the column `syncWindowStart` on the `user_network_preferences` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `user_network_preferences` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `user_network_preferences` table. All the data in the column will be lost.
  - You are about to drop the column `wifiOnlyDownload` on the `user_network_preferences` table. All the data in the column will be lost.
  - You are about to drop the column `wifiQuality` on the `user_network_preferences` table. All the data in the column will be lost.
  - You are about to drop the `AcademicPeriod` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Account` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Admin` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Announcement` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Article` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Assignment` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `AssignmentSubmission` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Attendance` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Badge` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `CalendarEvent` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Category` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Certificate` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `CodingExercise` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `CodingSubmission` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Conversation` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ConversationParticipant` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Course` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `CourseEnrollment` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `FAQ` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Forum` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Instructor` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `InvitationCode` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Lecture` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `LectureProgress` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Message` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `MessageReadStatus` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Note` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ParentChildLink` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Post` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Project` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `PromoVideo` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Question` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Quiz` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `QuizAttempt` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Report` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Resource` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Review` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Section` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Statistics` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `TeacherApproval` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Thread` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `User` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `UserBadge` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Version` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Video` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_AssignmentToClass` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_AssignmentToCourse` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_ClassToInstructor` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[class_id,student_id]` on the table `class_enrollments` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[school_id,name]` on the table `classes` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[server_id,content_type,content_id]` on the table `content_cache` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[content_type,content_id,quality]` on the table `content_variants` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[course_id,reviewer_id]` on the table `course_validations` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[user_id,device_id,date,connection_type]` on the table `network_usage` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[user_id,device_id,content_type,content_id]` on the table `offline_content` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[user_id,device_id]` on the table `offline_syncs` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[parent_id,student_id]` on the table `parent_students` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[user_id]` on the table `parents` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[session_token]` on the table `sessions` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[student_id]` on the table `students` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[user_id]` on the table `students` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[user_id]` on the table `user_network_preferences` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `entity_id` to the `audit_logs` table without a default value. This is not possible if the table is not empty.
  - Added the required column `entity_type` to the `audit_logs` table without a default value. This is not possible if the table is not empty.
  - Added the required column `class_id` to the `class_enrollments` table without a default value. This is not possible if the table is not empty.
  - Added the required column `student_id` to the `class_enrollments` table without a default value. This is not possible if the table is not empty.
  - Added the required column `academic_period_id` to the `classes` table without a default value. This is not possible if the table is not empty.
  - Added the required column `degree_level` to the `classes` table without a default value. This is not possible if the table is not empty.
  - Added the required column `school_id` to the `classes` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_at` to the `classes` table without a default value. This is not possible if the table is not empty.
  - Added the required column `content_id` to the `content_cache` table without a default value. This is not possible if the table is not empty.
  - Added the required column `content_type` to the `content_cache` table without a default value. This is not possible if the table is not empty.
  - Added the required column `server_id` to the `content_cache` table without a default value. This is not possible if the table is not empty.
  - Added the required column `size_in_bytes` to the `content_cache` table without a default value. This is not possible if the table is not empty.
  - Added the required column `content_id` to the `content_variants` table without a default value. This is not possible if the table is not empty.
  - Added the required column `content_type` to the `content_variants` table without a default value. This is not possible if the table is not empty.
  - Added the required column `size_formatted` to the `content_variants` table without a default value. This is not possible if the table is not empty.
  - Added the required column `size_in_bytes` to the `content_variants` table without a default value. This is not possible if the table is not empty.
  - Added the required column `course_id` to the `course_validations` table without a default value. This is not possible if the table is not empty.
  - Added the required column `reviewer_id` to the `course_validations` table without a default value. This is not possible if the table is not empty.
  - Added the required column `content_id` to the `download_queue` table without a default value. This is not possible if the table is not empty.
  - Added the required column `content_type` to the `download_queue` table without a default value. This is not possible if the table is not empty.
  - Added the required column `device_id` to the `download_queue` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_at` to the `download_queue` table without a default value. This is not possible if the table is not empty.
  - Added the required column `user_id` to the `download_queue` table without a default value. This is not possible if the table is not empty.
  - Added the required column `max_score` to the `grades` table without a default value. This is not possible if the table is not empty.
  - Added the required column `student_id` to the `grades` table without a default value. This is not possible if the table is not empty.
  - Added the required column `connection_type` to the `network_usage` table without a default value. This is not possible if the table is not empty.
  - Added the required column `device_id` to the `network_usage` table without a default value. This is not possible if the table is not empty.
  - Added the required column `user_id` to the `network_usage` table without a default value. This is not possible if the table is not empty.
  - Added the required column `user_id` to the `notifications` table without a default value. This is not possible if the table is not empty.
  - Added the required column `content_id` to the `offline_content` table without a default value. This is not possible if the table is not empty.
  - Added the required column `content_type` to the `offline_content` table without a default value. This is not possible if the table is not empty.
  - Added the required column `device_id` to the `offline_content` table without a default value. This is not possible if the table is not empty.
  - Added the required column `downloaded_at` to the `offline_content` table without a default value. This is not possible if the table is not empty.
  - Added the required column `last_accessed_at` to the `offline_content` table without a default value. This is not possible if the table is not empty.
  - Added the required column `size_in_bytes` to the `offline_content` table without a default value. This is not possible if the table is not empty.
  - Added the required column `user_id` to the `offline_content` table without a default value. This is not possible if the table is not empty.
  - Added the required column `device_id` to the `offline_syncs` table without a default value. This is not possible if the table is not empty.
  - Added the required column `last_sync_at` to the `offline_syncs` table without a default value. This is not possible if the table is not empty.
  - Added the required column `user_id` to the `offline_syncs` table without a default value. This is not possible if the table is not empty.
  - Added the required column `parent_id` to the `parent_students` table without a default value. This is not possible if the table is not empty.
  - Added the required column `student_id` to the `parent_students` table without a default value. This is not possible if the table is not empty.
  - Added the required column `user_id` to the `parents` table without a default value. This is not possible if the table is not empty.
  - Added the required column `server_name` to the `school_servers` table without a default value. This is not possible if the table is not empty.
  - Added the required column `storage_capacity` to the `school_servers` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_at` to the `school_servers` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_at` to the `schools` table without a default value. This is not possible if the table is not empty.
  - Added the required column `server_id` to the `server_sync_logs` table without a default value. This is not possible if the table is not empty.
  - Added the required column `sync_type` to the `server_sync_logs` table without a default value. This is not possible if the table is not empty.
  - Added the required column `session_token` to the `sessions` table without a default value. This is not possible if the table is not empty.
  - Added the required column `user_id` to the `sessions` table without a default value. This is not possible if the table is not empty.
  - Added the required column `user_id` to the `students` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_at` to the `user_network_preferences` table without a default value. This is not possible if the table is not empty.
  - Added the required column `user_id` to the `user_network_preferences` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "ContentType" AS ENUM ('LESSON', 'TEXT', 'VIDEO', 'PDF', 'INTERACTIVE', 'QUIZ', 'ASSIGNMENT');

-- CreateEnum
CREATE TYPE "DayOfWeek" AS ENUM ('MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY');

-- CreateEnum
CREATE TYPE "QuizStatus" AS ENUM ('DRAFT', 'PUBLISHED', 'ARCHIVED');

-- CreateEnum
CREATE TYPE "QuizMode" AS ENUM ('PRACTICE', 'EXAM', 'TIMED_EXAM');

-- CreateEnum
CREATE TYPE "QuizAttemptStatus" AS ENUM ('IN_PROGRESS', 'SUBMITTED', 'GRADED');

-- CreateEnum
CREATE TYPE "InstructionStatus" AS ENUM ('PENDING', 'COMPLETED', 'SKIPPED', 'NEEDS_HELP');

-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "CourseStatus" ADD VALUE 'UNDER_REVIEW';
ALTER TYPE "CourseStatus" ADD VALUE 'APPROVED';

-- AlterEnum
ALTER TYPE "Language" ADD VALUE 'ES';

-- AlterEnum
ALTER TYPE "LectureType" ADD VALUE 'RESOURCE';

-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "QuestionType" ADD VALUE 'SHORT_ANSWER';
ALTER TYPE "QuestionType" ADD VALUE 'ESSAY';

-- DropForeignKey
ALTER TABLE "AcademicPeriod" DROP CONSTRAINT "AcademicPeriod_schoolId_fkey";

-- DropForeignKey
ALTER TABLE "Account" DROP CONSTRAINT "Account_userId_fkey";

-- DropForeignKey
ALTER TABLE "Admin" DROP CONSTRAINT "Admin_userId_fkey";

-- DropForeignKey
ALTER TABLE "Announcement" DROP CONSTRAINT "Announcement_authorId_fkey";

-- DropForeignKey
ALTER TABLE "Announcement" DROP CONSTRAINT "Announcement_schoolId_fkey";

-- DropForeignKey
ALTER TABLE "Article" DROP CONSTRAINT "Article_lectureId_fkey";

-- DropForeignKey
ALTER TABLE "Assignment" DROP CONSTRAINT "Assignment_lectureId_fkey";

-- DropForeignKey
ALTER TABLE "AssignmentSubmission" DROP CONSTRAINT "AssignmentSubmission_assignmentId_fkey";

-- DropForeignKey
ALTER TABLE "AssignmentSubmission" DROP CONSTRAINT "AssignmentSubmission_studentId_fkey";

-- DropForeignKey
ALTER TABLE "AssignmentSubmission" DROP CONSTRAINT "AssignmentSubmission_userId_fkey";

-- DropForeignKey
ALTER TABLE "Attendance" DROP CONSTRAINT "Attendance_classId_fkey";

-- DropForeignKey
ALTER TABLE "Attendance" DROP CONSTRAINT "Attendance_recordedById_fkey";

-- DropForeignKey
ALTER TABLE "Attendance" DROP CONSTRAINT "Attendance_studentId_fkey";

-- DropForeignKey
ALTER TABLE "CalendarEvent" DROP CONSTRAINT "CalendarEvent_classId_fkey";

-- DropForeignKey
ALTER TABLE "CalendarEvent" DROP CONSTRAINT "CalendarEvent_schoolId_fkey";

-- DropForeignKey
ALTER TABLE "CalendarEvent" DROP CONSTRAINT "CalendarEvent_userId_fkey";

-- DropForeignKey
ALTER TABLE "Category" DROP CONSTRAINT "Category_parentId_fkey";

-- DropForeignKey
ALTER TABLE "Certificate" DROP CONSTRAINT "Certificate_courseId_fkey";

-- DropForeignKey
ALTER TABLE "CodingExercise" DROP CONSTRAINT "CodingExercise_lectureId_fkey";

-- DropForeignKey
ALTER TABLE "CodingSubmission" DROP CONSTRAINT "CodingSubmission_codingExerciseId_fkey";

-- DropForeignKey
ALTER TABLE "CodingSubmission" DROP CONSTRAINT "CodingSubmission_studentId_fkey";

-- DropForeignKey
ALTER TABLE "CodingSubmission" DROP CONSTRAINT "CodingSubmission_userId_fkey";

-- DropForeignKey
ALTER TABLE "Conversation" DROP CONSTRAINT "Conversation_courseId_fkey";

-- DropForeignKey
ALTER TABLE "Conversation" DROP CONSTRAINT "Conversation_creatorId_fkey";

-- DropForeignKey
ALTER TABLE "Conversation" DROP CONSTRAINT "Conversation_lectureId_fkey";

-- DropForeignKey
ALTER TABLE "ConversationParticipant" DROP CONSTRAINT "ConversationParticipant_conversationId_fkey";

-- DropForeignKey
ALTER TABLE "ConversationParticipant" DROP CONSTRAINT "ConversationParticipant_userId_fkey";

-- DropForeignKey
ALTER TABLE "Course" DROP CONSTRAINT "Course_categoryId_fkey";

-- DropForeignKey
ALTER TABLE "Course" DROP CONSTRAINT "Course_instructorId_fkey";

-- DropForeignKey
ALTER TABLE "Course" DROP CONSTRAINT "Course_schoolId_fkey";

-- DropForeignKey
ALTER TABLE "CourseEnrollment" DROP CONSTRAINT "CourseEnrollment_courseId_fkey";

-- DropForeignKey
ALTER TABLE "CourseEnrollment" DROP CONSTRAINT "CourseEnrollment_currentLectureId_fkey";

-- DropForeignKey
ALTER TABLE "CourseEnrollment" DROP CONSTRAINT "CourseEnrollment_studentId_fkey";

-- DropForeignKey
ALTER TABLE "CourseEnrollment" DROP CONSTRAINT "CourseEnrollment_userId_fkey";

-- DropForeignKey
ALTER TABLE "FAQ" DROP CONSTRAINT "FAQ_courseId_fkey";

-- DropForeignKey
ALTER TABLE "Forum" DROP CONSTRAINT "Forum_classId_fkey";

-- DropForeignKey
ALTER TABLE "Forum" DROP CONSTRAINT "Forum_courseId_fkey";

-- DropForeignKey
ALTER TABLE "Instructor" DROP CONSTRAINT "Instructor_userId_fkey";

-- DropForeignKey
ALTER TABLE "InvitationCode" DROP CONSTRAINT "InvitationCode_schoolId_fkey";

-- DropForeignKey
ALTER TABLE "Lecture" DROP CONSTRAINT "Lecture_sectionId_fkey";

-- DropForeignKey
ALTER TABLE "LectureProgress" DROP CONSTRAINT "LectureProgress_lectureId_fkey";

-- DropForeignKey
ALTER TABLE "LectureProgress" DROP CONSTRAINT "LectureProgress_studentId_fkey";

-- DropForeignKey
ALTER TABLE "LectureProgress" DROP CONSTRAINT "LectureProgress_userId_fkey";

-- DropForeignKey
ALTER TABLE "Message" DROP CONSTRAINT "Message_conversationId_fkey";

-- DropForeignKey
ALTER TABLE "Message" DROP CONSTRAINT "Message_senderId_fkey";

-- DropForeignKey
ALTER TABLE "MessageReadStatus" DROP CONSTRAINT "MessageReadStatus_messageId_fkey";

-- DropForeignKey
ALTER TABLE "MessageReadStatus" DROP CONSTRAINT "MessageReadStatus_userId_fkey";

-- DropForeignKey
ALTER TABLE "Note" DROP CONSTRAINT "Note_lectureId_fkey";

-- DropForeignKey
ALTER TABLE "Note" DROP CONSTRAINT "Note_studentId_fkey";

-- DropForeignKey
ALTER TABLE "Note" DROP CONSTRAINT "Note_userId_fkey";

-- DropForeignKey
ALTER TABLE "Post" DROP CONSTRAINT "Post_authorId_fkey";

-- DropForeignKey
ALTER TABLE "Post" DROP CONSTRAINT "Post_threadId_fkey";

-- DropForeignKey
ALTER TABLE "Project" DROP CONSTRAINT "Project_lectureId_fkey";

-- DropForeignKey
ALTER TABLE "PromoVideo" DROP CONSTRAINT "PromoVideo_courseId_fkey";

-- DropForeignKey
ALTER TABLE "Question" DROP CONSTRAINT "Question_quizId_fkey";

-- DropForeignKey
ALTER TABLE "Quiz" DROP CONSTRAINT "Quiz_lectureId_fkey";

-- DropForeignKey
ALTER TABLE "QuizAttempt" DROP CONSTRAINT "QuizAttempt_quizId_fkey";

-- DropForeignKey
ALTER TABLE "QuizAttempt" DROP CONSTRAINT "QuizAttempt_studentId_fkey";

-- DropForeignKey
ALTER TABLE "QuizAttempt" DROP CONSTRAINT "QuizAttempt_userId_fkey";

-- DropForeignKey
ALTER TABLE "Report" DROP CONSTRAINT "Report_generatedBy_fkey";

-- DropForeignKey
ALTER TABLE "Resource" DROP CONSTRAINT "Resource_lectureId_fkey";

-- DropForeignKey
ALTER TABLE "Review" DROP CONSTRAINT "Review_courseId_fkey";

-- DropForeignKey
ALTER TABLE "Review" DROP CONSTRAINT "Review_userId_fkey";

-- DropForeignKey
ALTER TABLE "Section" DROP CONSTRAINT "Section_courseId_fkey";

-- DropForeignKey
ALTER TABLE "Statistics" DROP CONSTRAINT "Statistics_courseId_fkey";

-- DropForeignKey
ALTER TABLE "Thread" DROP CONSTRAINT "Thread_creatorId_fkey";

-- DropForeignKey
ALTER TABLE "Thread" DROP CONSTRAINT "Thread_forumId_fkey";

-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_schoolId_fkey";

-- DropForeignKey
ALTER TABLE "UserBadge" DROP CONSTRAINT "UserBadge_badgeId_fkey";

-- DropForeignKey
ALTER TABLE "UserBadge" DROP CONSTRAINT "UserBadge_userId_fkey";

-- DropForeignKey
ALTER TABLE "Version" DROP CONSTRAINT "Version_courseId_fkey";

-- DropForeignKey
ALTER TABLE "Video" DROP CONSTRAINT "Video_lectureId_fkey";

-- DropForeignKey
ALTER TABLE "_AssignmentToClass" DROP CONSTRAINT "_AssignmentToClass_A_fkey";

-- DropForeignKey
ALTER TABLE "_AssignmentToClass" DROP CONSTRAINT "_AssignmentToClass_B_fkey";

-- DropForeignKey
ALTER TABLE "_AssignmentToCourse" DROP CONSTRAINT "_AssignmentToCourse_A_fkey";

-- DropForeignKey
ALTER TABLE "_AssignmentToCourse" DROP CONSTRAINT "_AssignmentToCourse_B_fkey";

-- DropForeignKey
ALTER TABLE "_ClassToInstructor" DROP CONSTRAINT "_ClassToInstructor_A_fkey";

-- DropForeignKey
ALTER TABLE "_ClassToInstructor" DROP CONSTRAINT "_ClassToInstructor_B_fkey";

-- DropForeignKey
ALTER TABLE "audit_logs" DROP CONSTRAINT "audit_logs_userId_fkey";

-- DropForeignKey
ALTER TABLE "class_enrollments" DROP CONSTRAINT "class_enrollments_classId_fkey";

-- DropForeignKey
ALTER TABLE "class_enrollments" DROP CONSTRAINT "class_enrollments_studentId_fkey";

-- DropForeignKey
ALTER TABLE "classes" DROP CONSTRAINT "classes_academicPeriodId_fkey";

-- DropForeignKey
ALTER TABLE "classes" DROP CONSTRAINT "classes_schoolId_fkey";

-- DropForeignKey
ALTER TABLE "content_cache" DROP CONSTRAINT "content_cache_serverId_fkey";

-- DropForeignKey
ALTER TABLE "content_variants" DROP CONSTRAINT "content_variants_videoId_fkey";

-- DropForeignKey
ALTER TABLE "course_validations" DROP CONSTRAINT "course_validations_courseId_fkey";

-- DropForeignKey
ALTER TABLE "course_validations" DROP CONSTRAINT "course_validations_reviewerId_fkey";

-- DropForeignKey
ALTER TABLE "download_queue" DROP CONSTRAINT "download_queue_userId_fkey";

-- DropForeignKey
ALTER TABLE "grades" DROP CONSTRAINT "grades_assignmentId_fkey";

-- DropForeignKey
ALTER TABLE "grades" DROP CONSTRAINT "grades_classId_fkey";

-- DropForeignKey
ALTER TABLE "grades" DROP CONSTRAINT "grades_courseId_fkey";

-- DropForeignKey
ALTER TABLE "grades" DROP CONSTRAINT "grades_studentId_fkey";

-- DropForeignKey
ALTER TABLE "network_usage" DROP CONSTRAINT "network_usage_userId_fkey";

-- DropForeignKey
ALTER TABLE "notifications" DROP CONSTRAINT "notifications_userId_fkey";

-- DropForeignKey
ALTER TABLE "offline_content" DROP CONSTRAINT "offline_content_userId_fkey";

-- DropForeignKey
ALTER TABLE "offline_syncs" DROP CONSTRAINT "offline_syncs_userId_fkey";

-- DropForeignKey
ALTER TABLE "parent_students" DROP CONSTRAINT "parent_students_parentId_fkey";

-- DropForeignKey
ALTER TABLE "parent_students" DROP CONSTRAINT "parent_students_studentId_fkey";

-- DropForeignKey
ALTER TABLE "parents" DROP CONSTRAINT "parents_userId_fkey";

-- DropForeignKey
ALTER TABLE "school_servers" DROP CONSTRAINT "school_servers_schoolId_fkey";

-- DropForeignKey
ALTER TABLE "server_sync_logs" DROP CONSTRAINT "server_sync_logs_serverId_fkey";

-- DropForeignKey
ALTER TABLE "sessions" DROP CONSTRAINT "sessions_userId_fkey";

-- DropForeignKey
ALTER TABLE "students" DROP CONSTRAINT "students_userId_fkey";

-- DropForeignKey
ALTER TABLE "user_network_preferences" DROP CONSTRAINT "user_network_preferences_userId_fkey";

-- DropIndex
DROP INDEX "audit_logs_action_createdAt_idx";

-- DropIndex
DROP INDEX "audit_logs_entityType_entityId_idx";

-- DropIndex
DROP INDEX "audit_logs_userId_createdAt_idx";

-- DropIndex
DROP INDEX "class_enrollments_classId_studentId_key";

-- DropIndex
DROP INDEX "content_cache_contentType_contentId_idx";

-- DropIndex
DROP INDEX "content_cache_lastAccessedAt_idx";

-- DropIndex
DROP INDEX "content_cache_serverId_contentType_contentId_key";

-- DropIndex
DROP INDEX "content_cache_serverId_status_idx";

-- DropIndex
DROP INDEX "content_variants_contentType_contentId_idx";

-- DropIndex
DROP INDEX "content_variants_contentType_contentId_quality_key";

-- DropIndex
DROP INDEX "course_validations_courseId_reviewerId_key";

-- DropIndex
DROP INDEX "download_queue_scheduledFor_idx";

-- DropIndex
DROP INDEX "download_queue_userId_status_idx";

-- DropIndex
DROP INDEX "grades_classId_idx";

-- DropIndex
DROP INDEX "grades_courseId_idx";

-- DropIndex
DROP INDEX "grades_gradableType_gradableId_idx";

-- DropIndex
DROP INDEX "grades_studentId_idx";

-- DropIndex
DROP INDEX "network_usage_userId_date_idx";

-- DropIndex
DROP INDEX "network_usage_userId_deviceId_date_connectionType_key";

-- DropIndex
DROP INDEX "notifications_type_createdAt_idx";

-- DropIndex
DROP INDEX "notifications_userId_read_createdAt_idx";

-- DropIndex
DROP INDEX "offline_content_expiresAt_idx";

-- DropIndex
DROP INDEX "offline_content_lastAccessedAt_idx";

-- DropIndex
DROP INDEX "offline_content_userId_deviceId_contentType_contentId_key";

-- DropIndex
DROP INDEX "offline_content_userId_deviceId_idx";

-- DropIndex
DROP INDEX "offline_syncs_userId_deviceId_key";

-- DropIndex
DROP INDEX "parent_students_parentId_studentId_key";

-- DropIndex
DROP INDEX "parents_userId_key";

-- DropIndex
DROP INDEX "school_servers_schoolId_idx";

-- DropIndex
DROP INDEX "server_sync_logs_serverId_startedAt_idx";

-- DropIndex
DROP INDEX "sessions_sessionToken_key";

-- DropIndex
DROP INDEX "students_studentId_key";

-- DropIndex
DROP INDEX "students_userId_key";

-- DropIndex
DROP INDEX "user_network_preferences_userId_key";

-- AlterTable
ALTER TABLE "audit_logs" DROP COLUMN "createdAt",
DROP COLUMN "entityId",
DROP COLUMN "entityType",
DROP COLUMN "ipAddress",
DROP COLUMN "newValue",
DROP COLUMN "oldValue",
DROP COLUMN "userAgent",
DROP COLUMN "userId",
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "entity_id" TEXT NOT NULL,
ADD COLUMN     "entity_type" TEXT NOT NULL,
ADD COLUMN     "ip_address" TEXT,
ADD COLUMN     "new_value" JSONB,
ADD COLUMN     "old_value" JSONB,
ADD COLUMN     "user_agent" TEXT,
ADD COLUMN     "user_id" TEXT;

-- AlterTable
ALTER TABLE "class_enrollments" DROP COLUMN "classId",
DROP COLUMN "enrolledAt",
DROP COLUMN "studentId",
ADD COLUMN     "class_id" TEXT NOT NULL,
ADD COLUMN     "enrolled_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "student_id" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "classes" DROP COLUMN "academicPeriodId",
DROP COLUMN "degreeLevel",
DROP COLUMN "schoolId",
ADD COLUMN     "academic_period_id" TEXT NOT NULL,
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "degree_level" "DegreeLevel" NOT NULL,
ADD COLUMN     "school_id" TEXT NOT NULL,
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "content_cache" DROP COLUMN "accessCount",
DROP COLUMN "cachedAt",
DROP COLUMN "contentId",
DROP COLUMN "contentType",
DROP COLUMN "downloadProgress",
DROP COLUMN "expiresAt",
DROP COLUMN "lastAccessedAt",
DROP COLUMN "serverId",
DROP COLUMN "sizeInBytes",
ADD COLUMN     "access_count" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "cached_at" TIMESTAMP(3),
ADD COLUMN     "content_id" TEXT NOT NULL,
ADD COLUMN     "content_type" "CachedContentType" NOT NULL,
ADD COLUMN     "download_progress" DOUBLE PRECISION NOT NULL DEFAULT 0,
ADD COLUMN     "expires_at" TIMESTAMP(3),
ADD COLUMN     "last_accessed_at" TIMESTAMP(3),
ADD COLUMN     "server_id" TEXT NOT NULL,
ADD COLUMN     "size_in_bytes" BIGINT NOT NULL;

-- AlterTable
ALTER TABLE "content_variants" DROP COLUMN "contentId",
DROP COLUMN "contentType",
DROP COLUMN "createdAt",
DROP COLUMN "isDefault",
DROP COLUMN "recommendedFor",
DROP COLUMN "sizeFormatted",
DROP COLUMN "sizeInBytes",
DROP COLUMN "videoId",
ADD COLUMN     "content_id" TEXT NOT NULL,
ADD COLUMN     "content_type" TEXT NOT NULL,
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "is_default" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "recommended_for" "NetworkSpeed"[],
ADD COLUMN     "size_formatted" TEXT NOT NULL,
ADD COLUMN     "size_in_bytes" BIGINT NOT NULL,
ADD COLUMN     "video_id" TEXT;

-- AlterTable
ALTER TABLE "course_validations" DROP COLUMN "courseId",
DROP COLUMN "createdAt",
DROP COLUMN "feedback",
DROP COLUMN "reviewedAt",
DROP COLUMN "reviewerId",
ADD COLUMN     "course_id" TEXT NOT NULL,
ADD COLUMN     "feedback_text" TEXT,
ADD COLUMN     "reviewed_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "reviewer_id" TEXT NOT NULL,
ALTER COLUMN "status" DROP DEFAULT;

-- AlterTable
ALTER TABLE "download_queue" DROP COLUMN "completedAt",
DROP COLUMN "contentId",
DROP COLUMN "contentType",
DROP COLUMN "createdAt",
DROP COLUMN "deviceId",
DROP COLUMN "downloadedSize",
DROP COLUMN "estimatedSize",
DROP COLUMN "lastError",
DROP COLUMN "maxRetries",
DROP COLUMN "retryCount",
DROP COLUMN "scheduledFor",
DROP COLUMN "startedAt",
DROP COLUMN "updatedAt",
DROP COLUMN "userId",
DROP COLUMN "variantQuality",
DROP COLUMN "wifiOnly",
ADD COLUMN     "completed_at" TIMESTAMP(3),
ADD COLUMN     "content_id" TEXT NOT NULL,
ADD COLUMN     "content_type" TEXT NOT NULL,
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "device_id" TEXT NOT NULL,
ADD COLUMN     "downloaded_size" BIGINT NOT NULL DEFAULT 0,
ADD COLUMN     "estimated_size" BIGINT,
ADD COLUMN     "last_error" TEXT,
ADD COLUMN     "max_retries" INTEGER NOT NULL DEFAULT 3,
ADD COLUMN     "retry_count" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "scheduled_for" TIMESTAMP(3),
ADD COLUMN     "started_at" TIMESTAMP(3),
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "user_id" TEXT NOT NULL,
ADD COLUMN     "variant_quality" "ContentQuality" NOT NULL DEFAULT 'MEDIUM',
ADD COLUMN     "wifi_only" BOOLEAN NOT NULL DEFAULT true;

-- AlterTable
ALTER TABLE "grades" DROP COLUMN "academicPeriod",
DROP COLUMN "assignmentId",
DROP COLUMN "classId",
DROP COLUMN "courseId",
DROP COLUMN "gradableId",
DROP COLUMN "gradableType",
DROP COLUMN "gradedAt",
DROP COLUMN "gradedBy",
DROP COLUMN "letterGrade",
DROP COLUMN "maxScore",
DROP COLUMN "studentId",
ADD COLUMN     "academic_period" TEXT,
ADD COLUMN     "assignment_id" TEXT,
ADD COLUMN     "class_id" TEXT,
ADD COLUMN     "course_id" TEXT,
ADD COLUMN     "gradable_id" TEXT,
ADD COLUMN     "gradable_type" TEXT,
ADD COLUMN     "graded_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "graded_by" TEXT,
ADD COLUMN     "letter_grade" TEXT,
ADD COLUMN     "max_score" DECIMAL(65,30) NOT NULL,
ADD COLUMN     "student_id" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "network_usage" DROP COLUMN "connectionType",
DROP COLUMN "dataDownloaded",
DROP COLUMN "dataUploaded",
DROP COLUMN "deviceId",
DROP COLUMN "documentData",
DROP COLUMN "imageData",
DROP COLUMN "otherData",
DROP COLUMN "userId",
DROP COLUMN "videoData",
ADD COLUMN     "connection_type" "ConnectionType" NOT NULL,
ADD COLUMN     "data_downloaded" BIGINT NOT NULL DEFAULT 0,
ADD COLUMN     "data_uploaded" BIGINT NOT NULL DEFAULT 0,
ADD COLUMN     "device_id" TEXT NOT NULL,
ADD COLUMN     "document_data" BIGINT NOT NULL DEFAULT 0,
ADD COLUMN     "image_data" BIGINT NOT NULL DEFAULT 0,
ADD COLUMN     "other_data" BIGINT NOT NULL DEFAULT 0,
ADD COLUMN     "user_id" TEXT NOT NULL,
ADD COLUMN     "video_data" BIGINT NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "notifications" DROP COLUMN "actionUrl",
DROP COLUMN "createdAt",
DROP COLUMN "expiresAt",
DROP COLUMN "readAt",
DROP COLUMN "userId",
ADD COLUMN     "action_url" TEXT,
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "expires_at" TIMESTAMP(3),
ADD COLUMN     "read_at" TIMESTAMP(3),
ADD COLUMN     "user_id" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "offline_content" DROP COLUMN "accessCount",
DROP COLUMN "autoDelete",
DROP COLUMN "cloudVersion",
DROP COLUMN "contentId",
DROP COLUMN "contentType",
DROP COLUMN "deviceId",
DROP COLUMN "downloadedAt",
DROP COLUMN "expiresAt",
DROP COLUMN "lastAccessedAt",
DROP COLUMN "localPath",
DROP COLUMN "localVersion",
DROP COLUMN "needsUpdate",
DROP COLUMN "sizeInBytes",
DROP COLUMN "userId",
DROP COLUMN "variantQuality",
ADD COLUMN     "access_count" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "auto_delete" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "cloud_version" TEXT,
ADD COLUMN     "content_id" TEXT NOT NULL,
ADD COLUMN     "content_type" TEXT NOT NULL,
ADD COLUMN     "device_id" TEXT NOT NULL,
ADD COLUMN     "downloaded_at" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "expires_at" TIMESTAMP(3),
ADD COLUMN     "last_accessed_at" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "local_path" TEXT,
ADD COLUMN     "local_version" TEXT,
ADD COLUMN     "needs_update" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "size_in_bytes" BIGINT NOT NULL,
ADD COLUMN     "user_id" TEXT NOT NULL,
ADD COLUMN     "variant_quality" "ContentQuality";

-- AlterTable
ALTER TABLE "offline_syncs" DROP COLUMN "deviceId",
DROP COLUMN "lastSyncAt",
DROP COLUMN "pendingChanges",
DROP COLUMN "userId",
ADD COLUMN     "device_id" TEXT NOT NULL,
ADD COLUMN     "last_sync_at" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "pending_changes" JSONB,
ADD COLUMN     "user_id" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "parent_students" DROP COLUMN "isVerified",
DROP COLUMN "parentId",
DROP COLUMN "studentId",
ADD COLUMN     "is_verified" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "parent_id" TEXT NOT NULL,
ADD COLUMN     "student_id" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "parents" DROP COLUMN "userId",
ADD COLUMN     "user_id" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "school_servers" DROP COLUMN "canServeContent",
DROP COLUMN "createdAt",
DROP COLUMN "ipAddress",
DROP COLUMN "isMainServer",
DROP COLUMN "lastPingAt",
DROP COLUMN "lastSyncAt",
DROP COLUMN "macAddress",
DROP COLUMN "maxConcurrentUsers",
DROP COLUMN "nextSyncAt",
DROP COLUMN "schoolId",
DROP COLUMN "serverName",
DROP COLUMN "storageCapacity",
DROP COLUMN "storageUsed",
DROP COLUMN "syncSchedule",
DROP COLUMN "syncWithCloud",
DROP COLUMN "updatedAt",
ADD COLUMN     "can_serve_content" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "ip_address" TEXT,
ADD COLUMN     "is_main_server" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "last_ping_at" TIMESTAMP(3),
ADD COLUMN     "last_sync_at" TIMESTAMP(3),
ADD COLUMN     "mac_address" TEXT,
ADD COLUMN     "max_concurrent_users" INTEGER NOT NULL DEFAULT 100,
ADD COLUMN     "next_sync_at" TIMESTAMP(3),
ADD COLUMN     "school_id" TEXT,
ADD COLUMN     "server_name" TEXT NOT NULL,
ADD COLUMN     "storage_capacity" INTEGER NOT NULL,
ADD COLUMN     "storage_used" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "sync_schedule" TEXT,
ADD COLUMN     "sync_with_cloud" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "schools" DROP COLUMN "createdAt",
DROP COLUMN "updatedAt",
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "email" TEXT,
ADD COLUMN     "phone" TEXT,
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "server_sync_logs" DROP COLUMN "completedAt",
DROP COLUMN "itemsFailed",
DROP COLUMN "itemsSynced",
DROP COLUMN "serverId",
DROP COLUMN "startedAt",
DROP COLUMN "syncType",
DROP COLUMN "totalSize",
ADD COLUMN     "completed_at" TIMESTAMP(3),
ADD COLUMN     "items_failed" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "items_synced" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "server_id" TEXT NOT NULL,
ADD COLUMN     "started_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "sync_type" "SyncType" NOT NULL,
ADD COLUMN     "total_size" BIGINT NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "sessions" DROP COLUMN "sessionToken",
DROP COLUMN "userId",
ADD COLUMN     "session_token" TEXT NOT NULL,
ADD COLUMN     "user_id" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "students" DROP COLUMN "birthDate",
DROP COLUMN "gradeLevel",
DROP COLUMN "studentId",
DROP COLUMN "userId",
ADD COLUMN     "birth_date" TIMESTAMP(3),
ADD COLUMN     "grade_level" TEXT,
ADD COLUMN     "student_id" TEXT,
ADD COLUMN     "user_id" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "user_network_preferences" DROP COLUMN "autoDeleteWatched",
DROP COLUMN "autoDownload",
DROP COLUMN "cellularQuality",
DROP COLUMN "createdAt",
DROP COLUMN "keepDuration",
DROP COLUMN "maxDailyData",
DROP COLUMN "maxStorageGB",
DROP COLUMN "prioritizeArticles",
DROP COLUMN "prioritizeQuizzes",
DROP COLUMN "prioritizeVideos",
DROP COLUMN "syncSchedule",
DROP COLUMN "syncWindowEnd",
DROP COLUMN "syncWindowStart",
DROP COLUMN "updatedAt",
DROP COLUMN "userId",
DROP COLUMN "wifiOnlyDownload",
DROP COLUMN "wifiQuality",
ADD COLUMN     "auto_delete_watched" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "auto_download" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "cellular_quality" "ContentQuality" NOT NULL DEFAULT 'LOW',
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "keep_duration" INTEGER DEFAULT 30,
ADD COLUMN     "max_daily_data" INTEGER,
ADD COLUMN     "max_storage_gb" INTEGER,
ADD COLUMN     "prioritize_articles" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "prioritize_quizzes" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "prioritize_videos" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "sync_schedule" TEXT,
ADD COLUMN     "sync_window_end" INTEGER,
ADD COLUMN     "sync_window_start" INTEGER,
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "user_id" TEXT NOT NULL,
ADD COLUMN     "wifi_only_download" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "wifi_quality" "ContentQuality" NOT NULL DEFAULT 'HIGH';

-- DropTable
DROP TABLE "AcademicPeriod";

-- DropTable
DROP TABLE "Account";

-- DropTable
DROP TABLE "Admin";

-- DropTable
DROP TABLE "Announcement";

-- DropTable
DROP TABLE "Article";

-- DropTable
DROP TABLE "Assignment";

-- DropTable
DROP TABLE "AssignmentSubmission";

-- DropTable
DROP TABLE "Attendance";

-- DropTable
DROP TABLE "Badge";

-- DropTable
DROP TABLE "CalendarEvent";

-- DropTable
DROP TABLE "Category";

-- DropTable
DROP TABLE "Certificate";

-- DropTable
DROP TABLE "CodingExercise";

-- DropTable
DROP TABLE "CodingSubmission";

-- DropTable
DROP TABLE "Conversation";

-- DropTable
DROP TABLE "ConversationParticipant";

-- DropTable
DROP TABLE "Course";

-- DropTable
DROP TABLE "CourseEnrollment";

-- DropTable
DROP TABLE "FAQ";

-- DropTable
DROP TABLE "Forum";

-- DropTable
DROP TABLE "Instructor";

-- DropTable
DROP TABLE "InvitationCode";

-- DropTable
DROP TABLE "Lecture";

-- DropTable
DROP TABLE "LectureProgress";

-- DropTable
DROP TABLE "Message";

-- DropTable
DROP TABLE "MessageReadStatus";

-- DropTable
DROP TABLE "Note";

-- DropTable
DROP TABLE "ParentChildLink";

-- DropTable
DROP TABLE "Post";

-- DropTable
DROP TABLE "Project";

-- DropTable
DROP TABLE "PromoVideo";

-- DropTable
DROP TABLE "Question";

-- DropTable
DROP TABLE "Quiz";

-- DropTable
DROP TABLE "QuizAttempt";

-- DropTable
DROP TABLE "Report";

-- DropTable
DROP TABLE "Resource";

-- DropTable
DROP TABLE "Review";

-- DropTable
DROP TABLE "Section";

-- DropTable
DROP TABLE "Statistics";

-- DropTable
DROP TABLE "TeacherApproval";

-- DropTable
DROP TABLE "Thread";

-- DropTable
DROP TABLE "User";

-- DropTable
DROP TABLE "UserBadge";

-- DropTable
DROP TABLE "Version";

-- DropTable
DROP TABLE "Video";

-- DropTable
DROP TABLE "_AssignmentToClass";

-- DropTable
DROP TABLE "_AssignmentToCourse";

-- DropTable
DROP TABLE "_ClassToInstructor";

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "email" TEXT,
    "phone" TEXT,
    "first_name" TEXT NOT NULL,
    "last_name" TEXT NOT NULL,
    "email_verified" TIMESTAMP(3),
    "phone_verified" TIMESTAMP(3),
    "password" TEXT,
    "role" "UserRole" NOT NULL,
    "language_preference" "Language" NOT NULL DEFAULT 'FR',
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "last_login" TIMESTAMP(3),
    "failed_login_attempts" INTEGER NOT NULL DEFAULT 0,
    "locked_until" TIMESTAMP(3),
    "avatar" TEXT,
    "school_id" TEXT,
    "settings" JSONB DEFAULT '{}',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "last_login_at" TIMESTAMP(3),

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "accounts" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "provider_account_id" TEXT NOT NULL,
    "refresh_token" TEXT,
    "access_token" TEXT,
    "expires_at" INTEGER,
    "token_type" TEXT,
    "scope" TEXT,
    "id_token" TEXT,
    "session_state" TEXT,

    CONSTRAINT "accounts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "verification_tokens" (
    "identifier" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL
);

-- CreateTable
CREATE TABLE "pending_registrations" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "password_hash" TEXT NOT NULL,
    "role" "UserRole" NOT NULL,
    "school_id" TEXT NOT NULL,
    "otp_hash" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "pending_registrations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_relationships" (
    "id" TEXT NOT NULL,
    "parent_id" TEXT NOT NULL,
    "student_id" TEXT NOT NULL,
    "is_verified" BOOLEAN NOT NULL DEFAULT false,
    "verified_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "user_relationships_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "school_configs" (
    "id" TEXT NOT NULL,
    "school_id" TEXT NOT NULL,
    "allow_video_download" BOOLEAN NOT NULL DEFAULT true,
    "allow_pdf_download" BOOLEAN NOT NULL DEFAULT true,
    "allow_interactive_download" BOOLEAN NOT NULL DEFAULT true,
    "sync_frequency_hours" INTEGER NOT NULL DEFAULT 24,
    "max_download_size_mb" INTEGER NOT NULL DEFAULT 100,
    "otp_enabled" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "school_configs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "academic_years" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "start_date" TIMESTAMP(3) NOT NULL,
    "end_date" TIMESTAMP(3) NOT NULL,
    "school_id" TEXT NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "academic_years_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "subjects" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "school_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "subjects_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "course_enrollments" (
    "id" TEXT NOT NULL,
    "enrolled_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "last_accessed_at" TIMESTAMP(3),
    "progress_percentage" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "completed_lectures" INTEGER NOT NULL DEFAULT 0,
    "total_time_spent" INTEGER NOT NULL DEFAULT 0,
    "certificate_earned" BOOLEAN NOT NULL DEFAULT false,
    "course_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "student_id" TEXT,
    "current_lecture_id" TEXT,

    CONSTRAINT "course_enrollments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "class_schedules" (
    "id" TEXT NOT NULL,
    "class_id" TEXT NOT NULL,
    "teacher_id" TEXT NOT NULL,
    "day_of_week" "DayOfWeek" NOT NULL,
    "planned_start_time" TEXT NOT NULL,
    "planned_duration" INTEGER NOT NULL,
    "actual_start_time" TEXT,
    "actual_duration" INTEGER,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "class_schedules_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "courses" (
    "id" TEXT NOT NULL,
    "uuid" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "subtitle" TEXT,
    "description" TEXT,
    "language" "Language" NOT NULL DEFAULT 'FR',
    "level" "CourseLevel" NOT NULL,
    "published_at" TIMESTAMP(3),
    "last_updated_at" TIMESTAMP(3) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "category_id" TEXT NOT NULL,
    "instructor_id" TEXT NOT NULL,
    "school_id" TEXT,
    "subject_id" TEXT,
    "course_type" "CourseType" NOT NULL DEFAULT 'HYBRID',
    "status" "CourseStatus" NOT NULL DEFAULT 'DRAFT',
    "is_public" BOOLEAN NOT NULL DEFAULT false,
    "requires_online" BOOLEAN NOT NULL DEFAULT false,
    "features" TEXT[],
    "requirements" TEXT[],
    "target_audience" TEXT[],
    "learning_objectives" TEXT[],
    "tags" TEXT[],
    "captions" JSONB,
    "total_size_bytes" BIGINT,
    "offline_available" BOOLEAN NOT NULL DEFAULT true,
    "download_priority" INTEGER NOT NULL DEFAULT 5,
    "estimated_data_usage" TEXT,

    CONSTRAINT "courses_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "course_content" (
    "id" TEXT NOT NULL,
    "course_id" TEXT NOT NULL,
    "content_order" INTEGER NOT NULL,
    "content_type" "ContentType" NOT NULL,
    "title" TEXT NOT NULL,
    "content_data" JSONB NOT NULL,
    "appears_after_seconds" INTEGER,
    "disappears_after_seconds" INTEGER,
    "file_reference" TEXT,
    "offline_available" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "course_content_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "content_versions" (
    "id" TEXT NOT NULL,
    "course_id" TEXT NOT NULL,
    "version" INTEGER NOT NULL,
    "content" JSONB NOT NULL,
    "changes" TEXT,
    "created_by" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "content_versions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "course_assignments" (
    "id" TEXT NOT NULL,
    "course_id" TEXT NOT NULL,
    "student_id" TEXT,
    "class_id" TEXT,
    "assigned_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "due_date" TIMESTAMP(3),

    CONSTRAINT "course_assignments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "course_progress" (
    "id" TEXT NOT NULL,
    "student_id" TEXT NOT NULL,
    "course_id" TEXT NOT NULL,
    "completion_percentage" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "time_spent_minutes" INTEGER NOT NULL DEFAULT 0,
    "last_accessed" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "current_module" TEXT,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "course_progress_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sections" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "order" INTEGER NOT NULL,
    "total_lectures" INTEGER NOT NULL DEFAULT 0,
    "total_duration" INTEGER NOT NULL DEFAULT 0,
    "duration_formatted" TEXT,
    "course_id" TEXT NOT NULL,

    CONSTRAINT "sections_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "lectures" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "type" "LectureType" NOT NULL,
    "order" INTEGER NOT NULL,
    "duration" INTEGER,
    "duration_formatted" TEXT,
    "is_preview" BOOLEAN NOT NULL DEFAULT false,
    "is_free" BOOLEAN NOT NULL DEFAULT true,
    "download_priority" INTEGER,
    "section_id" TEXT NOT NULL,
    "size_bytes" BIGINT,
    "estimated_data_usage" TEXT,
    "offline_available" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "lectures_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "articles" (
    "id" TEXT NOT NULL,
    "content" TEXT,
    "content_html" TEXT,
    "estimated_reading_time" INTEGER,
    "word_count" INTEGER,
    "images" JSONB,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "lecture_id" TEXT NOT NULL,

    CONSTRAINT "articles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "videos" (
    "id" TEXT NOT NULL,
    "version_id" TEXT,
    "version" INTEGER DEFAULT 1,
    "sources" JSONB,
    "hls_url" TEXT,
    "dash_url" TEXT,
    "thumbnail" TEXT,
    "thumbnail_sprite" TEXT,
    "captions" JSONB,
    "uploaded_at" TIMESTAMP(3),
    "processed_at" TIMESTAMP(3),
    "status" "VideoStatus" NOT NULL DEFAULT 'PROCESSING',
    "update_notes" TEXT,
    "lecture_id" TEXT NOT NULL,
    "default_quality" "ContentQuality" NOT NULL DEFAULT 'MEDIUM',
    "offline_optimized" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "videos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "resources" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "type" "ResourceType" NOT NULL,
    "file_size" INTEGER,
    "file_size_formatted" TEXT,
    "url" TEXT NOT NULL,
    "downloadable" BOOLEAN NOT NULL DEFAULT true,
    "lecture_id" TEXT NOT NULL,

    CONSTRAINT "resources_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "quizzes" (
    "id" TEXT NOT NULL,
    "course_content_id" TEXT,
    "lecture_id" TEXT,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "passing_score" DOUBLE PRECISION NOT NULL DEFAULT 70,
    "time_limit" INTEGER,
    "mode" "QuizMode" NOT NULL DEFAULT 'PRACTICE',
    "show_answers_after" BOOLEAN NOT NULL DEFAULT true,
    "randomize_questions" BOOLEAN NOT NULL DEFAULT false,
    "status" "QuizStatus" NOT NULL DEFAULT 'DRAFT',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "attempts_allowed" INTEGER DEFAULT 3,
    "shuffle_questions" BOOLEAN NOT NULL DEFAULT false,
    "shuffle_answers" BOOLEAN NOT NULL DEFAULT false,
    "question_count" INTEGER DEFAULT 0,

    CONSTRAINT "quizzes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "questions" (
    "id" TEXT NOT NULL,
    "quiz_id" TEXT NOT NULL,
    "question_type" "QuestionType" NOT NULL,
    "text" TEXT NOT NULL,
    "explanation" TEXT,
    "order" INTEGER NOT NULL,
    "points" DOUBLE PRECISION NOT NULL DEFAULT 1,
    "options" JSONB NOT NULL,
    "correct_answer" JSONB NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "questions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "question_responses" (
    "id" TEXT NOT NULL,
    "question_id" TEXT NOT NULL,
    "submission_id" TEXT NOT NULL,
    "student_answer" JSONB NOT NULL,
    "is_correct" BOOLEAN,
    "points_earned" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "question_responses_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "quiz_submissions" (
    "id" TEXT NOT NULL,
    "quiz_id" TEXT NOT NULL,
    "student_id" TEXT NOT NULL,
    "attempt_number" INTEGER NOT NULL DEFAULT 1,
    "started_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "submitted_at" TIMESTAMP(3),
    "score" DOUBLE PRECISION,
    "total_points" DOUBLE PRECISION,
    "time_spent" INTEGER,
    "status" "QuizAttemptStatus" NOT NULL DEFAULT 'IN_PROGRESS',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "quiz_submissions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "quiz_attempts" (
    "id" TEXT NOT NULL,
    "quiz_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "attempt_number" INTEGER NOT NULL,
    "started_at" TIMESTAMP(3),
    "submitted_at" TIMESTAMP(3),
    "score" DOUBLE PRECISION,
    "points_earned" INTEGER,
    "points_possible" INTEGER,
    "percentage" DOUBLE PRECISION,
    "passed" BOOLEAN,
    "time_spent" INTEGER,
    "answers" JSONB,
    "student_id" TEXT,

    CONSTRAINT "quiz_attempts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "quiz_assignments" (
    "id" TEXT NOT NULL,
    "quiz_id" TEXT NOT NULL,
    "class_id" TEXT,
    "student_id" TEXT,
    "assigned_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "due_date" TIMESTAMP(3),
    "scheduled_date" TIMESTAMP(3),

    CONSTRAINT "quiz_assignments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "submissions" (
    "id" TEXT NOT NULL,
    "student_id" TEXT NOT NULL,
    "course_content_id" TEXT NOT NULL,
    "submitted_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "content" JSONB,
    "grade" DOUBLE PRECISION,
    "graded_by_id" TEXT,
    "graded_at" TIMESTAMP(3),
    "feedback" TEXT,
    "status" "SubmissionStatus" NOT NULL DEFAULT 'SUBMITTED',

    CONSTRAINT "submissions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "assignments" (
    "id" TEXT NOT NULL,
    "title" TEXT,
    "description" TEXT,
    "instructions" TEXT,
    "allowed_file_types" TEXT[],
    "max_file_size" INTEGER,
    "due_date" TIMESTAMP(3),
    "rubric" JSONB,
    "lecture_id" TEXT NOT NULL,
    "course_id" TEXT,
    "class_id" TEXT,

    CONSTRAINT "assignments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "assignment_submissions" (
    "id" TEXT NOT NULL,
    "files" JSONB,
    "submitted_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "grade" DOUBLE PRECISION,
    "feedback" TEXT,
    "status" "SubmissionStatus" NOT NULL DEFAULT 'SUBMITTED',
    "assignment_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "student_id" TEXT,

    CONSTRAINT "assignment_submissions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "coding_exercises" (
    "id" TEXT NOT NULL,
    "title" TEXT,
    "instructions" TEXT,
    "starter_code" TEXT,
    "language" TEXT,
    "expected_output" TEXT,
    "test_cases" JSONB,
    "hints" TEXT[],
    "solution" TEXT,
    "allow_submission" BOOLEAN NOT NULL DEFAULT true,
    "max_submissions" INTEGER,
    "lecture_id" TEXT NOT NULL,

    CONSTRAINT "coding_exercises_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "coding_submissions" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "submitted_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "tests_passed" INTEGER NOT NULL DEFAULT 0,
    "tests_total" INTEGER NOT NULL DEFAULT 0,
    "passed" BOOLEAN NOT NULL DEFAULT false,
    "output" TEXT,
    "error" TEXT,
    "coding_exercise_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "student_id" TEXT,

    CONSTRAINT "coding_submissions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "parent_instructions" (
    "id" TEXT NOT NULL,
    "teacher_id" TEXT NOT NULL,
    "student_id" TEXT NOT NULL,
    "instruction_text" TEXT NOT NULL,
    "is_urgent" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expires_at" TIMESTAMP(3),

    CONSTRAINT "parent_instructions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "parent_instruction_completions" (
    "id" TEXT NOT NULL,
    "instruction_id" TEXT NOT NULL,
    "parent_id" TEXT NOT NULL,
    "completed_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "status" "InstructionStatus" NOT NULL DEFAULT 'COMPLETED',
    "notes" TEXT,

    CONSTRAINT "parent_instruction_completions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "parent_child_links" (
    "id" TEXT NOT NULL,
    "parent_id" TEXT NOT NULL,
    "student_id" TEXT NOT NULL,
    "status" "ApprovalStatus" NOT NULL DEFAULT 'PENDING',
    "approved_by" TEXT,
    "rejected_by" TEXT,
    "reason" TEXT,
    "requested_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "reviewed_at" TIMESTAMP(3),

    CONSTRAINT "parent_child_links_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "admins" (
    "id" TEXT NOT NULL,
    "role" "AdminRole" NOT NULL,
    "permissions" JSONB,
    "user_id" TEXT NOT NULL,

    CONSTRAINT "admins_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "instructors" (
    "id" TEXT NOT NULL,
    "title" TEXT,
    "biography" TEXT,
    "rating" DOUBLE PRECISION,
    "total_students" INTEGER DEFAULT 0,
    "total_courses" INTEGER DEFAULT 0,
    "website" TEXT,
    "social" JSONB,
    "user_id" TEXT NOT NULL,
    "config" JSONB,

    CONSTRAINT "instructors_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "attendances" (
    "id" TEXT NOT NULL,
    "student_id" TEXT NOT NULL,
    "class_id" TEXT NOT NULL,
    "date" DATE NOT NULL,
    "status" "AttendanceStatus" NOT NULL DEFAULT 'ABSENT',
    "notes" TEXT,
    "recorded_by_id" TEXT NOT NULL,

    CONSTRAINT "attendances_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "calendar_events" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "start_time" TIMESTAMP(3) NOT NULL,
    "end_time" TIMESTAMP(3) NOT NULL,
    "is_all_day" BOOLEAN NOT NULL DEFAULT false,
    "type" "EventType" NOT NULL,
    "school_id" TEXT,
    "class_id" TEXT,
    "user_id" TEXT,

    CONSTRAINT "calendar_events_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "reports" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" "ReportType" NOT NULL,
    "generated_by" TEXT NOT NULL,
    "generated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "parameters" JSONB,
    "data" JSONB NOT NULL,
    "format" TEXT NOT NULL DEFAULT 'JSON',

    CONSTRAINT "reports_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "announcements" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "author_id" TEXT NOT NULL,
    "school_id" TEXT,
    "target_role" "UserRole",
    "expires_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "announcements_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "forums" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "course_id" TEXT,
    "class_id" TEXT,

    CONSTRAINT "forums_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "threads" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "forum_id" TEXT NOT NULL,
    "creator_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "threads_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "posts" (
    "id" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "thread_id" TEXT NOT NULL,
    "author_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "posts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "conversations" (
    "id" TEXT NOT NULL,
    "name" TEXT,
    "is_group" BOOLEAN NOT NULL DEFAULT false,
    "creator_id" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "context_type" "ConversationContext",
    "course_id" TEXT,
    "lecture_id" TEXT,

    CONSTRAINT "conversations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "conversation_participants" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "conversation_id" TEXT NOT NULL,
    "joined_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "is_admin" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "conversation_participants_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "messages" (
    "id" TEXT NOT NULL,
    "conversation_id" TEXT NOT NULL,
    "sender_id" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "messages_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "message_read_statuses" (
    "id" TEXT NOT NULL,
    "message_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "read_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "message_read_statuses_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "badges" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "image_url" TEXT NOT NULL,
    "criteria" JSONB NOT NULL,

    CONSTRAINT "badges_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_badges" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "badge_id" TEXT NOT NULL,
    "earned_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "user_badges_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "categories" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "parent_id" TEXT,

    CONSTRAINT "categories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "certificates" (
    "id" TEXT NOT NULL,
    "available" BOOLEAN NOT NULL DEFAULT false,
    "completion_percentage" INTEGER DEFAULT 100,
    "quizzes_required" BOOLEAN NOT NULL DEFAULT true,
    "minimum_quiz_score" INTEGER DEFAULT 70,
    "course_id" TEXT NOT NULL,

    CONSTRAINT "certificates_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "faqs" (
    "id" TEXT NOT NULL,
    "question" TEXT NOT NULL,
    "answer" TEXT NOT NULL,
    "helpful" INTEGER NOT NULL DEFAULT 0,
    "not_helpful" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "course_id" TEXT NOT NULL,

    CONSTRAINT "faqs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "invitation_codes" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "role" "InvitationCodeRole" NOT NULL,
    "school_id" TEXT NOT NULL,
    "created_by" TEXT NOT NULL,
    "used_by" TEXT,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "expires_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "used_at" TIMESTAMP(3),

    CONSTRAINT "invitation_codes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "lecture_progress" (
    "id" TEXT NOT NULL,
    "completed" BOOLEAN NOT NULL DEFAULT false,
    "completed_at" TIMESTAMP(3),
    "last_activity_at" TIMESTAMP(3),
    "last_position" INTEGER DEFAULT 0,
    "watched_percentage" DOUBLE PRECISION DEFAULT 0,
    "attempts" INTEGER DEFAULT 0,
    "best_score" DOUBLE PRECISION DEFAULT 0,
    "passed" BOOLEAN DEFAULT false,
    "lecture_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "student_id" TEXT,

    CONSTRAINT "lecture_progress_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "notes" (
    "id" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "timestamp" INTEGER,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "lecture_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "student_id" TEXT,

    CONSTRAINT "notes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "projects" (
    "id" TEXT NOT NULL,
    "title" TEXT,
    "description" TEXT,
    "complexity" TEXT,
    "technologies" TEXT[],
    "learning_objectives" TEXT[],
    "milestones" JSONB,
    "submission" JSONB,
    "lecture_id" TEXT NOT NULL,

    CONSTRAINT "projects_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "promo_videos" (
    "id" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "duration" INTEGER,
    "thumbnail" TEXT,
    "course_id" TEXT NOT NULL,

    CONSTRAINT "promo_videos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "reviews" (
    "id" TEXT NOT NULL,
    "rating" INTEGER NOT NULL,
    "title" TEXT,
    "content" TEXT,
    "helpful" INTEGER NOT NULL DEFAULT 0,
    "not_helpful" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "course_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,

    CONSTRAINT "reviews_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "statistics" (
    "id" TEXT NOT NULL,
    "total_sections" INTEGER NOT NULL DEFAULT 0,
    "total_lectures" INTEGER NOT NULL DEFAULT 0,
    "total_quizzes" INTEGER NOT NULL DEFAULT 0,
    "total_assignments" INTEGER NOT NULL DEFAULT 0,
    "total_articles" INTEGER NOT NULL DEFAULT 0,
    "total_downloadable_resources" INTEGER NOT NULL DEFAULT 0,
    "total_duration" INTEGER NOT NULL DEFAULT 0,
    "total_duration_formatted" TEXT,
    "total_students" INTEGER NOT NULL DEFAULT 0,
    "total_reviews" INTEGER NOT NULL DEFAULT 0,
    "average_rating" DOUBLE PRECISION DEFAULT 0,
    "rating_distribution" JSONB,
    "completion_rate" DOUBLE PRECISION DEFAULT 0,
    "last_month_enrollments" INTEGER NOT NULL DEFAULT 0,
    "course_id" TEXT NOT NULL,

    CONSTRAINT "statistics_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "teacher_approvals" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "school_id" TEXT NOT NULL,
    "status" "ApprovalStatus" NOT NULL DEFAULT 'PENDING',
    "approved_by" TEXT,
    "rejected_by" TEXT,
    "reason" TEXT,
    "requested_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "reviewed_at" TIMESTAMP(3),

    CONSTRAINT "teacher_approvals_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "versions" (
    "id" TEXT NOT NULL,
    "current" TEXT NOT NULL,
    "published_versions" TEXT[],
    "course_id" TEXT NOT NULL,

    CONSTRAINT "versions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_ClassStudents" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_ClassStudents_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "_ClassInstructors" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_ClassInstructors_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "users_phone_key" ON "users"("phone");

-- CreateIndex
CREATE INDEX "User_email_index" ON "users"("email");

-- CreateIndex
CREATE INDEX "User_phone_index" ON "users"("phone");

-- CreateIndex
CREATE INDEX "User_school_id_index" ON "users"("school_id");

-- CreateIndex
CREATE INDEX "User_role_index" ON "users"("role");

-- CreateIndex
CREATE INDEX "accounts_user_id_idx" ON "accounts"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "accounts_provider_provider_account_id_key" ON "accounts"("provider", "provider_account_id");

-- CreateIndex
CREATE UNIQUE INDEX "verification_tokens_token_key" ON "verification_tokens"("token");

-- CreateIndex
CREATE UNIQUE INDEX "verification_tokens_identifier_token_key" ON "verification_tokens"("identifier", "token");

-- CreateIndex
CREATE UNIQUE INDEX "pending_registrations_email_key" ON "pending_registrations"("email");

-- CreateIndex
CREATE INDEX "pending_registrations_email_idx" ON "pending_registrations"("email");

-- CreateIndex
CREATE INDEX "user_relationships_parent_id_idx" ON "user_relationships"("parent_id");

-- CreateIndex
CREATE INDEX "user_relationships_student_id_idx" ON "user_relationships"("student_id");

-- CreateIndex
CREATE UNIQUE INDEX "user_relationships_parent_id_student_id_key" ON "user_relationships"("parent_id", "student_id");

-- CreateIndex
CREATE UNIQUE INDEX "school_configs_school_id_key" ON "school_configs"("school_id");

-- CreateIndex
CREATE INDEX "academic_years_school_id_idx" ON "academic_years"("school_id");

-- CreateIndex
CREATE UNIQUE INDEX "academic_years_school_id_name_key" ON "academic_years"("school_id", "name");

-- CreateIndex
CREATE INDEX "subjects_school_id_idx" ON "subjects"("school_id");

-- CreateIndex
CREATE UNIQUE INDEX "subjects_school_id_name_key" ON "subjects"("school_id", "name");

-- CreateIndex
CREATE INDEX "course_enrollments_user_id_idx" ON "course_enrollments"("user_id");

-- CreateIndex
CREATE INDEX "course_enrollments_course_id_idx" ON "course_enrollments"("course_id");

-- CreateIndex
CREATE UNIQUE INDEX "course_enrollments_course_id_user_id_key" ON "course_enrollments"("course_id", "user_id");

-- CreateIndex
CREATE INDEX "class_schedules_class_id_idx" ON "class_schedules"("class_id");

-- CreateIndex
CREATE INDEX "class_schedules_teacher_id_idx" ON "class_schedules"("teacher_id");

-- CreateIndex
CREATE INDEX "class_schedules_day_of_week_idx" ON "class_schedules"("day_of_week");

-- CreateIndex
CREATE UNIQUE INDEX "class_schedules_class_id_day_of_week_key" ON "class_schedules"("class_id", "day_of_week");

-- CreateIndex
CREATE UNIQUE INDEX "courses_uuid_key" ON "courses"("uuid");

-- CreateIndex
CREATE UNIQUE INDEX "courses_slug_key" ON "courses"("slug");

-- CreateIndex
CREATE INDEX "courses_status_idx" ON "courses"("status");

-- CreateIndex
CREATE INDEX "courses_instructor_id_idx" ON "courses"("instructor_id");

-- CreateIndex
CREATE INDEX "courses_published_at_idx" ON "courses"("published_at");

-- CreateIndex
CREATE INDEX "courses_slug_idx" ON "courses"("slug");

-- CreateIndex
CREATE INDEX "course_content_course_id_content_order_idx" ON "course_content"("course_id", "content_order");

-- CreateIndex
CREATE INDEX "content_versions_course_id_idx" ON "content_versions"("course_id");

-- CreateIndex
CREATE UNIQUE INDEX "content_versions_course_id_version_key" ON "content_versions"("course_id", "version");

-- CreateIndex
CREATE INDEX "course_assignments_course_id_idx" ON "course_assignments"("course_id");

-- CreateIndex
CREATE INDEX "course_assignments_student_id_idx" ON "course_assignments"("student_id");

-- CreateIndex
CREATE INDEX "course_assignments_class_id_idx" ON "course_assignments"("class_id");

-- CreateIndex
CREATE INDEX "course_progress_student_id_idx" ON "course_progress"("student_id");

-- CreateIndex
CREATE INDEX "course_progress_course_id_idx" ON "course_progress"("course_id");

-- CreateIndex
CREATE UNIQUE INDEX "course_progress_student_id_course_id_key" ON "course_progress"("student_id", "course_id");

-- CreateIndex
CREATE INDEX "sections_course_id_order_idx" ON "sections"("course_id", "order");

-- CreateIndex
CREATE INDEX "lectures_section_id_order_idx" ON "lectures"("section_id", "order");

-- CreateIndex
CREATE INDEX "lectures_type_idx" ON "lectures"("type");

-- CreateIndex
CREATE UNIQUE INDEX "articles_lecture_id_key" ON "articles"("lecture_id");

-- CreateIndex
CREATE UNIQUE INDEX "videos_lecture_id_key" ON "videos"("lecture_id");

-- CreateIndex
CREATE INDEX "resources_lecture_id_idx" ON "resources"("lecture_id");

-- CreateIndex
CREATE UNIQUE INDEX "quizzes_course_content_id_key" ON "quizzes"("course_content_id");

-- CreateIndex
CREATE UNIQUE INDEX "quizzes_lecture_id_key" ON "quizzes"("lecture_id");

-- CreateIndex
CREATE INDEX "quizzes_status_idx" ON "quizzes"("status");

-- CreateIndex
CREATE INDEX "questions_quiz_id_order_idx" ON "questions"("quiz_id", "order");

-- CreateIndex
CREATE INDEX "question_responses_question_id_submission_id_idx" ON "question_responses"("question_id", "submission_id");

-- CreateIndex
CREATE UNIQUE INDEX "question_responses_question_id_submission_id_key" ON "question_responses"("question_id", "submission_id");

-- CreateIndex
CREATE INDEX "quiz_submissions_quiz_id_idx" ON "quiz_submissions"("quiz_id");

-- CreateIndex
CREATE INDEX "quiz_submissions_student_id_idx" ON "quiz_submissions"("student_id");

-- CreateIndex
CREATE INDEX "quiz_submissions_status_idx" ON "quiz_submissions"("status");

-- CreateIndex
CREATE UNIQUE INDEX "quiz_submissions_quiz_id_student_id_attempt_number_key" ON "quiz_submissions"("quiz_id", "student_id", "attempt_number");

-- CreateIndex
CREATE INDEX "quiz_attempts_quiz_id_user_id_idx" ON "quiz_attempts"("quiz_id", "user_id");

-- CreateIndex
CREATE INDEX "quiz_attempts_submitted_at_idx" ON "quiz_attempts"("submitted_at");

-- CreateIndex
CREATE UNIQUE INDEX "quiz_attempts_quiz_id_user_id_attempt_number_key" ON "quiz_attempts"("quiz_id", "user_id", "attempt_number");

-- CreateIndex
CREATE INDEX "quiz_assignments_quiz_id_idx" ON "quiz_assignments"("quiz_id");

-- CreateIndex
CREATE INDEX "quiz_assignments_class_id_idx" ON "quiz_assignments"("class_id");

-- CreateIndex
CREATE INDEX "quiz_assignments_student_id_idx" ON "quiz_assignments"("student_id");

-- CreateIndex
CREATE INDEX "submissions_student_id_idx" ON "submissions"("student_id");

-- CreateIndex
CREATE INDEX "submissions_course_content_id_idx" ON "submissions"("course_content_id");

-- CreateIndex
CREATE INDEX "submissions_graded_by_id_idx" ON "submissions"("graded_by_id");

-- CreateIndex
CREATE UNIQUE INDEX "submissions_student_id_course_content_id_key" ON "submissions"("student_id", "course_content_id");

-- CreateIndex
CREATE UNIQUE INDEX "assignments_lecture_id_key" ON "assignments"("lecture_id");

-- CreateIndex
CREATE INDEX "assignment_submissions_assignment_id_user_id_idx" ON "assignment_submissions"("assignment_id", "user_id");

-- CreateIndex
CREATE UNIQUE INDEX "assignment_submissions_assignment_id_user_id_key" ON "assignment_submissions"("assignment_id", "user_id");

-- CreateIndex
CREATE UNIQUE INDEX "coding_exercises_lecture_id_key" ON "coding_exercises"("lecture_id");

-- CreateIndex
CREATE INDEX "coding_submissions_coding_exercise_id_user_id_idx" ON "coding_submissions"("coding_exercise_id", "user_id");

-- CreateIndex
CREATE INDEX "coding_submissions_submitted_at_idx" ON "coding_submissions"("submitted_at");

-- CreateIndex
CREATE UNIQUE INDEX "coding_submissions_coding_exercise_id_user_id_key" ON "coding_submissions"("coding_exercise_id", "user_id");

-- CreateIndex
CREATE INDEX "parent_instructions_teacher_id_idx" ON "parent_instructions"("teacher_id");

-- CreateIndex
CREATE INDEX "parent_instructions_student_id_idx" ON "parent_instructions"("student_id");

-- CreateIndex
CREATE INDEX "parent_instructions_created_at_idx" ON "parent_instructions"("created_at");

-- CreateIndex
CREATE INDEX "parent_instruction_completions_instruction_id_idx" ON "parent_instruction_completions"("instruction_id");

-- CreateIndex
CREATE INDEX "parent_instruction_completions_parent_id_idx" ON "parent_instruction_completions"("parent_id");

-- CreateIndex
CREATE UNIQUE INDEX "parent_instruction_completions_instruction_id_parent_id_key" ON "parent_instruction_completions"("instruction_id", "parent_id");

-- CreateIndex
CREATE INDEX "parent_child_links_parent_id_idx" ON "parent_child_links"("parent_id");

-- CreateIndex
CREATE INDEX "parent_child_links_status_idx" ON "parent_child_links"("status");

-- CreateIndex
CREATE INDEX "parent_child_links_student_id_idx" ON "parent_child_links"("student_id");

-- CreateIndex
CREATE UNIQUE INDEX "parent_child_links_parent_id_student_id_key" ON "parent_child_links"("parent_id", "student_id");

-- CreateIndex
CREATE UNIQUE INDEX "admins_user_id_key" ON "admins"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "instructors_user_id_key" ON "instructors"("user_id");

-- CreateIndex
CREATE INDEX "attendances_student_id_idx" ON "attendances"("student_id");

-- CreateIndex
CREATE INDEX "attendances_class_id_idx" ON "attendances"("class_id");

-- CreateIndex
CREATE INDEX "attendances_recorded_by_id_idx" ON "attendances"("recorded_by_id");

-- CreateIndex
CREATE UNIQUE INDEX "attendances_student_id_class_id_date_key" ON "attendances"("student_id", "class_id", "date");

-- CreateIndex
CREATE INDEX "calendar_events_school_id_start_time_idx" ON "calendar_events"("school_id", "start_time");

-- CreateIndex
CREATE INDEX "calendar_events_class_id_start_time_idx" ON "calendar_events"("class_id", "start_time");

-- CreateIndex
CREATE INDEX "reports_type_generated_at_idx" ON "reports"("type", "generated_at");

-- CreateIndex
CREATE INDEX "announcements_school_id_created_at_idx" ON "announcements"("school_id", "created_at");

-- CreateIndex
CREATE INDEX "conversations_course_id_idx" ON "conversations"("course_id");

-- CreateIndex
CREATE INDEX "conversations_creator_id_idx" ON "conversations"("creator_id");

-- CreateIndex
CREATE INDEX "conversations_lecture_id_idx" ON "conversations"("lecture_id");

-- CreateIndex
CREATE INDEX "conversation_participants_conversation_id_idx" ON "conversation_participants"("conversation_id");

-- CreateIndex
CREATE INDEX "conversation_participants_user_id_idx" ON "conversation_participants"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "conversation_participants_user_id_conversation_id_key" ON "conversation_participants"("user_id", "conversation_id");

-- CreateIndex
CREATE INDEX "messages_conversation_id_idx" ON "messages"("conversation_id");

-- CreateIndex
CREATE INDEX "messages_sender_id_idx" ON "messages"("sender_id");

-- CreateIndex
CREATE INDEX "message_read_statuses_message_id_idx" ON "message_read_statuses"("message_id");

-- CreateIndex
CREATE INDEX "message_read_statuses_user_id_idx" ON "message_read_statuses"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "message_read_statuses_message_id_user_id_key" ON "message_read_statuses"("message_id", "user_id");

-- CreateIndex
CREATE UNIQUE INDEX "badges_name_key" ON "badges"("name");

-- CreateIndex
CREATE UNIQUE INDEX "user_badges_user_id_badge_id_key" ON "user_badges"("user_id", "badge_id");

-- CreateIndex
CREATE UNIQUE INDEX "categories_name_parent_id_key" ON "categories"("name", "parent_id");

-- CreateIndex
CREATE UNIQUE INDEX "certificates_course_id_key" ON "certificates"("course_id");

-- CreateIndex
CREATE INDEX "faqs_course_id_idx" ON "faqs"("course_id");

-- CreateIndex
CREATE UNIQUE INDEX "invitation_codes_code_key" ON "invitation_codes"("code");

-- CreateIndex
CREATE UNIQUE INDEX "invitation_codes_used_by_key" ON "invitation_codes"("used_by");

-- CreateIndex
CREATE INDEX "invitation_codes_code_idx" ON "invitation_codes"("code");

-- CreateIndex
CREATE INDEX "invitation_codes_is_active_idx" ON "invitation_codes"("is_active");

-- CreateIndex
CREATE INDEX "invitation_codes_school_id_idx" ON "invitation_codes"("school_id");

-- CreateIndex
CREATE INDEX "lecture_progress_lecture_id_idx" ON "lecture_progress"("lecture_id");

-- CreateIndex
CREATE INDEX "lecture_progress_user_id_idx" ON "lecture_progress"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "lecture_progress_lecture_id_user_id_key" ON "lecture_progress"("lecture_id", "user_id");

-- CreateIndex
CREATE INDEX "notes_lecture_id_user_id_idx" ON "notes"("lecture_id", "user_id");

-- CreateIndex
CREATE INDEX "notes_user_id_idx" ON "notes"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "projects_lecture_id_key" ON "projects"("lecture_id");

-- CreateIndex
CREATE UNIQUE INDEX "promo_videos_course_id_key" ON "promo_videos"("course_id");

-- CreateIndex
CREATE INDEX "reviews_course_id_rating_idx" ON "reviews"("course_id", "rating");

-- CreateIndex
CREATE UNIQUE INDEX "reviews_course_id_user_id_key" ON "reviews"("course_id", "user_id");

-- CreateIndex
CREATE UNIQUE INDEX "statistics_course_id_key" ON "statistics"("course_id");

-- CreateIndex
CREATE UNIQUE INDEX "teacher_approvals_user_id_key" ON "teacher_approvals"("user_id");

-- CreateIndex
CREATE INDEX "teacher_approvals_school_id_idx" ON "teacher_approvals"("school_id");

-- CreateIndex
CREATE INDEX "teacher_approvals_status_idx" ON "teacher_approvals"("status");

-- CreateIndex
CREATE INDEX "teacher_approvals_user_id_idx" ON "teacher_approvals"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "versions_course_id_key" ON "versions"("course_id");

-- CreateIndex
CREATE INDEX "_ClassStudents_B_index" ON "_ClassStudents"("B");

-- CreateIndex
CREATE INDEX "_ClassInstructors_B_index" ON "_ClassInstructors"("B");

-- CreateIndex
CREATE INDEX "audit_logs_user_id_created_at_idx" ON "audit_logs"("user_id", "created_at");

-- CreateIndex
CREATE INDEX "audit_logs_entity_type_entity_id_idx" ON "audit_logs"("entity_type", "entity_id");

-- CreateIndex
CREATE INDEX "audit_logs_action_created_at_idx" ON "audit_logs"("action", "created_at");

-- CreateIndex
CREATE UNIQUE INDEX "class_enrollments_class_id_student_id_key" ON "class_enrollments"("class_id", "student_id");

-- CreateIndex
CREATE INDEX "classes_school_id_idx" ON "classes"("school_id");

-- CreateIndex
CREATE UNIQUE INDEX "classes_school_id_name_key" ON "classes"("school_id", "name");

-- CreateIndex
CREATE INDEX "content_cache_content_type_content_id_idx" ON "content_cache"("content_type", "content_id");

-- CreateIndex
CREATE INDEX "content_cache_last_accessed_at_idx" ON "content_cache"("last_accessed_at");

-- CreateIndex
CREATE INDEX "content_cache_server_id_status_idx" ON "content_cache"("server_id", "status");

-- CreateIndex
CREATE UNIQUE INDEX "content_cache_server_id_content_type_content_id_key" ON "content_cache"("server_id", "content_type", "content_id");

-- CreateIndex
CREATE INDEX "content_variants_content_type_content_id_idx" ON "content_variants"("content_type", "content_id");

-- CreateIndex
CREATE UNIQUE INDEX "content_variants_content_type_content_id_quality_key" ON "content_variants"("content_type", "content_id", "quality");

-- CreateIndex
CREATE INDEX "course_validations_course_id_idx" ON "course_validations"("course_id");

-- CreateIndex
CREATE INDEX "course_validations_reviewer_id_idx" ON "course_validations"("reviewer_id");

-- CreateIndex
CREATE UNIQUE INDEX "course_validations_course_id_reviewer_id_key" ON "course_validations"("course_id", "reviewer_id");

-- CreateIndex
CREATE INDEX "download_queue_scheduled_for_idx" ON "download_queue"("scheduled_for");

-- CreateIndex
CREATE INDEX "download_queue_user_id_status_idx" ON "download_queue"("user_id", "status");

-- CreateIndex
CREATE INDEX "grades_student_id_idx" ON "grades"("student_id");

-- CreateIndex
CREATE INDEX "grades_class_id_idx" ON "grades"("class_id");

-- CreateIndex
CREATE INDEX "grades_course_id_idx" ON "grades"("course_id");

-- CreateIndex
CREATE INDEX "grades_gradable_type_gradable_id_idx" ON "grades"("gradable_type", "gradable_id");

-- CreateIndex
CREATE INDEX "network_usage_user_id_date_idx" ON "network_usage"("user_id", "date");

-- CreateIndex
CREATE UNIQUE INDEX "network_usage_user_id_device_id_date_connection_type_key" ON "network_usage"("user_id", "device_id", "date", "connection_type");

-- CreateIndex
CREATE INDEX "notifications_user_id_read_created_at_idx" ON "notifications"("user_id", "read", "created_at");

-- CreateIndex
CREATE INDEX "notifications_type_idx" ON "notifications"("type");

-- CreateIndex
CREATE INDEX "offline_content_expires_at_idx" ON "offline_content"("expires_at");

-- CreateIndex
CREATE INDEX "offline_content_last_accessed_at_idx" ON "offline_content"("last_accessed_at");

-- CreateIndex
CREATE INDEX "offline_content_user_id_device_id_idx" ON "offline_content"("user_id", "device_id");

-- CreateIndex
CREATE UNIQUE INDEX "offline_content_user_id_device_id_content_type_content_id_key" ON "offline_content"("user_id", "device_id", "content_type", "content_id");

-- CreateIndex
CREATE UNIQUE INDEX "offline_syncs_user_id_device_id_key" ON "offline_syncs"("user_id", "device_id");

-- CreateIndex
CREATE UNIQUE INDEX "parent_students_parent_id_student_id_key" ON "parent_students"("parent_id", "student_id");

-- CreateIndex
CREATE UNIQUE INDEX "parents_user_id_key" ON "parents"("user_id");

-- CreateIndex
CREATE INDEX "school_servers_school_id_idx" ON "school_servers"("school_id");

-- CreateIndex
CREATE INDEX "schools_code_idx" ON "schools"("code");

-- CreateIndex
CREATE INDEX "schools_name_idx" ON "schools"("name");

-- CreateIndex
CREATE INDEX "server_sync_logs_server_id_started_at_idx" ON "server_sync_logs"("server_id", "started_at");

-- CreateIndex
CREATE UNIQUE INDEX "sessions_session_token_key" ON "sessions"("session_token");

-- CreateIndex
CREATE INDEX "sessions_user_id_idx" ON "sessions"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "students_student_id_key" ON "students"("student_id");

-- CreateIndex
CREATE UNIQUE INDEX "students_user_id_key" ON "students"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "user_network_preferences_user_id_key" ON "user_network_preferences"("user_id");

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_school_id_fkey" FOREIGN KEY ("school_id") REFERENCES "schools"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "accounts" ADD CONSTRAINT "accounts_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sessions" ADD CONSTRAINT "sessions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_relationships" ADD CONSTRAINT "user_relationships_parent_id_fkey" FOREIGN KEY ("parent_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_relationships" ADD CONSTRAINT "user_relationships_student_id_fkey" FOREIGN KEY ("student_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "school_configs" ADD CONSTRAINT "school_configs_school_id_fkey" FOREIGN KEY ("school_id") REFERENCES "schools"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "academic_years" ADD CONSTRAINT "academic_years_school_id_fkey" FOREIGN KEY ("school_id") REFERENCES "schools"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "subjects" ADD CONSTRAINT "subjects_school_id_fkey" FOREIGN KEY ("school_id") REFERENCES "schools"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "classes" ADD CONSTRAINT "classes_school_id_fkey" FOREIGN KEY ("school_id") REFERENCES "schools"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "classes" ADD CONSTRAINT "classes_academic_period_id_fkey" FOREIGN KEY ("academic_period_id") REFERENCES "academic_years"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "class_enrollments" ADD CONSTRAINT "class_enrollments_class_id_fkey" FOREIGN KEY ("class_id") REFERENCES "classes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "class_enrollments" ADD CONSTRAINT "class_enrollments_student_id_fkey" FOREIGN KEY ("student_id") REFERENCES "students"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "course_enrollments" ADD CONSTRAINT "course_enrollments_course_id_fkey" FOREIGN KEY ("course_id") REFERENCES "courses"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "course_enrollments" ADD CONSTRAINT "course_enrollments_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "course_enrollments" ADD CONSTRAINT "course_enrollments_student_id_fkey" FOREIGN KEY ("student_id") REFERENCES "students"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "course_enrollments" ADD CONSTRAINT "course_enrollments_current_lecture_id_fkey" FOREIGN KEY ("current_lecture_id") REFERENCES "lectures"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "class_schedules" ADD CONSTRAINT "class_schedules_class_id_fkey" FOREIGN KEY ("class_id") REFERENCES "classes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "class_schedules" ADD CONSTRAINT "class_schedules_teacher_id_fkey" FOREIGN KEY ("teacher_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "courses" ADD CONSTRAINT "courses_instructor_id_fkey" FOREIGN KEY ("instructor_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "courses" ADD CONSTRAINT "courses_school_id_fkey" FOREIGN KEY ("school_id") REFERENCES "schools"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "courses" ADD CONSTRAINT "courses_subject_id_fkey" FOREIGN KEY ("subject_id") REFERENCES "subjects"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "courses" ADD CONSTRAINT "courses_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "categories"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "course_content" ADD CONSTRAINT "course_content_course_id_fkey" FOREIGN KEY ("course_id") REFERENCES "courses"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "course_validations" ADD CONSTRAINT "course_validations_course_id_fkey" FOREIGN KEY ("course_id") REFERENCES "courses"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "course_validations" ADD CONSTRAINT "course_validations_reviewer_id_fkey" FOREIGN KEY ("reviewer_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "content_versions" ADD CONSTRAINT "content_versions_course_id_fkey" FOREIGN KEY ("course_id") REFERENCES "courses"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "course_assignments" ADD CONSTRAINT "course_assignments_course_id_fkey" FOREIGN KEY ("course_id") REFERENCES "courses"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "course_assignments" ADD CONSTRAINT "course_assignments_class_id_fkey" FOREIGN KEY ("class_id") REFERENCES "classes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "course_progress" ADD CONSTRAINT "course_progress_student_id_fkey" FOREIGN KEY ("student_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "course_progress" ADD CONSTRAINT "course_progress_course_id_fkey" FOREIGN KEY ("course_id") REFERENCES "courses"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sections" ADD CONSTRAINT "sections_course_id_fkey" FOREIGN KEY ("course_id") REFERENCES "courses"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "lectures" ADD CONSTRAINT "lectures_section_id_fkey" FOREIGN KEY ("section_id") REFERENCES "sections"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "articles" ADD CONSTRAINT "articles_lecture_id_fkey" FOREIGN KEY ("lecture_id") REFERENCES "lectures"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "videos" ADD CONSTRAINT "videos_lecture_id_fkey" FOREIGN KEY ("lecture_id") REFERENCES "lectures"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "resources" ADD CONSTRAINT "resources_lecture_id_fkey" FOREIGN KEY ("lecture_id") REFERENCES "lectures"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "quizzes" ADD CONSTRAINT "quizzes_course_content_id_fkey" FOREIGN KEY ("course_content_id") REFERENCES "course_content"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "quizzes" ADD CONSTRAINT "quizzes_lecture_id_fkey" FOREIGN KEY ("lecture_id") REFERENCES "lectures"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "questions" ADD CONSTRAINT "questions_quiz_id_fkey" FOREIGN KEY ("quiz_id") REFERENCES "quizzes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "question_responses" ADD CONSTRAINT "question_responses_question_id_fkey" FOREIGN KEY ("question_id") REFERENCES "questions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "question_responses" ADD CONSTRAINT "question_responses_submission_id_fkey" FOREIGN KEY ("submission_id") REFERENCES "quiz_submissions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "quiz_submissions" ADD CONSTRAINT "quiz_submissions_quiz_id_fkey" FOREIGN KEY ("quiz_id") REFERENCES "quizzes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "quiz_submissions" ADD CONSTRAINT "quiz_submissions_student_id_fkey" FOREIGN KEY ("student_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "quiz_attempts" ADD CONSTRAINT "quiz_attempts_quiz_id_fkey" FOREIGN KEY ("quiz_id") REFERENCES "quizzes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "quiz_attempts" ADD CONSTRAINT "quiz_attempts_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "quiz_attempts" ADD CONSTRAINT "quiz_attempts_student_id_fkey" FOREIGN KEY ("student_id") REFERENCES "students"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "quiz_assignments" ADD CONSTRAINT "quiz_assignments_quiz_id_fkey" FOREIGN KEY ("quiz_id") REFERENCES "quizzes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "quiz_assignments" ADD CONSTRAINT "quiz_assignments_class_id_fkey" FOREIGN KEY ("class_id") REFERENCES "classes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "submissions" ADD CONSTRAINT "submissions_student_id_fkey" FOREIGN KEY ("student_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "submissions" ADD CONSTRAINT "submissions_course_content_id_fkey" FOREIGN KEY ("course_content_id") REFERENCES "course_content"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "submissions" ADD CONSTRAINT "submissions_graded_by_id_fkey" FOREIGN KEY ("graded_by_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "assignments" ADD CONSTRAINT "assignments_lecture_id_fkey" FOREIGN KEY ("lecture_id") REFERENCES "lectures"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "assignments" ADD CONSTRAINT "assignments_course_id_fkey" FOREIGN KEY ("course_id") REFERENCES "courses"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "assignments" ADD CONSTRAINT "assignments_class_id_fkey" FOREIGN KEY ("class_id") REFERENCES "classes"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "assignment_submissions" ADD CONSTRAINT "assignment_submissions_assignment_id_fkey" FOREIGN KEY ("assignment_id") REFERENCES "assignments"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "assignment_submissions" ADD CONSTRAINT "assignment_submissions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "assignment_submissions" ADD CONSTRAINT "assignment_submissions_student_id_fkey" FOREIGN KEY ("student_id") REFERENCES "students"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "coding_exercises" ADD CONSTRAINT "coding_exercises_lecture_id_fkey" FOREIGN KEY ("lecture_id") REFERENCES "lectures"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "coding_submissions" ADD CONSTRAINT "coding_submissions_coding_exercise_id_fkey" FOREIGN KEY ("coding_exercise_id") REFERENCES "coding_exercises"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "coding_submissions" ADD CONSTRAINT "coding_submissions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "coding_submissions" ADD CONSTRAINT "coding_submissions_student_id_fkey" FOREIGN KEY ("student_id") REFERENCES "students"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "grades" ADD CONSTRAINT "grades_student_id_fkey" FOREIGN KEY ("student_id") REFERENCES "students"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "grades" ADD CONSTRAINT "grades_assignment_id_fkey" FOREIGN KEY ("assignment_id") REFERENCES "assignments"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "grades" ADD CONSTRAINT "grades_class_id_fkey" FOREIGN KEY ("class_id") REFERENCES "classes"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "grades" ADD CONSTRAINT "grades_course_id_fkey" FOREIGN KEY ("course_id") REFERENCES "courses"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "parent_instructions" ADD CONSTRAINT "parent_instructions_teacher_id_fkey" FOREIGN KEY ("teacher_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "parent_instruction_completions" ADD CONSTRAINT "parent_instruction_completions_instruction_id_fkey" FOREIGN KEY ("instruction_id") REFERENCES "parent_instructions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "parent_instruction_completions" ADD CONSTRAINT "parent_instruction_completions_parent_id_fkey" FOREIGN KEY ("parent_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "admins" ADD CONSTRAINT "admins_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "instructors" ADD CONSTRAINT "instructors_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "students" ADD CONSTRAINT "students_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "parents" ADD CONSTRAINT "parents_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "parent_students" ADD CONSTRAINT "parent_students_parent_id_fkey" FOREIGN KEY ("parent_id") REFERENCES "parents"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "parent_students" ADD CONSTRAINT "parent_students_student_id_fkey" FOREIGN KEY ("student_id") REFERENCES "students"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "attendances" ADD CONSTRAINT "attendances_student_id_fkey" FOREIGN KEY ("student_id") REFERENCES "students"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "attendances" ADD CONSTRAINT "attendances_class_id_fkey" FOREIGN KEY ("class_id") REFERENCES "classes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "attendances" ADD CONSTRAINT "attendances_recorded_by_id_fkey" FOREIGN KEY ("recorded_by_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "audit_logs" ADD CONSTRAINT "audit_logs_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "content_cache" ADD CONSTRAINT "content_cache_server_id_fkey" FOREIGN KEY ("server_id") REFERENCES "school_servers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "content_variants" ADD CONSTRAINT "content_variants_video_id_fkey" FOREIGN KEY ("video_id") REFERENCES "videos"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "download_queue" ADD CONSTRAINT "download_queue_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "network_usage" ADD CONSTRAINT "network_usage_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "offline_content" ADD CONSTRAINT "offline_content_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "offline_syncs" ADD CONSTRAINT "offline_syncs_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_network_preferences" ADD CONSTRAINT "user_network_preferences_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "school_servers" ADD CONSTRAINT "school_servers_school_id_fkey" FOREIGN KEY ("school_id") REFERENCES "schools"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "server_sync_logs" ADD CONSTRAINT "server_sync_logs_server_id_fkey" FOREIGN KEY ("server_id") REFERENCES "school_servers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "calendar_events" ADD CONSTRAINT "calendar_events_school_id_fkey" FOREIGN KEY ("school_id") REFERENCES "schools"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "calendar_events" ADD CONSTRAINT "calendar_events_class_id_fkey" FOREIGN KEY ("class_id") REFERENCES "classes"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "calendar_events" ADD CONSTRAINT "calendar_events_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reports" ADD CONSTRAINT "reports_generated_by_fkey" FOREIGN KEY ("generated_by") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "announcements" ADD CONSTRAINT "announcements_author_id_fkey" FOREIGN KEY ("author_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "announcements" ADD CONSTRAINT "announcements_school_id_fkey" FOREIGN KEY ("school_id") REFERENCES "schools"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "forums" ADD CONSTRAINT "forums_course_id_fkey" FOREIGN KEY ("course_id") REFERENCES "courses"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "forums" ADD CONSTRAINT "forums_class_id_fkey" FOREIGN KEY ("class_id") REFERENCES "classes"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "threads" ADD CONSTRAINT "threads_forum_id_fkey" FOREIGN KEY ("forum_id") REFERENCES "forums"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "threads" ADD CONSTRAINT "threads_creator_id_fkey" FOREIGN KEY ("creator_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "posts" ADD CONSTRAINT "posts_thread_id_fkey" FOREIGN KEY ("thread_id") REFERENCES "threads"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "posts" ADD CONSTRAINT "posts_author_id_fkey" FOREIGN KEY ("author_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "conversations" ADD CONSTRAINT "conversations_course_id_fkey" FOREIGN KEY ("course_id") REFERENCES "courses"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "conversations" ADD CONSTRAINT "conversations_creator_id_fkey" FOREIGN KEY ("creator_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "conversations" ADD CONSTRAINT "conversations_lecture_id_fkey" FOREIGN KEY ("lecture_id") REFERENCES "lectures"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "conversation_participants" ADD CONSTRAINT "conversation_participants_conversation_id_fkey" FOREIGN KEY ("conversation_id") REFERENCES "conversations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "conversation_participants" ADD CONSTRAINT "conversation_participants_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "messages" ADD CONSTRAINT "messages_conversation_id_fkey" FOREIGN KEY ("conversation_id") REFERENCES "conversations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "messages" ADD CONSTRAINT "messages_sender_id_fkey" FOREIGN KEY ("sender_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "message_read_statuses" ADD CONSTRAINT "message_read_statuses_message_id_fkey" FOREIGN KEY ("message_id") REFERENCES "messages"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "message_read_statuses" ADD CONSTRAINT "message_read_statuses_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_badges" ADD CONSTRAINT "user_badges_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_badges" ADD CONSTRAINT "user_badges_badge_id_fkey" FOREIGN KEY ("badge_id") REFERENCES "badges"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "categories" ADD CONSTRAINT "categories_parent_id_fkey" FOREIGN KEY ("parent_id") REFERENCES "categories"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "certificates" ADD CONSTRAINT "certificates_course_id_fkey" FOREIGN KEY ("course_id") REFERENCES "courses"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "faqs" ADD CONSTRAINT "faqs_course_id_fkey" FOREIGN KEY ("course_id") REFERENCES "courses"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "invitation_codes" ADD CONSTRAINT "invitation_codes_school_id_fkey" FOREIGN KEY ("school_id") REFERENCES "schools"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "lecture_progress" ADD CONSTRAINT "lecture_progress_lecture_id_fkey" FOREIGN KEY ("lecture_id") REFERENCES "lectures"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "lecture_progress" ADD CONSTRAINT "lecture_progress_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "lecture_progress" ADD CONSTRAINT "lecture_progress_student_id_fkey" FOREIGN KEY ("student_id") REFERENCES "students"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notes" ADD CONSTRAINT "notes_lecture_id_fkey" FOREIGN KEY ("lecture_id") REFERENCES "lectures"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notes" ADD CONSTRAINT "notes_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notes" ADD CONSTRAINT "notes_student_id_fkey" FOREIGN KEY ("student_id") REFERENCES "students"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "projects" ADD CONSTRAINT "projects_lecture_id_fkey" FOREIGN KEY ("lecture_id") REFERENCES "lectures"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "promo_videos" ADD CONSTRAINT "promo_videos_course_id_fkey" FOREIGN KEY ("course_id") REFERENCES "courses"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reviews" ADD CONSTRAINT "reviews_course_id_fkey" FOREIGN KEY ("course_id") REFERENCES "courses"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reviews" ADD CONSTRAINT "reviews_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "statistics" ADD CONSTRAINT "statistics_course_id_fkey" FOREIGN KEY ("course_id") REFERENCES "courses"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "versions" ADD CONSTRAINT "versions_course_id_fkey" FOREIGN KEY ("course_id") REFERENCES "courses"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ClassStudents" ADD CONSTRAINT "_ClassStudents_A_fkey" FOREIGN KEY ("A") REFERENCES "classes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ClassStudents" ADD CONSTRAINT "_ClassStudents_B_fkey" FOREIGN KEY ("B") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ClassInstructors" ADD CONSTRAINT "_ClassInstructors_A_fkey" FOREIGN KEY ("A") REFERENCES "classes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ClassInstructors" ADD CONSTRAINT "_ClassInstructors_B_fkey" FOREIGN KEY ("B") REFERENCES "instructors"("id") ON DELETE CASCADE ON UPDATE CASCADE;
