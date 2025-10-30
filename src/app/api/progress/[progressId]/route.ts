import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import prisma from '@/lib/prisma';

// GET /api/progress/[progressId] - Get a specific progress record
export async function GET(
  request: NextRequest,
  context: { params: Promise<{ progressId: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const { progressId } = await context.params;

    const progress = await prisma.studentProgress.findUnique({
      where: { id: progressId },
      include: {
        student: {
          select: {
            id: true,
            name: true,
            email: true,
          }
        },
        course: {
          select: {
            id: true,
            title: true,
            teacherId: true,
          }
        }
      }
    });

    if (!progress) {
      return NextResponse.json({ message: 'Progress record not found' }, { status: 404 });
    }

    // Check permissions based on role
    if (session.user.role === 'STUDENT') {
      if (progress.studentId !== session.user.id) {
        return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
      }
    } else if (session.user.role === 'TEACHER') {
      if (progress.course.teacherId !== session.user.id) {
        return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
      }
    } else if (session.user.role === 'PARENT') {
      const hasAccess = await prisma.userRelationship.findFirst({
        where: {
          parentId: session.user.id,
          studentId: progress.studentId,
          isVerified: true,
        }
      });

      if (!hasAccess) {
        return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
      }
    }

    return NextResponse.json({ progress });

  } catch (error) {
    console.error('Error fetching progress:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}

// DELETE /api/progress/[progressId] - Delete a progress record
export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ progressId: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const { progressId } = await context.params;

    // Only students (for their own progress) and admins can delete progress
    if (!['STUDENT', 'ADMIN', 'EDUCATIONAL_MANAGER'].includes(session.user.role)) {
      return NextResponse.json(
        { message: 'Forbidden: Insufficient permissions' },
        { status: 403 }
      );
    }

    const progress = await prisma.studentProgress.findUnique({
      where: { id: progressId }
    });

    if (!progress) {
      return NextResponse.json({ message: 'Progress record not found' }, { status: 404 });
    }

    // Students can only delete their own progress
    if (session.user.role === 'STUDENT' && progress.studentId !== session.user.id) {
      return NextResponse.json(
        { message: 'Forbidden: You can only delete your own progress' },
        { status: 403 }
      );
    }

    await prisma.studentProgress.delete({
      where: { id: progressId }
    });

    return NextResponse.json({
      message: 'Progress record deleted successfully'
    });

  } catch (error) {
    console.error('Error deleting progress:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
