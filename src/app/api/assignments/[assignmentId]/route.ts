import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import prisma from '@/lib/prisma';

// GET /api/assignments/[assignmentId] - Get a specific assignment
export async function GET(
  request: NextRequest,
  context: { params: Promise<{ assignmentId: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const { assignmentId } = await context.params;

    const assignment = await prisma.courseAssignment.findUnique({
      where: { id: assignmentId },
      include: {
        course: {
          select: {
            id: true,
            title: true,
            description: true,
            thumbnailUrl: true,
            teacherId: true,
            status: true,
          }
        },
        class: {
          select: {
            id: true,
            name: true,
            _count: {
              select: {
                students: true,
              }
            }
          }
        }
      }
    });

    if (!assignment) {
      return NextResponse.json({ message: 'Assignment not found' }, { status: 404 });
    }

    // Check permissions based on role
    if (session.user.role === 'STUDENT') {
      // Students can see their own assignments or class assignments they belong to
      if (assignment.studentId && assignment.studentId !== session.user.id) {
        return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
      }
      if (assignment.classId) {
        const isInClass = await prisma.class.findFirst({
          where: {
            id: assignment.classId,
            students: {
              some: { id: session.user.id }
            }
          }
        });
        if (!isInClass) {
          return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
        }
      }
    } else if (session.user.role === 'TEACHER') {
      // Teachers can see assignments for their courses
      if (assignment.course.teacherId !== session.user.id) {
        return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
      }
    } else if (session.user.role === 'PARENT') {
      // Parents can see assignments for their verified children
      if (assignment.studentId) {
        const hasAccess = await prisma.userRelationship.findFirst({
          where: {
            parentId: session.user.id,
            studentId: assignment.studentId,
            isVerified: true,
          }
        });
        if (!hasAccess) {
          return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
        }
      } else if (assignment.classId) {
        const hasAccess = await prisma.class.findFirst({
          where: {
            id: assignment.classId,
            students: {
              some: {
                studentRelations: {
                  some: {
                    parentId: session.user.id,
                    isVerified: true
                  }
                }
              }
            }
          }
        });
        if (!hasAccess) {
          return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
        }
      }
    }

    return NextResponse.json({ assignment });

  } catch (error) {
    console.error('Error fetching assignment:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PUT /api/assignments/[assignmentId] - Update an assignment
export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ assignmentId: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    // Only teachers, educational managers, and admins can update assignments
    if (!['TEACHER', 'EDUCATIONAL_MANAGER', 'ADMIN'].includes(session.user.role)) {
      return NextResponse.json(
        { message: 'Forbidden: Insufficient permissions' },
        { status: 403 }
      );
    }

    const { assignmentId } = await context.params;
    const body = await request.json();
    const { dueDate } = body;

    // Check if assignment exists
    const existingAssignment = await prisma.courseAssignment.findUnique({
      where: { id: assignmentId },
      include: {
        course: {
          select: {
            teacherId: true,
          }
        }
      }
    });

    if (!existingAssignment) {
      return NextResponse.json({ message: 'Assignment not found' }, { status: 404 });
    }

    // Teachers can only update assignments for their own courses
    if (session.user.role === 'TEACHER' && existingAssignment.course.teacherId !== session.user.id) {
      return NextResponse.json(
        { message: 'Forbidden: You can only update assignments for your own courses' },
        { status: 403 }
      );
    }

    // Build update data object
    const updateData: any = {};
    if (dueDate !== undefined) {
      updateData.dueDate = dueDate ? new Date(dueDate) : null;
    }

    // Update assignment
    const assignment = await prisma.courseAssignment.update({
      where: { id: assignmentId },
      data: updateData,
      include: {
        course: {
          select: {
            id: true,
            title: true,
          }
        },
        class: {
          select: {
            id: true,
            name: true,
          }
        }
      }
    });

    return NextResponse.json({
      message: 'Assignment updated successfully',
      assignment
    });

  } catch (error) {
    console.error('Error updating assignment:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}

// DELETE /api/assignments/[assignmentId] - Delete an assignment
export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ assignmentId: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    // Only teachers, educational managers, and admins can delete assignments
    if (!['TEACHER', 'EDUCATIONAL_MANAGER', 'ADMIN'].includes(session.user.role)) {
      return NextResponse.json(
        { message: 'Forbidden: Insufficient permissions' },
        { status: 403 }
      );
    }

    const { assignmentId } = await context.params;

    // Check if assignment exists
    const existingAssignment = await prisma.courseAssignment.findUnique({
      where: { id: assignmentId },
      include: {
        course: {
          select: {
            teacherId: true,
          }
        }
      }
    });

    if (!existingAssignment) {
      return NextResponse.json({ message: 'Assignment not found' }, { status: 404 });
    }

    // Teachers can only delete assignments for their own courses
    if (session.user.role === 'TEACHER' && existingAssignment.course.teacherId !== session.user.id) {
      return NextResponse.json(
        { message: 'Forbidden: You can only delete assignments for your own courses' },
        { status: 403 }
      );
    }

    // Delete assignment (will cascade delete related progress records due to schema)
    await prisma.courseAssignment.delete({
      where: { id: assignmentId }
    });

    return NextResponse.json({
      message: 'Assignment deleted successfully'
    });

  } catch (error) {
    console.error('Error deleting assignment:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
