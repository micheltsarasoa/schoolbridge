import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import prisma from '@/lib/prisma';

// GET /api/submissions - Fetch submissions for grading (teacher only)
export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user || session.user.role !== 'TEACHER') {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const teacherId = session.user.id;
    const { searchParams } = new URL(request.url);
    const classId = searchParams.get('classId');
    const courseId = searchParams.get('courseId');

    // Fetch ungraded submissions for courses taught by this teacher
    const submissions = await prisma.submission.findMany({
      where: {
        grade: null, // Only ungraded submissions
        courseContent: {
          course: {
            teacherId, // Only courses taught by this teacher
            ...(courseId && { id: courseId }), // Optional course filter
          },
        },
        ...(classId && {
          // Optional class filter - student must be in the specified class
          student: {
            classes: {
              some: {
                id: classId,
              },
            },
          },
        }),
      },
      include: {
        student: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        courseContent: {
          include: {
            course: {
              select: {
                id: true,
                title: true,
                subject: {
                  select: {
                    name: true,
                  },
                },
              },
            },
          },
        },
      },
      orderBy: {
        submittedAt: 'asc', // Oldest first
      },
    });

    // Transform to match UI expectations
    const transformedSubmissions = submissions.map((sub) => ({
      id: sub.id,
      studentId: sub.student.id,
      studentName: sub.student.name,
      studentEmail: sub.student.email,
      courseId: sub.courseContent.course.id,
      courseTitle: sub.courseContent.course.title,
      subjectName: sub.courseContent.course.subject.name,
      contentTitle: sub.courseContent.title,
      submittedAt: sub.submittedAt,
      content: sub.content,
    }));

    return NextResponse.json(transformedSubmissions);
  } catch (error) {
    console.error('Error fetching submissions:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  // Logic to create a new submission (student submitting work)
  return NextResponse.json({ message: 'Create new submission' });
}
