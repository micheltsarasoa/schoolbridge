# Course Creation Templates - Recommendation & Strategy

**Date:** November 2, 2025
**Purpose:** Guide for implementing course creation templates for teachers and course designers
**Status:** Strategic Recommendation (Implementation Ready)

---

## Executive Summary

For SchoolBridge, I recommend a **Dual-Path Course Creation System** with:

### **Path 1: Template Upload System (Markdown)**
- **Markdown + YAML** format for offline course creation
- Download template → Edit in any editor → Upload to platform
- Perfect for reusing/modifying existing courses
- Ideal for bulk imports and templates

### **Path 2: Web Portal Builder (UI)**
- Visual, interactive course builder in the web interface
- Step-by-step guided course creation
- Real-time preview and drag-drop organization
- Perfect for first-time course creators

**Both paths create the same course structure** and teachers can:
- Start with a template, then edit in the portal
- Build in the portal, then export as template (future)
- Mix and match based on their preference

This balances **flexibility** (templates for power users) with **accessibility** (portal for casual users).

---

## 1. Current Schema Analysis

Based on `prisma/schema.prisma`, the course structure supports:

### Course Model (lines 350-381)
- Core: title, description, teacherId, schoolId, subjectId
- Settings: status (DRAFT, UNDER_REVIEW, APPROVED, PUBLISHED, ARCHIVED), language, thumbnailUrl
- Metadata: requiresOnline, fileSizeBytes, createdAt, publishedAt

### CourseContent Model (lines 383-402)
- Flexible content types: LESSON, TEXT, VIDEO, PDF, INTERACTIVE, QUIZ, ASSIGNMENT
- Dynamic timing: appearsAfterSeconds, disappearsAfterSeconds
- Offline support: offlineAvailable flag
- Ordered: contentOrder (sequence matters)

### Quiz Model (lines 453-473)
- Advanced: QuizMode (PRACTICE, EXAM, TIMED_EXAM)
- Configurable: passingScore, timeLimit, randomizeQuestions
- Feedback control: showAnswersAfter

---

## 2. Recommended Approach: Dual-Path System

### Path Comparison

| Aspect | Template Path | Portal Path | Both Together |
|--------|---------------|-------------|---------------|
| Learning Curve | Medium | Easy | Teachers choose |
| Speed (experienced) | ⚡ Very Fast | 🟢 Good | ⚡ Template wins |
| Speed (beginner) | 🟡 Moderate | ⚡ Fast | 🟢 Portal wins |
| Offline Work | ✅ Yes | ❌ No | ✅ Covered |
| Bulk Import | ✅ Perfect | ❌ Manual | ✅ Covered |
| Reusing Courses | ✅ Easy | 🟡 Tedious | ✅ Covered |
| Real-time Preview | ❌ No | ✅ Yes | ✅ Covered |
| Collaboration | ✅ Git-friendly | 🟡 Limited | ✅ Both |

### Dual-Path Architecture

```
Teacher decides:
│
├─ PATH 1: Template Upload (Markdown)
│  ├─ Download .course.md template
│  ├─ Edit in any text editor
│  ├─ Parse YAML + Markdown
│  ├─ Validate & transform
│  ├─ Import to database
│  └─ Can edit in portal after
│
└─ PATH 2: Web Portal Builder (UI)
   ├─ Open portal builder
   ├─ Step-by-step form
   ├─ Real-time preview
   ├─ Drag-drop content
   └─ Can export as template (future)

Both paths → Same database structure
Both paths → Same student experience
Teachers → Choose based on preference
```

### Why Dual-Path is Better

**For Template Path:**
- ✅ Markdown is familiar to many teachers
- ✅ Works offline
- ✅ Version control friendly (Git)
- ✅ Perfect for reusing templates
- ✅ Bulk import capability

**For Portal Path:**
- ✅ No file format to learn
- ✅ Visual feedback while creating
- ✅ Guided step-by-step process
- ✅ No technical barrier
- ✅ Real-time preview

**Integrated Together:**
- ✅ Templates for power users
- ✅ Portal for casual users
- ✅ Both create identical courses
- ✅ Teachers can mix approaches
- ✅ Maximum flexibility

---

## 3. Template Format Specification

### File Format: `.course.md` (Markdown with YAML Front Matter)

