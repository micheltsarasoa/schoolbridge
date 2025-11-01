# 📚 Realistic Course Seed Data

This seed creates a comprehensive, realistic course scenario with full enrollment and progress tracking for admin demonstration and testing.

## 🎯 What Gets Created

### 4 Subjects
- **Computer Science** - Programming and technology courses
- **Digital Literacy** - Essential digital skills for modern life
- **Mathematics** - Practical math for everyday use
- **Science** - General science courses

### 3 Comprehensive Courses

#### 1. 🐍 Introduction to Python Programming
**Subject**: Computer Science
**Duration**: 60 days
**Content**:
- 6 content items (lessons, videos, quizzes, assignments)
- Topics: Hello World, Variables, Loops, Projects
- Practical assignments: Build a calculator
- Offline-accessible content

**Educational Value**:
- Perfect for beginners
- Real-world coding projects
- Interactive quizzes with instant feedback
- Step-by-step lessons with code examples

#### 2. 🌐 Digital Skills for Modern Life
**Subject**: Digital Literacy
**Duration**: 45 days
**Content**:
- 4 content items covering essential digital skills
- Topics: Digital Literacy Basics, Password Security, Online Safety
- Comprehensive assignment: Digital Safety Action Plan
- Mix of online and offline content

**Educational Value**:
- Critical 21st-century skills
- Practical security knowledge
- Real-world application (social media, email, privacy)
- Relevant to Madagascar context

#### 3. 💰 Mathematics for Everyday Life
**Subject**: Mathematics
**Duration**: 30 days
**Content**:
- 3 content items focused on practical applications
- Topics: Budgeting, Percentages, Financial Literacy
- Real-world scenarios with local currency (MGA)
- Fully offline-accessible

**Educational Value**:
- Applicable to daily life
- Financial literacy skills
- Problem-solving with real examples
- Builds practical money management skills

### 5 Students with Varying Progress Levels

Each student has different completion rates to simulate realistic classroom scenarios:

| Student | Python | Digital Skills | Math |
|---------|--------|----------------|------|
| Student 1 | 100% ⭐ | 90% 🎯 | 85% 📈 |
| Student 2 | 75% 📚 | 60% 📖 | 70% 📊 |
| Student 3 | 50% 📝 | 40% 📄 | 55% 📋 |
| Student 4 | 25% 🎓 | 80% 💡 | 40% 🔢 |
| Student 5 | 10% 🌱 | 30% 🌿 | 20% 🎯 |

### Assignment Submissions

- **Python Calculator Assignment**: 2 submissions (1 graded, 1 pending)
- **Digital Safety Plan**: 1 submission (graded with excellent feedback)
- Realistic grading with feedback from teacher
- Various submission dates to show timeline

### Progress Tracking

- Completed content items tracked
- Quiz scores recorded (70-100% range)
- Time spent on each lesson
- Last accessed timestamps

## 🚀 How to Run

### Option 1: Run Course Seed Only

```bash
npm run db:seed:courses
```

### Option 2: Run Full Seed (includes courses)

```bash
npm run db:seed
```

### Option 3: Direct TypeScript Execution

```bash
npx tsx prisma/seeds/run-course-seed.ts
```

## 👤 Login Credentials

### Teacher Account
- **Email**: `teacher@schoolbridge.com`
- **Password**: `Teacher123`
- **Role**: TEACHER
- **Name**: Prof. Sarah Johnson

### Student Accounts
- **Email**: `student1@schoolbridge.com` to `student5@schoolbridge.com`
- **Password**: `Student123`
- **Role**: STUDENT
- **Class**: 10A

### Admin Account
Use your existing admin account or create one to view all courses, enrollments, and progress.

## 🔍 What Admin Can See

After seeding, admin users can:

### 1. Course Overview
- 3 published courses across multiple subjects
- Course descriptions, thumbnails, and metadata
- Teacher assignments
- Course status and publish dates

### 2. Enrollment Data
- Class-based course assignments
- Student-to-course mappings
- Assignment due dates
- Completion timelines

### 3. Progress Analytics
- Individual student progress per course
- Completion percentages
- Quiz scores and performance
- Time spent learning
- Last accessed dates

### 4. Assignment Tracking
- Submitted assignments with files
- Grading status (graded vs pending)
- Teacher feedback
- Submission timestamps
- Grade distributions

### 5. Content Analytics
- Which lessons are most accessed
- Average time spent per content item
- Quiz pass rates
- Offline content usage

## 📊 Use Cases for Testing

### 1. Teacher Dashboard
- View assigned courses
- See pending submissions for grading
- Track class progress
- Monitor individual student performance

### 2. Student Portal
- Access enrolled courses
- View progress through course content
- Submit assignments
- Check grades and feedback
- See course completion status

