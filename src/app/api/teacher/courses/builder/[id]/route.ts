import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import prisma from '@/lib/prisma';
import { nanoid } from 'nanoid';

// GET /api/teacher/courses/builder/[id] - Get course with all details for editing
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user || session.user.role !== 'TEACHER') {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;

    // Get instructor ID
    const instructor = await prisma.instructor.findUnique({
      where: { userId: session.user.id },
    });

    if (!instructor) {
      return NextResponse.json(
        { message: 'Instructor profile not found' },
        { status: 404 }
      );
    }

    // Fetch the course with all related data
    const course = await prisma.course.findFirst({
      where: {
        id,
        instructorId: instructor.id, // Ensure teacher owns this course
      },
      include: {
        Section: {
          orderBy: { order: 'asc' },
          include: {
            Lecture: {
              orderBy: { order: 'asc' },
              include: {
                Video: true,
                Article: true,
                Quiz: {
                  include: {
                    Question: {
                      orderBy: { order: 'asc' },
                    },
                  },
                },
                CodingExercise: true,
                Assignment: true,
                Project: true,
                Resource: true,
              },
            },
          },
        },
        Category: true,
        Instructor: true,
      },
    });

    if (!course) {
      return NextResponse.json({ message: 'Course not found' }, { status: 404 });
    }

    // Transform to frontend format
    const transformed = {
      ...course,
      sections: course.Section.map((section) => ({
        ...section,
        lectures: section.Lecture.map((lecture) => {
          const lectureData: any = {
            ...lecture,
            video: lecture.Video || undefined,
            article: lecture.Article || undefined,
            codingExercise: lecture.CodingExercise || undefined,
            assignment: lecture.Assignment || undefined,
            project: lecture.Project || undefined,
            resources: lecture.Resource || [],
          };

          // Transform quiz data
          if (lecture.Quiz) {
            lectureData.quiz = {
              ...lecture.Quiz,
              questions: lecture.Quiz.Question.map((q) => {
                const questionData: any = {
                  ...q,
                };

                // Parse options for MULTIPLE_CHOICE
                if (q.type === 'MULTIPLE_CHOICE' && q.options) {
                  const opts = q.options as any;
                  if (opts.choices && opts.correct) {
                    questionData.options = opts.choices;
                    questionData.correctAnswer = opts.correct;
                  }
                } else if (q.type === 'MULTIPLE_ANSWER') {
                  questionData.correctAnswer = q.acceptedAnswers || [];
                }

                return questionData;
              }),
            };
          }

          // Remove Prisma relations from response
          delete lectureData.Video;
          delete lectureData.Article;
          delete lectureData.Quiz;
          delete lectureData.CodingExercise;
          delete lectureData.Assignment;
          delete lectureData.Project;
          delete lectureData.Resource;

          return lectureData;
        }),
      })),
    };

    // Remove Prisma relations from response
    delete (transformed as any).Section;
    delete (transformed as any).Category;
    delete (transformed as any).Instructor;

    return NextResponse.json({
      success: true,
      course: transformed,
    });
  } catch (error) {
    console.error('Error fetching course:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to fetch course',
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

// PUT /api/teacher/courses/builder/[id] - Update course
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user || session.user.role !== 'TEACHER') {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();
    const { course } = body;

    if (!course) {
      return NextResponse.json({ message: 'Course data is required' }, { status: 400 });
    }

    // Get instructor ID
    const instructor = await prisma.instructor.findUnique({
      where: { userId: session.user.id },
    });

    if (!instructor) {
      return NextResponse.json(
        { message: 'Instructor profile not found' },
        { status: 404 }
      );
    }

    // Verify ownership
    const existingCourse = await prisma.course.findFirst({
      where: {
        id,
        instructorId: instructor.id,
      },
    });

    if (!existingCourse) {
      return NextResponse.json({ message: 'Course not found' }, { status: 404 });
    }

    // Update course using transaction
    const updatedCourse = await prisma.$transaction(async (tx) => {
      // Update main course data
      const updated = await tx.course.update({
        where: { id },
        data: {
          title: course.title,
          subtitle: course.subtitle,
          description: course.description,
          language: course.language,
          level: course.level,
          contentType: course.contentType,
          status: course.status || 'DRAFT',
          isPublic: course.isPublic,
          requiresOnline: course.requiresOnline,
          offlineAvailable: course.offlineAvailable,
          features: course.features || [],
          requirements: course.requirements || [],
          targetAudience: course.targetAudience || [],
          learningObjectives: course.learningObjectives || [],
          tags: course.tags || [],
          downloadPriority: course.downloadPriority,
          lastUpdatedAt: new Date(),
        },
      });

      // Delete existing sections and their lectures (cascade delete will handle related data)
      await tx.section.deleteMany({
        where: { courseId: id },
      });

      // Recreate sections and lectures
      if (course.sections && course.sections.length > 0) {
        for (const section of course.sections) {
          const createdSection = await tx.section.create({
            data: {
              id: nanoid(),
              courseId: id,
              title: section.title,
              description: section.description,
              order: section.order,
              totalLectures: section.lectures?.length || 0,
              totalDuration: section.lectures?.reduce((sum: number, l: any) => sum + (l.duration || 0), 0) || 0,
            },
          });

          if (section.lectures && section.lectures.length > 0) {
            for (const lecture of section.lectures) {
              const lectureData: any = {
                id: nanoid(),
                sectionId: createdSection.id,
                title: lecture.title,
                description: lecture.description,
                type: lecture.type,
                order: lecture.order,
                duration: lecture.duration,
                isPreview: lecture.isPreview || false,
                isFree: lecture.isFree || false,
                offlineAvailable: lecture.offlineAvailable !== false,
                downloadPriority: lecture.downloadPriority,
              };

              const createdLecture = await tx.lecture.create({
                data: lectureData,
              });

              // Create type-specific data
              if (lecture.type === 'VIDEO' && lecture.video) {
                await tx.video.create({
                  data: {
                    id: nanoid(),
                    lectureId: createdLecture.id,
                    defaultQuality: lecture.video.defaultQuality || 'MEDIUM',
                    offlineOptimized: lecture.video.offlineOptimized || false,
                    status: 'PROCESSING',
                  },
                });
              }

              if (lecture.type === 'ARTICLE' && lecture.article) {
                await tx.article.create({
                  data: {
                    id: nanoid(),
                    lectureId: createdLecture.id,
                    content: lecture.article.content || '',
                    contentHtml: lecture.article.contentHtml || '',
                    wordCount: lecture.article.wordCount || 0,
                    estimatedReadingTime: lecture.article.estimatedReadingTime,
                    updatedAt: new Date(),
                  },
                });
              }

              if (lecture.type === 'QUIZ' && lecture.quiz) {
                const createdQuiz = await tx.quiz.create({
                  data: {
                    id: nanoid(),
                    lectureId: createdLecture.id,
                    title: lecture.quiz.title || lecture.title,
                    description: lecture.quiz.description,
                    passingScore: lecture.quiz.passingScore || 70,
                    totalPoints: lecture.quiz.totalPoints || 100,
                    timeLimit: lecture.quiz.timeLimit,
                    attemptsAllowed: lecture.quiz.attemptsAllowed || 3,
                    shuffleQuestions: lecture.quiz.shuffleQuestions || false,
                    shuffleAnswers: lecture.quiz.shuffleAnswers || false,
                    showCorrectAnswers: lecture.quiz.showCorrectAnswers !== false,
                    showCorrectAnswersAfter: lecture.quiz.showCorrectAnswersAfter || 'submission',
                    questionCount: lecture.quiz.questions?.length || 0,
                  },
                });

                // Create questions
                if (lecture.quiz.questions && lecture.quiz.questions.length > 0) {
                  for (const q of lecture.quiz.questions) {
                    const questionData: any = {
                      id: nanoid(),
                      quizId: createdQuiz.id,
                      order: q.order,
                      type: q.type,
                      question: q.question,
                      points: q.points || 20,
                      explanation: q.explanation,
                      hint: q.hint,
                      partialCredit: q.partialCredit || false,
                    };

                    // Handle different question types
                    if (q.type === 'MULTIPLE_CHOICE' || q.type === 'MULTIPLE_ANSWER') {
                      if (q.type === 'MULTIPLE_CHOICE') {
                        questionData.correctAnswer = null;
                        questionData.options = {
                          choices: q.options,
                          correct: q.correctAnswer,
                        };
                      } else {
                        questionData.correctAnswer = null;
                        questionData.acceptedAnswers = Array.isArray(q.correctAnswer)
                          ? q.correctAnswer
                          : [];
                        questionData.options = q.options;
                      }
                    } else if (q.type === 'TRUE_FALSE') {
                      questionData.correctAnswer = q.correctAnswer === true;
                      questionData.options = null;
                    } else if (q.type === 'FILL_BLANK') {
                      questionData.acceptedAnswers = q.acceptedAnswers || [];
                      questionData.options = q.options || [];
                      questionData.correctAnswer = null;
                    } else if (q.type === 'ORDERING') {
                      questionData.orderingItems = q.orderingItems || [];
                      questionData.correctAnswer = null;
                      questionData.options = null;
                    }

                    await tx.question.create({
                      data: questionData,
                    });
                  }
                }
              }

              if (lecture.type === 'CODING_EXERCISE' && lecture.codingExercise) {
                await tx.codingExercise.create({
                  data: {
                    id: nanoid(),
                    lectureId: createdLecture.id,
                    title: lecture.codingExercise.title,
                    instructions: lecture.codingExercise.instructions || '',
                    starterCode: lecture.codingExercise.starterCode,
                    language: lecture.codingExercise.language || 'javascript',
                    expectedOutput: lecture.codingExercise.expectedOutput,
                    testCases: lecture.codingExercise.testCases || [],
                    hints: lecture.codingExercise.hints || [],
                    solution: lecture.codingExercise.solution,
                    allowSubmission: lecture.codingExercise.allowSubmission !== false,
                    maxSubmissions: lecture.codingExercise.maxSubmissions,
                  },
                });
              }

              if (lecture.type === 'ASSIGNMENT' && lecture.assignment) {
                await tx.assignment.create({
                  data: {
                    id: nanoid(),
                    lectureId: createdLecture.id,
                    title: lecture.assignment.title,
                    description: lecture.assignment.description,
                    instructions: lecture.assignment.instructions || '',
                    allowedFileTypes: lecture.assignment.allowedFileTypes || ['PDF'],
                    maxFileSize: lecture.assignment.maxFileSize || 10,
                    dueDate: lecture.assignment.dueDate,
                    rubric: lecture.assignment.rubric,
                  },
                });
              }

              if (lecture.type === 'PROJECT' && lecture.project) {
                await tx.project.create({
                  data: {
                    id: nanoid(),
                    lectureId: createdLecture.id,
                    title: lecture.project.title,
                    description: lecture.project.description || '',
                    complexity: lecture.project.complexity || 'intermediate',
                    technologies: lecture.project.technologies || [],
                    learningObjectives: lecture.project.learningObjectives || [],
                    milestones: lecture.project.milestones || [],
                    submission: lecture.project.submission,
                  },
                });
              }

              // Add resources if any
              if (lecture.resources && lecture.resources.length > 0) {
                for (const resource of lecture.resources) {
                  await tx.resource.create({
                    data: {
                      id: nanoid(),
                      lectureId: createdLecture.id,
                      title: resource.title,
                      type: resource.type,
                      fileSize: resource.fileSize,
                      fileSizeFormatted: resource.fileSizeFormatted,
                      url: resource.url,
                      downloadable: resource.downloadable !== false,
                    },
                  });
                }
              }
            }
          }
        }
      }

      return updated;
    });

    return NextResponse.json({
      success: true,
      message: 'Course updated successfully',
      course: updatedCourse,
    });
  } catch (error) {
    console.error('Error updating course:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to update course',
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

// DELETE /api/teacher/courses/builder/[id] - Delete course (soft delete by changing status)
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user || session.user.role !== 'TEACHER') {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;

    // Get instructor ID
    const instructor = await prisma.instructor.findUnique({
      where: { userId: session.user.id },
    });

    if (!instructor) {
      return NextResponse.json(
        { message: 'Instructor profile not found' },
        { status: 404 }
      );
    }

    // Soft delete: change status to ARCHIVED
    const deleted = await prisma.course.updateMany({
      where: {
        id,
        instructorId: instructor.id,
      },
      data: {
        status: 'ARCHIVED',
        lastUpdatedAt: new Date(),
      },
    });

    if (deleted.count === 0) {
      return NextResponse.json({ message: 'Course not found' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: 'Course archived successfully',
    });
  } catch (error) {
    console.error('Error deleting course:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to delete course',
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
