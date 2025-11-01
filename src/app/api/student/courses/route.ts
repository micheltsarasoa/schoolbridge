import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import prisma from '@/lib/prisma';

// GET /api/student/courses - Get courses assigned to the current student, grouped by subject
export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user || session.user.role !== 'STUDENT') {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const studentId = session.user.id;

    // Get student's class assignments
    const student = await prisma.user.findUnique({
      where: { id: studentId },
      select: {
        id: true,
        classes: {
          select: {
            id: true,
          },
        },
      },
    });

    if (!student || student.classes.length === 0) {
      return NextResponse.json([]);
    }

    const classIds = student.classes.map(c => c.id);

    // Get courses assigned to the student's classes or directly to the student
    const courseAssignments = await prisma.courseAssignment.findMany({
      where: {
        OR: [
          { studentId: studentId },
          { classId: { in: classIds } },
        ],
      },
      select: {
        course: {
          select: {
            id: true,
            title: true,
            subjectId: true,
            status: true,
            subject: {
              select: {
                id: true,
                name: true,
              },
            },
            content: {
              select: {
                offlineAvailable: true,
              },
            },
          },
        },
      },
    });

    // Filter published courses only
    const publishedCourses = courseAssignments
      .map(assignment => assignment.course)
      .filter(course => course.status === 'PUBLISHED');

    // Check if any content is offline available
    const coursesWithOffline = publishedCourses.map(course => ({
      id: course.id,
      title: course.title,
      subjectId: course.subjectId,
      subjectName: course.subject.name,
      hasOfflineContent: course.content.some(c => c.offlineAvailable),
    }));

    // Group courses by subject
    const groupedBySubject = coursesWithOffline.reduce((acc, course) => {
      const subjectName = course.subjectName;
      if (!acc[subjectName]) {
        acc[subjectName] = {
          subjectId: course.subjectId,
          subjectName: subjectName,
          courses: [],
        };
      }
      acc[subjectName].courses.push({
        id: course.id,
        title: course.title,
        hasOfflineContent: course.hasOfflineContent,
      });
      return acc;
    }, {} as Record<string, { subjectId: string; subjectName: string; courses: { id: string; title: string; hasOfflineContent: boolean }[] }>);

    // Convert to array
    const result = Object.values(groupedBySubject);

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error fetching student courses:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
