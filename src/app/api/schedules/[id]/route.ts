import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import prisma from '@/lib/prisma';

// GET /api/schedules/[id] - Get single schedule
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const schedule = await prisma.classSchedule.findUnique({
      where: { id },
      include: {
        class: {
          include: {
            students: true,
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
    });

    if (!schedule) {
      return NextResponse.json({ message: 'Schedule not found' }, { status: 404 });
    }

    return NextResponse.json({ schedule });
  } catch (error) {
    console.error('Error fetching schedule:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PUT /api/schedules/[id] - Update schedule (actual times)
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const session = await auth();
    if (!session?.user || session.user.role !== 'TEACHER') {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { actualStartTime, actualDuration } = body;

    // Verify teacher owns this schedule
    const schedule = await prisma.classSchedule.findUnique({
      where: { id },
    });

    if (!schedule) {
      return NextResponse.json({ message: 'Schedule not found' }, { status: 404 });
    }

    if (schedule.teacherId !== session.user.id) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const updated = await prisma.classSchedule.update({
      where: { id },
      data: {
        actualStartTime: actualStartTime || undefined,
        actualDuration: actualDuration || undefined,
      },
      include: {
        class: true,
      },
    });

    return NextResponse.json({ schedule: updated });
  } catch (error) {
    console.error('Error updating schedule:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}

// DELETE /api/schedules/[id] - Delete schedule
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const session = await auth();
    if (!session?.user || session.user.role !== 'TEACHER') {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const schedule = await prisma.classSchedule.findUnique({
      where: { id },
    });

    if (!schedule) {
      return NextResponse.json({ message: 'Schedule not found' }, { status: 404 });
    }

    if (schedule.teacherId !== session.user.id) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    await prisma.classSchedule.delete({
      where: { id },
    });

    return NextResponse.json({ message: 'Schedule deleted successfully' });
  } catch (error) {
    console.error('Error deleting schedule:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
