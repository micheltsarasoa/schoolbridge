import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import prisma from '@/lib/prisma';
import { DayOfWeek } from '@/generated/prisma';

// GET /api/teacher/schedules - Get all schedules for teacher
export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user || session.user.role !== 'TEACHER') {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const dayOfWeek = searchParams.get('dayOfWeek');

    const where: any = { teacherId: session.user.id };
    if (dayOfWeek && Object.values(DayOfWeek).includes(dayOfWeek as DayOfWeek)) {
      where.dayOfWeek = dayOfWeek;
    }

    const schedules = await prisma.classSchedule.findMany({
      where,
      include: {
        class: {
          include: {
            students: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
        },
      },
      orderBy: [
        { dayOfWeek: 'asc' },
        { plannedStartTime: 'asc' },
      ],
    });

    return NextResponse.json({ schedules });
  } catch (error) {
    console.error('Error fetching schedules:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST /api/teacher/schedules - Create schedule
export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user || session.user.role !== 'TEACHER') {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { classId, dayOfWeek, plannedStartTime, plannedDuration } = body;

    if (!classId || !dayOfWeek || !plannedStartTime || !plannedDuration) {
      return NextResponse.json(
        { message: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Verify teacher teaches this class
    const classExists = await prisma.class.findFirst({
      where: { id: classId },
    });

    if (!classExists) {
      return NextResponse.json(
        { message: 'Class not found' },
        { status: 404 }
      );
    }

    const schedule = await prisma.classSchedule.create({
      data: {
        classId,
        teacherId: session.user.id,
        dayOfWeek,
        plannedStartTime,
        plannedDuration,
      },
      include: {
        class: true,
      },
    });

    return NextResponse.json({ schedule }, { status: 201 });
  } catch (error: any) {
    console.error('Error creating schedule:', error);

    if (error.code === 'P2002') {
      return NextResponse.json(
        { message: 'Schedule already exists for this class on this day' },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
