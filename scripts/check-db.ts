import { PrismaClient } from '../src/generated/prisma';

const prisma = new PrismaClient();

async function checkDatabase() {
  try {
    console.log('🔍 Checking database status...\n');

    const [
      userCount,
      schoolCount,
      courseCount,
      subjectCount,
      classCount,
      academicYearCount,
      notificationCount,
      relationshipCount,
    ] = await Promise.all([
      prisma.user.count(),
      prisma.school.count(),
      prisma.course.count(),
      prisma.subject.count(),
      prisma.class.count(),
      prisma.academicYear.count(),
      prisma.notification.count(),
      prisma.userRelationship.count(),
    ]);

    console.log('📊 Database Status:');
    console.log('==================');
    console.log(`👥 Users:             ${userCount}`);
    console.log(`🏫 Schools:           ${schoolCount}`);
    console.log(`📚 Courses:           ${courseCount}`);
    console.log(`📖 Subjects:          ${subjectCount}`);
    console.log(`🎓 Classes:           ${classCount}`);
    console.log(`📅 Academic Years:    ${academicYearCount}`);
    console.log(`🔔 Notifications:     ${notificationCount}`);
    console.log(`👨‍👩‍👧‍👦 Relationships:    ${relationshipCount}`);
    console.log('==================\n');

    if (userCount === 0 && schoolCount === 0) {
      console.log('⚠️  Database is EMPTY! Run: npm run db:seed\n');
    } else {
      console.log('✅ Database is populated!\n');

      // Show sample users
      const users = await prisma.user.findMany({
        select: {
          email: true,
          role: true,
          firstName: true,
        },
        take: 5,
      });

      if (users.length > 0) {
        console.log('👥 Sample Users:');
        users.forEach((user) => {
          console.log(`   - ${user.email} (${user.role}) - ${user.email || 'no email'}`);
        });
        console.log('\n💡 Use these credentials to login (password: Password123!)');
      }
    }
  } catch (error) {
    console.error('❌ Error checking database:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkDatabase();
