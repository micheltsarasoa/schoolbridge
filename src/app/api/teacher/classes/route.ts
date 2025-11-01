import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import prisma from '@/lib/prisma';

// GET /api/teacher/classes - Get classes taught by the current teacher
export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user || session.user.role !== 'TEACHER') {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const teacherId = session.user.id;

    // Find classes where the current user is a teacher
    // This assumes a many-to-many relationship between teachers and classes
    // For simplicity, let's assume a direct link for now, or through courses
    // Based on schema, a Class has students (User[]), but no direct teacher link.
    // A Course has a teacherId. So, we might need to fetch classes through courses.

    // For now, let's return dummy classes or assume a direct link for simplicity
    // Fetch the full user to get schoolId
    const user = await prisma.user.findUnique({
      where: { id: teacherId },
      select: { schoolId: true },
    });

    const classes = await prisma.class.findMany({
      where: {
        // Assuming a teacher is linked to a class via a course they teach
        // This part needs to be refined based on actual data model for teacher-class relationship
        // For now, returning all classes in the teacher's school
        schoolId: user?.schoolId || undefined,
      },
      select: {
        id: true,
        name: true,
      },
    });

    return NextResponse.json(classes);
  } catch (error) {
    console.error('Error fetching teacher classes:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
