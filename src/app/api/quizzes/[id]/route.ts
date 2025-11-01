import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import prisma from '@/lib/prisma';

// GET /api/quizzes/[id] - Get quiz with questions
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

    const quiz = await prisma.quiz.findUnique({
      where: { id },
      include: {
        questions: {
          orderBy: { order: 'asc' },
        },
        courseContent: {
          select: {
            id: true,
            title: true,
            courseId: true,
          },
        },
      },
    });

    if (!quiz) {
      return NextResponse.json({ message: 'Quiz not found' }, { status: 404 });
    }

    // Filter questions based on quiz mode
    // In EXAM mode during the quiz, don't show correct answers
    // In PRACTICE mode, show explanations (but not during the quiz, only in results)
    const filteredQuestions = quiz.questions.map((q) => ({
      id: q.id,
      questionType: q.questionType,
      text: q.text,
      explanation: quiz.mode === 'PRACTICE' ? q.explanation : undefined, // Only show explanations in practice mode
      order: q.order,
      points: q.points,
      options: q.options,
      // Never return correctAnswer during quiz (shown only in results)
    }));

    // Check if student has access to this quiz (if they're a student)
    if (session.user.role === 'STUDENT') {
      const courseAssignment = await prisma.courseAssignment.findFirst({
        where: {
          courseId: quiz.courseContent.courseId,
          OR: [
            { studentId: session.user.id },
            {
              classId: {
                in: (
                  await prisma.user.findUnique({
                    where: { id: session.user.id },
                    select: { classes: { select: { id: true } } },
                  })
                )?.classes.map((c) => c.id) || [],
              },
            },
          ],
        },
      });

      if (!courseAssignment) {
        return NextResponse.json({ message: 'Access denied' }, { status: 403 });
      }
    }

    // Get or create quiz submission if student
    let quizSubmission = null;
    if (session.user.role === 'STUDENT') {
      quizSubmission = await prisma.quizSubmission.findFirst({
        where: {
          quizId: id,
          studentId: session.user.id,
          status: 'IN_PROGRESS',
        },
      });

      if (!quizSubmission) {
        // Create new submission
        quizSubmission = await prisma.quizSubmission.create({
          data: {
            quizId: id,
            studentId: session.user.id,
            attemptNumber: 1,
          },
        });
      }
    }

    return NextResponse.json({
      quiz: {
        id: quiz.id,
        title: quiz.title,
        description: quiz.description,
        passingScore: quiz.passingScore,
        timeLimit: quiz.timeLimit,
        mode: quiz.mode,
        showAnswersAfter: quiz.showAnswersAfter,
        questions: filteredQuestions,
        submissionId: quizSubmission?.id,
      },
    });
  } catch (error) {
    console.error('Error fetching quiz:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
