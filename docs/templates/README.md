# SchoolBridge Course Templates

Welcome! This folder contains everything you need to create courses for SchoolBridge using our template system.

---

## Quick Navigation

### I'm a Teacher 👨‍🏫

**Start here:** `TEMPLATE_GUIDE.md`
- Learn how to create a course in 5 minutes
- See examples of all content types
- Get tips and tricks

**Then use:** `course_template.md`
- Copy this file to start your course
- Fill in your course information
- Upload to SchoolBridge

**See examples:**
- Simple (30 min): `example_simple.course.md` - Water Cycle Basics
- Medium (3 weeks): `example_complex.course.md` - Introduction to Fractions
- Advanced (4 weeks): `example_advanced.course.md` - Climate Change

### I'm a Developer 👨‍💻

**Read first:** `../COURSE_TEMPLATES_RECOMMENDATION.md`
- Strategic overview of the template system
- Technical architecture and design decisions
- Implementation roadmap

**Then review:** `../COURSE_TEMPLATES_DELIVERY_SUMMARY.md`
- What was delivered
- Technology stack
- Next implementation steps

**Study the examples:**
- All three example courses are production-ready
- Show real use cases and best practices
- Include comprehensive content, quizzes, and assignments

**Implement Phase 2:**
1. Build parser in `src/lib/course-parser.ts`
2. Create upload page in `/teacher/courses/create-from-template`
3. Build API endpoint: `POST /api/teacher/courses/import`

### I'm an Educational Manager 📚

**Understand the system:** `../COURSE_TEMPLATES_RECOMMENDATION.md`
- How teachers will use templates
- Supported content types
- Benefits and advantages

**Create reusable templates:**
- Copy `course_template.md`
- Create standardized templates for your school
- Share with teachers in your subject area

**Support teachers:**
- Direct them to `TEMPLATE_GUIDE.md`
- Share the example courses
- Provide feedback on course templates

---

## File Guide

### Documentation Files

| File | Purpose | Audience |
|------|---------|----------|
| `TEMPLATE_GUIDE.md` | Quick start guide for teachers | Teachers |
| `../COURSE_TEMPLATES_RECOMMENDATION.md` | Strategic framework and technical details | Developers, Managers |
| `../COURSE_TEMPLATES_DELIVERY_SUMMARY.md` | Delivery overview and implementation roadmap | Project Managers, Developers |

### Template Files

| File | Type | Duration | Purpose |
|------|------|----------|---------|
| `course_template.md` | Blank | N/A | Start your course here |
| `example_simple.course.md` | Example | 30 min | Short introductory course |
| `example_complex.course.md` | Example | 3 weeks | Multi-module intermediate course |
| `example_advanced.course.md` | Example | 4 weeks | Comprehensive course with projects |

---

## Quick Start - Choose Your Path

### **Path 1: Template Upload (Offline)**

Perfect for: Creating courses offline, reusing templates, bulk imports

1. **Download template**
   ```bash
   cp course_template.md my_course.course.md
   ```

2. **Open in your editor**
   - Word, Google Docs, VS Code, Notepad, etc.
   - Any text editor works!

3. **Fill in the blue box (metadata)**
   ```markdown
   ---
   metadata:
     title: "My Course Name"
     description: "What this course teaches"
     subject: "Subject Name"
     language: "FR"
   ---
   ```

4. **Write your course content**
   ```markdown
   # My Course Name

   ## Module 1: Topic

   ### Lesson 1.1: Introduction
   **Type:** LESSON
   **Duration:** 900

   Your lesson text here...
   ```

5. **Upload to SchoolBridge**
   - Go to `/teacher/courses/create-from-template`
   - Upload your `.course.md` file
   - Review preview and confirm
   - Done!

---

### **Path 2: Web Portal Builder (Online)**

Perfect for: First-time course creators, visual learners, real-time preview

1. **Open SchoolBridge**
   - Go to `/teacher/courses`
   - Click "Create New Course"
   - Choose "Using Portal Builder"

2. **Step-by-step form**
   - Fill in course metadata
   - Add modules and content
   - See live preview as you go

3. **Build your course**
   - Add lessons, videos, quizzes
   - Drag to reorder content
   - Visual quiz builder

4. **Publish**
   - Review your course
   - Assign to classes
   - Done!

---

### **Both Paths Create the Same Course** ✅

Whether you use templates or the portal builder, your course ends up in the same place with the same structure and features.

---

## Content Types at a Glance

### Teaching Content
- **LESSON**: Introduce a concept (15-20 min)
- **TEXT**: Reading material or article
- **VIDEO**: YouTube or hosted videos
- **PDF**: Documents, worksheets, textbooks
- **INTERACTIVE**: Simulations, discussions, tools

