import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import prisma from '@/lib/prisma';

// POST /api/attendance - Record attendance
export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user || session.user.role !== 'TEACHER') {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { studentId, classId, status, date } = body;

    let present = false;
    let notes: string | undefined = undefined;

    if (status === 'Present') {
      present = true;
    } else if (status === 'Absent') {
      present = false;
    } else if (status === 'Late') {
      present = true;
      notes = 'Late';
    } else if (status === 'Excused') {
      present = false;
      notes = 'Excused';
    }

    const attendance = await prisma.attendance.create({
      data: {
        studentId,
        classId,
        present,
        notes,
        date: new Date(date),
        recordedById: session.user.id,
      },
    });

    return NextResponse.json({ message: 'Attendance recorded successfully', attendance });
  } catch (error) {
    console.error('Error recording attendance:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}

// GET /api/attendance - Get attendance records
export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const studentId = searchParams.get('studentId');
    const classId = searchParams.get('classId');

    const where: any = {};
    if (studentId) {
      where.studentId = studentId;
    }
    if (classId) {
      where.classId = classId;
    }

    const attendanceRecords = await prisma.attendance.findMany({
      where,
      include: {
        student: {
          select: {
            id: true,
            name: true,
          },
        },
        class: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    return NextResponse.json({ attendanceRecords });
  } catch (error) {
    console.error('Error fetching attendance:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
