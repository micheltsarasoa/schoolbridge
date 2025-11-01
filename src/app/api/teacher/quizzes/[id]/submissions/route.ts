import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import prisma from '@/lib/prisma';

// GET /api/teacher/quizzes/[id]/submissions - Get all submissions for a quiz
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const session = await auth();
    if (!session?.user || session.user.role !== 'TEACHER') {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    // Verify teacher owns this quiz
    const quiz = await prisma.quiz.findUnique({
      where: { id },
      include: {
        courseContent: {
          include: {
            course: {
              select: { teacherId: true },
            },
          },
        },
      },
    });

    if (!quiz || quiz.courseContent.course.teacherId !== session.user.id) {
      return NextResponse.json({ message: 'Access denied' }, { status: 403 });
    }

    // Get all submissions
    const submissions = await prisma.quizSubmission.findMany({
      where: { quizId: id },
      include: {
        student: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        responses: {
          include: {
            question: {
              select: {
                text: true,
                correctAnswer: true,
                points: true,
              },
            },
          },
        },
      },
      orderBy: { submittedAt: 'desc' },
    });

    // Format data with analytics
    const formattedSubmissions = submissions.map((submission) => ({
      id: submission.id,
      studentId: submission.student.id,
      studentName: submission.student.name,
      studentEmail: submission.student.email,
      score: submission.score,
      totalPoints: submission.totalPoints,
      passed: submission.score !== null && submission.score >= quiz.passingScore,
      status: submission.status,
      attemptNumber: submission.attemptNumber,
      startedAt: submission.startedAt,
      submittedAt: submission.submittedAt,
      timeSpent: submission.timeSpent,
      correctAnswers: submission.responses.filter((r) => r.isCorrect === true).length,
      totalQuestions: submission.responses.length,
      needsReview: submission.responses.some((r) => r.isCorrect === null),
      responses: submission.responses,
    }));

    // Calculate statistics
    const submitted = formattedSubmissions.filter((s) => s.status === 'SUBMITTED' || s.status === 'GRADED');
    const passedCount = submitted.filter((s) => s.passed).length;
    const averageScore = submitted.length > 0
      ? submitted.reduce((sum, s) => sum + (s.score || 0), 0) / submitted.length
      : 0;

    return NextResponse.json({
      submissions: formattedSubmissions,
      stats: {
        totalSubmissions: formattedSubmissions.length,
        submitted: submitted.length,
        passed: passedCount,
        averageScore: Math.round(averageScore),
        passRate: submitted.length > 0 ? Math.round((passedCount / submitted.length) * 100) : 0,
      },
    });
  } catch (error) {
    console.error('Error fetching quiz submissions:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
