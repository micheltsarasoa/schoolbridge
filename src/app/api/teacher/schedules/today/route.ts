import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import prisma from '@/lib/prisma';
import { DayOfWeek } from '@/generated/prisma';

// GET /api/teacher/schedules/today - Get today's schedules for teacher
export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user || session.user.role !== 'TEACHER') {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    // Get today's day of week
    const days = ['SUNDAY', 'MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY'];
    const today = days[new Date().getDay()] as DayOfWeek;

    const schedules = await prisma.classSchedule.findMany({
      where: {
        teacherId: session.user.id,
        dayOfWeek: today,
      },
      include: {
        class: {
          include: {
            students: {
              select: {
                id: true,
                name: true,
              },
            },
            attendances: {
              where: {
                date: {
                  gte: new Date(new Date().toISOString().split('T')[0]),
                },
              },
            },
          },
        },
      },
      orderBy: {
        plannedStartTime: 'asc',
      },
    });

    return NextResponse.json({
      schedules,
      today,
      count: schedules.length,
    });
  } catch (error) {
    console.error('Error fetching today schedules:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
