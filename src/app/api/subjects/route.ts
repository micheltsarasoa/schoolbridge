import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';

// GET /api/subjects - Get all available subjects
export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    let subjects;

    if (session.user.role === 'TEACHER') {
      // Teachers see subjects from their school
      const teacher = await prisma.user.findUnique({
        where: { id: session.user.id },
        select: { schoolId: true },
      });

      if (!teacher?.schoolId) {
        return NextResponse.json(
          { message: 'User not associated with a school' },
          { status: 400 }
        );
      }

      subjects = await prisma.subject.findMany({
        where: { schoolId: teacher.schoolId },
        select: {
          id: true,
          name: true,
        },
        orderBy: { name: 'asc' },
      });
    } else if (session.user.role === 'ADMIN' || session.user.role === 'EDUCATIONAL_MANAGER') {
      // Admins see all subjects from their school (or all if multi-tenant)
      let schoolId = undefined;
      if (session.user.role === 'EDUCATIONAL_MANAGER') {
        const manager = await prisma.user.findUnique({
          where: { id: session.user.id },
          select: { schoolId: true },
        });
        schoolId = manager?.schoolId ?? undefined;
      }

      subjects = await prisma.subject.findMany({
        where: schoolId ? { schoolId } : undefined,
        select: {
          id: true,
          name: true,
        },
        orderBy: { name: 'asc' },
      });
    } else if (session.user.role === 'STUDENT') {
      // Students see subjects from their school
      const student = await prisma.user.findUnique({
        where: { id: session.user.id },
        select: { schoolId: true },
      });

      if (!student?.schoolId) {
        return NextResponse.json(
          { message: 'User not associated with a school' },
          { status: 400 }
        );
      }

      subjects = await prisma.subject.findMany({
        where: { schoolId: student.schoolId },
        select: {
          id: true,
          name: true,
        },
        orderBy: { name: 'asc' },
      });
    } else {
      return NextResponse.json(
        { message: 'Insufficient permissions' },
        { status: 403 }
      );
    }

    return NextResponse.json({ subjects });
  } catch (error) {
    console.error('Error fetching subjects:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
