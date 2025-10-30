import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import prisma from '@/lib/prisma';

// GET /api/progress - Get progress records with filters
export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const searchParams = request.nextUrl.searchParams;
    const courseId = searchParams.get('courseId');
    const studentId = searchParams.get('studentId');
    const contentId = searchParams.get('contentId');

    // Build where clause based on user role and filters
    const where: any = {};

    // Role-based filtering
    if (session.user.role === 'STUDENT') {
      // Students can only see their own progress
      where.studentId = session.user.id;
    } else if (session.user.role === 'TEACHER') {
      // Teachers can see progress for students in their courses
      where.course = {
        teacherId: session.user.id
      };
    } else if (session.user.role === 'PARENT') {
      // Parents can see progress for their verified children
      where.student = {
        studentRelations: {
          some: {
            parentId: session.user.id,
            isVerified: true
          }
        }
      };
    }
    // ADMIN and EDUCATIONAL_MANAGER can see all progress (no additional filter)

    // Apply additional filters
    if (courseId) where.courseId = courseId;
    if (studentId) {
      // Only allow if user has permission to view this student
      if (session.user.role === 'STUDENT' && studentId !== session.user.id) {
        return NextResponse.json(
          { message: 'Forbidden: Cannot view other students progress' },
          { status: 403 }
        );
      }
      where.studentId = studentId;
    }
    if (contentId) where.contentId = contentId;

    const progress = await prisma.studentProgress.findMany({
      where,
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
          }
        }
      },
      orderBy: { updatedAt: 'desc' },
    });

    return NextResponse.json({ progress });

  } catch (error) {
    console.error('Error fetching progress:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST /api/progress - Create or update progress record
export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    // Only students can create/update their own progress
    if (session.user.role !== 'STUDENT') {
      return NextResponse.json(
        { message: 'Forbidden: Only students can update progress' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const {
      courseId,
      contentId,
      completed,
      timeSpent,
      lastPosition,
    } = body;

    // Validation
    if (!courseId || !contentId) {
      return NextResponse.json(
        { message: 'Missing required fields: courseId, contentId' },
        { status: 400 }
      );
    }

    // Verify course exists and student has access
    const courseAssignment = await prisma.courseAssignment.findFirst({
      where: {
        courseId,
        OR: [
          { studentId: session.user.id },
          { class: { students: { some: { id: session.user.id } } } }
        ]
      }
    });

    if (!courseAssignment) {
      return NextResponse.json(
        { message: 'Course not assigned to you' },
        { status: 403 }
      );
    }

    // Verify content exists and belongs to the course
    const content = await prisma.courseContent.findUnique({
      where: { id: contentId }
    });

    if (!content || content.courseId !== courseId) {
      return NextResponse.json(
        { message: 'Content not found or does not belong to the course' },
        { status: 404 }
      );
    }

    // Check if progress record already exists
    const existingProgress = await prisma.studentProgress.findUnique({
      where: {
        studentId_courseId: {
          studentId: session.user.id,
          courseId,
        }
      }
    });

    let progress;

    if (existingProgress) {
      // Update existing progress
      progress = await prisma.studentProgress.update({
        where: {
          id: existingProgress.id
        },
        data: {
          completionPercentage: completed !== undefined ? (completed ? 100 : existingProgress.completionPercentage) : existingProgress.completionPercentage,
          timeSpentMinutes: timeSpent !== undefined ? existingProgress.timeSpentMinutes + timeSpent : existingProgress.timeSpentMinutes,
          currentModule: lastPosition !== undefined ? lastPosition : existingProgress.currentModule,
          lastAccessed: new Date(),
        },
        include: {
          course: {
            select: {
              id: true,
              title: true,
            }
          }
        }
      });
    } else {
      // Create new progress record
      progress = await prisma.studentProgress.create({
        data: {
          studentId: session.user.id,
          courseId,
          completionPercentage: completed ? 100 : 0,
          timeSpentMinutes: timeSpent || 0,
          currentModule: lastPosition,
        },
        include: {
          course: {
            select: {
              id: true,
              title: true,
            }
          }
        }
      });
    }

    return NextResponse.json(
      {
        message: existingProgress ? 'Progress updated successfully' : 'Progress created successfully',
        progress
      },
      { status: existingProgress ? 200 : 201 }
    );

  } catch (error) {
    console.error('Error creating/updating progress:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
