import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import prisma from '@/lib/prisma';

// GET /api/student/course/[courseId]/lesson/[lessonId] - Get lesson details
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ courseId: string; lessonId: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user || session.user.role !== 'STUDENT') {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const studentId = session.user.id;
    const { courseId, lessonId } = await params;

    // Verify student is enrolled in this course
    const student = await prisma.user.findUnique({
      where: { id: studentId },
      select: {
        classes: {
          select: { id: true },
        },
      },
    });

    if (!student) {
      return NextResponse.json({ message: 'Student not found' }, { status: 404 });
    }

    const classIds = student.classes.map((c) => c.id);

    // Verify course access and get lesson content
    // Include both class-based assignments and individual student assignments
    const courseContent = await prisma.courseContent.findFirst({
      where: {
        id: lessonId,
        course: {
          id: courseId,
          status: 'PUBLISHED',  // Only show content from published courses
          assignments: {
            some: {
              OR: [
                ...(classIds.length > 0 ? [{ classId: { in: classIds } }] : []),  // Class assignments (if any)
                { studentId: studentId },        // Courses assigned directly to this student
              ],
            },
          },
        },
      },
      include: {
        course: {
          select: {
            id: true,
            title: true,
          },
        },
      },
    });

    if (!courseContent) {
      return NextResponse.json({ message: 'Lesson not found or access denied' }, { status: 404 });
    }

    // Parse content data (stored as JSON)
    let parsedContent = {};
    try {
      if (courseContent.contentData) {
        parsedContent = typeof courseContent.contentData === 'string'
          ? JSON.parse(courseContent.contentData)
          : courseContent.contentData;
      }
    } catch (e) {
      console.error('Error parsing content data:', e);
      parsedContent = courseContent.contentData || {};
    }

    return NextResponse.json({
      lesson: {
        id: courseContent.id,
        courseId: courseContent.course.id,
        courseName: courseContent.course.title,
        title: courseContent.title,
        type: courseContent.contentType,
        content: parsedContent,
        order: courseContent.contentOrder,
        offlineAvailable: courseContent.offlineAvailable,
      },
    });
  } catch (error) {
    console.error('Error fetching lesson details:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
