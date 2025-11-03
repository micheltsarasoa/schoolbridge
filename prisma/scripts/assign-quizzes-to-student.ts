/**
 * Script to assign quizzes to a specific student
 * Run with: npx ts-node prisma/scripts/assign-quizzes-to-student.ts
 */

const { PrismaClient } = require('../../src/generated/prisma');

const prisma = new PrismaClient();

async function assignQuizzesToStudent() {
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

    // Get all quizzes (any status)
    const allQuizzes = await prisma.quiz.findMany({
      include: {
        courseContent: {
          include: {
            course: true,
          },
        },
      },
    });

    if (allQuizzes.length === 0) {
      console.log('⚠️  No quizzes found in the system');
      return;
    }

    // Filter to published quizzes, but if none, use all quizzes
    const quizzes = allQuizzes.filter((q: any) => q.status === 'PUBLISHED').length > 0
      ? allQuizzes.filter((q: any) => q.status === 'PUBLISHED')
      : allQuizzes;

    console.log(`\n📚 Found ${quizzes.length} published quiz(zes)\n`);

    // Assign all quizzes to the student
    const assignments = await Promise.all(
      quizzes.map((quiz: any) =>
        prisma.quizAssignment.create({
          data: {
            quizId: quiz.id,
            studentId: student.id,
            dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
          },
        })
      )
    );

    console.log(`✨ Successfully assigned ${assignments.length} quiz(zes) to ${student.name}:\n`);

    assignments.forEach((assignment: any, index: number) => {
      const quiz = quizzes.find((q: any) => q.id === assignment.quizId);
      if (quiz) {
        console.log(
          `  ${index + 1}. ${quiz.title} (${quiz.courseContent.course.title})`
        );
      }
    });

    console.log(
      `\n✅ All quizzes assigned successfully! Due date: ${new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toDateString()}`
    );
  } catch (error) {
    console.error('❌ Error assigning quizzes:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

assignQuizzesToStudent();
