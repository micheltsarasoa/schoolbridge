/**
 * Script to update all user passwords in the database to "Password123!"
 * Run with: npx ts-node --esm prisma/scripts/update-all-passwords.ts
 */

const { PrismaClient } = require('../../src/generated/prisma');
const bcryptjs = require('bcryptjs');

const prisma = new PrismaClient();

async function updateAllPasswords() {
  try {
    console.log('🔐 Updating all user passwords to "Password123!"...\n');

    // Hash the new password
    const hashedPassword = await bcryptjs.hash('Password123!', 10);

    // Update all users
    const result = await prisma.user.updateMany({
      data: {
        password: hashedPassword,
      },
    });

    console.log(`✅ Successfully updated ${result.count} user(s) password(s)`);
    console.log('\n📋 Updated users:');

    // Fetch and display all users
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
      },
    });

    users.forEach((user: any, index: number) => {
      console.log(`  ${index + 1}. ${user.email} (${user.role}) - ${user.name}`);
    });

    console.log(`\n🎯 Total users: ${users.length}`);
    console.log('\n✨ All passwords are now set to: Password123!');
  } catch (error) {
    console.error('❌ Error updating passwords:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

updateAllPasswords();
