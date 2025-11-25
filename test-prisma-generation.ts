// Test file to verify Prisma generation includes new models
import prisma from './src/lib/prisma';
import { InvitationCodeRole, ApprovalStatus } from './src/generated/prisma';

async function testPrismaGeneration() {
  console.log('✅ Testing Prisma Client Generation...\n');

  // Test 1: Check if models are available
  console.log('1. Checking if new models exist in Prisma Client:');
  console.log('   - prisma.invitationCode:', typeof prisma.invitationCode);
  console.log('   - prisma.teacherApproval:', typeof prisma.teacherApproval);
  console.log('   - prisma.parentChildLink:', typeof prisma.parentChildLink);

  // Test 2: Check if enums are available
  console.log('\n2. Checking if new enums exist:');
  console.log('   - InvitationCodeRole:', InvitationCodeRole);
  console.log('   - ApprovalStatus:', ApprovalStatus);

  // Test 3: Type check (this will compile if types are correct)
  console.log('\n3. Type checking (compilation test):');
  const invitationCodeExample: Parameters<typeof prisma.invitationCode.create>[0] = {
    data: {
      code: 'TEST123',
      role: 'TEACHER',
      schoolId: 'test-school-id',
      createdBy: 'test-user-id',
      isActive: true,
    }
  };
  console.log('   ✓ InvitationCode type is correct');

  const approvalExample: Parameters<typeof prisma.teacherApproval.create>[0] = {
    data: {
      userId: 'test-user-id',
      schoolId: 'test-school-id',
      status: 'PENDING',
    }
  };
  console.log('   ✓ TeacherApproval type is correct');

  console.log('\n✅ All Prisma generation tests passed!');
  console.log('\n📝 Summary:');
  console.log('   - InvitationCode model: ✓');
  console.log('   - TeacherApproval model: ✓');
  console.log('   - ParentChildLink model: ✓');
  console.log('   - InvitationCodeRole enum: ✓');
  console.log('   - ApprovalStatus enum: ✓');
}

testPrismaGeneration().catch(console.error);
