-- AlterTable
ALTER TABLE "course_content" ADD COLUMN     "data_version" INTEGER NOT NULL DEFAULT 1,
ADD COLUMN     "last_synced_at" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "courses" ADD COLUMN     "data_version" INTEGER NOT NULL DEFAULT 1,
ADD COLUMN     "last_synced_at" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "lecture_progress" ADD COLUMN     "data_version" INTEGER NOT NULL DEFAULT 1,
ADD COLUMN     "last_synced_at" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "lectures" ADD COLUMN     "data_version" INTEGER NOT NULL DEFAULT 1,
ADD COLUMN     "last_synced_at" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "notes" ADD COLUMN     "data_version" INTEGER NOT NULL DEFAULT 1,
ADD COLUMN     "last_synced_at" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "questions" ADD COLUMN     "data_version" INTEGER NOT NULL DEFAULT 1,
ADD COLUMN     "last_synced_at" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "quiz_attempts" ADD COLUMN     "data_version" INTEGER NOT NULL DEFAULT 1,
ADD COLUMN     "last_synced_at" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "quizzes" ADD COLUMN     "data_version" INTEGER NOT NULL DEFAULT 1,
ADD COLUMN     "last_synced_at" TIMESTAMP(3);
