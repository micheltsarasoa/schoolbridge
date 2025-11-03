import { PrismaClient, UserRole, Language, CourseStatus, ContentType } from '../src/generated/prisma';
import bcrypt from 'bcryptjs';
import * as fs from 'fs';
import * as path from 'path';

const prisma = new PrismaClient();

const seedDataDir = path.join(__dirname, 'seed-data');

async function main() {
  console.log('🌱 Starting dynamic database seeding...');

  // --- 1. Clear existing data (order matters due to foreign keys) ---
  console.log('🗑️  Cleaning existing data...');
  await prisma.submission.deleteMany();
  await prisma.attendance.deleteMany();
  await prisma.studentProgress.deleteMany();
  await prisma.courseAssignment.deleteMany();
  await prisma.courseContent.deleteMany();
  await prisma.courseValidation.deleteMany();
  await prisma.contentVersion.deleteMany();
  await prisma.course.deleteMany();
  await prisma.userRelationship.deleteMany();
  await prisma.notification.deleteMany();
  await prisma.parentInstructionCompletion.deleteMany();
  await prisma.parentInstruction.deleteMany();
  await prisma.schoolConfig.deleteMany();
  await prisma.user.deleteMany();
  await prisma.subject.deleteMany();
  await prisma.class.deleteMany();
  await prisma.academicYear.deleteMany();
  await prisma.school.deleteMany();
  console.log('🗑️  Existing data cleared.');

  // --- 2. Seed Schools ---
  console.log('🏫 Seeding schools from schools.json...');
  const schoolsData = JSON.parse(fs.readFileSync(path.join(seedDataDir, 'schools.json'), 'utf-8'));
  await prisma.school.createMany({ data: schoolsData });
  console.log(`🏫 ${schoolsData.length} schools seeded.`);

  // --- 3. Seed Academic Years ---
  console.log('🗓️  Seeding academic years from academic-years.json...');
  const academicYearsData = JSON.parse(fs.readFileSync(path.join(seedDataDir, 'academic-years.json'), 'utf-8'));
  await prisma.academicYear.createMany({ data: academicYearsData });
  console.log(`🗓️  ${academicYearsData.length} academic years seeded.`);

  // --- 4. Seed Subjects ---
  console.log('📚 Seeding subjects from subjects.json...');
  const subjectsData = JSON.parse(fs.readFileSync(path.join(seedDataDir, 'subjects.json'), 'utf-8'));
  await prisma.subject.createMany({ data: subjectsData });
  console.log(`📚 ${subjectsData.length} subjects seeded.`);

  // --- 5. Seed Classes ---
  console.log('🏫 Seeding classes from classes.json...');
  const classesData = JSON.parse(fs.readFileSync(path.join(seedDataDir, 'classes.json'), 'utf-8'));
  await prisma.class.createMany({ data: classesData });
  console.log(`🏫 ${classesData.length} classes seeded.`);

  // --- 6. Seed Users ---
  console.log('👥 Seeding users from users.json...');
  const usersData = JSON.parse(fs.readFileSync(path.join(seedDataDir, 'users.json'), 'utf-8'));
  for (const userData of usersData) {
    const hashedPassword = await bcrypt.hash(userData.password, 10);
    await prisma.user.create({
      data: {
        ...userData,
        password: hashedPassword,
        emailVerified: userData.email ? new Date() : null, // Auto-verify email if present
        phoneVerified: userData.phone ? new Date() : null, // Auto-verify phone if present
      },
    });
  }
  console.log(`👥 ${usersData.length} users seeded.`);

  // --- 7. Seed Courses ---
  console.log('📖 Seeding courses from courses.json...');
  const coursesData = JSON.parse(fs.readFileSync(path.join(seedDataDir, 'courses.json'), 'utf-8'));
  await prisma.course.createMany({ data: coursesData });
  console.log(`📖 ${coursesData.length} courses seeded.`);

  // --- 8. Seed Course Content and Assignments ---
  console.log('📝 Seeding course content and assignments...');

  const courses = await prisma.course.findMany();
  const students = await prisma.user.findMany({ where: { role: 'STUDENT' } });
  const classes = await prisma.class.findMany();

  if (courses.length > 0 && students.length > 0) {
    let contentCreated = 0;
    let assignmentCreated = 0;

    // Add course content
    for (const course of courses) {
      const sampleContents = [
        {
          contentOrder: 1,
          contentType: ContentType.LESSON,
          title: `Introduction to ${course.title}`,
          contentData: {
            text: `<h2>Welcome to ${course.title}!</h2><p>This is the first lesson. In this course, you will learn fundamental concepts and practical applications. Let's get started!</p>`,
            duration: 15,
          },
          offlineAvailable: true,
        },
        {
          contentOrder: 2,
          contentType: ContentType.LESSON,
          title: `Core Concepts of ${course.title}`,
          contentData: {
            text: `<h2>Core Concepts</h2><p>Understanding the main concepts is crucial for success in this course. We'll cover essential topics that form the foundation of your learning.</p>`,
            duration: 20,
          },
          offlineAvailable: true,
        },
        {
          contentOrder: 3,
          contentType: ContentType.VIDEO,
          title: `Video Lecture: ${course.title} Overview`,
          contentData: {
            videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
            duration: 600,
            transcript: 'This is a sample video lecture...',
          },
          offlineAvailable: false,
        },
        {
          contentOrder: 4,
          contentType: ContentType.QUIZ,
          title: `Quiz: ${course.title} Fundamentals`,
          contentData: {
            questions: [
              { question: 'What is the main topic of this course?', options: ['Option A', 'Option B', 'Option C'], correctAnswer: 0 },
              { question: 'Which concept is most important?', options: ['Concept 1', 'Concept 2', 'Concept 3'], correctAnswer: 1 },
            ],
            passingScore: 70,
            timeLimit: 600,
          },
          offlineAvailable: true,
        },
      ];

      for (const content of sampleContents) {
        await prisma.courseContent.create({
          data: {
            courseId: course.id,
            ...content,
          },
        });
        contentCreated++;
      }
    }

    // Add course assignments (both class-based and individual student)
    for (const course of courses) {
      // Assign to a class
      if (classes.length > 0) {
        await prisma.courseAssignment.create({
          data: {
            courseId: course.id,
            classId: classes[Math.floor(Math.random() * classes.length)].id,
            dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
          },
        });
        assignmentCreated++;
      }

      // Assign to individual students
      const numStudents = Math.min(Math.floor(Math.random() * 3) + 1, students.length);
      for (let i = 0; i < numStudents; i++) {
        const randomStudent = students[Math.floor(Math.random() * students.length)];
        const existingAssignment = await prisma.courseAssignment.findFirst({
          where: {
            courseId: course.id,
            studentId: randomStudent.id,
          },
        });

        if (!existingAssignment) {
          await prisma.courseAssignment.create({
            data: {
              courseId: course.id,
              studentId: randomStudent.id,
              dueDate: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000),
            },
          });
          assignmentCreated++;
        }
      }
    }

    console.log(`📝 Created ${contentCreated} course content items and ${assignmentCreated} course assignments.`);
  }

  console.log('✅ Dynamic seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