### 3. Admin Analytics
- Course enrollment reports
- Student performance across courses
- Teacher workload analysis
- Completion rate trends
- Identify struggling students

### 4. Parent Portal
- View child's enrolled courses
- See progress in each course
- Check assignment grades
- Monitor learning activity

## 🎓 Educational Design Principles

This seed data follows best practices in course design:

### 1. **Scaffolded Learning**
- Lessons progress from simple to complex
- Foundational concepts before advanced topics
- Built-in review and practice

### 2. **Multiple Content Types**
- Text lessons for reading
- Video content for visual learners
- Quizzes for assessment
- Assignments for practical application

### 3. **Real-World Relevance**
- Practical applications of concepts
- Local context (Madagascar currency, relevant examples)
- Skills applicable to daily life and careers

### 4. **Offline-First Design**
- Most content available offline
- Critical for low-connectivity environments
- Sync progress when online

### 5. **Varied Assessment**
- Formative (quizzes) and summative (assignments)
- Immediate feedback on quizzes
- Detailed feedback on assignments
- Multiple attempts allowed

## 🛠️ Extending the Seed

### Add More Courses

Edit `prisma/seeds/courses-seed.ts` and add:

```typescript
const newCourse = await prisma.course.create({
  data: {
    title: 'Your Course Title',
    description: 'Course description',
    teacherId: teacher.id,
    schoolId: school.id,
    subjectId: yourSubject.id,
    status: CourseStatus.PUBLISHED,
    // ... other fields
  },
});
```

### Add More Content

```typescript
await prisma.courseContent.create({
  data: {
    courseId: newCourse.id,
    contentOrder: 1,
    contentType: ContentType.LESSON,
    title: 'Lesson Title',
    contentData: { /* your content */ },
    offlineAvailable: true,
  },
});
```

### Customize Student Progress

Modify the progress percentages in the seed file:

```typescript
const pythonProgress = [100, 75, 50, 25, 10][i];
// Change to your desired completion levels
```

## 📝 Notes

- **Data Persistence**: This seed does NOT delete existing data. It creates new records.
- **Idempotency**: Running multiple times will create duplicate courses. Clear database first if needed.
- **Performance**: Seeding may take 10-30 seconds depending on your machine.
- **Dependencies**: Requires a running database connection (Neon PostgreSQL).

## 🐛 Troubleshooting

### "No school found" Error
**Solution**: Run the main seed first: `npm run db:seed`

### TypeScript Errors
**Solution**: Make sure all dependencies are installed: `npm install`

### Database Connection Error
**Solution**: Check your `.env.local` file has correct `DATABASE_URL`

### Prisma Client Not Generated
**Solution**: Run `npx prisma generate`

## 📚 Content Details

### Python Course Content Structure

1. **Welcome to Python** (Lesson, 10min, Offline)
2. **Your First Program** (Lesson, 15min, Offline)
3. **Variables Explained** (Video, 7min, Online)
4. **Python Basics Quiz** (Quiz, 5min, Offline)
5. **Build a Calculator** (Assignment, 50pts, Offline)
6. **Loops** (Lesson, 20min, Offline)

### Digital Skills Content Structure

1. **Introduction to Digital Literacy** (Lesson, 12min, Offline)
2. **Creating Strong Passwords** (Lesson, 18min, Offline)
3. **Online Safety Quiz** (Quiz, 10min, Offline)
4. **Digital Safety Action Plan** (Assignment, 100pts, Offline)

### Math Course Content Structure

1. **Budgeting and Personal Finance** (Lesson, 25min, Offline)
2. **Understanding Percentages** (Lesson, 20min, Offline)
3. **Practical Math Quiz** (Quiz, 15min, Offline)

## 🎯 Success Metrics

After seeding, you should see:

- ✅ 3 courses visible in teacher/student dashboards
- ✅ Dynamic course menus populated with real data
- ✅ Progress bars showing different completion levels
- ✅ Assignment submissions in grading queue
- ✅ Offline indicators on applicable content
- ✅ Realistic enrollment and activity dates

## 🚀 Next Steps

1. **Run the seed**: `npm run db:seed:courses`
2. **Login as teacher**: View courses and pending assignments
3. **Login as student**: Experience the course content
4. **Login as admin**: See analytics and reports
5. **Test the dynamic navigation**: Courses appear in sidebar menus
6. **Explore progress tracking**: View completion percentages

## 💡 Tips

- **Demo Preparation**: Run this seed before demos to show realistic data
- **Testing**: Use different student accounts to see varied progress levels
- **Development**: Helps test features with real content structures
- **Training**: Great for training staff on the system

---

**Created**: 2025-11-01
**Version**: 1.0.0
**Maintained by**: SchoolBridge Team
