import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import prisma from '@/lib/prisma';
import { ContentType } from '@/generated/prisma';

// GET /api/courses/[courseId]/content - Get all content for a course
export async function GET(
  request: NextRequest,
  context: { params: Promise<{ courseId: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const { courseId } = await context.params;

    // Verify course exists and user has access
    const course = await prisma.course.findUnique({
      where: { id: courseId },
      select: {
        id: true,
        teacherId: true,
        status: true,
        assignments: {
          where: {
            OR: [
              { studentId: session.user.id },
              { class: { students: { some: { id: session.user.id } } } }
            ]
          },
          take: 1,
        }
      }
    });

    if (!course) {
      return NextResponse.json({ message: 'Course not found' }, { status: 404 });
    }

    // Check access permissions
    const isTeacher = session.user.role === 'TEACHER' && course.teacherId === session.user.id;
    const isAdmin = session.user.role === 'ADMIN' || session.user.role === 'EDUCATIONAL_MANAGER';
    const isStudentWithAccess = session.user.role === 'STUDENT' && course.assignments.length > 0;

    // Check if parent has access through their children
    let isParentWithAccess = false;
    if (session.user.role === 'PARENT') {
      const childRelations = await prisma.userRelationship.findMany({
        where: {
          parentId: session.user.id,
          isVerified: true
        },
        select: { studentId: true }
      });

      const childIds = childRelations.map(r => r.studentId);
      if (childIds.length > 0) {
        isParentWithAccess = !!(await prisma.courseAssignment.findFirst({
          where: {
            courseId: course.id,
            studentId: { in: childIds }
          }
        }));
      }
    }

    if (!isTeacher && !isAdmin && !isStudentWithAccess && !isParentWithAccess) {
      return NextResponse.json({ message: 'Access denied' }, { status: 403 });
    }

    // Get content
    const content = await prisma.courseContent.findMany({
      where: { courseId },
      orderBy: { contentOrder: 'asc' },
      select: {
        id: true,
        title: true,
        contentType: true,
        contentOrder: true,
        contentData: true,
        fileReference: true,
        offlineAvailable: true,
        appearsAfterSeconds: true,
        disappearsAfterSeconds: true,
        createdAt: true,
        updatedAt: true,
      }
    });

    return NextResponse.json({ content });

  } catch (error) {
    console.error('Error fetching course content:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST /api/courses/[courseId]/content - Create new content for a course
export async function POST(
  request: NextRequest,
  context: { params: Promise<{ courseId: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    // Only teachers, educational managers, and admins can create content
    if (!['TEACHER', 'EDUCATIONAL_MANAGER', 'ADMIN'].includes(session.user.role)) {
      return NextResponse.json(
        { message: 'Forbidden: Insufficient permissions' },
        { status: 403 }
      );
    }

    const { courseId } = await context.params;
    const body = await request.json();
    const {
      title,
      description,
      type,
      order,
      requiresOnline,
      contentUrl,
      duration,
    } = body;

    // Validation
    if (!title || !type) {
      return NextResponse.json(
        { message: 'Missing required fields: title, type' },
        { status: 400 }
      );
    }

    // Verify course exists
    const course = await prisma.course.findUnique({
      where: { id: courseId }
    });

    if (!course) {
      return NextResponse.json({ message: 'Course not found' }, { status: 404 });
    }

    // Teachers can only add content to their own courses
    if (session.user.role === 'TEACHER' && course.teacherId !== session.user.id) {
      return NextResponse.json(
        { message: 'Forbidden: You can only add content to your own courses' },
        { status: 403 }
      );
    }

    // If order not specified, add to end
    let contentOrder = order;
    if (contentOrder === undefined || contentOrder === null) {
      const lastContent = await prisma.courseContent.findFirst({
        where: { courseId },
        orderBy: { contentOrder: 'desc' },
        select: { contentOrder: true }
      });
      contentOrder = lastContent ? lastContent.contentOrder + 1 : 0;
    }

    // Create content
    const content = await prisma.courseContent.create({
      data: {
        title,
        contentType: type,
        contentOrder: contentOrder,
        contentData: {
          description: description || '',
          duration: duration || 0,
        },
        offlineAvailable: !requiresOnline,
        fileReference: contentUrl,
        appearsAfterSeconds: null,
        disappearsAfterSeconds: null,
        courseId,
      }
    });

    return NextResponse.json(
      { message: 'Content created successfully', content },
      { status: 201 }
    );

  } catch (error) {
    console.error('Error creating course content:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
