# Course Template Guide for Teachers

**Quick Start Guide for Creating Courses in SchoolBridge**

---

## What is a Course Template?

A course template is a Markdown file (`.course.md`) that contains your entire course structure. You write it once, upload it to SchoolBridge, and the system automatically creates all your course content.

Think of it like writing an outline in Word, but with special formatting that tells SchoolBridge how to organize everything.

---

## Quick Start (5 Minutes)

### Step 1: Copy the Template
1. Go to `/docs/templates/`
2. Download `course_template.md`
3. Save it as: `my_course_name.course.md`
4. Open with any text editor (Word, Google Docs, Notepad, VS Code)

### Step 2: Fill In Your Course Info

At the very top, fill in the blue box (frontmatter):

```markdown
---
metadata:
  title: "Your Course Title"
  description: "What this course teaches"
  subject: "Subject Name"
  language: "FR"  # Change to: FR, EN, ES, MG
  requiresOnline: true  # Change to false if offline works
  status: "DRAFT"
---
```

### Step 3: Add Your Content

Below the blue box, write your course like an outline:

```markdown
# My Course Title

## Module 1: First Topic

### Lesson 1.1: Introduction
**Type:** LESSON
**Duration:** 15

Your lesson text here...

### Video 1.2: Watch This
**Type:** VIDEO
**URL:** https://youtube.com/watch?v=xxx

### Quiz 1.3: Check Understanding
**Type:** QUIZ
```

### Step 4: Upload to SchoolBridge
1. Go to: `/teacher/courses/create-from-template`
2. Upload your `.course.md` file
3. Review the preview
4. Click "Import Course"
5. Done! Your course is created

---

## Content Types Explained

### 1. LESSON - Introduction to a Topic

```markdown
### Lesson Title
**Type:** LESSON
**Duration:** 900  # Duration in seconds (optional)
**Offline:** true  # Can students access offline? (default: false)
**AppearAfter:** 0  # Seconds after course starts to show (default: 0)

Your lesson introduction and key points here.
Explain the concept clearly.
```

**When to use:** When introducing a new concept or topic

---

### 2. TEXT - Reading Material

```markdown
### Text Content
**Type:** TEXT
**Offline:** true

Detailed explanation or reading material goes here.

You can use **bold**, *italic*, and [links](https://example.com).
```

**When to use:** For articles, explanations, or reading assignments

---

### 3. VIDEO - Video Lessons

```markdown
### Video Section
**Type:** VIDEO
**URL:** https://youtube.com/watch?v=abc123
**Duration:** 720  # Video length in seconds
**Offline:** false

Optional: Description of what the video teaches
```

**When to use:** For video lessons from YouTube or your school's platform

---

### 4. QUIZ - Test Understanding

```markdown
### Quiz Title
**Type:** QUIZ
**Mode:** PRACTICE  # Options: PRACTICE, EXAM, TIMED_EXAM
**PassingScore:** 70  # Percentage needed to pass
**TimeLimit:** 30  # Minutes (leave blank for unlimited)
**ShowAnswersAfter:** true  # Show correct answers after submission?
**RandomizeQuestions:** false  # Randomize question order?

#### Question 1
**Type:** MULTIPLE_CHOICE  # Options: MULTIPLE_CHOICE, TRUE_FALSE, SHORT_ANSWER
**Points:** 2

What is 2 + 2?

a) 3
b) 4
c) 5

**Answer:** b
**Explanation:** When you add 2 and 2, you get 4.

---

#### Question 2
**Type:** TRUE_FALSE
**Points:** 1

Earth is flat.

**Answer:** false
**Explanation:** Earth is actually spherical.
```

**Quiz Modes Explained:**
- **PRACTICE**: Students get immediate feedback on each question
- **EXAM**: Students see no feedback until they submit all answers, then final score
- **TIMED_EXAM**: Like EXAM but with a strict time limit

---

### 5. ASSIGNMENT - Homework or Projects

```markdown
### Assignment Title
**Type:** ASSIGNMENT
**Points:** 50  # Total points for this assignment
**DueDate:** 2025-12-15  # When it's due (YYYY-MM-DD)

Instructions for the assignment go here.
Be specific about what students need to do.
```

**When to use:** For homework, projects, essays, or creative work

---

### 6. PDF - PDF Documents

```markdown
### PDF Document
**Type:** PDF
**URL:** https://example.com/document.pdf
**Offline:** true
```

**When to use:** For textbooks, worksheets, or official documents

---

### 7. INTERACTIVE - Interactive Lessons

```markdown
### Interactive Activity
**Type:** INTERACTIVE
**URL:** https://example.com/interactive-lesson
**Offline:** false

Description of the interactive activity
```

**When to use:** For simulations, interactive tools, or Scratch projects

---

## Course Structure Best Practices

