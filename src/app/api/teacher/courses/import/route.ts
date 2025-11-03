import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import prisma from '@/lib/prisma';
import { parseCourseMd, ParsedCourseContent } from '@/lib/course-parser';

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const session = await auth();
    if (!session?.user || session.user.role !== 'TEACHER') {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const teacherId = session.user.id;

    // Get user's school from database
    const user = await prisma.user.findUnique({
      where: { id: teacherId },
      select: { schoolId: true },
    });

    if (!user?.schoolId) {
      return NextResponse.json({ message: 'User not associated with a school' }, { status: 400 });
    }

    const schoolId = user.schoolId;

    // Get FormData
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const subjectName = formData.get('subject') as string;

    if (!file) {
      return NextResponse.json({ message: 'No file provided' }, { status: 400 });
    }

    if (!subjectName) {
      return NextResponse.json({ message: 'Subject name is required' }, { status: 400 });
    }

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { message: 'File size exceeds 5MB limit' },
        { status: 400 }
      );
    }

    // Validate file type
    const fileName = file.name.toLowerCase();
    if (!fileName.endsWith('.course.md') && !fileName.endsWith('.md')) {
      return NextResponse.json(
        { message: 'Invalid file type. Must be a .course.md or .md file' },
        { status: 400 }
      );
    }

    // Read file content
    const fileContent = await file.text();

    // Parse course from markdown
    let parsedCourse;
    try {
      parsedCourse = parseCourseMd(fileContent);
    } catch (error) {
      return NextResponse.json(
        {
          message: 'Failed to parse course template',
          errors: [{ message: error instanceof Error ? error.message : 'Unknown error', severity: 'error' }],
        },
        { status: 400 }
      );
    }

    // Return parsing errors if any
    const parseErrors = parsedCourse.errors.filter((e) => e.severity === 'error');
    if (parseErrors.length > 0) {
      return NextResponse.json(
        {
          message: 'Course template has errors',
          errors: parseErrors,
        },
        { status: 400 }
      );
    }

    // Get or create subject
    let subject = await prisma.subject.findFirst({
      where: {
        name: subjectName,
        schoolId,
      },
    });

    if (!subject) {
      subject = await prisma.subject.create({
        data: {
          name: subjectName,
          schoolId,
        },
      });
    }

    // Create course with content
    const course = await prisma.course.create({
      data: {
        title: parsedCourse.title,
        description: parsedCourse.description,
        teacherId,
        schoolId,
        subjectId: subject.id,
        status: parsedCourse.status,
        language: parsedCourse.language,
        requiresOnline: parsedCourse.requiresOnline,
        thumbnailUrl: parsedCourse.thumbnailUrl,
        content: {
          create: parsedCourse.content.map((item) => ({
            contentOrder: item.contentOrder,
            contentType: item.contentType as any,
            title: item.title,
            contentData: JSON.stringify(item.contentData),
            offlineAvailable: item.offlineAvailable,
            appearsAfterSeconds: item.appearsAfterSeconds,
            disappearsAfterSeconds: item.disappearsAfterSeconds,
          })),
        },
      },
      include: {
        content: true,
      },
    });

    // Create quizzes for quiz content items
    for (const contentItem of course.content) {
      if (contentItem.contentType === 'QUIZ' && typeof contentItem.contentData === 'string') {
        const quizData = JSON.parse(contentItem.contentData as string);

        const quiz = await prisma.quiz.create({
          data: {
            courseContentId: contentItem.id,
            title: quizData.title || 'Quiz',
            description: quizData.description,
            passingScore: quizData.passingScore || 70,
            timeLimit: quizData.timeLimit,
            mode: (quizData.mode as any) || 'PRACTICE',
            showAnswersAfter: quizData.showAnswersAfter !== false,
            randomizeQuestions: quizData.randomizeQuestions || false,
            questions: {
              create: (quizData.questions || []).map((q: any, index: number) => ({
                questionType: q.questionType,
                text: q.text,
                explanation: q.explanation,
                order: q.order || index + 1,
                points: q.points || 1,
                options: q.options,
                correctAnswer: q.correctAnswer,
              })),
            },
          },
        });
      }
    }

    return NextResponse.json(
      {
        message: 'Course imported successfully',
        courseId: course.id,
        courseName: course.title,
        contentCount: course.content.length,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error importing course:', error);
    return NextResponse.json(
      {
        message: 'Failed to import course',
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
