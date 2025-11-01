/*
  Warnings:

  - You are about to drop the column `present` on the `Attendance` table. All the data in the column will be lost.
  - Changed the type of `status` on the `CourseValidation` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "ValidationStatus" AS ENUM ('APPROVED', 'CHANGES_REQUESTED', 'REJECTED');

-- CreateEnum
CREATE TYPE "AttendanceStatus" AS ENUM ('PRESENT', 'ABSENT', 'LATE', 'EXCUSED');

-- AlterTable
ALTER TABLE "Attendance" DROP COLUMN "present",
ADD COLUMN     "status" "AttendanceStatus" NOT NULL DEFAULT 'ABSENT';

-- AlterTable
ALTER TABLE "CourseValidation" DROP COLUMN "status",
ADD COLUMN     "status" "ValidationStatus" NOT NULL;

-- AlterTable
ALTER TABLE "Submission" ADD COLUMN     "status" "SubmissionStatus" NOT NULL DEFAULT 'PENDING';
