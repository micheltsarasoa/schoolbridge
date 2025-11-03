const { seedCourses } = require('./courses-seed');
const { addStudentAssignments } = require('./add-student-assignments-seed');

async function main() {
  console.log('🚀 Starting enhanced seeding process...\n');

  try {
    console.log('📚 Step 1: Seeding courses with content...\n');
    await seedCourses();

    console.log('\n📝 Step 2: Adding individual student assignments...\n');
    await addStudentAssignments();

    console.log('\n🎉 All seeding complete!\n');
  } catch (error) {
    console.error('❌ Fatal error:', error);
    process.exit(1);
  }
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  });