**Why Markdown?**
- Teachers already know Markdown
- Similar to educational platforms (Canvas, Moodle, GitHub)
- Easy to version control
- Can be edited in any text editor
- Supports rich formatting

**Example Structure:**

```markdown
---
metadata:
  title: "Introduction to Photosynthesis"
  description: "A comprehensive course on plant photosynthesis"
  subject: "Biology"
  language: "FR"
  requiresOnline: true
  thumbnail: "https://..."
  status: "DRAFT"
course:
  passingScore: 70
  objectives:
    - "Understand the basics of photosynthesis"
    - "Identify key components of the process"
    - "Apply knowledge to real-world scenarios"
---

# Course: Introduction to Photosynthesis

## Module 1: Foundations

### Lesson 1.1: What is Photosynthesis?
**Type:** LESSON
**Duration:** 15 minutes
**Offline:** true

This lesson introduces the fundamental concept of photosynthesis...

#### Content Points
- Definition and importance
- Energy conversion basics
- Light-dependent reactions overview

---

### Content 1.2: Light and Energy
**Type:** TEXT
**AppearAfter:** 900 (15 minutes after lesson starts)

The sun provides the energy for photosynthesis through photons...

---

### Content 1.3: Photosynthesis Video
**Type:** VIDEO
**URL:** https://videos.schoolbridge.edu/photosynthesis-101.mp4
**Duration:** 12 minutes
**Offline:** true
**DisappearAfter:** 2700 (45 minutes after course starts)

---

### Quiz 1.4: Knowledge Check
**Type:** QUIZ
**Mode:** PRACTICE
**PassingScore:** 70
**TimeLimit:** 30
**ShowAnswersAfter:** true

#### Question 1
**Type:** MULTIPLE_CHOICE
**Points:** 2

What is the primary function of chlorophyll?

a) To absorb light energy
b) To produce glucose
c) To release oxygen
d) To store water

**Answer:** a
**Explanation:** Chlorophyll is the pigment that absorbs light energy

---

#### Question 2
**Type:** TRUE_FALSE
**Points:** 1

Photosynthesis occurs in all plant cells.

**Answer:** false
**Explanation:** Photosynthesis primarily occurs in cells containing chloroplasts

---

### Assignment 1.5: Research Project
**Type:** ASSIGNMENT
**DueDate:** 2025-12-15
**Points:** 50

Research and present one innovative application of photosynthesis in renewable energy...

---

## Module 2: Deep Dive

...continue with more modules...
```

---

## 4. JSON Intermediate Format

After parsing Markdown, the system generates this JSON structure:

```json
{
  "course": {
    "title": "Introduction to Photosynthesis",
    "description": "A comprehensive course on plant photosynthesis",
    "language": "FR",
    "requiresOnline": true,
    "status": "DRAFT",
    "thumbnailUrl": "https://...",
    "subject": {
      "name": "Biology"
    },
    "objectives": [
      "Understand the basics of photosynthesis",
      "Identify key components of the process",
      "Apply knowledge to real-world scenarios"
    ]
  },
  "content": [
    {
      "contentOrder": 1,
      "contentType": "LESSON",
      "title": "What is Photosynthesis?",
      "contentData": {
        "duration": 900,
        "description": "This lesson introduces the fundamental concept...",
        "contentPoints": [
          "Definition and importance",
          "Energy conversion basics",
          "Light-dependent reactions overview"
        ]
      },
      "offlineAvailable": true,
      "appearsAfterSeconds": 0
    },
    {
      "contentOrder": 2,
      "contentType": "TEXT",
      "title": "Light and Energy",
      "contentData": {
        "text": "The sun provides the energy for photosynthesis through photons..."
      },
      "appearsAfterSeconds": 900
    },
    {
      "contentOrder": 3,
      "contentType": "VIDEO",
      "title": "Photosynthesis Video",
      "contentData": {
        "videoUrl": "https://videos.schoolbridge.edu/photosynthesis-101.mp4",
        "duration": 720
      },
      "offlineAvailable": true,
      "appearsAfterSeconds": 0,
      "disappearsAfterSeconds": 2700
    },
    {
      "contentOrder": 4,
      "contentType": "QUIZ",
      "title": "Knowledge Check",
      "contentData": {
        "quizId": "quiz-1-4",
        "mode": "PRACTICE",
        "passingScore": 70,
        "timeLimit": 30,
        "showAnswersAfter": true,
        "randomizeQuestions": false,
        "questions": [
          {
            "questionType": "MULTIPLE_CHOICE",
            "text": "What is the primary function of chlorophyll?",
            "options": [
              { "id": "a", "text": "To absorb light energy" },
              { "id": "b", "text": "To produce glucose" },
              { "id": "c", "text": "To release oxygen" },
              { "id": "d", "text": "To store water" }
            ],
            "correctAnswer": { "type": "single", "value": "a" },
            "explanation": "Chlorophyll is the pigment that absorbs light energy",
            "points": 2,
            "order": 1
          },
          {
            "questionType": "TRUE_FALSE",
            "text": "Photosynthesis occurs in all plant cells.",
            "options": [
              { "id": "true", "text": "True" },
              { "id": "false", "text": "False" }
            ],
            "correctAnswer": { "type": "single", "value": "false" },
            "explanation": "Photosynthesis primarily occurs in cells containing chloroplasts",
            "points": 1,
            "order": 2
          }
        ]
      }
    },
    {
      "contentOrder": 5,
      "contentType": "ASSIGNMENT",
      "title": "Research Project",
      "contentData": {
        "description": "Research and present one innovative application...",
        "dueDate": "2025-12-15",
        "points": 50
      }
    }
  ]
}
```

