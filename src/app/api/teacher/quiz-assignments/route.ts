import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import prisma from '@/lib/prisma';

// GET /api/teacher/quiz-assignments - Get all quiz assignments for teacher (timeline)
export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user || session.user.role !== 'TEACHER') {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const sortBy = searchParams.get('sortBy') || 'scheduledDate'; // scheduledDate, dueDate, createdAt

    // Get all quizzes created by this teacher
    const quizzesAndAssignments = await prisma.quizAssignment.findMany({
      where: {
        quiz: {
          courseContent: {
            course: {
              teacherId: session.user.id,
            },
          },
        },
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
            submissions: {
              select: {
                id: true,
                studentId: true,
                score: true,
                status: true,
                submittedAt: true,
                student: {
                  select: {
                    id: true,
                    name: true,
                  },
                },
              },
            },
          },
        },
        class: {
          select: {
            id: true,
            name: true,
            students: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
      },
      orderBy: {
        [sortBy]: 'desc',
      },
    });

    // Transform data for timeline view
    const assignments = quizzesAndAssignments.map((assignment) => {
      const totalStudents = assignment.class?.students.length || 1;
      const submissionsMap = new Map(
        assignment.quiz.submissions.map((s) => [s.studentId, s])
      );

      let submittedCount = 0;
      let passedCount = 0;
      let averageScore = 0;

      assignment.quiz.submissions.forEach((submission) => {
        if (submission.status === 'SUBMITTED' || submission.status === 'GRADED') {
          submittedCount++;
          if (submission.score !== null && submission.score >= assignment.quiz.passingScore) {
            passedCount++;
          }
          if (submission.score !== null) {
            averageScore += submission.score;
          }
        }
      });

      averageScore = submittedCount > 0 ? averageScore / submittedCount : 0;

      return {
        id: assignment.id,
        quizId: assignment.quizId,
        quizTitle: assignment.quiz.title,
        courseTitle: assignment.quiz.courseContent.course.title,
        subjectName: assignment.quiz.courseContent.course.subject.name,
        className: assignment.class?.name,
        assignedAt: assignment.assignedAt,
        dueDate: assignment.dueDate,
        scheduledDate: assignment.scheduledDate,
        passingScore: assignment.quiz.passingScore,
        submissions: {
          total: submittedCount,
          passed: passedCount,
          pending: totalStudents - submittedCount,
          averageScore: Math.round(averageScore),
        },
        students: assignment.class?.students || [],
      };
    });

    return NextResponse.json({
      assignments,
      total: assignments.length,
    });
  } catch (error) {
    console.error('Error fetching quiz assignments:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
