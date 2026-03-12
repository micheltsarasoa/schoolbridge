import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import { AttendanceStatus } from "@/types/db";
import { includes } from 'zod';

// GET /api/student/dashboard - Get student dashboard data
export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id || session.user.role !== 'STUDENT') {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const studentId = session.user.id;

    // Fetch student data with all relations
    const student = await prisma.user.findUnique({
      where: { id: studentId },
      include: {
        classes: true,
      }
    });

    if (!student) {
      return NextResponse.json({ message: 'Student not found' }, { status: 404 });
    }

    // Get attendance rate (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const attendanceRecords = await prisma.attendance.findMany({
      where: {
        studentId,
        date: {
          gte: thirtyDaysAgo,
        },
      },
    });

    const attendanceRate =
      attendanceRecords.length > 0
        ? Math.round(
            (attendanceRecords.filter((r) => r.status === AttendanceStatus.PRESENT).length / attendanceRecords.length) * 100
          )
        : 0;

    // Get submissions count (completed quizzes/assignments)
    const submissions = await prisma.assignmentSubmission.findMany({
      where: { studentId },
      include: {
        assignment: {
          include: {
            course: true
          }
        }
      },
    });

    const gradedSubmissions = submissions.filter((s) => s.grade !== null);

    // Calculate average grade
    const averageGrade =
      gradedSubmissions.length > 0
        ? (
            gradedSubmissions.reduce((sum, s) => sum + (s.grade || 0), 0) /
            gradedSubmissions.length
          ).toFixed(1)
        : null;

    // Get active academic year
    const activeYear = await prisma.academicYear.findFirst({
      where: {
        isActive: true,
        schoolId: student.schoolId || undefined,
      },
    });

    let daysUntilYearEnd = 0;
    if (activeYear) {
      const now = new Date();
      const endDate = new Date(activeYear.endDate);
      daysUntilYearEnd = Math.ceil((endDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    }

    // Get student progress for courses
    const studentProgress = await prisma.lectureProgress.findMany({
      where: { studentId },
      include: {
        lecture: {
          include: {
            section: {
              include: {
                course: {
                  select: {
                    title: true,
                    category: {
                      select: {
                        name: true
                      }
                    },
                    teacher: {
                      select: {
                        firstName: true,
                        lastName: true,
                      }
                    },
                    subject: {
                      select: {
                        name: true
                      }
                    }
                  },
                }
              }
            },
          },
        },
      },
      orderBy: {
        lastActivityAt: 'desc',
      },
      take: 6,
    });

    // Get upcoming assignments
    const assignments = await prisma.courseAssignment.findMany({
      where: {
        OR: [
          { studentId },
          {
            classId: {
              in: student.classes.map((c) => c.id),
            },
          },
        ],
        dueDate: {
          gte: new Date(),
        },
      },
      include: {
        course: {
          select: {
            title: true,
          },
        },
      },
      orderBy: {
        dueDate: 'asc',
      },
      take: 5,
    });

    // Transform data for frontend
    const dashboardData = {
      stats: {
        attendanceRate,
        submissionsCompleted: gradedSubmissions.length,
        totalSubmissions: submissions.length,
        daysUntilYearEnd: Math.max(0, daysUntilYearEnd),
        averageGrade,
      },
      courses: studentProgress.map((progress) => ({
        id: progress.lecture.section.course.id,
        title: progress.lecture.section.course.title,
        teacher: `${progress.lecture.section.course.teacher.firstName} ${progress.lecture.section.course.teacher.lastName}`,
        subject: progress.lecture.section.course.subject?.name,
        progress: Math.round(progress.watchedPercentage),
        lastAccessed: progress.lastActivityAt,
        currentModule: progress.lecture.section.title,
      })),
      assignments: assignments.map((assignment) => ({
        id: assignment.id,
        courseId: assignment.courseId,
        courseTitle: assignment.course.title,
        dueDate: assignment.dueDate,
        assignedAt: assignment.assignedAt,
      })),
      recentSubmissions: gradedSubmissions
        .sort((a, b) => {
          const dateA = a.submittedAt ? new Date(a.submittedAt).getTime() : 0;
          const dateB = b.submittedAt ? new Date(b.submittedAt).getTime() : 0;
          return dateB - dateA;
        })
        .slice(0, 5)
        .map((sub) => ({
          id: sub.id,
          courseTitle: sub.assignment.course.title,
          contentTitle: sub.assignment.title,
          grade: sub.grade,
          gradedAt: sub.submittedAt,
          feedback: sub.feedback,
        })),
    };

    return NextResponse.json(dashboardData);
  } catch (error) {
    console.error('Error fetching student dashboard:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
