import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';

// GET /api/student/course/[courseId] - Get course details for student
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ courseId: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user || session.user.role !== 'STUDENT') {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const studentId = session.user.id;
    const { courseId } = await params;

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

    // Get the course and verify student has access through CourseAssignment
    // Include both class-based assignments and individual student assignments
    const course = await prisma.course.findFirst({
      where: {
        id: courseId,
        status: 'PUBLISHED',  // Only show published courses
        assignments: {
          some: {
            OR: [
              ...(classIds.length > 0 ? [{ classId: { in: classIds } }] : []),  // Class assignments (if any)
              { studentId: studentId },        // Courses assigned directly to this student
            ],
          },
        },
      },
      include: {
        subject: {
          select: { name: true },
        },
        teacher: {
          select: {
            id: true,
            name: true,
          },
        },
        content: {
          select: {
            id: true,
            title: true,
            contentType: true,
            contentOrder: true,
          },
          orderBy: { contentOrder: 'asc' },
        },
      },
    });

    if (!course) {
      return NextResponse.json({ message: 'Course not found or access denied' }, { status: 404 });
    }

    const teacher = course.teacher;

    // Get student progress for this course
    const studentProgress = await prisma.studentProgress.findUnique({
      where: {
        studentId_courseId: {
          studentId: studentId,
          courseId: courseId,
        },
      },
    });

    const progressPercentage = studentProgress?.completionPercentage || 0;

    // Format course data
    const formattedCourse = {
      id: course.id,
      title: course.title,
      description: course.description,
      subject: course.subject.name,
      teacher: teacher ? teacher.name : 'Unknown',
      teacherId: teacher ? teacher.id : null,
      progress: Math.round(progressPercentage),
      contentCount: course.content.length,
      content: course.content.map((content) => ({
        id: content.id,
        title: content.title,
        type: content.contentType,
        order: content.contentOrder,
        isCompleted: false, // TODO: Check if student completed this
      })),
    };

    // Calculate completed content count based on progress
    const completedCount = Math.round((progressPercentage / 100) * course.content.length);

    return NextResponse.json({
      course: formattedCourse,
      stats: {
        totalContent: course.content.length,
        completedContent: completedCount,
      },
    });
  } catch (error) {
    console.error('Error fetching course details:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
