import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import prisma from '@/lib/prisma';
import { AttendanceStatus } from '@/generated/prisma';

// POST /api/attendance - Record attendance
export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user || session.user.role !== 'TEACHER') {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { studentId, classId, status, date } = body;

    // Validate status is a valid AttendanceStatus
    const validStatuses = Object.values(AttendanceStatus);
    if (!validStatuses.includes(status)) {
      return NextResponse.json(
        { message: `Invalid status. Must be one of: ${validStatuses.join(', ')}` },
        { status: 400 }
      );
    }

    const attendance = await prisma.attendance.create({
      data: {
        studentId,
        classId,
        status,
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
