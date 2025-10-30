import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import prisma from '@/lib/prisma';
import { CourseStatus, Language } from '@/generated/prisma';

// GET /api/courses - List courses with filters
export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const status = searchParams.get('status') as CourseStatus | null;
    const language = searchParams.get('language') as Language | null;
    const schoolId = searchParams.get('schoolId');
    const teacherId = searchParams.get('teacherId');
    const search = searchParams.get('search');

    const skip = (page - 1) * limit;

    // Build where clause based on user role and filters
    const where: any = {};

    // Role-based filtering
    if (session.user.role === 'TEACHER') {
      where.teacherId = session.user.id;
    } else if (session.user.role === 'STUDENT') {
      // Students can only see published courses assigned to them
      where.status = CourseStatus.PUBLISHED;
      where.assignments = {
        some: {
          OR: [
            { studentId: session.user.id },
            { class: { students: { some: { id: session.user.id } } } }
          ]
        }
      };
    } else if (session.user.role === 'PARENT') {
      // Parents can see courses assigned to their children
      where.status = CourseStatus.PUBLISHED;
      where.assignments = {
        some: {
          student: {
            studentRelations: {
              some: { parentId: session.user.id, isVerified: true }
            }
          }
        }
      };
    }

    // Admin and Educational Manager can see all courses with optional filters
    if (session.user.role === 'ADMIN' || session.user.role === 'EDUCATIONAL_MANAGER') {
      if (schoolId) where.schoolId = schoolId;
      if (teacherId) where.teacherId = teacherId;
    }

    // Apply additional filters
    if (status) where.status = status;
    if (language) where.language = language;
    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } }
      ];
    }

    const [courses, total] = await Promise.all([
      prisma.course.findMany({
        where,
        skip,
        take: limit,
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
          _count: {
            select: {
              content: true,
              assignments: true,
              progress: true,
            }
          }
        },
        orderBy: { updatedAt: 'desc' },
      }),
      prisma.course.count({ where }),
    ]);

    return NextResponse.json({
      courses,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      }
    });

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

    // Only teachers, educational managers, and admins can create courses
    if (!['TEACHER', 'EDUCATIONAL_MANAGER', 'ADMIN'].includes(session.user.role)) {
      return NextResponse.json(
        { message: 'Forbidden: Insufficient permissions' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const {
      title,
      description,
      schoolId,
      subjectId,
      language,
      requiresOnline,
      thumbnailUrl,
    } = body;

    // Validation
    if (!title || !schoolId || !subjectId) {
      return NextResponse.json(
        { message: 'Missing required fields: title, schoolId, subjectId' },
        { status: 400 }
      );
    }

    // Verify school exists
    const school = await prisma.school.findUnique({
      where: { id: schoolId }
    });
    if (!school) {
      return NextResponse.json(
        { message: 'School not found' },
        { status: 404 }
      );
    }

    // Verify subject exists and belongs to the school
    const subject = await prisma.subject.findUnique({
      where: { id: subjectId }
    });
    if (!subject || subject.schoolId !== schoolId) {
      return NextResponse.json(
        { message: 'Subject not found or does not belong to the school' },
        { status: 404 }
      );
    }

    // Create course
    const course = await prisma.course.create({
      data: {
        title,
        description,
        teacherId: session.user.id,
        schoolId,
        subjectId,
        language: language || Language.FR,
        requiresOnline: requiresOnline || false,
        thumbnailUrl,
        status: CourseStatus.DRAFT,
      },
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

    return NextResponse.json(
      { message: 'Course created successfully', course },
      { status: 201 }
    );

  } catch (error) {
    console.error('Error creating course:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
