import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import prisma from '@/lib/prisma';

// GET /api/student/quiz-progress - Get student's quiz submissions and progress
export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user || session.user.role !== 'STUDENT') {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const studentId = session.user.id;

    // Get all quiz submissions for the student
    const submissions = await prisma.quizSubmission.findMany({
      where: { studentId },
      include: {
        quiz: {
          include: {
            courseContent: {
              include: {
                course: {
                  select: {
                    title: true,
                    subject: { select: { name: true } },
                  },
                },
              },
            },
          },
        },
        responses: {
          select: {
            questionId: true,
            isCorrect: true,
            pointsEarned: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    // Format the data for the frontend
    const quizProgress = submissions.map((submission) => ({
      id: submission.id,
      quizId: submission.quizId,
      quizTitle: submission.quiz.title,
      courseTitle: submission.quiz.courseContent.course.title,
      subjectName: submission.quiz.courseContent.course.subject.name,
      score: submission.score,
      totalPoints: submission.totalPoints,
      passed: submission.score !== null && submission.score >= submission.quiz.passingScore,
      status: submission.status,
      attemptNumber: submission.attemptNumber,
      startedAt: submission.startedAt,
      submittedAt: submission.submittedAt,
      timeSpent: submission.timeSpent,
      correctAnswers: submission.responses.filter((r) => r.isCorrect === true).length,
      totalQuestions: submission.responses.length,
    }));

    // Calculate overall stats
    const submittedQuizzes = quizProgress.filter((q) => q.status === 'SUBMITTED' || q.status === 'GRADED');
    const passedQuizzes = submittedQuizzes.filter((q) => q.passed);
    const averageScore = submittedQuizzes.length > 0
      ? submittedQuizzes.reduce((sum, q) => sum + (q.score || 0), 0) / submittedQuizzes.length
      : 0;

    return NextResponse.json({
      quizProgress,
      stats: {
        totalAttempts: quizProgress.length,
        submittedQuizzes: submittedQuizzes.length,
        passedQuizzes: passedQuizzes.length,
        averageScore: Math.round(averageScore),
      },
    });
  } catch (error) {
    console.error('Error fetching quiz progress:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
