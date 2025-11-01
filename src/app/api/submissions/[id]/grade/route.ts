import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import prisma from '@/lib/prisma';

// PUT /api/submissions/[id]/grade - Grade a submission
export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await auth();
    if (!session?.user || session.user.role !== 'TEACHER') {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();
    const { grade, feedback } = body;

    const submission = await prisma.submission.update({
      where: { id },
      data: {
        grade,
        feedback,
        gradedAt: new Date(),
        gradedById: session.user.id,
      },
    });

    return NextResponse.json({ message: 'Submission graded successfully', submission });
  } catch (error) {
    console.error('Error grading submission:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
