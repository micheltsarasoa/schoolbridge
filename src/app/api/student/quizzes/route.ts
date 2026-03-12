import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';

// GET /api/student/quizzes - Get student's quizzes organized by status (To Do, In Progress, Completed)
export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user || session.user.role !== 'STUDENT') {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const studentId = session.user.id;

    // Get student's class enrollments to find assigned quizzes
    const student = await prisma.user.findUnique({
      where: { id: studentId },
      select: {
        classes: {
          select: { id: true },
        },
      },
    });

    if (!student || student.classes.length === 0) {
      return NextResponse.json({
        todo: [],
        inProgress: [],
        completed: [],
        stats: {
          totalQuizzes: 0,
          todoCount: 0,
          inProgressCount: 0,
          completedCount: 0,
          totalAttempts: 0,
          averageScore: 0,
        },
      });
    }

    const classIds = student.classes.map((c) => c.id);

    // Get all quiz assignments for this student (individual + class-based)
    const quizAssignments = await prisma.quizAssignment.findMany({
      where: {
        OR: [
          { studentId }, // Individual assignments
          { classId: { in: classIds } }, // Class assignments
        ],
      },
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
            questions: {
              select: { id: true },
            },
          },
        },
      },
    });

    // Get all quiz submissions for this student
    const submissions = await prisma.quizSubmission.findMany({
      where: { studentId },
      select: {
        id: true,
        quizId: true,
        score: true,
        totalPoints: true,
        status: true,
        attemptNumber: true,
        startedAt: true,
        submittedAt: true,
        timeSpent: true,
        responses: {
          select: { isCorrect: true },
        },
      },
    });

    // Create a map for quick lookup
    const submissionMap: Record<string, typeof submissions> = {};
    submissions.forEach((sub) => {
      if (!submissionMap[sub.quizId]) {
        submissionMap[sub.quizId] = [];
      }
      submissionMap[sub.quizId].push(sub);
    });

    // Process each quiz assignment
    const processedQuizzes = quizAssignments
      .map((assignment) => {
        const quiz = assignment.quiz;
        const quizSubmissions = submissionMap[quiz.id] || [];
        const latestSubmission = quizSubmissions[0]; // Most recent submission

        // Determine display status
        let displayStatus = 'TODO';
        if (latestSubmission) {
          if (latestSubmission.status === 'IN_PROGRESS') {
            displayStatus = 'IN_PROGRESS';
          } else if (latestSubmission.status === 'SUBMITTED' || latestSubmission.status === 'GRADED') {
            displayStatus = 'COMPLETED';
          }
        }

        return {
          id: quiz.id,
          title: quiz.title,
          description: quiz.description,
          course: quiz.courseContent.course.title,
          subject: quiz.courseContent.course.subject.name,
          dueDate: assignment.dueDate?.toISOString().split('T')[0],
          timeLimit: quiz.timeLimit ? `${quiz.timeLimit} minutes` : 'Unlimited',
          questions: quiz.questions.length,
          attempts: quizSubmissions.filter((sub) => sub.status !== 'IN_PROGRESS').length,
          maxAttempts: 3, // Default, can be customized per assignment
          status: latestSubmission?.status || 'TODO',
          displayStatus,
          score: latestSubmission?.score,
          totalPoints: latestSubmission?.totalPoints,
          correctAnswers: latestSubmission
            ? latestSubmission.responses.filter((r) => r.isCorrect === true).length
            : 0,
          totalQuestionsAttempted: latestSubmission?.responses.length || 0,
          submittedAt: latestSubmission?.submittedAt?.toISOString(),
          startedAt: latestSubmission?.startedAt?.toISOString(),
          timeSpent: latestSubmission?.timeSpent,
          latestSubmissionId: latestSubmission?.id,
          allSubmissions: quizSubmissions.map((sub) => ({
            id: sub.id,
            attemptNumber: sub.attemptNumber,
            status: sub.status,
            score: sub.score,
            submittedAt: sub.submittedAt?.toISOString(),
          })),
        };
      })
      .filter((quiz) => quiz); // Remove any undefined values

    // Group quizzes by display status
    const todoQuizzes = processedQuizzes.filter((q) => q.displayStatus === 'TODO');
    const inProgressQuizzes = processedQuizzes.filter((q) => q.displayStatus === 'IN_PROGRESS');
    const completedQuizzes = processedQuizzes.filter((q) => q.displayStatus === 'COMPLETED');

    // Calculate stats
    const totalAttempts = processedQuizzes.reduce((sum, q) => sum + q.attempts, 0);
    const completedCount = completedQuizzes.length;
    const averageScore =
      completedQuizzes.length > 0
        ? Math.round(
            completedQuizzes.reduce((sum, q) => sum + (q.score || 0), 0) / completedQuizzes.length
          )
        : 0;

    return NextResponse.json({
      todo: todoQuizzes,
      inProgress: inProgressQuizzes,
      completed: completedQuizzes,
      stats: {
        totalQuizzes: processedQuizzes.length,
        todoCount: todoQuizzes.length,
        inProgressCount: inProgressQuizzes.length,
        completedCount,
        totalAttempts,
        averageScore,
      },
    });
  } catch (error) {
    console.error('Error fetching student quizzes:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
