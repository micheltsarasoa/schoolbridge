import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import { UserRole } from '@/generated/prisma';

// GET /api/courses/[id]/structure - Get course structure for download selection (accessible by students)
export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const { id: courseId } = await context.params;
    const userId = session.user.id;
    const userRole = session.user.role;

    // 1. Verify course exists and is published/approved
    const course = await prisma.course.findUnique({
      where: { id: courseId },
      select: { 
        id: true, 
        status: true,
        // Check if user is the teacher or admin (to allow preview/editing access)
        instructorId: true,
        totalSizeBytes: true // For US 2.3 Pre-Download Storage Indicator
      },
    });

    if (!course) {
      return NextResponse.json({ message: 'Course not found' }, { status: 404 });
    }

    const isAuthorized = 
        userRole === UserRole.ADMIN ||
        course.instructorId === userId;
    
    const isEnrolled = await prisma.courseEnrollment.findUnique({
        where: {
            courseId_userId: { courseId, userId },
        },
    });

    // Check enrollment for students, or if it's an approved course, allow teacher/admin
    if (!isAuthorized && !isEnrolled) {
      return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
    }

    // Students can only access PUBLISHED or APPROVED courses
    if (!isAuthorized && course.status !== 'PUBLISHED' && course.status !== 'APPROVED') {
        return NextResponse.json({ message: 'Course is not available' }, { status: 403 });
    }

    // 2. Fetch the hierarchical structure: Sections and Lectures
    const structure = await prisma.section.findMany({
      where: { courseId },
      orderBy: { order: 'asc' },
      select: {
        id: true,
        title: true,
        order: true,
        lectures: {
          orderBy: { order: 'asc' },
          select: {
            id: true,
            title: true,
            type: true,
            order: true,
            sizeBytes: true,
            estimatedDataUsage: true,
            offlineAvailable: true,
            downloadPriority: true,
            video: {
                select: {
                    defaultQuality: true, // Baseline for selection
                    contentVariants: {
                        select: {
                            quality: true,
                            sizeInBytes: true,
                            url: true,
                            resolution: true,
                        },
                    },
                },
            },
          },
        },
      },
    });

    // Assuming we need to adjust the structure to return the course level data as well
    const courseStructure = {
        courseId: course.id,
        totalSizeBytes: course.totalSizeBytes, // For US 2.3 Course size indicator
        sections: structure,
    };

    return NextResponse.json(courseStructure);
  } catch (error) {
    console.error('Error fetching course structure:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}