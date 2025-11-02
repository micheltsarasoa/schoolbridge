import { NextResponse, NextRequest } from 'next/server';
import { auth } from '@/auth';
import prisma from '@/lib/prisma';
import { CourseStatus } from '@/generated/prisma';

// GET /api/courses - Get all courses for the authenticated user
export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    let courses;

    if (session.user.role === 'TEACHER') {
      // Teachers see their own courses
      courses = await prisma.course.findMany({
        where: { teacherId: session.user.id },
        include: {
          subject: { select: { id: true, name: true } },
          _count: { select: { content: true, progress: true } },
        },
        orderBy: { createdAt: 'desc' },
      });
    } else if (session.user.role === 'ADMIN' || session.user.role === 'EDUCATIONAL_MANAGER') {
      // Admins see all courses
      courses = await prisma.course.findMany({
        include: {
          teacher: { select: { id: true, name: true } },
          subject: { select: { id: true, name: true } },
          _count: { select: { content: true, progress: true } },
        },
        orderBy: { createdAt: 'desc' },
      });
    } else {
      return NextResponse.json(
        { message: 'Insufficient permissions' },
        { status: 403 }
      );
    }

    return NextResponse.json({ courses });
  } catch (error) {
    console.error('Error fetching courses:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST /api/courses - Create a new course
export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    // Only teachers, admins, and educational managers can create courses
    if (!['TEACHER', 'ADMIN', 'EDUCATIONAL_MANAGER'].includes(session.user.role)) {
      return NextResponse.json(
        { message: 'Insufficient permissions' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { title, description, subjectId, language, requiresOnline, thumbnailUrl } = body;

    // Validation
    if (!title || !description || !subjectId || !language) {
      return NextResponse.json(
        { message: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Verify subject exists and belongs to the same school
    const subject = await prisma.subject.findUnique({
      where: { id: subjectId },
      include: { school: { select: { id: true } } },
    });

    if (!subject) {
      return NextResponse.json(
        { message: 'Subject not found' },
        { status: 404 }
      );
    }

    // Teachers must be from the same school as the subject
    if (session.user.role === 'TEACHER') {
      const teacher = await prisma.user.findUnique({
        where: { id: session.user.id },
        select: { schoolId: true },
      });

      if (teacher?.schoolId !== subject.school.id) {
        return NextResponse.json(
          { message: 'Subject does not belong to your school' },
          { status: 403 }
        );
      }
    }

    // Create the course
    const course = await prisma.course.create({
      data: {
        title,
        description,
        subjectId,
        language,
        requiresOnline: requiresOnline ?? false,
        thumbnailUrl: thumbnailUrl || null,
        status: CourseStatus.DRAFT,
        teacherId: session.user.id,
        schoolId: subject.school.id,
      },
      include: {
        subject: { select: { id: true, name: true } },
        teacher: { select: { id: true, name: true } },
      },
    });

    return NextResponse.json({ course }, { status: 201 });
  } catch (error) {
    console.error('Error creating course:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}