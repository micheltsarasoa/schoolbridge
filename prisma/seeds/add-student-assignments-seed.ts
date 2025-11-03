import { PrismaClient } from '../../src/generated/prisma';

const prisma = new PrismaClient();

export async function addStudentAssignments() {
  console.log('🌱 Adding individual student course assignments...\n');

  try {
    // Get all students and courses
    const students = await prisma.user.findMany({
      where: { role: 'STUDENT' },
    });

    const courses = await prisma.course.findMany({
      where: { status: 'PUBLISHED' },
    });

    if (students.length === 0) {
      console.log('⚠️ No students found. Please run course seed first.');
      return;
    }

    if (courses.length === 0) {
      console.log('⚠️ No courses found. Please run course seed first.');
      return;
    }

    console.log(`📚 Found ${students.length} students and ${courses.length} courses\n`);

    // Clear existing individual student assignments (but keep class assignments)
    const deletedAssignments = await prisma.courseAssignment.deleteMany({
      where: {
        studentId: { not: null },
      },
    });

    console.log(`🗑️  Cleared ${deletedAssignments.count} existing student assignments\n`);

    // Assign courses to individual students
    let assignmentCount = 0;

    for (const student of students) {
      // Each student gets assigned to 2-3 random courses (or all if there are only 3)
      const numCoursesToAssign = Math.min(courses.length, Math.floor(Math.random() * 2) + 2);
      const shuffledCourses = courses.sort(() => Math.random() - 0.5);
      const assignedCourses = shuffledCourses.slice(0, numCoursesToAssign);

      for (const course of assignedCourses) {
        // Check if this student already has a class-based assignment for this course
        const existingClassAssignment = await prisma.courseAssignment.findFirst({
          where: {
            courseId: course.id,
            classId: { not: null },
            class: {
              students: {
                some: {
                  id: student.id,
                },
              },
            },
          },
        });

        // Only create individual assignment if no class assignment exists
        if (!existingClassAssignment) {
          const assignment = await prisma.courseAssignment.create({
            data: {
              courseId: course.id,
              studentId: student.id,
              dueDate: new Date(Date.now() + Math.random() * 60 * 24 * 60 * 60 * 1000), // Random due date up to 60 days
            },
          });

          console.log(`✅ Assigned "${course.title}" to ${student.name}`);
          assignmentCount++;
        }
      }
    }

    console.log(`\n✅ ====================================`);
    console.log(`✅ Successfully created ${assignmentCount} student assignments!`);
    console.log(`✅ ====================================\n`);

    // Display assignment statistics
    const allAssignments = await prisma.courseAssignment.findMany({
      include: {
        course: true,
      },
    });

    const classAssignments = allAssignments.filter(a => a.classId);
    const studentAssignments = allAssignments.filter(a => a.studentId);

    console.log('📊 Assignment Summary:');
    console.log(`   - Class-based assignments: ${classAssignments.length}`);
    console.log(`   - Individual student assignments: ${studentAssignments.length}`);
    console.log(`   - Total assignments: ${allAssignments.length}\n`);

    // Show student assignment details
    console.log('👤 Student Assignments:');
    for (const student of students) {
      const studentAsignments = await prisma.courseAssignment.findMany({
        where: { studentId: student.id },
        include: { course: true },
      });

      if (studentAsignments.length > 0) {
        console.log(`\n   ${student.name} (${student.email}):`);
        for (const assignment of studentAsignments) {
          console.log(`      - ${assignment.course.title}`);
        }
      }
    }

    console.log('\n✅ Student assignments completed successfully!\n');
  } catch (error) {
    console.error('❌ Error adding student assignments:', error);
    throw error;
  }
}

// Run if called directly
if (require.main === module) {
  addStudentAssignments()
    .catch((e) => {
      console.error(e);
      process.exit(1);
    })
    .finally(async () => {
      await prisma.$disconnect();
    });
}
