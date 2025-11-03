---
metadata:
  title: "Your Course Title Here"
  description: "Write a short description of what this course teaches"
  subject: "Subject Name (e.g., Mathematics, Biology, History)"
  language: "FR"  # FR, EN, ES, MG
  requiresOnline: true  # true if students need internet, false if offline OK
  thumbnail: "https://example.com/image.jpg"  # Optional: course thumbnail image
  status: "DRAFT"  # DRAFT, PUBLISHED, ARCHIVED

course:
  passingScore: 70  # Optional: minimum percentage to pass
  objectives:
    - "Learning objective 1"
    - "Learning objective 2"
    - "Learning objective 3"
---

# Your Course Title

Write a brief introduction to your course here. This text will be shown to students when they first see your course.

---

## Module 1: First Topic

Start with an introduction to the first module or week of your course.

### Lesson 1.1: First Lesson
**Type:** LESSON
**Duration:** 900  # Optional: duration in seconds (900 = 15 minutes)
**Offline:** true  # Optional: can students access offline? (default: false)
**AppearAfter:** 0  # Optional: seconds after course starts before showing

Write your lesson content here. Introduce the concept clearly.
Use **bold** for important terms and *italics* for emphasis.

Key points:
- Point 1
- Point 2
- Point 3

---

### Content 1.2: Reading Material
**Type:** TEXT
**Offline:** true

Provide detailed explanation or reading material here.
This could be an article, explanation, or additional context.

---

### Video 1.3: Watch This Video
**Type:** VIDEO
**URL:** https://youtube.com/watch?v=xxx
**Duration:** 720  # Optional: video length in seconds
**Offline:** false  # Can students watch offline?

Optional description of what the video teaches.

---

### Quiz 1.4: Check Your Understanding
**Type:** QUIZ
**Mode:** PRACTICE  # PRACTICE, EXAM, or TIMED_EXAM
**PassingScore:** 70  # Percentage needed to pass
**TimeLimit:** null  # Optional: minutes allowed (null = unlimited)
**ShowAnswersAfter:** true  # Show correct answers after submission?
**RandomizeQuestions:** false  # Randomize question order?

#### Question 1
**Type:** MULTIPLE_CHOICE
**Points:** 1

What is an important concept from this lesson?

a) Option A
b) Option B
c) Option C
d) Option D

**Answer:** a
**Explanation:** Explain why this is correct.

---

#### Question 2
**Type:** TRUE_FALSE
**Points:** 1

Is this statement true or false?

**Answer:** true
**Explanation:** Explanation of the answer.

---

### Assignment 1.5: Complete This Task
**Type:** ASSIGNMENT
**Points:** 50  # Total points for this assignment
**DueDate:** 2025-12-31  # When it's due (YYYY-MM-DD)

Provide clear instructions for what students should do:
1. First step
2. Second step
3. Third step

Be specific about deliverables.

---

## Module 2: Second Topic

Introduction to the second module.

### Lesson 2.1: Another Lesson
**Type:** LESSON

Content here...

---

### PDF 2.2: Reading Material
**Type:** PDF
**URL:** https://example.com/document.pdf
**Offline:** true

---

## Final Assessment

### Comprehensive Quiz
**Type:** QUIZ
**Mode:** EXAM  # This one requires no feedback until end
**PassingScore:** 75
**TimeLimit:** 60  # 60 minutes for exam

#### Question 1
**Type:** MULTIPLE_CHOICE
**Points:** 2

Question text?

a) Option
b) Option

**Answer:** a
**Explanation:** Explanation

---

## Helpful Tips

- Keep lessons to 10-20 minutes each
- Alternate between different content types (lesson, video, text, quiz)
- Always follow a lesson or concept with a quiz to check understanding
- Use assignments for longer projects or homework
- Set reasonable due dates that align with your school calendar
- Enable offline access for important content
- Make quiz explanations clear and educational

---

**For help, see TEMPLATE_GUIDE.md**
