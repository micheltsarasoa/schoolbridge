import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import prisma from '@/lib/prisma';

// GET /api/student/courses - Get student's courses
export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user || session.user.role !== 'STUDENT') {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const studentId = session.user.id;

    // Get student's classes to find enrolled courses
    const studentClasses = await prisma.user.findUnique({
      where: { id: studentId },
      select: {
        classes: {
          select: { id: true },
        },
      },
    });

    const classIds = studentClasses?.classes.map((c) => c.id) || [];

    // Get all courses for the student's classes through CourseAssignment
    // Include both class-based assignments and individual student assignments
    const courses = await prisma.course.findMany({
      where: {
        status: 'PUBLISHED',  // Only show published courses
        assignments: {
          some: {
            OR: [
              ...(classIds.length > 0 ? [{ classId: { in: classIds } }] : []),  // Courses assigned to student's classes (if any)
              { studentId: studentId },        // Courses assigned directly to this student
            ],
          },
        },
      },
      include: {
        subject: true,
        teacher: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        content: {
          select: { id: true },
        },
      },
    });

    // Get student progress for all courses
    const progressData = await prisma.studentProgress.findMany({
      where: {
        studentId: studentId,
        courseId: {
          in: courses.map((c) => c.id),
        },
      },
    });

    // Create a map of course progress
    const progressMap = new Map(
      progressData.map((p) => [p.courseId, p.completionPercentage])
    );

    // Format courses data
    const formattedCourses = courses.map((course) => {
      return {
        id: course.id,
        title: course.title,
        description: course.description,
        subject: course.subject.name,
        teacher: course.teacher?.name || 'Unknown',
        teacherId: course.teacher?.id || null,
        progress: Math.round(progressMap.get(course.id) || 0),
        lastAccessed: 'Never',
        contentCount: course.content.length,
      };
    });

    // Get unique subjects
    const subjects = [...new Set(formattedCourses.map((c) => c.subject))].sort();

    return NextResponse.json({
      courses: formattedCourses,
      stats: {
        totalCourses: formattedCourses.length,
        subjects,
      },
    });
  } catch (error) {
    console.error('Error fetching student courses:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