---

## 5. Implementation Plan

### Phase 1: Template Files & Examples (COMPLETED ✅)
- **Location**: `docs/templates/`
- **Files**:
  - `course_template.md` - Empty template for teachers to copy
  - `example_simple.course.md` - Simple 1-module course
  - `example_complex.course.md` - Complex multi-module course with quizzes
  - `example_advanced.course.md` - Advanced with timing, offline, assignments
  - `TEMPLATE_GUIDE.md` - Documentation for teachers

### Phase 2A: Template Parser & Import (Path 1)
- **Location**: `src/lib/course-parser.ts`
- **Functionality**:
  - Parse YAML front matter
  - Extract Markdown sections
  - Validate structure against schema
  - Generate JSON intermediate format
  - Error reporting with line numbers

**Frontend**: `src/app/teacher/courses/create-from-template/page.tsx`
  - File upload (drag-drop)
  - Template preview before import
  - Progress indicator
  - Error/success feedback

**API**: `src/app/api/teacher/courses/import/route.ts`
  - Validate JSON against schema
  - Create course + content in database
  - Handle batch operations
  - Return created course ID

### Phase 2B: Web Portal Course Builder (Path 2)
- **Frontend**: `src/app/teacher/courses/create/page.tsx`
  - Step-by-step form builder
  - Real-time preview
  - Drag-drop content organization
  - Quiz builder with visual interface
  - WYSIWYG editor for content

**API**: `src/app/api/teacher/courses/create/route.ts`
  - Accept form data
  - Validate against schema
  - Create course + content in database
  - Return created course ID

### Navigation & Integration
**Location**: `src/app/teacher/courses/page.tsx`
```
┌─ Create New Course
│  ├─ From Template (upload .course.md)
│  ├─ Using Portal Builder
│  └─ From Example Template
```

### Phase 3: Export to Template (Optional, Future)
- Export course as `.course.md` template
- Share templates with colleagues
- Version control in Git
- Community template library

### Phase 4: Advanced Features (Future)
- Bulk import/export
- Template marketplace
- Course cloning
- Collaborative editing
- Integration with LMS platforms

---

## 6. File Format Details

### Markdown Frontmatter (YAML)

```yaml
---
metadata:
  title: "Course Title"
  description: "Course Description"
  subject: "Subject Name"
  language: "FR|EN|ES|MG"
  requiresOnline: true|false
  thumbnail: "https://image-url"
  status: "DRAFT|UNDER_REVIEW|APPROVED|PUBLISHED|ARCHIVED"

course:
  passingScore: 70  # Optional, applies to overall course
  objectives:
    - "Learning objective 1"
    - "Learning objective 2"
---
```

### Markdown Content Sections

**Lesson/Text Content:**
```markdown
### Section Title
**Type:** LESSON|TEXT
**Duration:** 900 (seconds, optional)
**Offline:** true|false
**AppearAfter:** 0 (seconds after course start)
**DisappearAfter:** 3600 (seconds, optional)

Content text goes here...
Can use **markdown** formatting
```

