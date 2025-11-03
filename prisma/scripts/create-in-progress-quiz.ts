/**
 * Script to create an in-progress quiz submission for Antoine Moreau
 * Run with: npx ts-node prisma/scripts/create-in-progress-quiz.ts
 */

const { PrismaClient } = require('../../src/generated/prisma');

const prisma = new PrismaClient();

async function createInProgressQuiz() {
  try {
    // Find Antoine Moreau
    const student = await prisma.user.findFirst({
      where: {
        name: { contains: 'Antoine' },
        role: 'STUDENT',
      },
    });

    if (!student) {
      console.log('❌ Student "Antoine Moreau" not found');
      return;
    }

    console.log(`✅ Found student: ${student.name} (${student.email})`);

    // Get the first quiz
    const quiz = await prisma.quiz.findFirst({
      include: {
        courseContent: {
          include: {
            course: true,
          },
        },
        questions: true,
      },
    });

    if (!quiz) {
      console.log('⚠️  No quizzes found');
      return;
    }

    console.log(`\n📝 Selected quiz: ${quiz.title}`);
    console.log(`   Course: ${quiz.courseContent.course.title}`);
    console.log(`   Questions: ${quiz.questions.length}`);

    // Get the latest attempt number
    const lastSubmission = await prisma.quizSubmission.findMany({
      where: {
        quizId: quiz.id,
        studentId: student.id,
      },
      orderBy: { attemptNumber: 'desc' },
      take: 1,
    });

    const attemptNumber = (lastSubmission[0]?.attemptNumber || 0) + 1;

    // Create an in-progress submission
    const submission = await prisma.quizSubmission.create({
      data: {
        quizId: quiz.id,
        studentId: student.id,
        attemptNumber,
        startedAt: new Date(Date.now() - 10 * 60 * 1000), // Started 10 minutes ago
        status: 'IN_PROGRESS',
      },
    });

    console.log(`\n✨ Created in-progress submission:`);
    console.log(`   Status: ${submission.status}`);
    console.log(`   Started: ${submission.startedAt.toLocaleString()}`);
    console.log(`   Time elapsed: ~10 minutes`);

    // If there are questions, create some partial responses
    if (quiz.questions.length > 0) {
      const responses = await Promise.all(
        quiz.questions.slice(0, Math.ceil(quiz.questions.length / 2)).map((question: any) =>
          prisma.questionResponse.create({
            data: {
              questionId: question.id,
              submissionId: submission.id,
              studentAnswer: { answer: 'In progress' },
            },
          })
        )
      );

      console.log(`\n   Answers started: ${responses.length} of ${quiz.questions.length} questions`);
    }

    console.log(`\n✅ You can now resume this quiz!`);
  } catch (error) {
    console.error('❌ Error creating in-progress quiz:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

createInProgressQuiz();
