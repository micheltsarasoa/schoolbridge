import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import prisma from '@/lib/prisma';

// GET /api/progress/stats - Get progress statistics
export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const searchParams = request.nextUrl.searchParams;
    const courseId = searchParams.get('courseId');
    const studentId = searchParams.get('studentId');

    // Validate permissions
    if (session.user.role === 'STUDENT') {
      // Students can only get their own stats
      if (studentId && studentId !== session.user.id) {
        return NextResponse.json(
          { message: 'Forbidden: Cannot view other students stats' },
          { status: 403 }
        );
      }
    }

    // Build base query
    let statsStudentId = studentId;
    if (session.user.role === 'STUDENT' && !studentId) {
      statsStudentId = session.user.id;
    }

    if (!courseId && !statsStudentId) {
      return NextResponse.json(
        { message: 'Either courseId or studentId is required' },
        { status: 400 }
      );
    }

    let stats: any = {};

    if (courseId && statsStudentId) {
      // Get stats for a specific student in a specific course
      const course = await prisma.course.findUnique({
        where: { id: courseId },
        select: {
          id: true,
          title: true,
          _count: {
            select: { content: true }
          }
        }
      });

      if (!course) {
        return NextResponse.json({ message: 'Course not found' }, { status: 404 });
      }

      const progress = await prisma.studentProgress.findMany({
        where: {
          courseId,
          studentId: statsStudentId,
        },
        select: {
          completionPercentage: true,
          timeSpentMinutes: true,
        }
      });

      const avgCompletionPercentage = progress.length > 0
        ? Math.round(progress.reduce((sum, p) => sum + p.completionPercentage, 0) / progress.length)
        : 0;
      const completedCount = progress.filter(p => p.completionPercentage === 100).length;
      const totalTimeSpent = progress.reduce((sum, p) => sum + p.timeSpentMinutes, 0);
      const completionPercentage = avgCompletionPercentage;

      stats = {
        courseId: course.id,
        courseTitle: course.title,
        studentId: statsStudentId,
        totalContent: course._count.content,
        completedContent: completedCount,
        inProgressContent: progress.length - completedCount,
        completionPercentage,
        totalTimeSpent,
        averageTimePerContent: progress.length > 0 ? Math.round(totalTimeSpent / progress.length) : 0,
      };

    } else if (courseId) {
      // Get stats for all students in a course (teacher/admin view)
      if (!['TEACHER', 'ADMIN', 'EDUCATIONAL_MANAGER'].includes(session.user.role)) {
        return NextResponse.json(
          { message: 'Forbidden: Insufficient permissions' },
          { status: 403 }
        );
      }

      const course = await prisma.course.findUnique({
        where: { id: courseId },
        select: {
          id: true,
          title: true,
          teacherId: true,
          _count: {
            select: {
              content: true,
              assignments: true,
            }
          }
        }
      });

      if (!course) {
        return NextResponse.json({ message: 'Course not found' }, { status: 404 });
      }

      // Teachers can only see stats for their own courses
      if (session.user.role === 'TEACHER' && course.teacherId !== session.user.id) {
        return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
      }

      const allProgress = await prisma.studentProgress.findMany({
        where: { courseId },
        select: {
          studentId: true,
          completionPercentage: true,
          timeSpentMinutes: true,
        }
      });

      const studentStats = allProgress.reduce((acc: any, p) => {
        if (!acc[p.studentId]) {
          acc[p.studentId] = { completionPercentage: 0, timeSpent: 0, total: 0 };
        }
        acc[p.studentId].total++;
        acc[p.studentId].completionPercentage = Math.max(acc[p.studentId].completionPercentage, p.completionPercentage);
        acc[p.studentId].timeSpent += p.timeSpentMinutes;
        return acc;
      }, {});

      const totalStudents = Object.keys(studentStats).length;
      const avgCompletion = totalStudents > 0
        ? Object.values(studentStats).reduce((sum: number, s: any) => {
            return sum + s.completionPercentage;
          }, 0) / totalStudents
        : 0;

      stats = {
        courseId: course.id,
        courseTitle: course.title,
        totalContent: course._count.content,
        totalStudents: course._count.assignments,
        activeStudents: totalStudents,
        averageCompletionPercentage: Math.round(avgCompletion),
        studentStats: Object.entries(studentStats).map(([studentId, data]: [string, any]) => ({
          studentId,
          completionPercentage: data.completionPercentage,
          totalTimeSpent: data.timeSpent,
        })),
      };

    } else if (statsStudentId) {
      // Get stats for a student across all courses
      const courses = await prisma.course.findMany({
        where: {
          assignments: {
            some: {
              OR: [
                { studentId: statsStudentId },
                { class: { students: { some: { id: statsStudentId } } } }
              ]
            }
          }
        },
        select: {
          id: true,
          title: true,
          _count: {
            select: { content: true }
          }
        }
      });

      const courseStats = await Promise.all(
        courses.map(async (course) => {
          const progress = await prisma.studentProgress.findMany({
            where: {
              courseId: course.id,
              studentId: statsStudentId,
            },
            select: {
              completionPercentage: true,
              timeSpentMinutes: true,
            }
          });

          const avgCompletionPercentage = progress.length > 0
            ? Math.round(progress.reduce((sum, p) => sum + p.completionPercentage, 0) / progress.length)
            : 0;
          const totalTimeSpent = progress.reduce((sum, p) => sum + p.timeSpentMinutes, 0);

          return {
            courseId: course.id,
            courseTitle: course.title,
            totalContent: course._count.content,
            completionPercentage: avgCompletionPercentage,
            totalTimeSpent,
          };
        })
      );

      const totalCourses = courses.length;
      const totalCompleted = courseStats.filter(c => c.completionPercentage === 100).length;
      const avgCompletion = totalCourses > 0
        ? courseStats.reduce((sum, c) => sum + c.completionPercentage, 0) / totalCourses
        : 0;
      const totalTime = courseStats.reduce((sum, c) => sum + c.totalTimeSpent, 0);

      stats = {
        studentId: statsStudentId,
        totalCourses,
        completedCourses: totalCompleted,
        inProgressCourses: totalCourses - totalCompleted,
        averageCompletionPercentage: Math.round(avgCompletion),
        totalTimeSpent: totalTime,
        courses: courseStats,
      };
    }

    return NextResponse.json({ stats });

  } catch (error) {
    console.error('Error fetching progress stats:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
