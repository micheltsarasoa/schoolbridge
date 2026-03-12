import { Prisma, PrismaClient } from '@/generated/prisma/client';
import bcrypt from 'bcryptjs';
import fs from 'fs';
import path from 'path';

const prisma = new PrismaClient();
const seedDataDir = path.join(__dirname, 'seed-data');

// Map Prisma client model names to their JSON file names
const MODEL_FILE_MAP: { [key: string]: string } = {
  'School': 'schools.json',
  'AcademicYear': 'academic-years.json',
  'AcademicPeriod': 'academicPeriods.json',
  'User': 'users.json',
  'Admin': 'admins.json',
  'Instructor': 'instructors.json',
  'Student': 'students.json',
  'Parent': 'parents.json',
  'Class': 'classes.json',
  'ParentStudent': 'parent_students.json',
  'ClassEnrollment': 'class_enrollments.json',
  'Attendance': 'attendances.json',
  'CalendarEvent': 'calendarEvents.json',
  'Announcement': 'announcements.json',
  'Badge': 'badges.json',
  'UserBadge': 'userBadges.json',
  'Quiz': 'quizzes.json',
  'Question': 'questions.json',
  'Option': 'options.json',
  'QuizAssignment': 'quiz_assignments.json',
  'AnswerSubmission': 'answer_submissions.json',
  'SidebarConfiguration': 'sidebar-configurations.json',
};

// --- Seeding Order (using actual Prisma client model property names) ---
const SEED_ORDER = [
  'School',
  'AcademicYear',
  'AcademicPeriod',
  'User',
  'Instructor',
  'Student',
  'Parent',
  'ParentStudent',
  'Class',
  'ClassEnrollment',
  'Attendance',
  'CalendarEvent',
  'Announcement',
  'Badge',
  'UserBadge',
  'Quiz',
  'Question',
  'Option',
  'QuizAssignment',
  'AnswerSubmission',
  'SidebarConfiguration',
];

async function seedModel(modelName: string) {
  const fileName = MODEL_FILE_MAP[modelName];
  if (!fileName) {
    console.error(`🔴 Error: No file mapping found for model ${modelName}.`);
    return;
  }
  const filePath = path.join(seedDataDir, fileName);

  if (!fs.existsSync(filePath)) {
    console.log(`🟡 Skipping ${modelName}: File '${fileName}' not found.`);
    return;
  }

  const fileContent = fs.readFileSync(filePath, 'utf-8');
  if (!fileContent.trim()) {
    console.log(`🟡 Skipping ${modelName}: File '${fileName}' is empty.`);
    return;
  }

  const data = JSON.parse(fileContent);
  if (!Array.isArray(data) || data.length === 0) {
    console.log(`🟡 Skipping ${modelName}: No data to seed in '${fileName}'.`);
    return;
  }

  console.log(`🌱 Seeding ${modelName} from '${fileName}'...`);
  let count = 0;

  if (modelName === 'Admin') {
    for (const adminRecord of data) {
      const { adminRole, ...userRecord } = adminRecord;
      userRecord.password = await bcrypt.hash(userRecord.password, 10);
      
      const user = await prisma.user.upsert({
        where: { email: userRecord.email },
        update: userRecord,
        create: { ...userRecord, updatedAt: new Date() },
      });

      await prisma.admin.upsert({
        where: { userId: user.id },
        update: { role: adminRole },
        create: {
          userId: user.id,
          role: adminRole,
        },
      });
      count++;
    }
  } else {
    for (const record of data) {
      if (modelName === 'User' && record.password) {
        record.password = await bcrypt.hash(record.password, 10);
      }

      let whereClause: any = {};
      if (record.id) {
        whereClause.id = record.id;
      } else {
        // Handle composite keys and other unique identifiers
      }

      try {
       if (modelName === 'SidebarConfiguration') {
         await prisma.sidebarConfiguration.upsert({
           where: { schoolId: record.schoolId },
           update: { configuration: record.configuration as any },
           create: {
             schoolId: record.schoolId,
             configuration: record.configuration as any,
             clientId: 'system-seed', // or a default admin id
           },
         });
       } else {
         await (prisma as any)[modelName].upsert({
           where: whereClause,
           update: record,
           create: record,
         });
       }
        count++;
      } catch (e) {
        if (e instanceof Prisma.PrismaClientKnownRequestError) {
          console.error(`❌ Prisma Error for ${modelName} (Code: ${e.code}): Record ->`, record, `\nError: ${e.message}`);
        } else {
          console.error(`❌ Unknown error seeding ${modelName}:`, e);
        }
      }
    }
  }
  console.log(`✅ Seeded ${count}/${data.length} records for ${modelName}.`);
}


// --- Main Seeding Function ---
async function main() {
  const args = process.argv.slice(2);
  const modelArg = args.find(arg => arg.startsWith('--model='));
  const specificModel = modelArg ? modelArg.split('=')[1] : null;

  if (specificModel) {
    console.log(`🌱 Starting database seeding for model: ${specificModel}...`);
    await seedModel(specificModel);
  } else {
    console.log('🌱 Starting database seeding from JSON files...');
    for (const modelName of SEED_ORDER) {
      await seedModel(modelName);
    }
  }

  console.log('✅ Seeding completed successfully!');
}

// --- Execute Seeding ---
main()
  .catch((e) => {
    console.error('❌ A critical error occurred during the seeding process:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    console.log('🔚 Prisma client disconnected.');
  });
