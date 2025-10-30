import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import prisma from '@/lib/prisma';

// GET /api/courses/[courseId]/content/[contentId] - Get a specific content item
export async function GET(
  request: NextRequest,
  context: { params: Promise<{ courseId: string; contentId: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const { courseId, contentId } = await context.params;

    // Get content with course info
    const content = await prisma.courseContent.findUnique({
      where: { id: contentId },
      include: {
        course: {
          select: {
            id: true,
            teacherId: true,
            status: true,
          }
        }
      }
    });

    if (!content || content.courseId !== courseId) {
      return NextResponse.json({ message: 'Content not found' }, { status: 404 });
    }

    // Check access permissions
    const isTeacher = session.user.role === 'TEACHER' && content.course.teacherId === session.user.id;
    const isAdmin = session.user.role === 'ADMIN' || session.user.role === 'EDUCATIONAL_MANAGER';

    const isStudentWithAccess = session.user.role === 'STUDENT' && await prisma.courseAssignment.findFirst({
      where: {
        courseId: content.courseId,
        OR: [
          { studentId: session.user.id },
          { class: { students: { some: { id: session.user.id } } } }
        ]
      }
    });

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
            courseId: content.courseId,
            studentId: { in: childIds }
          }
        }));
      }
    }

    if (!isTeacher && !isAdmin && !isStudentWithAccess && !isParentWithAccess) {
      return NextResponse.json({ message: 'Access denied' }, { status: 403 });
    }

    // Remove course object from response
    const { course, ...contentData } = content;

    return NextResponse.json({ content: contentData });

  } catch (error) {
    console.error('Error fetching content:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PUT /api/courses/[courseId]/content/[contentId] - Update a content item
export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ courseId: string; contentId: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    // Only teachers, educational managers, and admins can update content
    if (!['TEACHER', 'EDUCATIONAL_MANAGER', 'ADMIN'].includes(session.user.role)) {
      return NextResponse.json(
        { message: 'Forbidden: Insufficient permissions' },
        { status: 403 }
      );
    }

    const { courseId, contentId } = await context.params;
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

    // Check if content exists
    const existingContent = await prisma.courseContent.findUnique({
      where: { id: contentId },
      include: {
        course: {
          select: {
            teacherId: true,
          }
        }
      }
    });

    if (!existingContent || existingContent.courseId !== courseId) {
      return NextResponse.json({ message: 'Content not found' }, { status: 404 });
    }

    // Teachers can only update content from their own courses
    if (session.user.role === 'TEACHER' && existingContent.course.teacherId !== session.user.id) {
      return NextResponse.json(
        { message: 'Forbidden: You can only update content from your own courses' },
        { status: 403 }
      );
    }

    // Build update data object
    const updateData: any = {};
    if (title !== undefined) updateData.title = title;
    if (description !== undefined) updateData.description = description;
    if (type !== undefined) updateData.type = type;
    if (order !== undefined) updateData.order = order;
    if (requiresOnline !== undefined) updateData.requiresOnline = requiresOnline;
    if (contentUrl !== undefined) updateData.contentUrl = contentUrl;
    if (duration !== undefined) updateData.duration = duration;

    // Update content
    const content = await prisma.courseContent.update({
      where: { id: contentId },
      data: updateData,
    });

    return NextResponse.json({
      message: 'Content updated successfully',
      content
    });

  } catch (error) {
    console.error('Error updating content:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}

// DELETE /api/courses/[courseId]/content/[contentId] - Delete a content item
export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ courseId: string; contentId: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    // Only teachers, educational managers, and admins can delete content
    if (!['TEACHER', 'EDUCATIONAL_MANAGER', 'ADMIN'].includes(session.user.role)) {
      return NextResponse.json(
        { message: 'Forbidden: Insufficient permissions' },
        { status: 403 }
      );
    }

    const { courseId, contentId } = await context.params;

    // Check if content exists
    const existingContent = await prisma.courseContent.findUnique({
      where: { id: contentId },
      include: {
        course: {
          select: {
            teacherId: true,
          }
        }
      }
    });

    if (!existingContent || existingContent.courseId !== courseId) {
      return NextResponse.json({ message: 'Content not found' }, { status: 404 });
    }

    // Teachers can only delete content from their own courses
    if (session.user.role === 'TEACHER' && existingContent.course.teacherId !== session.user.id) {
      return NextResponse.json(
        { message: 'Forbidden: You can only delete content from your own courses' },
        { status: 403 }
      );
    }

    // Delete content
    await prisma.courseContent.delete({
      where: { id: contentId }
    });

    return NextResponse.json({
      message: 'Content deleted successfully'
    });

  } catch (error) {
    console.error('Error deleting content:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
