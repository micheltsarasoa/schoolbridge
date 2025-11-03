import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import prisma from '@/lib/prisma';

// GET /api/student/quiz-results/[submissionId] - Get quiz submission results for review
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ submissionId: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user || session.user.role !== 'STUDENT') {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const { submissionId } = await params;
    const studentId = session.user.id;

    // Get the submission with all related data
    const submission = await prisma.quizSubmission.findUnique({
      where: { id: submissionId },
      include: {
        quiz: {
          include: {
            courseContent: {
              include: {
                course: true,
              },
            },
          },
        },
        responses: {
          include: {
            question: {
              select: {
                id: true,
                text: true,
                questionType: true,
                explanation: true,
                points: true,
                correctAnswer: true,
                order: true,
              },
            },
          },
          orderBy: {
            question: {
              order: 'asc',
            },
          },
        },
      },
    });

    if (!submission) {
      return NextResponse.json({ message: 'Submission not found' }, { status: 404 });
    }

    // Verify the submission belongs to the current student
    if (submission.studentId !== studentId) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 403 });
    }

    // Only allow review of completed submissions
    if (submission.status === 'IN_PROGRESS') {
      return NextResponse.json(
        { message: 'Cannot review an in-progress quiz' },
        { status: 400 }
      );
    }

    // Calculate stats
    const correctAnswers = submission.responses.filter((r) => r.isCorrect === true).length;
    const totalQuestions = submission.responses.length;
    const earnedPoints = submission.responses.reduce((sum, r) => sum + r.pointsEarned, 0);
    const totalPoints = submission.totalPoints || submission.responses.reduce((sum, r) => sum + r.question.points, 0);
    const passed = submission.score !== null && submission.score >= submission.quiz.passingScore;

    // Format response
    return NextResponse.json({
      submission: {
        id: submission.id,
        quizId: submission.quizId,
        quizTitle: submission.quiz.title,
        courseTitle: submission.quiz.courseContent.course.title,
        score: submission.score,
        totalPoints,
        earnedPoints,
        submittedAt: submission.submittedAt?.toISOString(),
        timeSpent: submission.timeSpent,
        status: submission.status,
        responses: submission.responses.map((response) => ({
          questionId: response.questionId,
          question: {
            text: response.question.text,
            type: response.question.questionType,
            explanation: response.question.explanation,
            points: response.question.points,
            correctAnswer: response.question.correctAnswer,
          },
          studentAnswer: response.studentAnswer,
          isCorrect: response.isCorrect,
          pointsEarned: response.pointsEarned,
        })),
      },
      stats: {
        correctAnswers,
        totalQuestions,
        passed,
        score: submission.score,
        earnedPoints,
        totalPoints,
      },
      quizMode: submission.quiz.mode,
    });
  } catch (error) {
    console.error('Error fetching quiz results:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
