import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import prisma from '@/lib/prisma';

type QuestionAnswerInput = {
  questionId: string;
  studentAnswer: string | string[] | boolean;
};

// POST /api/quizzes/[id]/submit - Submit quiz answers
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const session = await auth();
    if (!session?.user || session.user.role !== 'STUDENT') {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { submissionId, answers, timeSpent } = body;

    if (!submissionId || !answers || !Array.isArray(answers)) {
      return NextResponse.json(
        { message: 'Invalid request data' },
        { status: 400 }
      );
    }

    // Get quiz and questions
    const quiz = await prisma.quiz.findUnique({
      where: { id },
      include: {
        questions: true,
      },
    });

    if (!quiz) {
      return NextResponse.json({ message: 'Quiz not found' }, { status: 404 });
    }

    // Verify submission belongs to student
    const submission = await prisma.quizSubmission.findUnique({
      where: { id: submissionId },
    });

    if (!submission || submission.studentId !== session.user.id || submission.quizId !== id) {
      return NextResponse.json({ message: 'Access denied' }, { status: 403 });
    }

    // Grade quiz and save responses
    let totalPoints = 0;
    let earnedPoints = 0;

    const questionAnswerMap: { [key: string]: QuestionAnswerInput } = {};
    answers.forEach((answer: QuestionAnswerInput) => {
      questionAnswerMap[answer.questionId] = answer;
    });

    // Create question responses
    for (const question of quiz.questions) {
      const studentAnswer = questionAnswerMap[question.id];
      if (!studentAnswer) continue;

      // Check if answer is correct
      const correctAnswer = question.correctAnswer as any;
      let isCorrect = false;

      if (question.questionType === 'MULTIPLE_CHOICE' || question.questionType === 'TRUE_FALSE') {
        // Auto-grade objective questions
        if (correctAnswer.type === 'single') {
          isCorrect = studentAnswer.studentAnswer === correctAnswer.value;
        } else if (correctAnswer.type === 'multiple') {
          const studentAnswers = Array.isArray(studentAnswer.studentAnswer)
            ? studentAnswer.studentAnswer
            : [studentAnswer.studentAnswer];
          const correctAnswers = Array.isArray(correctAnswer.value)
            ? correctAnswer.value
            : [correctAnswer.value];
          isCorrect =
            studentAnswers.length === correctAnswers.length &&
            studentAnswers.every((a: any) => correctAnswers.includes(a));
        }
      }
      // SHORT_ANSWER and ESSAY require manual grading, isCorrect stays null

      totalPoints += question.points;
      if (isCorrect) {
        earnedPoints += question.points;
      }

      // Save question response
      await prisma.questionResponse.create({
        data: {
          questionId: question.id,
          submissionId,
          studentAnswer: studentAnswer.studentAnswer,
          isCorrect: question.questionType === 'SHORT_ANSWER' || question.questionType === 'ESSAY' ? null : isCorrect,
          pointsEarned: isCorrect ? question.points : 0,
        },
      });
    }

    // Calculate score percentage
    const score = totalPoints > 0 ? (earnedPoints / totalPoints) * 100 : 0;
    const passed = score >= quiz.passingScore;

    // Update submission
    const updatedSubmission = await prisma.quizSubmission.update({
      where: { id: submissionId },
      data: {
        submittedAt: new Date(),
        score,
        totalPoints,
        timeSpent: timeSpent || undefined,
        status: 'SUBMITTED',
      },
      include: {
        responses: {
          include: {
            question: true,
          },
        },
      },
    });

    return NextResponse.json({
      submission: updatedSubmission,
      passed,
      score,
      earnedPoints,
      totalPoints,
    });
  } catch (error) {
    console.error('Error submitting quiz:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
