import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import prisma from '@/lib/prisma';
import { nanoid } from 'nanoid';

// POST /api/teacher/courses/builder - Create a new course from the course builder
export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user || session.user.role !== 'TEACHER') {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { course } = body;

    if (!course || !course.title) {
      return NextResponse.json(
        { message: 'Course title is required' },
        { status: 400 }
      );
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

    // Create slug from title
    const slug = course.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');

    // Get or create a default category
    let category = await prisma.category.findFirst({
      where: { name: 'General', parentId: null },
    });

    if (!category) {
      category = await prisma.category.create({
        data: {
          id: nanoid(),
          name: 'General',
          description: 'General courses',
        },
      });
    }

    // Create the course with sections and lectures
    const createdCourse = await prisma.course.create({
      data: {
        id: nanoid(),
        uuid: nanoid(),
        title: course.title,
        slug: `${slug}-${nanoid(6)}`,
        subtitle: course.subtitle,
        description: course.description,
        language: course.language || 'FR',
        level: course.level || 'BEGINNER',
        contentType: course.contentType || 'HYBRID',
        status: 'DRAFT',
        publishedAt: null,
        lastUpdatedAt: new Date(),
        categoryId: category.id,
        instructorId: instructor.id,
        schoolId: session.user.schoolId || null,
        isPublic: false,
        requiresOnline: course.requiresOnline || false,
        offlineAvailable: course.offlineAvailable !== false,
        features: course.features || [],
        requirements: course.requirements || [],
        targetAudience: course.targetAudience || [],
        learningObjectives: course.learningObjectives || [],
        tags: course.tags || [],
        downloadPriority: course.downloadPriority || 5,
        // Create sections
        Section: {
          create: (course.sections || []).map((section: any, sectionIndex: number) => ({
            id: nanoid(),
            title: section.title,
            description: section.description,
            order: sectionIndex + 1,
            totalLectures: section.lectures?.length || 0,
            totalDuration: section.lectures?.reduce((sum: number, l: any) => sum + (l.duration || 0), 0) || 0,
            // Create lectures
            Lecture: {
              create: (section.lectures || []).map((lecture: any, lectureIndex: number) => {
                const lectureData: any = {
                  id: nanoid(),
                  title: lecture.title,
                  description: lecture.description,
                  type: lecture.type,
                  order: lectureIndex + 1,
                  duration: lecture.duration,
                  isPreview: lecture.isPreview || false,
                  isFree: lecture.isFree || false,
                  offlineAvailable: lecture.offlineAvailable !== false,
                  downloadPriority: lecture.downloadPriority,
                };

                // Create type-specific data
                if (lecture.type === 'VIDEO' && lecture.video) {
                  lectureData.Video = {
                    create: {
                      id: nanoid(),
                      defaultQuality: lecture.video.defaultQuality || 'MEDIUM',
                      offlineOptimized: lecture.video.offlineOptimized || false,
                      status: 'PROCESSING',
                    },
                  };
                }

                if (lecture.type === 'ARTICLE' && lecture.article) {
                  lectureData.Article = {
                    create: {
                      id: nanoid(),
                      content: lecture.article.content || '',
                      contentHtml: lecture.article.contentHtml || '',
                      wordCount: lecture.article.wordCount || 0,
                      estimatedReadingTime: lecture.article.estimatedReadingTime,
                      updatedAt: new Date(),
                    },
                  };
                }

                if (lecture.type === 'QUIZ' && lecture.quiz) {
                  lectureData.Quiz = {
                    create: {
                      id: nanoid(),
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
                      // Create questions
                      Question: {
                        create: (lecture.quiz.questions || []).map((q: any) => {
                          const questionData: any = {
                            id: nanoid(),
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
                            questionData.options = q.options || [];
                            // For MULTIPLE_CHOICE, correctAnswer should be a string
                            // For MULTIPLE_ANSWER, it should be an array stored in acceptedAnswers
                            if (q.type === 'MULTIPLE_CHOICE') {
                              // Store as boolean in the correctAnswer field (schema limitation)
                              // We'll need to store the actual answer in options JSON
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
                            questionData.options = q.options || []; // Incorrect answers/distractors
                            questionData.correctAnswer = null;
                          } else if (q.type === 'ORDERING') {
                            questionData.orderingItems = q.orderingItems || [];
                            questionData.correctAnswer = null;
                            questionData.options = null;
                          }

                          return questionData;
                        }),
                      },
                    },
                  };
                }

                if (lecture.type === 'CODING_EXERCISE' && lecture.codingExercise) {
                  lectureData.CodingExercise = {
                    create: {
                      id: nanoid(),
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
                  };
                }

                if (lecture.type === 'ASSIGNMENT' && lecture.assignment) {
                  lectureData.Assignment = {
                    create: {
                      id: nanoid(),
                      title: lecture.assignment.title,
                      description: lecture.assignment.description,
                      instructions: lecture.assignment.instructions || '',
                      allowedFileTypes: lecture.assignment.allowedFileTypes || ['PDF'],
                      maxFileSize: lecture.assignment.maxFileSize || 10,
                      dueDate: lecture.assignment.dueDate,
                      rubric: lecture.assignment.rubric,
                    },
                  };
                }

                if (lecture.type === 'PROJECT' && lecture.project) {
                  lectureData.Project = {
                    create: {
                      id: nanoid(),
                      title: lecture.project.title,
                      description: lecture.project.description || '',
                      complexity: lecture.project.complexity || 'intermediate',
                      technologies: lecture.project.technologies || [],
                      learningObjectives: lecture.project.learningObjectives || [],
                      milestones: lecture.project.milestones || [],
                      submission: lecture.project.submission,
                    },
                  };
                }

                // Add resources if any
                if (lecture.resources && lecture.resources.length > 0) {
                  lectureData.Resource = {
                    create: lecture.resources.map((resource: any) => ({
                      id: nanoid(),
                      title: resource.title,
                      type: resource.type,
                      fileSize: resource.fileSize,
                      fileSizeFormatted: resource.fileSizeFormatted,
                      url: resource.url,
                      downloadable: resource.downloadable !== false,
                    })),
                  };
                }

                return lectureData;
              }),
            },
          })),
        },
      },
      include: {
        Section: {
          include: {
            Lecture: {
              include: {
                Video: true,
                Article: true,
                Quiz: {
                  include: {
                    Question: true,
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
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Course created successfully',
      course: createdCourse,
    });
  } catch (error) {
    console.error('Error creating course:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to create course',
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