**Video Content:**
```markdown
### Video Section
**Type:** VIDEO
**URL:** https://example.com/video.mp4
**Duration:** 720 (seconds)
**Offline:** true|false
```

**Quiz Content:**
```markdown
### Quiz Section
**Type:** QUIZ
**Mode:** PRACTICE|EXAM|TIMED_EXAM
**PassingScore:** 70
**TimeLimit:** 30 (minutes, null = unlimited)
**ShowAnswersAfter:** true|false
**RandomizeQuestions:** true|false

#### Question Title
**Type:** MULTIPLE_CHOICE|TRUE_FALSE|SHORT_ANSWER|ESSAY
**Points:** 1

Question text here?

a) Option A
b) Option B
c) Option C

**Answer:** a|b|c (or true|false, or essay)
**Explanation:** Explanation text
```

**Assignment Content:**
```markdown
### Assignment Section
**Type:** ASSIGNMENT
**Points:** 50
**DueDate:** 2025-12-15

Assignment description and instructions...
```

---

## 7. Technology Stack

### Parsing
- `markdown-it` - Markdown parsing (npm)
- `js-yaml` - YAML front matter parsing (npm)
- TypeScript for type safety

### Validation
- Zod or custom validators for schema validation
- Error messages with line numbers for teacher feedback

### Storage
- Markdown files in `/public/templates/` for sharing
- JSON stored in database
- Versioning via ContentVersion model

---

## 8. Advantages of This Approach

### For Teachers
✅ Natural, familiar format (like Google Docs outline)
✅ Can edit in any text editor (VS Code, Notepad, etc.)
✅ Easy to copy and modify existing courses
✅ Version control friendly (Git, Google Drive)
✅ Offline creation possible

### For System
✅ Clear structure with validation
✅ Flexible timing and content control
✅ Quiz builder without UI complexity
✅ Supports all content types
✅ Easy to extend with new content types

### For Course Designers
✅ Can create templates for specific subject areas
✅ Easy to share templates across school
✅ Supports complex multi-module courses
✅ Compatible with course import/export workflows

---

## 9. Sample Course Designers Template

**For Educational Managers creating reusable templates:**

```markdown
---
metadata:
  title: "TEMPLATE: Grade 5 Mathematics - Fractions Unit"
  description: "Reusable template for teaching fractions. Customize for your class."
  subject: "Mathematics"
  language: "FR"
  requiresOnline: false
  status: "APPROVED"
  isTemplate: true

course:
  passingScore: 75
  objectives:
    - "Understand fraction basics"
    - "Compare and order fractions"
    - "Add and subtract fractions"

template:
  targetGrade: "Grade 5"
  duration: "4 weeks"
  estimatedHours: "12"
  materials: "Fraction bars, manipulatives, worksheets"
  notes: "Customize the assignment due dates to match your school calendar"
---

# TEMPLATE: Grade 5 Mathematics - Fractions Unit

> **Template Instructions**: This is a reusable template. When creating your course:
> 1. Change the title to match your school/class
> 2. Adjust module dates to your calendar
> 3. Customize assignments with your own due dates
> 4. Add your school's logo to thumbnail

...rest of course content...
```

---

## 10. Next Steps for Implementation

1. **Create template files** in `docs/templates/`
2. **Build parser** in `src/lib/course-parser.ts`
3. **Create upload interface** at `/teacher/courses/create-from-template`
4. **Build API endpoint** for import processing
5. **Add validation** with helpful error messages
6. **Test with sample courses**
7. **Create teacher documentation**
8. **Optional**: Build visual course designer UI

---

## 11. Key Features to Implement

- [x] Markdown + YAML format specification
- [x] JSON intermediate format
- [x] Parser design
- [ ] Implementation: Template files
- [ ] Implementation: Parser logic
- [ ] Implementation: Upload feature
- [ ] Implementation: API endpoint
- [ ] Implementation: Course designer (Phase 2)
- [ ] Documentation for teachers
- [ ] Documentation for designers

---

## Summary

**Recommended Format**: Markdown (.course.md) with YAML frontmatter
**Why**: Natural for teachers, structured for system, flexible for content
**Parser Output**: JSON → Database
**Teacher Experience**: Edit markdown files, upload, import into platform
**Designer Experience**: Create reusable templates, customize for classes

This approach balances **usability** (teachers), **structure** (system), and **flexibility** (both).

---

**Ready to implement Phase 1 (template files) or proceed with another feature?**
