import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import prisma from '@/lib/prisma';
import { CourseStatus, Language } from '@/generated/prisma';

// GET /api/courses/[id] - Get a single course
export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await context.params;

    const course = await prisma.course.findUnique({
      where: { id: id },
      include: {
        teacher: {
          select: {
            id: true,
            name: true,
            email: true,
          }
        },
        school: {
          select: {
            id: true,
            name: true,
            code: true,
          }
        },
        subject: {
          select: {
            id: true,
            name: true,
          }
        },
        content: {
          orderBy: { contentOrder: 'asc' },
          select: {
            id: true,
            title: true,
            contentType: true,
            contentOrder: true,
            offlineAvailable: true,
          }
        },
        _count: {
          select: {
            content: true,
            assignments: true,
            progress: true,
          }
        }
      }
    });

    if (!course) {
      return NextResponse.json({ message: 'Course not found' }, { status: 404 });
    }

    // Check permissions based on role
    if (session.user.role === 'TEACHER') {
      // Teachers can only view their own courses
      if (course.teacherId !== session.user.id) {
        return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
      }
    } else if (session.user.role === 'STUDENT') {
      // Students can only view published courses they're assigned to
      if (course.status !== CourseStatus.PUBLISHED) {
        return NextResponse.json({ message: 'Course not available' }, { status: 403 });
      }

      const hasAccess = await prisma.courseAssignment.findFirst({
        where: {
          courseId: course.id,
          OR: [
            { studentId: session.user.id },
            { class: { students: { some: { id: session.user.id } } } }
          ]
        }
      });

      if (!hasAccess) {
        return NextResponse.json({ message: 'Access denied' }, { status: 403 });
      }
    } else if (session.user.role === 'PARENT') {
      // Parents can only view published courses assigned to their verified children
      if (course.status !== CourseStatus.PUBLISHED) {
        return NextResponse.json({ message: 'Course not available' }, { status: 403 });
      }

      // Check if parent has access through their children
      const childRelations = await prisma.userRelationship.findMany({
        where: {
          parentId: session.user.id,
          isVerified: true
        },
        select: { studentId: true }
      });

      const childIds = childRelations.map(r => r.studentId);
      const hasAccess = childIds.length > 0 && await prisma.courseAssignment.findFirst({
        where: {
          courseId: course.id,
          studentId: { in: childIds }
        }
      });

      if (!hasAccess) {
        return NextResponse.json({ message: 'Access denied' }, { status: 403 });
      }
    }

    return NextResponse.json({ course });

  } catch (error) {
    console.error('Error fetching course:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PUT /api/courses/[id] - Update a course
export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    // Only teachers, educational managers, and admins can update courses
    if (!['TEACHER', 'EDUCATIONAL_MANAGER', 'ADMIN'].includes(session.user.role)) {
      return NextResponse.json(
        { message: 'Forbidden: Insufficient permissions' },
        { status: 403 }
      );
    }

    const { id } = await context.params;
    const body = await request.json();
    const {
      title,
      description,
      subjectId,
      language,
      requiresOnline,
      thumbnailUrl,
      status,
    } = body;

    // Check if course exists
    const existingCourse = await prisma.course.findUnique({
      where: { id: id }
    });

    if (!existingCourse) {
      return NextResponse.json({ message: 'Course not found' }, { status: 404 });
    }

    // Teachers can only update their own courses
    if (session.user.role === 'TEACHER' && existingCourse.teacherId !== session.user.id) {
      return NextResponse.json(
        { message: 'Forbidden: You can only update your own courses' },
        { status: 403 }
      );
    }

    // If subjectId is being changed, verify it exists and belongs to the same school
    if (subjectId && subjectId !== existingCourse.subjectId) {
      const subject = await prisma.subject.findUnique({
        where: { id: subjectId }
      });

      if (!subject || subject.schoolId !== existingCourse.schoolId) {
        return NextResponse.json(
          { message: 'Subject not found or does not belong to the same school' },
          { status: 404 }
        );
      }
    }

    // Build update data object
    const updateData: any = {};
    if (title !== undefined) updateData.title = title;
    if (description !== undefined) updateData.description = description;
    if (subjectId !== undefined) updateData.subjectId = subjectId;
    if (language !== undefined) updateData.language = language;
    if (requiresOnline !== undefined) updateData.requiresOnline = requiresOnline;
    if (thumbnailUrl !== undefined) updateData.thumbnailUrl = thumbnailUrl;
    if (status !== undefined) updateData.status = status;

    // Update course
    const course = await prisma.course.update({
      where: { id: id },
      data: updateData,
      include: {
        teacher: {
          select: {
            id: true,
            name: true,
            email: true,
          }
        },
        school: {
          select: {
            id: true,
            name: true,
          }
        },
        subject: {
          select: {
            id: true,
            name: true,
          }
        }
      }
    });

    return NextResponse.json({
      message: 'Course updated successfully',
      course
    });

  } catch (error) {
    console.error('Error updating course:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}

// DELETE /api/courses/[id] - Delete a course
export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    // Only teachers, educational managers, and admins can delete courses
    if (!['TEACHER', 'EDUCATIONAL_MANAGER', 'ADMIN'].includes(session.user.role)) {
      return NextResponse.json(
        { message: 'Forbidden: Insufficient permissions' },
        { status: 403 }
      );
    }

    const { id } = await context.params;

    // Check if course exists
    const existingCourse = await prisma.course.findUnique({
      where: { id: id },
      include: {
        _count: {
          select: {
            assignments: true,
            progress: true,
            content: true,
          }
        }
      }
    });

    if (!existingCourse) {
      return NextResponse.json({ message: 'Course not found' }, { status: 404 });
    }

    // Teachers can only delete their own courses
    if (session.user.role === 'TEACHER' && existingCourse.teacherId !== session.user.id) {
      return NextResponse.json(
        { message: 'Forbidden: You can only delete your own courses' },
        { status: 403 }
      );
    }

    // Check if course has active assignments or progress
    if (existingCourse._count.assignments > 0 || existingCourse._count.progress > 0) {
      return NextResponse.json(
        {
          message: 'Cannot delete course with active assignments or student progress. Archive it instead.',
          canDelete: false,
          hasAssignments: existingCourse._count.assignments > 0,
          hasProgress: existingCourse._count.progress > 0,
        },
        { status: 400 }
      );
    }

    // Delete course (will cascade delete content due to schema)
    await prisma.course.delete({
      where: { id: id }
    });

    return NextResponse.json({
      message: 'Course deleted successfully'
    });

  } catch (error) {
    console.error('Error deleting course:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}