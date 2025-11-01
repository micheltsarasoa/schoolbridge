/**
 * Standalone script to seed realistic course data
 * Run with: npx ts-node prisma/seeds/run-course-seed.ts
 */

import { seedCourses } from './courses-seed';

async function main() {
  console.log('🚀 Starting course seeding process...\n');
  await seedCourses();
  console.log('🎉 Course seeding complete!\n');
}

main()
  .catch((e) => {
    console.error('❌ Fatal error:', e);
    process.exit(1);
  })
  .finally(() => {
    console.log('👋 Seed script finished.');
  });
