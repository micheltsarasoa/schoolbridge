import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import prisma from '@/lib/prisma';

// GET /api/assignments - Get course assignments with filters
export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const searchParams = request.nextUrl.searchParams;
    const courseId = searchParams.get('courseId');
    const studentId = searchParams.get('studentId');
    const classId = searchParams.get('classId');

    // Build where clause based on user role and filters
    const where: any = {};

    // Role-based filtering
    if (session.user.role === 'STUDENT') {
      // Students can see assignments for themselves
      where.OR = [
        { studentId: session.user.id },
        { class: { students: { some: { id: session.user.id } } } }
      ];
    } else if (session.user.role === 'TEACHER') {
      // Teachers can see assignments for their courses
      where.course = {
        teacherId: session.user.id
      };
    } else if (session.user.role === 'PARENT') {
      // Parents can see assignments for their verified children
      where.OR = [
        {
          student: {
            studentRelations: {
              some: {
                parentId: session.user.id,
                isVerified: true
              }
            }
          }
        },
        {
          class: {
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
        }
      ];
    }
    // ADMIN and EDUCATIONAL_MANAGER can see all assignments (no additional filter)

    // Apply additional filters
    if (courseId) where.courseId = courseId;
    if (studentId) {
      // Only allow if user has permission to view this student
      if (session.user.role === 'STUDENT' && studentId !== session.user.id) {
        return NextResponse.json(
          { message: 'Forbidden: Cannot view other students assignments' },
          { status: 403 }
        );
      }
      where.studentId = studentId;
    }
    if (classId) where.classId = classId;

    const assignments = await prisma.courseAssignment.findMany({
      where,
      include: {
        course: {
          select: {
            id: true,
            title: true,
            description: true,
            thumbnailUrl: true,
          }
        },
        student: {
          select: {
            id: true,
            name: true,
            email: true,
          }
        },
        class: {
          select: {
            id: true,
            name: true,
          }
        }
      },
      orderBy: { assignedAt: 'desc' },
    });

    return NextResponse.json({ assignments });

  } catch (error) {
    console.error('Error fetching assignments:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST /api/assignments - Create a new course assignment
export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    // Only teachers, educational managers, and admins can create assignments
    if (!['TEACHER', 'EDUCATIONAL_MANAGER', 'ADMIN'].includes(session.user.role)) {
      return NextResponse.json(
        { message: 'Forbidden: Insufficient permissions' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const {
      courseId,
      studentId,
      classId,
      dueDate,
    } = body;

    // Validation
    if (!courseId) {
      return NextResponse.json(
        { message: 'Missing required field: courseId' },
        { status: 400 }
      );
    }

    // Must provide either studentId or classId
    if (!studentId && !classId) {
      return NextResponse.json(
        { message: 'Must provide either studentId or classId' },
        { status: 400 }
      );
    }

    // Cannot provide both
    if (studentId && classId) {
      return NextResponse.json(
        { message: 'Cannot provide both studentId and classId' },
        { status: 400 }
      );
    }

    // Verify course exists
    const course = await prisma.course.findUnique({
      where: { id: courseId },
      select: {
        id: true,
        teacherId: true,
        schoolId: true,
      }
    });

    if (!course) {
      return NextResponse.json({ message: 'Course not found' }, { status: 404 });
    }

    // Teachers can only assign their own courses
    if (session.user.role === 'TEACHER' && course.teacherId !== session.user.id) {
      return NextResponse.json(
        { message: 'Forbidden: You can only assign your own courses' },
        { status: 403 }
      );
    }

    // If studentId provided, verify student exists and belongs to the same school
    if (studentId) {
      const student = await prisma.user.findUnique({
        where: { id: studentId },
        select: {
          id: true,
          role: true,
          schoolId: true,
        }
      });

      if (!student) {
        return NextResponse.json({ message: 'Student not found' }, { status: 404 });
      }

      if (student.role !== 'STUDENT') {
        return NextResponse.json({ message: 'User is not a student' }, { status: 400 });
      }

      if (student.schoolId !== course.schoolId) {
        return NextResponse.json(
          { message: 'Student does not belong to the same school as the course' },
          { status: 400 }
        );
      }

      // Check if assignment already exists
      const existingAssignment = await prisma.courseAssignment.findFirst({
        where: {
          courseId,
          studentId,
        }
      });

      if (existingAssignment) {
        return NextResponse.json(
          { message: 'Course already assigned to this student' },
          { status: 409 }
        );
      }
    }

    // If classId provided, verify class exists and belongs to the same school
    if (classId) {
      const classData = await prisma.class.findUnique({
        where: { id: classId },
        select: {
          id: true,
          schoolId: true,
        }
      });

      if (!classData) {
        return NextResponse.json({ message: 'Class not found' }, { status: 404 });
      }

      if (classData.schoolId !== course.schoolId) {
        return NextResponse.json(
          { message: 'Class does not belong to the same school as the course' },
          { status: 400 }
        );
      }

      // Check if assignment already exists
      const existingAssignment = await prisma.courseAssignment.findFirst({
        where: {
          courseId,
          classId,
        }
      });

      if (existingAssignment) {
        return NextResponse.json(
          { message: 'Course already assigned to this class' },
          { status: 409 }
        );
      }
    }

    // Create assignment
    const assignment = await prisma.courseAssignment.create({
      data: {
        courseId,
        studentId,
        classId,
        dueDate: dueDate ? new Date(dueDate) : null,
      },
      include: {
        course: {
          select: {
            id: true,
            title: true,
          }
        },
        student: studentId ? {
          select: {
            id: true,
            name: true,
            email: true,
          }
        } : undefined,
        class: classId ? {
          select: {
            id: true,
            name: true,
          }
        } : undefined,
      }
    });

    return NextResponse.json(
      { message: 'Assignment created successfully', assignment },
      { status: 201 }
    );

  } catch (error) {
    console.error('Error creating assignment:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
