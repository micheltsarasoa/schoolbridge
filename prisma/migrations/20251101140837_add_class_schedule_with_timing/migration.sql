-- CreateEnum
CREATE TYPE "DayOfWeek" AS ENUM ('MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY');

-- CreateTable
CREATE TABLE "ClassSchedule" (
    "id" TEXT NOT NULL,
    "classId" TEXT NOT NULL,
    "teacherId" TEXT NOT NULL,
    "dayOfWeek" "DayOfWeek" NOT NULL,
    "plannedStartTime" TEXT NOT NULL,
    "plannedDuration" INTEGER NOT NULL,
    "actualStartTime" TEXT,
    "actualDuration" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ClassSchedule_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "ClassSchedule_classId_idx" ON "ClassSchedule"("classId");

-- CreateIndex
CREATE INDEX "ClassSchedule_teacherId_idx" ON "ClassSchedule"("teacherId");

-- CreateIndex
CREATE INDEX "ClassSchedule_dayOfWeek_idx" ON "ClassSchedule"("dayOfWeek");

-- CreateIndex
CREATE UNIQUE INDEX "ClassSchedule_classId_dayOfWeek_key" ON "ClassSchedule"("classId", "dayOfWeek");

-- AddForeignKey
ALTER TABLE "ClassSchedule" ADD CONSTRAINT "ClassSchedule_classId_fkey" FOREIGN KEY ("classId") REFERENCES "Class"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClassSchedule" ADD CONSTRAINT "ClassSchedule_teacherId_fkey" FOREIGN KEY ("teacherId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
