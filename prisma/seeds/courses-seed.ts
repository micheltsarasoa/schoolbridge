import { PrismaClient, CourseStatus, ContentType, Language } from '../../src/generated/prisma';

const prisma = new PrismaClient();

export async function seedCourses() {
  console.log('🌱 Seeding realistic courses with content and progress...');

  try {
    // Get the default school
    const school = await prisma.school.findFirst();
    if (!school) {
      console.error('❌ No school found. Please run school seed first.');
      return;
    }

    // Create subjects
    console.log('📚 Creating subjects...');
    const computerScience = await prisma.subject.upsert({
      where: { schoolId_name: { schoolId: school.id, name: 'Computer Science' } },
      update: {},
      create: { name: 'Computer Science', schoolId: school.id },
    });

    const digitalLiteracy = await prisma.subject.upsert({
      where: { schoolId_name: { schoolId: school.id, name: 'Digital Literacy' } },
      update: {},
      create: { name: 'Digital Literacy', schoolId: school.id },
    });

    const mathematics = await prisma.subject.upsert({
      where: { schoolId_name: { schoolId: school.id, name: 'Mathematics' } },
      update: {},
      create: { name: 'Mathematics', schoolId: school.id },
    });

    const science = await prisma.subject.upsert({
      where: { schoolId_name: { schoolId: school.id, name: 'Science' } },
      update: {},
      create: { name: 'Science', schoolId: school.id },
    });

    // Get or create a teacher
    console.log('👨‍🏫 Finding/creating teacher...');
    let teacher = await prisma.user.findFirst({
      where: { role: 'TEACHER', schoolId: school.id },
    });

    if (!teacher) {
      const bcrypt = require('bcryptjs');
      const hashedPassword = await bcrypt.hash('Teacher123', 12);
      teacher = await prisma.user.create({
        data: {
          email: 'teacher@schoolbridge.com',
          name: 'Prof. Sarah Johnson',
          password: hashedPassword,
          role: 'TEACHER',
          schoolId: school.id,
          isActive: true,
          emailVerified: new Date(),
        },
      });
      console.log('✅ Created teacher:', teacher.email);
    }

    // Get students
    let students = await prisma.user.findMany({
      where: { role: 'STUDENT', schoolId: school.id },
      take: 5,
    });

    if (students.length === 0) {
      console.log('⚠️ No students found. Creating sample students...');
      const bcrypt = require('bcryptjs');
      const hashedPassword = await bcrypt.hash('Student123', 12);

      for (let i = 1; i <= 5; i++) {
        await prisma.user.create({
          data: {
            email: `student${i}@schoolbridge.com`,
            name: `Student ${i === 1 ? 'John' : i}`,
            password: hashedPassword,
            role: 'STUDENT',
            schoolId: school.id,
            isActive: true,
            emailVerified: new Date(),
          },
        });
      }

      students = await prisma.user.findMany({
        where: { role: 'STUDENT', schoolId: school.id },
        take: 5,
      });
    }

    // Create classes
    console.log('🏫 Creating classes...');
    const class10A = await prisma.class.upsert({
      where: { schoolId_name: { schoolId: school.id, name: '10A' } },
      update: {},
      create: {
        name: '10A',
        schoolId: school.id,
      },
    });

    // Assign students to class
    for (const student of students) {
      await prisma.user.update({
        where: { id: student.id },
        data: {
          classes: {
            connect: { id: class10A.id }
          }
        },
      });
    }

    console.log('💻 Creating Course 1: Introduction to Python Programming...');

    // Course 1: Introduction to Python Programming
    const pythonCourse = await prisma.course.create({
      data: {
        title: 'Introduction to Python Programming',
        description: 'Learn the fundamentals of programming with Python. Perfect for beginners with no prior coding experience. Build real projects and gain practical skills.',
        teacherId: teacher.id,
        schoolId: school.id,
        subjectId: computerScience.id,
        status: CourseStatus.PUBLISHED,
        language: Language.EN,
        requiresOnline: false,
        thumbnailUrl: '/courses/python-intro.jpg',
        publishedAt: new Date(),
      },
    });

    // Course content for Python course
    const pythonContent = [
      {
        contentOrder: 1,
        contentType: ContentType.LESSON,
        title: 'Welcome to Python Programming!',
        contentData: {
          text: `
# Welcome to Python Programming! 🐍

## What is Python?

Python is one of the most popular programming languages in the world. It's used by companies like Google, Netflix, NASA, and Instagram!

## Why Learn Python?

- **Easy to learn**: Python has a simple, readable syntax that's perfect for beginners
- **Powerful**: You can build websites, games, AI applications, and more
- **In-demand**: Python developers are highly sought after in the job market
- **Free**: Python is completely free and open-source

## What You'll Learn

In this course, you'll learn:
1. Basic programming concepts (variables, data types, loops)
2. How to write and run Python programs
3. Problem-solving with code
4. Build real projects like a calculator, quiz game, and more!

## Let's Get Started!

By the end of this course, you'll be able to write your own Python programs and solve real-world problems with code.

Ready? Let's dive in! 🚀
          `,
          duration: 10,
        },
        offlineAvailable: true,
      },
      {
        contentOrder: 2,
        contentType: ContentType.LESSON,
        title: 'Your First Python Program',
        contentData: {
          text: `
# Your First Python Program 🎉

## The "Hello, World!" Tradition

Every programmer starts with "Hello, World!" - it's a tradition that dates back decades!

## Let's Write It!

\`\`\`python
print("Hello, World!")
\`\`\`

That's it! This simple line tells Python to display text on the screen.

## Try It Yourself!

**Exercise 1**: Modify the program to print your name:
\`\`\`python
print("Hello, my name is [Your Name]!")
\`\`\`

**Exercise 2**: Print multiple lines:
\`\`\`python
print("Welcome to Python!")
print("I'm learning to code!")
print("This is awesome!")
\`\`\`

## Understanding print()

- \`print()\` is a **function** - a reusable block of code
- The text inside quotes is called a **string**
- You can use single quotes ('') or double quotes ("")

## Practice Challenge 🎯

Write a program that prints your favorite quote or a short poem!
          `,
          duration: 15,
        },
        offlineAvailable: true,
      },
      {
        contentOrder: 3,
        contentType: ContentType.VIDEO,
        title: 'Variables and Data Types Explained',
        contentData: {
          videoUrl: 'https://example.com/videos/python-variables.mp4',
          duration: 420, // 7 minutes
          transcript: 'In this video, we explore variables - the building blocks of programming...',
        },
        offlineAvailable: false,
      },
      {
        contentOrder: 4,
        contentType: ContentType.QUIZ,
        title: 'Quiz: Python Basics',
        contentData: {
          questions: [
            {
              question: 'What function do we use to display text in Python?',
              options: ['display()', 'print()', 'show()', 'echo()'],
              correctAnswer: 1,
              points: 10,
            },
            {
              question: 'Which of these is a valid variable name in Python?',
              options: ['my-variable', 'my variable', 'my_variable', '2my_variable'],
              correctAnswer: 2,
              points: 10,
            },
            {
              question: 'What data type is "Hello"?',
              options: ['Integer', 'String', 'Float', 'Boolean'],
              correctAnswer: 1,
              points: 10,
            },
          ],
          passingScore: 70,
          timeLimit: 300, // 5 minutes
        },
        offlineAvailable: true,
      },
      {
        contentOrder: 5,
        contentType: ContentType.ASSIGNMENT,
        title: 'Build a Simple Calculator',
        contentData: {
          instructions: `
# Project: Build a Simple Calculator 🔢

## Objective
Create a Python program that performs basic arithmetic operations.

## Requirements
Your calculator should:
1. Ask the user for two numbers
2. Ask which operation to perform (+, -, *, /)
3. Display the result

## Example Output
\`\`\`
Enter first number: 10
Enter second number: 5
Choose operation (+, -, *, /): +
Result: 15
\`\`\`

## Bonus Challenge 🌟
Add error handling for division by zero!

## Submission
Submit your .py file with clear comments explaining your code.

**Due Date**: 1 week from enrollment
**Points**: 50
          `,
          maxScore: 50,
          dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 1 week from now
        },
        offlineAvailable: true,
      },
      {
        contentOrder: 6,
        contentType: ContentType.LESSON,
        title: 'Loops: Making Code Repeat',
        contentData: {
          text: `
# Loops: Making Code Repeat 🔄

## Why Loops?

Imagine you need to print "Hello!" 100 times. Would you write 100 print statements? No way!

## The For Loop

\`\`\`python
for i in range(5):
    print("Hello!")
\`\`\`

This prints "Hello!" 5 times. Much easier!

## Real-World Example: Countdown Timer

\`\`\`python
for count in range(10, 0, -1):
    print(count)
print("Blast off! 🚀")
\`\`\`

## Practice Exercise

Create a program that:
1. Asks the user for their name
2. Asks how many times to greet them
3. Prints a personalized greeting that many times

**Hint**: Use \`input()\` and a for loop!
          `,
          duration: 20,
        },
        offlineAvailable: true,
      },
    ];

    for (const content of pythonContent) {
      await prisma.courseContent.create({
        data: {
          courseId: pythonCourse.id,
          contentOrder: content.contentOrder,
          contentType: content.contentType,
          title: content.title,
          contentData: content.contentData,
          offlineAvailable: content.offlineAvailable,
        },
      });
    }

    console.log('📱 Creating Course 2: Digital Skills for Modern Life...');

    // Course 2: Digital Skills for Modern Life
    const digitalSkillsCourse = await prisma.course.create({
      data: {
        title: 'Digital Skills for Modern Life',
        description: 'Master essential digital skills for the 21st century. Learn online safety, digital communication, productivity tools, and how to navigate the digital world confidently.',
        teacherId: teacher.id,
        schoolId: school.id,
        subjectId: digitalLiteracy.id,
        status: CourseStatus.PUBLISHED,
        language: Language.EN,
        requiresOnline: true,
        thumbnailUrl: '/courses/digital-skills.jpg',
        publishedAt: new Date(),
      },
    });

    const digitalSkillsContent = [
      {
        contentOrder: 1,
        contentType: ContentType.LESSON,
        title: 'Introduction to Digital Literacy',
        contentData: {
          text: `
# Digital Literacy: Essential Skills for Today 🌐

## What is Digital Literacy?

Digital literacy is the ability to use technology effectively and responsibly. In today's world, it's as important as reading and writing!

## Why Does It Matter?

- **Education**: Online learning is everywhere
- **Jobs**: Most careers require digital skills
- **Communication**: Stay connected with family and friends
- **Safety**: Protect yourself online
- **Opportunities**: Access information and services

## Course Overview

### Module 1: Getting Started
- Understanding devices and operating systems
- Basic computer navigation
- Internet fundamentals

### Module 2: Communication Tools
- Email etiquette
- Video conferencing
- Social media basics

### Module 3: Online Safety
- Password security
- Identifying scams
- Privacy protection

### Module 4: Productivity Tools
- Word processing
- Spreadsheets basics
- Cloud storage

## Your Digital Journey Starts Here! 🚀
          `,
          duration: 12,
        },
        offlineAvailable: true,
      },
      {
        contentOrder: 2,
        contentType: ContentType.LESSON,
        title: 'Creating Strong Passwords',
        contentData: {
          text: `
# Creating Strong Passwords 🔐

## Why Password Security Matters

Your password is like the key to your house. A weak password is like leaving your door unlocked!

## What Makes a Strong Password?

✅ **At least 12 characters**
✅ **Mix of uppercase and lowercase letters**
✅ **Numbers and special characters**
✅ **Unique for each account**

❌ **DON'T USE**:
- Your name or birthday
- Common words like "password123"
- Sequential numbers like "123456"
- Same password everywhere

## Examples

❌ Weak: password123
✅ Strong: My$on!sB0rn@2015

## Password Tips

1. **Use a passphrase**: Combine random words
   - Example: "Coffee@Mountain!Sky42"

2. **Use a password manager**: Let software remember for you
   - LastPass, 1Password, Bitwarden

3. **Enable 2-Factor Authentication**: Add extra security
   - Get a code on your phone when logging in

## Activity 🎯

Create three strong passwords for:
1. Your email
2. Social media
3. Online banking

Write them down in a secure place (not on your computer)!
          `,
          duration: 18,
        },
        offlineAvailable: true,
      },
      {
        contentOrder: 3,
        contentType: ContentType.QUIZ,
        title: 'Online Safety Quiz',
        contentData: {
          questions: [
            {
              question: 'What is the recommended minimum length for a strong password?',
              options: ['6 characters', '8 characters', '12 characters', '20 characters'],
              correctAnswer: 2,
              points: 10,
            },
            {
              question: 'Which of these is a sign of a phishing email?',
              options: [
                'Comes from your bank',
                'Asks for urgent action',
                'Has proper grammar',
                'Contains your name',
              ],
              correctAnswer: 1,
              points: 10,
            },
            {
              question: 'What should you do if you receive a suspicious link?',
              options: [
                'Click it to see what happens',
                'Forward it to friends',
                'Delete it immediately',
                'Reply asking for more info',
              ],
              correctAnswer: 2,
              points: 10,
            },
            {
              question: 'What is two-factor authentication?',
              options: [
                'Using two passwords',
                'An extra security step beyond password',
                'Having two accounts',
                'Logging in twice',
              ],
              correctAnswer: 1,
              points: 10,
            },
          ],
          passingScore: 75,
          timeLimit: 600,
        },
        offlineAvailable: true,
      },
      {
        contentOrder: 4,
        contentType: ContentType.ASSIGNMENT,
        title: 'Digital Safety Action Plan',
        contentData: {
          instructions: `
# Assignment: Create Your Digital Safety Action Plan 🛡️

## Objective
Develop a personal plan to improve your online security and digital habits.

## Requirements

### Part 1: Security Audit (20 points)
List all your online accounts and rate their password strength:
- Weak (need to change)
- Medium (could improve)
- Strong (meets all criteria)

### Part 2: Action Steps (20 points)
For each weak/medium password:
1. Create a new strong password
2. Note if 2FA is enabled
3. Plan when you'll update it

### Part 3: Privacy Check (30 points)
Review privacy settings on:
- Social media accounts
- Email account
- Phone/tablet apps

Document what you changed and why.

### Part 4: Reflection (30 points)
Write 200-300 words about:
- What surprised you during this audit?
- What changes will you make?
- How will you maintain good digital hygiene?

## Submission Format
Submit as PDF or Word document with screenshots (remove sensitive info!)

**Due Date**: 2 weeks
**Total Points**: 100
          `,
          maxScore: 100,
          dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
        },
        offlineAvailable: true,
      },
    ];

    for (const content of digitalSkillsContent) {
      await prisma.courseContent.create({
        data: {
          courseId: digitalSkillsCourse.id,
          contentOrder: content.contentOrder,
          contentType: content.contentType,
          title: content.title,
          contentData: content.contentData,
          offlineAvailable: content.offlineAvailable,
        },
      });
    }

    console.log('🔢 Creating Course 3: Practical Mathematics...');

    // Course 3: Practical Mathematics
    const mathCourse = await prisma.course.create({
      data: {
        title: 'Mathematics for Everyday Life',
        description: 'Apply mathematics to real-world situations. Learn budgeting, percentages, statistics, and problem-solving skills you\'ll use every day.',
        teacherId: teacher.id,
        schoolId: school.id,
        subjectId: mathematics.id,
        status: CourseStatus.PUBLISHED,
        language: Language.EN,
        requiresOnline: false,
        thumbnailUrl: '/courses/practical-math.jpg',
        publishedAt: new Date(),
      },
    });

    const mathContent = [
      {
        contentOrder: 1,
        contentType: ContentType.LESSON,
        title: 'Budgeting and Personal Finance',
        contentData: {
          text: `
# Budgeting and Personal Finance 💰

## Why Math Matters in Real Life

Every day, you use math without even thinking about it! Let's make those skills stronger.

## Creating a Personal Budget

### Step 1: Track Your Income
- Monthly allowance
- Part-time job earnings
- Gifts or other income

**Example**: 50,000 MGA/month

### Step 2: List Your Expenses
- Necessities (food, transport)
- Wants (entertainment, snacks)
- Savings goals

### Step 3: The 50/30/20 Rule
- 50% Needs (25,000 MGA)
- 30% Wants (15,000 MGA)
- 20% Savings (10,000 MGA)

## Practice Exercise 📊

**Scenario**: You earn 60,000 MGA per month.

Create a budget using the 50/30/20 rule:
1. Calculate each category
2. List 3-4 items in each category
3. Total your expenses

**Bonus**: What if you want to save for a 240,000 MGA phone? How many months will it take?
          `,
          duration: 25,
        },
        offlineAvailable: true,
      },
      {
        contentOrder: 2,
        contentType: ContentType.LESSON,
        title: 'Understanding Percentages',
        contentData: {
          text: `
# Understanding Percentages 📈

## What is a Percentage?

Percent means "out of 100". 50% means 50 out of 100.

## Real-World Applications

### 1. Shopping Discounts
Original price: 80,000 MGA
Discount: 25% off

**Calculation**:
- Discount amount = 80,000 × 0.25 = 20,000 MGA
- Final price = 80,000 - 20,000 = 60,000 MGA

### 2. Test Scores
You got 17 out of 20 questions correct.
Percentage = (17/20) × 100 = 85%

### 3. Phone Battery
75% battery means 75 out of 100 units of charge.

## Practice Problems 🎯

1. A shirt costs 45,000 MGA. It's on sale for 20% off. What's the sale price?

2. You scored 23/25 on a quiz. What's your percentage?

3. Your phone is at 15% battery. If the battery has 3000 mAh capacity, how much is left?

4. You save 8,000 MGA from your 40,000 MGA allowance. What percentage are you saving?

## Challenge Problem 🌟
A store increases prices by 10%, then offers 10% off. Are you back to the original price? Prove it!
          `,
          duration: 20,
        },
        offlineAvailable: true,
      },
      {
        contentOrder: 3,
        contentType: ContentType.QUIZ,
        title: 'Practical Math Quiz',
        contentData: {
          questions: [
            {
              question: 'A phone costs 400,000 MGA with a 15% discount. What is the sale price?',
              options: ['340,000 MGA', '360,000 MGA', '385,000 MGA', '415,000 MGA'],
              correctAnswer: 0,
              points: 15,
            },
            {
              question: 'You scored 18/20 on a test. What is your percentage?',
              options: ['80%', '85%', '90%', '95%'],
              correctAnswer: 2,
              points: 15,
            },
            {
              question: 'Using the 50/30/20 rule on 100,000 MGA income, how much goes to savings?',
              options: ['10,000 MGA', '20,000 MGA', '30,000 MGA', '50,000 MGA'],
              correctAnswer: 1,
              points: 15,
            },
          ],
          passingScore: 70,
          timeLimit: 900,
        },
        offlineAvailable: true,
      },
    ];

    for (const content of mathContent) {
      await prisma.courseContent.create({
        data: {
          courseId: mathCourse.id,
          contentOrder: content.contentOrder,
          contentType: content.contentType,
          title: content.title,
          contentData: content.contentData,
          offlineAvailable: content.offlineAvailable,
        },
      });
    }

    // Assign courses to class
    console.log('📝 Enrolling students in courses...');
    await prisma.courseAssignment.create({
      data: {
        courseId: pythonCourse.id,
        classId: class10A.id,
        dueDate: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000), // 60 days
      },
    });

    await prisma.courseAssignment.create({
      data: {
        courseId: digitalSkillsCourse.id,
        classId: class10A.id,
        dueDate: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000), // 45 days
      },
    });

    await prisma.courseAssignment.create({
      data: {
        courseId: mathCourse.id,
        classId: class10A.id,
        dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
      },
    });

    // Create student progress with varying completion levels
    console.log('📊 Creating student progress data...');

    const pythonContentItems = await prisma.courseContent.findMany({
      where: { courseId: pythonCourse.id },
      orderBy: { contentOrder: 'asc' },
    });

    const digitalContentItems = await prisma.courseContent.findMany({
      where: { courseId: digitalSkillsCourse.id },
      orderBy: { contentOrder: 'asc' },
    });

    const mathContentItems = await prisma.courseContent.findMany({
      where: { courseId: mathCourse.id },
      orderBy: { contentOrder: 'asc' },
    });

    // Student progress scenarios
    for (let i = 0; i < students.length; i++) {
      const student = students[i];

      // Python Course Progress (varies by student)
      const pythonProgress = [100, 75, 50, 25, 10][i]; // Different completion levels
      await prisma.studentProgress.create({
        data: {
          studentId: student.id,
          courseId: pythonCourse.id,
          completionPercentage: pythonProgress,
          timeSpentMinutes: Math.floor((pythonProgress / 100) * 120) + Math.floor(Math.random() * 30),
          lastAccessed: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000),
        },
      });

      // Digital Skills Progress
      const digitalProgress = [90, 60, 40, 80, 30][i];
      await prisma.studentProgress.create({
        data: {
          studentId: student.id,
          courseId: digitalSkillsCourse.id,
          completionPercentage: digitalProgress,
          timeSpentMinutes: Math.floor((digitalProgress / 100) * 90) + Math.floor(Math.random() * 20),
          lastAccessed: new Date(Date.now() - Math.random() * 5 * 24 * 60 * 60 * 1000),
        },
      });

      // Math Course Progress
      const mathProgress = [85, 70, 55, 40, 20][i];
      await prisma.studentProgress.create({
        data: {
          studentId: student.id,
          courseId: mathCourse.id,
          completionPercentage: mathProgress,
          timeSpentMinutes: Math.floor((mathProgress / 100) * 60) + Math.floor(Math.random() * 15),
          lastAccessed: new Date(Date.now() - Math.random() * 3 * 24 * 60 * 60 * 1000),
        },
      });

      console.log(`✅ Created progress for ${student.name}:
        - Python: ${pythonProgress}%
        - Digital Skills: ${digitalProgress}%
        - Math: ${mathProgress}%`);
    }

    // Create some submissions for assignments
    console.log('📄 Creating assignment submissions...');
    console.log(`   Found ${students.length} students`);

    const pythonAssignment = pythonContentItems.find(c => c.contentType === ContentType.ASSIGNMENT);
    const digitalAssignment = digitalContentItems.find(c => c.contentType === ContentType.ASSIGNMENT);

    if (pythonAssignment) {
      // First 2 students submitted Python assignment
      const numSubmissions = Math.min(2, students.length);
      for (let i = 0; i < numSubmissions; i++) {
        await prisma.submission.create({
          data: {
            studentId: students[i].id,
            courseContentId: pythonAssignment.id,
            content: {
              files: ['calculator.py'],
              comments: 'Here is my calculator program. I added error handling for division by zero!',
            },
            grade: i === 0 ? 48 : null, // First student graded, second pending
            feedback: i === 0 ? 'Excellent work! Clean code with good error handling. Just add more comments.' : null,
            submittedAt: new Date(Date.now() - (i + 1) * 2 * 24 * 60 * 60 * 1000),
            gradedAt: i === 0 ? new Date(Date.now() - 24 * 60 * 60 * 1000) : null,
            gradedById: i === 0 ? teacher.id : null,
          },
        });
      }
    }

    if (digitalAssignment) {
      // First student submitted digital skills assignment
      await prisma.submission.create({
        data: {
          studentId: students[0].id,
          courseContentId: digitalAssignment.id,
          content: {
            files: ['digital-safety-plan.pdf'],
            comments: 'Completed my security audit. Changed 8 passwords and enabled 2FA on all accounts!',
          },
          grade: 92,
          feedback: 'Outstanding work! Very thorough security audit and excellent reflection. Keep up the great digital hygiene!',
          submittedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
          gradedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
          gradedById: teacher.id,
        },
      });
    }

    console.log('\n✅ ====================================');
    console.log('✅ Course seeding completed successfully!');
    console.log('✅ ====================================\n');
    console.log('📚 Created:');
    console.log(`   - 4 Subjects`);
    console.log(`   - 3 Comprehensive Courses`);
    console.log(`   - ${pythonContentItems.length + digitalContentItems.length + mathContentItems.length} Content Items`);
    console.log(`   - Progress data for ${students.length} students`);
    console.log(`   - Multiple assignment submissions with grades`);
    console.log('\n🎯 Courses created:');
    console.log('   1. Introduction to Python Programming');
    console.log('   2. Digital Skills for Modern Life');
    console.log('   3. Mathematics for Everyday Life');
    console.log('\n👤 Login credentials:');
    console.log('   Teacher: teacher@schoolbridge.com / Teacher123');
    console.log('   Students: student1-5@schoolbridge.com / Student123');
    console.log('\n🔍 Admin can now:');
    console.log('   - View all courses and enrollments');
    console.log('   - Track student progress across courses');
    console.log('   - See assignment submissions and grades');
    console.log('   - Monitor course completion rates\n');

  } catch (error) {
    console.error('❌ Error seeding courses:', error);
    throw error;
  }
}

// Run if called directly
if (require.main === module) {
  seedCourses()
    .catch((e) => {
      console.error(e);
      process.exit(1);
    })
    .finally(async () => {
      await prisma.$disconnect();
    });
}
