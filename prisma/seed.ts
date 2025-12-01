import { Prisma, PrismaClient } from '@/generated/prisma/client';
import bcrypt from 'bcryptjs';
import fs from 'fs';
import path from 'path';

const prisma = new PrismaClient();
const seedDataDir = path.join(__dirname, 'seed-data');

// Map Prisma client model names to their JSON file names
const MODEL_FILE_MAP: { [key: string]: string } = {
  'schools': 'schools.json',
  'academicPeriod': 'academicPeriods.json',
  'user': 'users.json',
  'admin': 'admins.json',
  'instructor': 'instructors.json',
  'students': 'students_profiles.json',
  'parents': 'parents_profiles.json',
  'classes': 'classes.json',
  'parent_students': 'parent_students.json',
  'class_enrollments': 'class_enrollments.json',
  'attendance': 'attendances.json',
  'calendarEvent': 'calendarEvents.json',
  'announcement': 'announcements.json',
  'badge': 'badges.json',
  'userBadge': 'userBadges.json',
};

// --- Seeding Order (using actual Prisma client model property names) ---
// The order is crucial to respect foreign key constraints.
const SEED_ORDER = [
  'schools',
  'academicPeriod',
  'user',
  'admin',
  'instructor',
  'students',
  'parents',
  'classes',
  'parent_students',
  'class_enrollments',
  'attendance',
  'calendarEvent',
  'announcement',
  'badge',
  'userBadge',
];

// --- Main Seeding Function ---
async function main() {
  console.log('🌱 Starting database seeding from JSON files...');

  for (const modelName of SEED_ORDER) {
    const fileName = MODEL_FILE_MAP[modelName];
    if (!fileName) {
      console.error(`🔴 Error: No file mapping found for model ${modelName}.`);
      continue;
    }
    const filePath = path.join(seedDataDir, fileName);

    if (!fs.existsSync(filePath)) {
      console.log(`🟡 Skipping ${modelName}: File '${fileName}' not found.`);
      continue;
    }

    const fileContent = fs.readFileSync(filePath, 'utf-8');
    if (!fileContent.trim()) {
      console.log(`🟡 Skipping ${modelName}: File '${fileName}' is empty.`);
      continue;
    }

    const data = JSON.parse(fileContent);
    if (!Array.isArray(data) || data.length === 0) {
      console.log(`🟡 Skipping ${modelName}: No data to seed in '${fileName}'.`);
      continue;
    }

    console.log(`🌱 Seeding ${modelName} from '${fileName}'...`);
    let count = 0;
    for (const record of data) {
      // --- Special Handling for Users: Hash Passwords ---
      if (modelName === 'user' && record.password) {
        record.password = await bcrypt.hash(record.password, 10);
      }

      // --- Determine Unique Identifier for Upsert ---
      let whereClause: any = {};
      // Most models have 'id' as the unique identifier for upsert
      if (record.id) {
        whereClause.id = record.id;
      } else {
        // Handle models with composite unique keys or userId unique keys
        switch (modelName) {
          case 'parent_students':
            whereClause = { parentId_studentId: { parentId: record.parentId, studentId: record.studentId } };
            break;
          case 'class_enrollments':
            whereClause = { classId_studentId: { classId: record.classId, studentId: record.studentId } };
            break;
          case 'attendance':
            whereClause = { studentId_classId_date: { studentId: record.studentId, classId: record.classId, date: new Date(record.date) } };
            break;
          case 'userBadge':
            whereClause = { userId_badgeId: { userId: record.userId, badgeId: record.badgeId } };
            break;
          case 'schools':
            whereClause = { code: record.code };
            break;
          case 'academicPeriod':
            whereClause = { id: record.id };
            break;
          case 'classes':
            whereClause = { id: record.id };
            break;
          case 'admin':
          case 'instructor':
          case 'students':
          case 'parents':
            whereClause = { userId: record.userId }; // These models have userId as a unique field
            break;
          default:
            console.error(`🔴 Cannot upsert for ${modelName}: No 'id' field or specific unique key found in record for upsert ->`, record);
            continue; // Skip this record if no upsert key is defined
        }
      }

      try {
        await (prisma as any)[modelName].upsert({
          where: whereClause,
          update: record,
          create: record,
        });
        count++;
      } catch (e) {
        if (e instanceof Prisma.PrismaClientKnownRequestError) {
          console.error(`❌ Prisma Error for ${modelName} (Code: ${e.code}): Record ->`, record, `\nError: ${e.message}`);
        } else {
          console.error(`❌ Unknown error seeding ${modelName}:`, e);
        }
      }
    }
    console.log(`✅ Seeded ${count}/${data.length} records for ${modelName}.`);
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
