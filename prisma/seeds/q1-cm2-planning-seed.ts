import { PrismaClient, UserRole, ContentType, DayOfWeek, AttendanceStatus, CourseStatus, SubmissionStatus, QuizMode } from '../../src/generated/prisma';
import bcryptjs from 'bcryptjs';

const prisma = new PrismaClient();

// Realistic French CM2 student names
const studentNames = [
  'Alice Dupont', 'Antoine Moreau', 'Amélie Bernard', 'Adrien Dubois', 'Aurélien Fournier',
  'Béatrice Leclerc', 'Benjamin Lefevre', 'Brigitte Leroy', 'Bruno Masson', 'Bastien Perrin',
  'Camille Rousseau', 'Charles Renard', 'Catherine Roux', 'Cédric Robin', 'Christophe Rossi',
  'Delphine Sauvage', 'Denis Schmid', 'Daphné Schmitt', 'Damien Soulier', 'Dominique Thibault',
  'Emma Touvay', 'Etienne Valentin', 'Elodie Vannier', 'Eric Verdier', 'Emilie Vincent',
];

async function seedQ1CM2() {
  console.log('🌱 Starting Q1 CM2 seed...');

  try {
    // 1. Create/Find School
    const school = await prisma.school.upsert({
      where: { code: 'EC_MARTIN_001' },
      update: {},
      create: {
        name: 'École Primaire Jean Jaurès',
        code: 'EC_MARTIN_001',
        address: '123 Rue de la Paix, Lyon 69000',
        phone: '04 72 12 34 56',
        email: 'contact@ecolejaurès.fr',
      },
    });
    console.log('✅ School created:', school.name);

    // 2. Create AcademicYear
    const academicYear = await prisma.academicYear.upsert({
      where: { schoolId_name: { schoolId: school.id, name: '2025-2026' } },
      update: { isActive: true },
      create: {
        name: '2025-2026',
        startDate: new Date('2025-09-01'),
        endDate: new Date('2026-06-30'),
        schoolId: school.id,
        isActive: true,
      },
    });
    console.log('✅ Academic year created:', academicYear.name);

    // 3. Create Teacher (Mme. Martin)
    const teacherPassword = await bcryptjs.hash('teacher_password', 10);
    const teacher = await prisma.user.upsert({
      where: { email: 'mme.martin@ecole.fr' },
      update: {},
      create: {
        email: 'mme.martin@ecole.fr',
        name: 'Mme. Marie Martin',
        password: teacherPassword,
        role: UserRole.TEACHER,
        schoolId: school.id,
      },
    });
    console.log('✅ Teacher created:', teacher.name);

    // 4. Create Class (CM2 - Classe A)
    const cm2Class = await prisma.class.upsert({
      where: { schoolId_name: { schoolId: school.id, name: 'CM2 - Classe A' } },
      update: {},
      create: {
        name: 'CM2 - Classe A',
        schoolId: school.id,
      },
    });
    console.log('✅ Class created:', cm2Class.name);

    // 5. Create Students
    const students: any[] = [];
    const studentPassword = await bcryptjs.hash('student_password', 10);
    for (const name of studentNames) {
      const student = await prisma.user.upsert({
        where: { email: `${name.toLowerCase().replace(' ', '.')}@student.fr` },
        update: {},
        create: {
          email: `${name.toLowerCase().replace(' ', '.')}@student.fr`,
          name,
          password: studentPassword,
          role: UserRole.STUDENT,
          schoolId: school.id,
        },
      });
      students.push(student);
    }

    // Assign students to class
    await prisma.class.update({
      where: { id: cm2Class.id },
      data: {
        students: {
          connect: students.map((s) => ({ id: s.id })),
        },
      },
    });
    console.log(`✅ ${students.length} students created and assigned to class`);

    // 6. Create Subjects
    const subjects = await Promise.all([
      prisma.subject.upsert({
        where: { schoolId_name: { schoolId: school.id, name: 'Français' } },
        update: {},
        create: { name: 'Français', schoolId: school.id },
      }),
      prisma.subject.upsert({
        where: { schoolId_name: { schoolId: school.id, name: 'Mathématiques' } },
        update: {},
        create: { name: 'Mathématiques', schoolId: school.id },
      }),
      prisma.subject.upsert({
        where: { schoolId_name: { schoolId: school.id, name: 'Sciences et Technologie' } },
        update: {},
        create: { name: 'Sciences et Technologie', schoolId: school.id },
      }),
      prisma.subject.upsert({
        where: { schoolId_name: { schoolId: school.id, name: 'Histoire-Géographie' } },
        update: {},
        create: { name: 'Histoire-Géographie', schoolId: school.id },
      }),
      prisma.subject.upsert({
        where: { schoolId_name: { schoolId: school.id, name: 'Arts Plastiques' } },
        update: {},
        create: { name: 'Arts Plastiques', schoolId: school.id },
      }),
    ]);
    console.log('✅ Subjects created');

    // 7. Create Courses for Q1
    const courses = await Promise.all([
      prisma.course.create({
        data: {
          title: 'Français CM2 - Trimestre 1',
          description: 'Grammaire, orthographe, littérature et expression écrite',
          teacherId: teacher.id,
          schoolId: school.id,
          subjectId: subjects[0].id,
          status: CourseStatus.PUBLISHED,
          publishedAt: new Date(),
        },
      }),
      prisma.course.create({
        data: {
          title: 'Mathématiques CM2 - Trimestre 1',
          description: 'Fractions, décimaux, géométrie et calcul',
          teacherId: teacher.id,
          schoolId: school.id,
          subjectId: subjects[1].id,
          status: CourseStatus.PUBLISHED,
          publishedAt: new Date(),
        },
      }),
      prisma.course.create({
        data: {
          title: 'Sciences CM2 - Trimestre 1',
          description: 'Le vivant, matière et énergie',
          teacherId: teacher.id,
          schoolId: school.id,
          subjectId: subjects[2].id,
          status: CourseStatus.PUBLISHED,
          publishedAt: new Date(),
        },
      }),
      prisma.course.create({
        data: {
          title: 'Histoire-Géographie CM2 - Trimestre 1',
          description: 'Le Moyen-Âge et géographie de la France',
          teacherId: teacher.id,
          schoolId: school.id,
          subjectId: subjects[3].id,
          status: CourseStatus.PUBLISHED,
          publishedAt: new Date(),
        },
      }),
    ]);
    console.log('✅ Courses created');

    // 8. Assign courses to class
    for (const course of courses) {
      await prisma.courseAssignment.create({
        data: {
          courseId: course.id,
          classId: cm2Class.id,
          dueDate: new Date('2025-11-30'),
        },
      });
    }
    console.log('✅ Course assignments created');

    // 9. Create Lessons (Content)
    const lessonsFrancais = [
      {
        order: 1,
        type: ContentType.LESSON,
        title: 'Les types et formes de phrases',
        data: {
          description: 'Apprendre à identifier les phrases simples et complexes',
          duration: 45,
        },
      },
      {
        order: 2,
        type: ContentType.LESSON,
        title: 'Le groupe nominal et ses expansions',
        data: {
          description: 'Étude des adjectifs, compléments du nom',
          duration: 50,
        },
      },
      {
        order: 3,
        type: ContentType.LESSON,
        title: 'La conjugaison aux temps du présent',
        data: {
          description: 'Révision du présent de l\'indicatif',
          duration: 45,
        },
      },
    ];

    const lessonsMath = [
      {
        order: 1,
        type: ContentType.LESSON,
        title: 'Les fractions - Introduction',
        data: {
          description: 'Notion de fraction, représentation',
          duration: 50,
        },
      },
      {
        order: 2,
        type: ContentType.LESSON,
        title: 'Les nombres décimaux',
        data: {
          description: 'Conversion fraction-décimal',
          duration: 50,
        },
      },
      {
        order: 3,
        type: ContentType.LESSON,
        title: 'La géométrie : les triangles',
        data: {
          description: 'Propriétés, classification des triangles',
          duration: 45,
        },
      },
    ];

    const lessonScience = [
      {
        order: 1,
        type: ContentType.LESSON,
        title: 'Le cycle de vie des plantes',
        data: {
          description: 'De la graine à la fleur',
          duration: 45,
        },
      },
      {
        order: 2,
        type: ContentType.LESSON,
        title: 'Les états de la matière',
        data: {
          description: 'Solide, liquide, gazeux',
          duration: 40,
        },
      },
      {
        order: 3,
        type: ContentType.LESSON,
        title: 'L\'énergie - Introduction',
        data: {
          description: 'Sources d\'énergie et transformations',
          duration: 50,
        },
      },
    ];

    // Create lesson contents
    for (const lesson of lessonsFrancais) {
      await prisma.courseContent.create({
        data: {
          courseId: courses[0].id,
          contentOrder: lesson.order,
          contentType: lesson.type,
          title: lesson.title,
          contentData: lesson.data,
          offlineAvailable: true,
        },
      });
    }

    for (const lesson of lessonsMath) {
      await prisma.courseContent.create({
        data: {
          courseId: courses[1].id,
          contentOrder: lesson.order,
          contentType: lesson.type,
          title: lesson.title,
          contentData: lesson.data,
          offlineAvailable: true,
        },
      });
    }

    for (const lesson of lessonScience) {
      await prisma.courseContent.create({
        data: {
          courseId: courses[2].id,
          contentOrder: lesson.order,
          contentType: lesson.type,
          title: lesson.title,
          contentData: lesson.data,
          offlineAvailable: true,
        },
      });
    }

    console.log('✅ Lessons created (9 total)');

    // 10. Create Class Schedule for Q1
    const scheduleData = [
      { day: DayOfWeek.MONDAY, time: '09:00', duration: 90, subject: 'Français' },
      { day: DayOfWeek.MONDAY, time: '11:00', duration: 60, subject: 'Mathématiques' },
      { day: DayOfWeek.TUESDAY, time: '10:00', duration: 60, subject: 'Mathématiques' },
      { day: DayOfWeek.TUESDAY, time: '14:00', duration: 45, subject: 'Sciences' },
      { day: DayOfWeek.WEDNESDAY, time: '09:30', duration: 90, subject: 'Français' },
      { day: DayOfWeek.THURSDAY, time: '10:00', duration: 60, subject: 'Mathématiques' },
      { day: DayOfWeek.THURSDAY, time: '14:00', duration: 60, subject: 'Histoire-Géographie' },
      { day: DayOfWeek.FRIDAY, time: '09:00', duration: 60, subject: 'Sciences' },
      { day: DayOfWeek.FRIDAY, time: '14:00', duration: 60, subject: 'Arts Plastiques' },
    ];

    for (const sched of scheduleData) {
      await prisma.classSchedule.upsert({
        where: {
          classId_dayOfWeek: {
            classId: cm2Class.id,
            dayOfWeek: sched.day,
          },
        },
        update: {
          plannedStartTime: sched.time,
          plannedDuration: sched.duration,
          teacherId: teacher.id,
        },
        create: {
          classId: cm2Class.id,
          teacherId: teacher.id,
          dayOfWeek: sched.day,
          plannedStartTime: sched.time,
          plannedDuration: sched.duration,
        },
      });
    }
    console.log('✅ Class schedule created/updated (9 sessions/week)');

    // 11. Create Quizzes with Questions
    const contentForQuiz = await prisma.courseContent.findMany({
      where: { courseId: courses[0].id },
      take: 1,
    });

    if (contentForQuiz.length > 0) {
      const quiz1 = await prisma.quiz.create({
        data: {
          courseContentId: contentForQuiz[0].id,
          title: 'Quiz - Les types de phrases',
          description: 'Évaluation sur la leçon 1',
          passingScore: 70,
          mode: QuizMode.EXAM,
          showAnswersAfter: true,
          questions: {
            create: [
              {
                questionType: 'MULTIPLE_CHOICE',
                text: 'Quelle est la différence entre une phrase simple et une phrase complexe ?',
                explanation: 'Une phrase simple contient un seul verbe, une phrase complexe en contient plusieurs.',
                order: 1,
                points: 2,
                options: JSON.parse(JSON.stringify([
                  { id: 'a', text: 'La longueur' },
                  { id: 'b', text: 'Le nombre de verbes' },
                  { id: 'c', text: 'La ponctuation' },
                ])),
                correctAnswer: JSON.parse(JSON.stringify({ type: 'single', value: 'b' })),
              },
              {
                questionType: 'TRUE_FALSE',
                text: 'Une phrase interrogative se termine toujours par un point d\'interrogation.',
                explanation: 'Correct ! C\'est la marque spécifique de la phrase interrogative.',
                order: 2,
                points: 1,
                options: JSON.parse(JSON.stringify([
                  { id: 'true', text: 'Vrai' },
                  { id: 'false', text: 'Faux' },
                ])),
                correctAnswer: JSON.parse(JSON.stringify({ type: 'single', value: 'true' })),
              },
              {
                questionType: 'MULTIPLE_CHOICE',
                text: 'Identifiez le type de phrase : "Arrête ce bruit !"',
                explanation: 'C\'est une phrase impérative car elle exprime un ordre.',
                order: 3,
                points: 2,
                options: JSON.parse(JSON.stringify([
                  { id: 'a', text: 'Déclarative' },
                  { id: 'b', text: 'Interrogative' },
                  { id: 'c', text: 'Impérative' },
                  { id: 'd', text: 'Exclamative' },
                ])),
                correctAnswer: JSON.parse(JSON.stringify({ type: 'single', value: 'c' })),
              },
              {
                questionType: 'SHORT_ANSWER',
                text: 'Donne 2 exemples de mots qui terminent une phrase interrogative.',
                explanation: 'Exemples: Comment, pourquoi, où, quand, qui, que, quoi, quel, etc.',
                order: 4,
                points: 2,
                options: JSON.parse(JSON.stringify([])),
                correctAnswer: JSON.parse(JSON.stringify({ type: 'multiple', value: [] })),
              },
            ],
          },
        },
      });
      console.log('✅ Français Quiz created with 4 questions');
    }

    // 12. Create Attendance Records for September (4 weeks)
    const septemberWeeks = [
      { start: new Date('2025-09-01'), end: new Date('2025-09-05') },
      { start: new Date('2025-09-08'), end: new Date('2025-09-12') },
      { start: new Date('2025-09-15'), end: new Date('2025-09-19') },
      { start: new Date('2025-09-22'), end: new Date('2025-09-26') },
    ];

    for (const week of septemberWeeks) {
      let currentDate = new Date(week.start);
      while (currentDate <= week.end) {
        // Skip weekends
        if (currentDate.getDay() > 0 && currentDate.getDay() < 6) {
          for (let i = 0; i < Math.min(5, students.length); i++) {
            const statuses = [AttendanceStatus.PRESENT, AttendanceStatus.PRESENT, AttendanceStatus.PRESENT, AttendanceStatus.ABSENT, AttendanceStatus.LATE, AttendanceStatus.EXCUSED];
            const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];

            await prisma.attendance.upsert({
              where: {
                studentId_classId_date: {
                  studentId: students[i].id,
                  classId: cm2Class.id,
                  date: currentDate,
                },
              },
              update: { status: randomStatus },
              create: {
                studentId: students[i].id,
                classId: cm2Class.id,
                date: currentDate,
                status: randomStatus,
                recordedById: teacher.id,
              },
            });
          }
        }
        currentDate.setDate(currentDate.getDate() + 1);
      }
    }
    console.log('✅ Attendance records created for September');

    // 13. Create Quiz Submissions (students taking the quiz)
    const quizzes = await prisma.quiz.findMany();
    if (quizzes.length > 0) {
      const quiz = quizzes[0];
      const questions = await prisma.question.findMany({ where: { quizId: quiz.id } });

      // Let 15 students take the quiz
      for (let i = 0; i < 15; i++) {
        const submission = await prisma.quizSubmission.upsert({
          where: {
            quizId_studentId_attemptNumber: {
              quizId: quiz.id,
              studentId: students[i].id,
              attemptNumber: 1,
            },
          },
          update: {
            startedAt: new Date('2025-09-10T10:00:00'),
            submittedAt: new Date('2025-09-10T10:25:00'),
            timeSpent: 1500, // 25 minutes
          },
          create: {
            quizId: quiz.id,
            studentId: students[i].id,
            attemptNumber: 1,
            startedAt: new Date('2025-09-10T10:00:00'),
            submittedAt: new Date('2025-09-10T10:25:00'),
            timeSpent: 1500, // 25 minutes
          },
        });

        // Add responses for each question
        let totalPoints = 0;
        let earnedPoints = 0;

        for (const question of questions) {
          let isCorrect: boolean | null = false;
          let studentAnswer: any = null;

          if (question.questionType === 'MULTIPLE_CHOICE') {
            const correctAnswer = question.correctAnswer as any;
            // 70% of students get MC questions right
            isCorrect = Math.random() > 0.3;
            studentAnswer = isCorrect ? correctAnswer.value : 'a';
          } else if (question.questionType === 'TRUE_FALSE') {
            isCorrect = Math.random() > 0.2;
            studentAnswer = isCorrect ? 'true' : 'false';
          } else if (question.questionType === 'SHORT_ANSWER') {
            // Short answers need manual grading
            studentAnswer = 'Réponse fournie par l\'étudiant';
            isCorrect = null;
          }

          totalPoints += question.points;
          if (isCorrect) earnedPoints += question.points;

          await prisma.questionResponse.upsert({
            where: {
              questionId_submissionId: {
                questionId: question.id,
                submissionId: submission.id,
              },
            },
            update: {
              studentAnswer,
              isCorrect: isCorrect === null ? null : isCorrect,
              pointsEarned: isCorrect === true ? question.points : 0,
            },
            create: {
              questionId: question.id,
              submissionId: submission.id,
              studentAnswer,
              isCorrect: isCorrect === null ? null : isCorrect,
              pointsEarned: isCorrect === true ? question.points : 0,
            },
          });
        }

        const score = (earnedPoints / totalPoints) * 100;
        await prisma.quizSubmission.update({
          where: { id: submission.id },
          data: {
            score,
            totalPoints,
            status: 'SUBMITTED',
          },
        });
      }
      console.log('✅ Quiz submissions created (15 students)');
    }

    console.log('\n✨ Q1 CM2 Seed completed successfully!\n');
    console.log('📊 Data Summary:');
    console.log(`   - School: ${school.name}`);
    console.log(`   - Teacher: ${teacher.name}`);
    console.log(`   - Class: ${cm2Class.name}`);
    console.log(`   - Students: ${students.length}`);
    console.log(`   - Courses: ${courses.length}`);
    console.log(`   - Weekly lessons: 9 sessions`);
    console.log(`   - Attendance records: ~100`);
    console.log(`   - Quizzes: 1 (4 questions)`);
    console.log(`   - Quiz submissions: 15`);
  } catch (error) {
    console.error('❌ Seed error:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

seedQ1CM2();
