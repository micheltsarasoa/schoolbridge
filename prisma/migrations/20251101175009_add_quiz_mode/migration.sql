-- CreateEnum
CREATE TYPE "QuizMode" AS ENUM ('PRACTICE', 'EXAM', 'TIMED_EXAM');

-- AlterTable
ALTER TABLE "Quiz" ADD COLUMN     "mode" "QuizMode" NOT NULL DEFAULT 'PRACTICE';