### Good Structure
```markdown
# Main Course Title

## Module 1: Foundations
- Lesson 1.1
- Text 1.2
- Video 1.3
- Quiz 1.4

## Module 2: Advanced Topics
- Lesson 2.1
- Assignment 2.2
- Quiz 2.3

## Final Assessment
- Comprehensive Quiz
- Final Project
```

### Not Recommended
❌ 10 hours of video without any breaks
❌ 50 questions in one quiz
❌ Same format for every activity (mix content types)
❌ No quizzes or checks for understanding

---

## Metadata Fields Explained

| Field | Required? | Options | Example |
|-------|-----------|---------|---------|
| title | Yes | Any text | "Biology 101" |
| description | Yes | Any text | "Introduction to biology" |
| subject | Yes | Subject name | "Biology" |
| language | Yes | FR, EN, ES, MG | "FR" |
| requiresOnline | No | true/false | true |
| status | No | DRAFT, PUBLISHED | "DRAFT" |
| thumbnail | No | Image URL | "https://..." |

---

## Tips & Tricks

### Timing Content
Control when content appears in your course:

```markdown
### Content that appears later
**AppearAfter:** 1800  # After 30 minutes

### Content that disappears
**DisappearAfter:** 3600  # After 1 hour

### Content that appears AND disappears
**AppearAfter:** 900
**DisappearAfter:** 2700
```

### Offline Access
Enable offline access for important content:

```markdown
**Offline:** true  # Students can download and view offline
**Offline:** false  # Requires internet connection
```

### Points and Grading
Assign points to quizzes and assignments:

```markdown
### Quiz with points
**Type:** QUIZ
**PassingScore:** 75  # Students need 75% to pass

#### Question with points
**Points:** 5  # This question is worth 5 points
```

### Organizing Large Courses
For courses with 20+ lessons:

```markdown
# Large Course

## Unit 1: Week 1-2
### Lesson 1.1
### Lesson 1.2

## Unit 2: Week 3-4
### Lesson 2.1
### Lesson 2.2
```

---

## Common Mistakes to Avoid

### ❌ Mistake 1: Wrong Frontmatter Format
**Wrong:**
```
title: My Course
description: A course
```

**Right:**
```
---
metadata:
  title: "My Course"
  description: "A course"
---
```

### ❌ Mistake 2: Missing Answer in Quiz
```markdown
**Type:** MULTIPLE_CHOICE

What is 2+2?

a) 3
b) 4

<!-- Missing: **Answer:** b -->
```

### ❌ Mistake 3: Invalid Language Code
**Wrong:** language: "French"
**Right:** language: "FR"

### ❌ Mistake 4: Invalid Date Format
**Wrong:** DueDate: December 15, 2025
**Right:** DueDate: 2025-12-15

### ❌ Mistake 5: Broken URLs
Always use full URLs:
**Wrong:** URL: /videos/lesson1.mp4
**Right:** URL: https://yourdomain.com/videos/lesson1.mp4

---

## Example Courses

### Example 1: Simple Course (30 minutes)
See: `example_simple.course.md`
- 1 lesson
- 1 video
- 1 quiz

### Example 2: Medium Course (3 weeks)
See: `example_complex.course.md`
- 2 modules
- 8 lessons
- Videos, quizzes, assignments

### Example 3: Full Course (8 weeks)
See: `example_advanced.course.md`
- 4 modules
- 12 lessons
- Videos, quizzes, assignments
- Timing controls
- Offline support

---

## Troubleshooting

### Q: My course won't upload
**A:** Check your frontmatter format (the blue box at the top). It must be exactly right.

### Q: Quiz questions aren't showing up
**A:** Make sure each question starts with `#### Question` and has **Answer:** specified.

### Q: Videos aren't playing
**A:** Make sure the URL is a full web address (starts with https://)

### Q: I want to add more content types
**A:** Contact your educational manager. SchoolBridge supports: LESSON, TEXT, VIDEO, PDF, INTERACTIVE, QUIZ, ASSIGNMENT

---

## Need Help?

1. **Check Examples**: Look at the example files
2. **Read Full Guide**: See `COURSE_TEMPLATES_RECOMMENDATION.md`
3. **Ask Your Manager**: Contact your educational manager
4. **Check SchoolBridge Docs**: Visit your school's help center

---

## Quick Reference

**File naming:** `coursename.course.md`

**Frontmatter languages:** FR, EN, ES, MG

**Content types:** LESSON, TEXT, VIDEO, PDF, INTERACTIVE, QUIZ, ASSIGNMENT

**Quiz types:** MULTIPLE_CHOICE, TRUE_FALSE, SHORT_ANSWER, ESSAY

**Quiz modes:** PRACTICE, EXAM, TIMED_EXAM

**Times in:** Seconds (except TimeLimit which is Minutes)

**Dates in:** YYYY-MM-DD format

---

**Happy course creating! 📚**
