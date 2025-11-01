import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import prisma from '@/lib/prisma';

// GET /api/classes/[classId]/students - Get students for a specific class
export async function GET(request: NextRequest, { params }: { params: Promise<{ classId: string }> }) {
  try {
    const session = await auth();
    if (!session?.user || session.user.role !== 'TEACHER') {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const { classId } = await params;

    const students = await prisma.user.findMany({
      where: {
        role: 'STUDENT',
        classes: {
          some: {
            id: classId,
          },
        },
      },
      select: {
        id: true,
        name: true,
        // Add avatar if available in User model or a related profile model
      },
    });

    return NextResponse.json(students);
  } catch (error) {
    console.error('Error fetching class students:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
