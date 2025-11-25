import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import prisma from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    
    if (!session?.user?.id) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    // Check if user is a teacher
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { role: true },
    });

    if (user?.role !== 'TEACHER') {
      return NextResponse.json({ message: 'Not a teacher account' }, { status: 403 });
    }

    // Get teacher approval status
    const approval = await prisma.teacherApproval.findUnique({
      where: { userId: session.user.id },
      select: {
        status: true,
        reason: true,
        reviewedAt: true,
      },
    });

    if (!approval) {
      return NextResponse.json({
        status: 'APPROVED', // If no approval record, assume approved (legacy accounts)
        reason: null,
        reviewedAt: null,
      });
    }

    return NextResponse.json(approval);
  } catch (error) {
    console.error('Error fetching teacher approval status:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
