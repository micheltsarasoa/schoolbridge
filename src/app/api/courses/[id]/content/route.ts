import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import prisma from '@/lib/prisma';
import { ContentType } from '@/generated/prisma';

// GET /api/courses/[id]/content - Get all content for a course
export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await context.params;

    // Verify course exists and user has access
    const course = await prisma.course.findUnique({
      where: { id },
      select: { teacherId: true, status: true },
    });

    if (!course) {
      return NextResponse.json({ message: 'Course not found' }, { status: 404 });
    }

    // Only course teacher can view content
    if (course.teacherId !== session.user.id && session.user.role !== 'ADMIN') {
      return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
    }

    // Fetch all content items for the course
    const content = await prisma.courseContent.findMany({
      where: { courseId: id },
      orderBy: { contentOrder: 'asc' },
      include: {
        quiz: {
          include: {
            questions: {
              orderBy: { order: 'asc' },
            },
          },
        },
      },
    });

    return NextResponse.json({ content });
  } catch (error) {
    console.error('Error fetching course content:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST /api/courses/[id]/content - Add new content to a course
export async function POST(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await context.params;
    const body = await request.json();
    const { contentType, title, contentData, duration, points } = body;

    // Verify course exists and user has access
    const course = await prisma.course.findUnique({
      where: { id },
      select: { teacherId: true, _count: { select: { content: true } } },
    });

    if (!course) {
      return NextResponse.json({ message: 'Course not found' }, { status: 404 });
    }

    // Only course teacher can add content
    if (course.teacherId !== session.user.id && session.user.role !== 'ADMIN') {
      return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
    }

    // Validate required fields
    if (!contentType || !title) {
      return NextResponse.json(
        { message: 'Missing required fields: contentType, title' },
        { status: 400 }
      );
    }

    // Create the content item
    const newContent = await prisma.courseContent.create({
      data: {
        courseId: id,
        contentType: contentType as ContentType,
        title,
        contentData: {
          ...contentData,
          duration,
        },
        contentOrder: course._count.content,
        offlineAvailable: contentType !== 'VIDEO',
      },
      include: {
        quiz: {
          include: {
            questions: {
              orderBy: { order: 'asc' },
            },
          },
        },
      },
    });

    // If it's a QUIZ, create the quiz record
    if (contentType === 'QUIZ') {
      const quizData = contentData || {};
      const quiz = await prisma.quiz.create({
        data: {
          courseContentId: newContent.id,
          title: quizData.title || title,
          description: quizData.description || '',
          mode: quizData.mode || 'PRACTICE',
          passingScore: quizData.passingScore || 70,
          timeLimit: quizData.timeLimit || null,
          showAnswersAfter: quizData.showAnswersAfter ?? true,
          randomizeQuestions: quizData.randomizeQuestions ?? false,
        },
      });

      // Create questions if provided
      if (quizData.questions && Array.isArray(quizData.questions)) {
        for (const q of quizData.questions) {
          await prisma.question.create({
            data: {
              quizId: quiz.id,
              text: q.text,
              questionType: q.type || q.questionType,
              options: q.options || [],
              correctAnswer: q.correctAnswer || null,
              explanation: q.explanation || '',
              points: q.points || 1,
              order: q.order || 0,
            },
          });
        }
      }
    }

    return NextResponse.json({ content: newContent }, { status: 201 });
  } catch (error) {
    console.error('Error creating course content:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PUT /api/courses/[id]/content - Update content
export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await context.params;
    const body = await request.json();
    const { contentId, title, contentData, duration, points, contentOrder } = body;

    if (!contentId) {
      return NextResponse.json(
        { message: 'Missing contentId' },
        { status: 400 }
      );
    }

    // Verify course exists and user has access
    const course = await prisma.course.findUnique({
      where: { id },
      select: { teacherId: true },
    });

    if (!course) {
      return NextResponse.json({ message: 'Course not found' }, { status: 404 });
    }

    if (course.teacherId !== session.user.id && session.user.role !== 'ADMIN') {
      return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
    }

    // Verify content belongs to this course
    const content = await prisma.courseContent.findFirst({
      where: { id: contentId, courseId: id },
    });

    if (!content) {
      return NextResponse.json(
        { message: 'Content not found' },
        { status: 404 }
      );
    }

    // Update the content item
    const updateData: any = {
      title: title || undefined,
      contentOrder: contentOrder !== undefined ? contentOrder : undefined,
    };

    if (contentData !== undefined) {
      updateData.contentData = {
        ...(content.contentData as any),
        ...contentData,
        duration,
      };
    } else if (duration !== undefined) {
      updateData.contentData = {
        ...(content.contentData as any),
        duration,
      };
    }

    const updatedContent = await prisma.courseContent.update({
      where: { id: contentId },
      data: updateData,
      include: {
        quiz: {
          include: {
            questions: {
              orderBy: { order: 'asc' },
            },
          },
        },
      },
    });

    // If it's a quiz, update quiz data
    if (content.contentType === 'QUIZ' && contentData) {
      const quiz = await prisma.quiz.findUnique({
        where: { courseContentId: contentId },
      });

      if (quiz) {
        await prisma.quiz.update({
          where: { id: quiz.id },
          data: {
            title: contentData.title || undefined,
            description: contentData.description || undefined,
            mode: contentData.mode || undefined,
            passingScore: contentData.passingScore || undefined,
            timeLimit: contentData.timeLimit || undefined,
            showAnswersAfter: contentData.showAnswersAfter !== undefined ? contentData.showAnswersAfter : undefined,
            randomizeQuestions: contentData.randomizeQuestions !== undefined ? contentData.randomizeQuestions : undefined,
          },
        });

        // Update questions if provided
        if (contentData.questions && Array.isArray(contentData.questions)) {
          // Delete existing questions
          await prisma.question.deleteMany({
            where: { quizId: quiz.id },
          });

          // Create new questions
          for (const q of contentData.questions) {
            await prisma.question.create({
              data: {
                quizId: quiz.id,
                text: q.text,
                questionType: q.type || q.questionType,
                options: q.options || [],
                correctAnswer: q.correctAnswer || null,
                explanation: q.explanation || '',
                points: q.points || 1,
                order: q.order || 0,
              },
            });
          }
        }
      }
    }

    return NextResponse.json({ content: updatedContent });
  } catch (error) {
    console.error('Error updating course content:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}

// DELETE /api/courses/[id]/content - Delete content
export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await context.params;
    const body = await request.json();
    const { contentId } = body;

    if (!contentId) {
      return NextResponse.json(
        { message: 'Missing contentId' },
        { status: 400 }
      );
    }

    // Verify course exists and user has access
    const course = await prisma.course.findUnique({
      where: { id },
      select: { teacherId: true },
    });

    if (!course) {
      return NextResponse.json({ message: 'Course not found' }, { status: 404 });
    }

    if (course.teacherId !== session.user.id && session.user.role !== 'ADMIN') {
      return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
    }

    // Verify content belongs to this course
    const content = await prisma.courseContent.findFirst({
      where: { id: contentId, courseId: id },
    });

    if (!content) {
      return NextResponse.json(
        { message: 'Content not found' },
        { status: 404 }
      );
    }

    // Delete the quiz if it exists
    if (content.contentType === 'QUIZ') {
      await prisma.quiz.deleteMany({
        where: { courseContentId: contentId },
      });
    }

    // Delete the content item
    const deletedContent = await prisma.courseContent.delete({
      where: { id: contentId },
    });

    // Reorder remaining content items
    const remainingContent = await prisma.courseContent.findMany({
      where: { courseId: id },
      orderBy: { contentOrder: 'asc' },
    });

    for (let i = 0; i < remainingContent.length; i++) {
      await prisma.courseContent.update({
        where: { id: remainingContent[i].id },
        data: { contentOrder: i },
      });
    }

    return NextResponse.json({ message: 'Content deleted successfully' });
  } catch (error) {
    console.error('Error deleting course content:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
