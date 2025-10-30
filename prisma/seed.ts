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

  // --- Add seeding for other models as needed (e.g., CourseContent, Assignments, etc.) ---

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