### Assessment Content
- **QUIZ**: Multiple choice, true/false, essays (Instant or exam mode)
- **ASSIGNMENT**: Homework, projects, research tasks

---

## Example Course Structures

### Simple Course (30 minutes)
```
Water Cycle Basics
├── Lesson: What is the water cycle?
├── Video: How the water cycle works
└── Quiz: Knowledge check (5 questions)
```

### Medium Course (3 weeks)
```
Introduction to Fractions
├── Week 1: Understanding Fractions
│   ├── Lesson 1.1
│   ├── Video 1.2
│   ├── Text 1.3
│   └── Quiz 1.4
├── Week 2: Operating with Fractions
│   ├── Lesson 2.1
│   ├── Video 2.2
│   ├── Interactive 2.3
│   └── Assignment 2.4
└── Week 3: Applications
    ├── Lesson 3.1
    ├── Quiz 3.2 (Exam mode)
    └── Final Project
```

### Advanced Course (4 weeks)
```
Climate Change & Solutions
├── Module 1: Understanding Climate Science
│   ├── Forum Discussion
│   ├── Video Lecture
│   ├── Text Reading + PDF
│   ├── Video Documentary
│   └── Quiz
├── Module 2: Climate Impacts
│   ├── Lesson
│   ├── Interactive Simulation
│   ├── Video
│   └── Assignment (Analysis)
├── Module 3: Solutions & Mitigation
│   ├── Lesson
│   ├── Case Study
│   ├── Interactive Tool
│   └── Exam Quiz
└── Module 4: Taking Action
    ├── Lesson
    ├── Group Project
    └── Reflection Essay
```

---

## Common Questions

### Q: What format do I use?
**A:** Markdown (`.course.md` file). Plain text with simple formatting.

### Q: Do I need to know coding?
**A:** No! The template uses simple Markdown, not code. Any teacher can do it.

### Q: How long does a course take to create?
**A:**
- Simple (30 min): 2-3 hours
- Medium (3 weeks): 6-8 hours
- Advanced (4 weeks): 12-15 hours

### Q: Can I edit my course after uploading?
**A:** Yes! Once imported, you can edit courses directly in SchoolBridge.

### Q: What if I make a mistake in my template?
**A:** The system validates your course before importing. You'll get clear error messages telling you what to fix.

### Q: Can I copy a course from another teacher?
**A:** Yes! Ask for their `.course.md` file and modify it for your needs.

### Q: What's the maximum course size?
**A:** There's no strict limit, but keep modules to 20-30 items for better student experience.

### Q: Can I have videos from YouTube?
**A:** Yes! Just use the YouTube video URL in the VIDEO content type.

---

## Getting Help

### Teachers
1. Read `TEMPLATE_GUIDE.md` first
2. Look at the example courses
3. Check the "Common Mistakes" section in the guide
4. Ask your educational manager

### Developers
1. Read `../COURSE_TEMPLATES_RECOMMENDATION.md`
2. Review the example courses for patterns
3. Check `.claude/project-context.md` for project context
4. Plan Phase 2 implementation

### Managers
1. Review `../COURSE_TEMPLATES_RECOMMENDATION.md`
2. Look at example courses in your subject area
3. Create subject-specific templates for teachers
4. Share best practices with your team

---

## File Naming Convention

When creating your course:
- **Use lowercase** with underscores or hyphens
- **Keep it simple:** `biology_101.course.md`
- **Not:** `Biology 101 - Advanced Level.course.md`

Examples:
- ✅ `water_cycle_basics.course.md`
- ✅ `fractions-introduction.course.md`
- ❌ `Water Cycle Basics!!!.course.md`

---

## Template Checklist

Before uploading, make sure:
- [ ] File name ends with `.course.md`
- [ ] Metadata is in correct YAML format (blue box at top)
- [ ] All required fields filled: title, description, subject, language
- [ ] All content sections have `**Type:**` specified
- [ ] All quiz questions have `**Answer:**` specified
- [ ] All URLs are complete (start with https://)
- [ ] Dates are in YYYY-MM-DD format
- [ ] No spelling errors in critical fields

---

## Next Steps

1. **Read** `TEMPLATE_GUIDE.md` (15 minutes)
2. **Copy** `course_template.md` to your course
3. **Create** your course content
4. **Review** one of the examples for inspiration
5. **Upload** to SchoolBridge when ready

---

## Version History

| Date | Version | Changes |
|------|---------|---------|
| 2025-11-02 | 1.0 | Initial release with 3 example courses |

---

## Support & Feedback

Have questions or suggestions?
- Contact your educational manager
- Review the detailed guides in `docs/`
- Check your school's help center

---

**Happy course creating! 🎓**

Questions? Start with `TEMPLATE_GUIDE.md` →
