/*
  Warnings:

  - The required column `client_id` was added to the `academic_years` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.
  - Added the required column `client_updated_at` to the `academic_years` table without a default value. This is not possible if the table is not empty.
  - The required column `client_id` was added to the `accounts` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.
  - Added the required column `client_updated_at` to the `accounts` table without a default value. This is not possible if the table is not empty.
  - The required column `client_id` was added to the `admins` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.
  - Added the required column `client_updated_at` to the `admins` table without a default value. This is not possible if the table is not empty.
  - The required column `client_id` was added to the `announcements` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.
  - Added the required column `client_updated_at` to the `announcements` table without a default value. This is not possible if the table is not empty.
  - The required column `client_id` was added to the `articles` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.
  - Added the required column `client_updated_at` to the `articles` table without a default value. This is not possible if the table is not empty.
  - The required column `client_id` was added to the `assignment_submissions` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.
  - Added the required column `client_updated_at` to the `assignment_submissions` table without a default value. This is not possible if the table is not empty.
  - The required column `client_id` was added to the `assignments` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.
  - Added the required column `client_updated_at` to the `assignments` table without a default value. This is not possible if the table is not empty.
  - The required column `client_id` was added to the `attendances` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.
  - Added the required column `client_updated_at` to the `attendances` table without a default value. This is not possible if the table is not empty.
  - The required column `client_id` was added to the `badges` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.
  - Added the required column `client_updated_at` to the `badges` table without a default value. This is not possible if the table is not empty.
  - The required column `client_id` was added to the `calendar_events` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.
  - Added the required column `client_updated_at` to the `calendar_events` table without a default value. This is not possible if the table is not empty.
  - The required column `client_id` was added to the `categories` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.
  - Added the required column `client_updated_at` to the `categories` table without a default value. This is not possible if the table is not empty.
  - The required column `client_id` was added to the `certificates` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.
  - Added the required column `client_updated_at` to the `certificates` table without a default value. This is not possible if the table is not empty.
  - The required column `client_id` was added to the `class_enrollments` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.
  - Added the required column `client_updated_at` to the `class_enrollments` table without a default value. This is not possible if the table is not empty.
  - The required column `client_id` was added to the `class_schedules` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.
  - Added the required column `client_updated_at` to the `class_schedules` table without a default value. This is not possible if the table is not empty.
  - The required column `client_id` was added to the `classes` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.
  - Added the required column `client_updated_at` to the `classes` table without a default value. This is not possible if the table is not empty.
  - The required column `client_id` was added to the `coding_exercises` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.
  - Added the required column `client_updated_at` to the `coding_exercises` table without a default value. This is not possible if the table is not empty.
  - The required column `client_id` was added to the `coding_submissions` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.
  - Added the required column `client_updated_at` to the `coding_submissions` table without a default value. This is not possible if the table is not empty.
  - The required column `client_id` was added to the `content_versions` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.
  - Added the required column `client_updated_at` to the `content_versions` table without a default value. This is not possible if the table is not empty.
  - The required column `client_id` was added to the `conversation_participants` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.
  - Added the required column `client_updated_at` to the `conversation_participants` table without a default value. This is not possible if the table is not empty.
  - The required column `client_id` was added to the `conversations` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.
  - Added the required column `client_updated_at` to the `conversations` table without a default value. This is not possible if the table is not empty.
  - The required column `client_id` was added to the `course_assignments` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.
  - Added the required column `client_updated_at` to the `course_assignments` table without a default value. This is not possible if the table is not empty.
  - The required column `client_id` was added to the `course_content` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.
  - Added the required column `client_updated_at` to the `course_content` table without a default value. This is not possible if the table is not empty.
  - The required column `client_id` was added to the `course_enrollments` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.
  - Added the required column `client_updated_at` to the `course_enrollments` table without a default value. This is not possible if the table is not empty.
  - The required column `client_id` was added to the `course_progress` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.
  - Added the required column `client_updated_at` to the `course_progress` table without a default value. This is not possible if the table is not empty.
  - The required column `client_id` was added to the `course_validations` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.
  - Added the required column `client_updated_at` to the `course_validations` table without a default value. This is not possible if the table is not empty.
  - The required column `client_id` was added to the `courses` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.
  - Added the required column `client_updated_at` to the `courses` table without a default value. This is not possible if the table is not empty.
  - The required column `client_id` was added to the `download_queue` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.
  - Added the required column `client_updated_at` to the `download_queue` table without a default value. This is not possible if the table is not empty.
  - The required column `client_id` was added to the `faqs` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.
  - Added the required column `client_updated_at` to the `faqs` table without a default value. This is not possible if the table is not empty.
  - The required column `client_id` was added to the `forums` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.
  - Added the required column `client_updated_at` to the `forums` table without a default value. This is not possible if the table is not empty.
  - The required column `client_id` was added to the `grades` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.
  - Added the required column `client_updated_at` to the `grades` table without a default value. This is not possible if the table is not empty.
  - The required column `client_id` was added to the `instructors` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.
  - Added the required column `client_updated_at` to the `instructors` table without a default value. This is not possible if the table is not empty.
  - The required column `client_id` was added to the `invitation_codes` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.
  - Added the required column `client_updated_at` to the `invitation_codes` table without a default value. This is not possible if the table is not empty.
  - The required column `client_id` was added to the `lecture_progress` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.
  - Added the required column `client_updated_at` to the `lecture_progress` table without a default value. This is not possible if the table is not empty.
  - The required column `client_id` was added to the `lectures` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.
  - Added the required column `client_updated_at` to the `lectures` table without a default value. This is not possible if the table is not empty.
  - The required column `client_id` was added to the `message_read_statuses` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.
  - Added the required column `client_updated_at` to the `message_read_statuses` table without a default value. This is not possible if the table is not empty.
  - The required column `client_id` was added to the `messages` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.
  - Added the required column `client_updated_at` to the `messages` table without a default value. This is not possible if the table is not empty.
  - The required column `client_id` was added to the `network_usage` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.
  - Added the required column `client_updated_at` to the `network_usage` table without a default value. This is not possible if the table is not empty.
  - The required column `client_id` was added to the `notes` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.
  - Added the required column `client_updated_at` to the `notes` table without a default value. This is not possible if the table is not empty.
  - The required column `client_id` was added to the `notifications` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.
  - Added the required column `client_updated_at` to the `notifications` table without a default value. This is not possible if the table is not empty.
  - The required column `client_id` was added to the `offline_content` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.
  - Added the required column `client_updated_at` to the `offline_content` table without a default value. This is not possible if the table is not empty.
  - The required column `client_id` was added to the `offline_syncs` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.
  - Added the required column `client_updated_at` to the `offline_syncs` table without a default value. This is not possible if the table is not empty.
  - The required column `client_id` was added to the `parent_child_links` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.
  - Added the required column `client_updated_at` to the `parent_child_links` table without a default value. This is not possible if the table is not empty.
  - The required column `client_id` was added to the `parent_instruction_completions` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.
  - Added the required column `client_updated_at` to the `parent_instruction_completions` table without a default value. This is not possible if the table is not empty.
  - The required column `client_id` was added to the `parent_instructions` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.
  - Added the required column `client_updated_at` to the `parent_instructions` table without a default value. This is not possible if the table is not empty.
  - The required column `client_id` was added to the `parent_students` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.
  - Added the required column `client_updated_at` to the `parent_students` table without a default value. This is not possible if the table is not empty.
  - The required column `client_id` was added to the `parents` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.
  - Added the required column `client_updated_at` to the `parents` table without a default value. This is not possible if the table is not empty.
  - The required column `client_id` was added to the `pending_registrations` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.
  - Added the required column `client_updated_at` to the `pending_registrations` table without a default value. This is not possible if the table is not empty.
  - The required column `client_id` was added to the `posts` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.
  - Added the required column `client_updated_at` to the `posts` table without a default value. This is not possible if the table is not empty.
  - The required column `client_id` was added to the `projects` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.
  - Added the required column `client_updated_at` to the `projects` table without a default value. This is not possible if the table is not empty.
  - The required column `client_id` was added to the `promo_videos` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.
  - Added the required column `client_updated_at` to the `promo_videos` table without a default value. This is not possible if the table is not empty.
  - The required column `client_id` was added to the `question_responses` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.
  - Added the required column `client_updated_at` to the `question_responses` table without a default value. This is not possible if the table is not empty.
  - The required column `client_id` was added to the `quiz_assignments` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.
  - Added the required column `client_updated_at` to the `quiz_assignments` table without a default value. This is not possible if the table is not empty.
  - The required column `client_id` was added to the `quiz_attempts` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.
  - Added the required column `client_updated_at` to the `quiz_attempts` table without a default value. This is not possible if the table is not empty.
  - The required column `client_id` was added to the `quiz_submissions` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.
  - Added the required column `client_updated_at` to the `quiz_submissions` table without a default value. This is not possible if the table is not empty.
  - The required column `client_id` was added to the `quizzes` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.
  - Added the required column `client_updated_at` to the `quizzes` table without a default value. This is not possible if the table is not empty.
  - The required column `client_id` was added to the `resources` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.
  - Added the required column `client_updated_at` to the `resources` table without a default value. This is not possible if the table is not empty.
  - The required column `client_id` was added to the `reviews` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.
  - Added the required column `client_updated_at` to the `reviews` table without a default value. This is not possible if the table is not empty.
  - The required column `client_id` was added to the `school_configs` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.
  - Added the required column `client_updated_at` to the `school_configs` table without a default value. This is not possible if the table is not empty.
  - The required column `client_id` was added to the `school_servers` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.
  - Added the required column `client_updated_at` to the `school_servers` table without a default value. This is not possible if the table is not empty.
  - The required column `client_id` was added to the `schools` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.
  - Added the required column `client_updated_at` to the `schools` table without a default value. This is not possible if the table is not empty.
  - The required column `client_id` was added to the `sections` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.
  - Added the required column `client_updated_at` to the `sections` table without a default value. This is not possible if the table is not empty.
  - The required column `client_id` was added to the `sessions` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.
  - Added the required column `client_updated_at` to the `sessions` table without a default value. This is not possible if the table is not empty.
  - The required column `client_id` was added to the `students` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.
  - Added the required column `client_updated_at` to the `students` table without a default value. This is not possible if the table is not empty.
  - The required column `client_id` was added to the `subjects` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.
  - Added the required column `client_updated_at` to the `subjects` table without a default value. This is not possible if the table is not empty.
  - The required column `client_id` was added to the `submissions` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.
  - Added the required column `client_updated_at` to the `submissions` table without a default value. This is not possible if the table is not empty.
  - The required column `client_id` was added to the `teacher_approvals` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.
  - Added the required column `client_updated_at` to the `teacher_approvals` table without a default value. This is not possible if the table is not empty.
  - The required column `client_id` was added to the `threads` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.
  - Added the required column `client_updated_at` to the `threads` table without a default value. This is not possible if the table is not empty.
  - The required column `client_id` was added to the `user_badges` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.
  - Added the required column `client_updated_at` to the `user_badges` table without a default value. This is not possible if the table is not empty.
  - The required column `client_id` was added to the `user_network_preferences` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.
  - Added the required column `client_updated_at` to the `user_network_preferences` table without a default value. This is not possible if the table is not empty.
  - The required column `client_id` was added to the `user_relationships` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.
  - Added the required column `client_updated_at` to the `user_relationships` table without a default value. This is not possible if the table is not empty.
  - The required column `client_id` was added to the `users` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.
  - Added the required column `client_updated_at` to the `users` table without a default value. This is not possible if the table is not empty.
  - The required column `client_id` was added to the `versions` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.
  - Added the required column `client_updated_at` to the `versions` table without a default value. This is not possible if the table is not empty.
  - The required column `client_id` was added to the `videos` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.
  - Added the required column `client_updated_at` to the `videos` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "academic_years" ADD COLUMN     "client_id" TEXT NOT NULL,
ADD COLUMN     "client_updated_at" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "is_deleted" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "accounts" ADD COLUMN     "client_id" TEXT NOT NULL,
ADD COLUMN     "client_updated_at" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "is_deleted" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "admins" ADD COLUMN     "client_id" TEXT NOT NULL,
ADD COLUMN     "client_updated_at" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "is_deleted" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "announcements" ADD COLUMN     "client_id" TEXT NOT NULL,
ADD COLUMN     "client_updated_at" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "is_deleted" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "articles" ADD COLUMN     "client_id" TEXT NOT NULL,
ADD COLUMN     "client_updated_at" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "is_deleted" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "assignment_submissions" ADD COLUMN     "client_id" TEXT NOT NULL,
ADD COLUMN     "client_updated_at" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "is_deleted" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "assignments" ADD COLUMN     "client_id" TEXT NOT NULL,
ADD COLUMN     "client_updated_at" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "is_deleted" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "attendances" ADD COLUMN     "client_id" TEXT NOT NULL,
ADD COLUMN     "client_updated_at" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "is_deleted" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "badges" ADD COLUMN     "client_id" TEXT NOT NULL,
ADD COLUMN     "client_updated_at" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "is_deleted" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "calendar_events" ADD COLUMN     "client_id" TEXT NOT NULL,
ADD COLUMN     "client_updated_at" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "is_deleted" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "categories" ADD COLUMN     "client_id" TEXT NOT NULL,
ADD COLUMN     "client_updated_at" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "is_deleted" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "certificates" ADD COLUMN     "client_id" TEXT NOT NULL,
ADD COLUMN     "client_updated_at" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "is_deleted" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "class_enrollments" ADD COLUMN     "client_id" TEXT NOT NULL,
ADD COLUMN     "client_updated_at" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "is_deleted" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "class_schedules" ADD COLUMN     "client_id" TEXT NOT NULL,
ADD COLUMN     "client_updated_at" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "is_deleted" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "classes" ADD COLUMN     "client_id" TEXT NOT NULL,
ADD COLUMN     "client_updated_at" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "is_deleted" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "coding_exercises" ADD COLUMN     "client_id" TEXT NOT NULL,
ADD COLUMN     "client_updated_at" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "is_deleted" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "coding_submissions" ADD COLUMN     "client_id" TEXT NOT NULL,
ADD COLUMN     "client_updated_at" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "is_deleted" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "content_versions" ADD COLUMN     "client_id" TEXT NOT NULL,
ADD COLUMN     "client_updated_at" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "is_deleted" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "conversation_participants" ADD COLUMN     "client_id" TEXT NOT NULL,
ADD COLUMN     "client_updated_at" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "is_deleted" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "conversations" ADD COLUMN     "client_id" TEXT NOT NULL,
ADD COLUMN     "client_updated_at" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "is_deleted" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "course_assignments" ADD COLUMN     "client_id" TEXT NOT NULL,
ADD COLUMN     "client_updated_at" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "is_deleted" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "course_content" ADD COLUMN     "client_id" TEXT NOT NULL,
ADD COLUMN     "client_updated_at" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "is_deleted" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "course_enrollments" ADD COLUMN     "client_id" TEXT NOT NULL,
ADD COLUMN     "client_updated_at" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "is_deleted" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "course_progress" ADD COLUMN     "client_id" TEXT NOT NULL,
ADD COLUMN     "client_updated_at" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "is_deleted" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "course_validations" ADD COLUMN     "client_id" TEXT NOT NULL,
ADD COLUMN     "client_updated_at" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "is_deleted" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "courses" ADD COLUMN     "client_id" TEXT NOT NULL,
ADD COLUMN     "client_updated_at" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "is_deleted" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "download_queue" ADD COLUMN     "client_id" TEXT NOT NULL,
ADD COLUMN     "client_updated_at" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "is_deleted" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "faqs" ADD COLUMN     "client_id" TEXT NOT NULL,
ADD COLUMN     "client_updated_at" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "is_deleted" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "forums" ADD COLUMN     "client_id" TEXT NOT NULL,
ADD COLUMN     "client_updated_at" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "is_deleted" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "grades" ADD COLUMN     "client_id" TEXT NOT NULL,
ADD COLUMN     "client_updated_at" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "is_deleted" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "instructors" ADD COLUMN     "client_id" TEXT NOT NULL,
ADD COLUMN     "client_updated_at" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "is_deleted" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "invitation_codes" ADD COLUMN     "client_id" TEXT NOT NULL,
ADD COLUMN     "client_updated_at" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "is_deleted" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "lecture_progress" ADD COLUMN     "client_id" TEXT NOT NULL,
ADD COLUMN     "client_updated_at" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "is_deleted" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "lectures" ADD COLUMN     "client_id" TEXT NOT NULL,
ADD COLUMN     "client_updated_at" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "is_deleted" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "message_read_statuses" ADD COLUMN     "client_id" TEXT NOT NULL,
ADD COLUMN     "client_updated_at" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "is_deleted" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "messages" ADD COLUMN     "client_id" TEXT NOT NULL,
ADD COLUMN     "client_updated_at" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "is_deleted" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "network_usage" ADD COLUMN     "client_id" TEXT NOT NULL,
ADD COLUMN     "client_updated_at" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "is_deleted" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "notes" ADD COLUMN     "client_id" TEXT NOT NULL,
ADD COLUMN     "client_updated_at" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "is_deleted" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "notifications" ADD COLUMN     "client_id" TEXT NOT NULL,
ADD COLUMN     "client_updated_at" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "is_deleted" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "offline_content" ADD COLUMN     "client_id" TEXT NOT NULL,
ADD COLUMN     "client_updated_at" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "is_deleted" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "offline_syncs" ADD COLUMN     "client_id" TEXT NOT NULL,
ADD COLUMN     "client_updated_at" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "is_deleted" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "parent_child_links" ADD COLUMN     "client_id" TEXT NOT NULL,
ADD COLUMN     "client_updated_at" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "is_deleted" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "parent_instruction_completions" ADD COLUMN     "client_id" TEXT NOT NULL,
ADD COLUMN     "client_updated_at" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "is_deleted" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "parent_instructions" ADD COLUMN     "client_id" TEXT NOT NULL,
ADD COLUMN     "client_updated_at" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "is_deleted" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "parent_students" ADD COLUMN     "client_id" TEXT NOT NULL,
ADD COLUMN     "client_updated_at" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "is_deleted" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "parents" ADD COLUMN     "client_id" TEXT NOT NULL,
ADD COLUMN     "client_updated_at" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "is_deleted" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "pending_registrations" ADD COLUMN     "client_id" TEXT NOT NULL,
ADD COLUMN     "client_updated_at" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "is_deleted" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "posts" ADD COLUMN     "client_id" TEXT NOT NULL,
ADD COLUMN     "client_updated_at" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "is_deleted" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "projects" ADD COLUMN     "client_id" TEXT NOT NULL,
ADD COLUMN     "client_updated_at" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "is_deleted" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "promo_videos" ADD COLUMN     "client_id" TEXT NOT NULL,
ADD COLUMN     "client_updated_at" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "is_deleted" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "question_responses" ADD COLUMN     "client_id" TEXT NOT NULL,
ADD COLUMN     "client_updated_at" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "is_deleted" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "quiz_assignments" ADD COLUMN     "client_id" TEXT NOT NULL,
ADD COLUMN     "client_updated_at" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "is_deleted" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "quiz_attempts" ADD COLUMN     "client_id" TEXT NOT NULL,
ADD COLUMN     "client_updated_at" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "is_deleted" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "quiz_submissions" ADD COLUMN     "client_id" TEXT NOT NULL,
ADD COLUMN     "client_updated_at" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "is_deleted" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "quizzes" ADD COLUMN     "client_id" TEXT NOT NULL,
ADD COLUMN     "client_updated_at" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "is_deleted" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "resources" ADD COLUMN     "client_id" TEXT NOT NULL,
ADD COLUMN     "client_updated_at" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "is_deleted" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "reviews" ADD COLUMN     "client_id" TEXT NOT NULL,
ADD COLUMN     "client_updated_at" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "is_deleted" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "school_configs" ADD COLUMN     "client_id" TEXT NOT NULL,
ADD COLUMN     "client_updated_at" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "is_deleted" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "school_servers" ADD COLUMN     "client_id" TEXT NOT NULL,
ADD COLUMN     "client_updated_at" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "is_deleted" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "schools" ADD COLUMN     "client_id" TEXT NOT NULL,
ADD COLUMN     "client_updated_at" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "is_deleted" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "sections" ADD COLUMN     "client_id" TEXT NOT NULL,
ADD COLUMN     "client_updated_at" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "is_deleted" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "sessions" ADD COLUMN     "client_id" TEXT NOT NULL,
ADD COLUMN     "client_updated_at" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "is_deleted" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "students" ADD COLUMN     "client_id" TEXT NOT NULL,
ADD COLUMN     "client_updated_at" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "is_deleted" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "subjects" ADD COLUMN     "client_id" TEXT NOT NULL,
ADD COLUMN     "client_updated_at" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "is_deleted" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "submissions" ADD COLUMN     "client_id" TEXT NOT NULL,
ADD COLUMN     "client_updated_at" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "is_deleted" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "teacher_approvals" ADD COLUMN     "client_id" TEXT NOT NULL,
ADD COLUMN     "client_updated_at" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "is_deleted" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "threads" ADD COLUMN     "client_id" TEXT NOT NULL,
ADD COLUMN     "client_updated_at" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "is_deleted" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "user_badges" ADD COLUMN     "client_id" TEXT NOT NULL,
ADD COLUMN     "client_updated_at" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "is_deleted" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "user_network_preferences" ADD COLUMN     "client_id" TEXT NOT NULL,
ADD COLUMN     "client_updated_at" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "is_deleted" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "user_relationships" ADD COLUMN     "client_id" TEXT NOT NULL,
ADD COLUMN     "client_updated_at" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "is_deleted" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "client_id" TEXT NOT NULL,
ADD COLUMN     "client_updated_at" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "is_deleted" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "versions" ADD COLUMN     "client_id" TEXT NOT NULL,
ADD COLUMN     "client_updated_at" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "is_deleted" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "videos" ADD COLUMN     "client_id" TEXT NOT NULL,
ADD COLUMN     "client_updated_at" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "is_deleted" BOOLEAN NOT NULL DEFAULT false;
