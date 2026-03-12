import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';

// POST /api/student/course/complete - Mark course as completed
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ courseId?: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user || session.user.role !== 'STUDENT') {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { courseId } = body;

    if (!courseId) {
      return NextResponse.json(
        { message: 'courseId is required' },
        { status: 400 }
      );
    }

    const studentId = session.user.id;

    // Update or create student progress with 100% completion
    const studentProgress = await prisma.courseProgress.upsert({
      where: {
        studentId_courseId: {
          studentId: studentId,
          courseId: courseId,
        },
      },
      update: {
        completionPercentage: 100,
        updatedAt: new Date(),
      },
      create: {
        studentId: studentId,
        courseId: courseId,
        completionPercentage: 100,
      },
    });

    return NextResponse.json({
      message: 'Course marked as completed',
      progress: studentProgress,
    });
  } catch (error) {
    console.error('Error completing course:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
