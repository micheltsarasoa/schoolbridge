import { nanoid } from 'nanoid';

export function generateId(): string {
  return nanoid();
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export function getStatusColor(status: string): string {
  const colors: Record<string, string> = {
    DRAFT: 'text-gray-500 bg-gray-100',
    PUBLISHED: 'text-green-600 bg-green-100',
    ARCHIVED: 'text-red-600 bg-red-100',
    UNPUBLISHED: 'text-yellow-600 bg-yellow-100',
  };
  return colors[status] || 'text-gray-500 bg-gray-100';
}

export function formatDuration(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;

  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }
  return `${minutes}:${secs.toString().padStart(2, '0')}`;
}

export function calculateTotalDuration(sections: any[]): number {
  return sections.reduce((total, section) => {
    const sectionDuration = section.lectures?.reduce(
      (sum: number, lecture: any) => sum + (lecture.duration || 0),
      0
    ) || 0;
    return total + sectionDuration;
  }, 0);
}

export function validateCourse(course: any): { isValid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (!course.title || course.title.trim() === '') {
    errors.push('Course title is required');
  }

  if (!course.sections || course.sections.length === 0) {
    errors.push('Course must have at least one section');
  }

  course.sections?.forEach((section: any, sectionIndex: number) => {
    if (!section.title || section.title.trim() === '') {
      errors.push(`Section ${sectionIndex + 1} must have a title`);
    }

    if (!section.lectures || section.lectures.length === 0) {
      errors.push(`Section ${sectionIndex + 1} must have at least one lecture`);
    }

    section.lectures?.forEach((lecture: any, lectureIndex: number) => {
      if (!lecture.title || lecture.title.trim() === '') {
        errors.push(
          `Lecture ${lectureIndex + 1} in section ${sectionIndex + 1} must have a title`
        );
      }

      // Validate quiz questions
      if (lecture.type === 'QUIZ' && lecture.quiz) {
        if (!lecture.quiz.questions || lecture.quiz.questions.length === 0) {
          errors.push(
            `Quiz in lecture "${lecture.title}" must have at least one question`
          );
        }

        lecture.quiz.questions?.forEach((question: any, qIndex: number) => {
          if (!question.question || question.question.trim() === '') {
            errors.push(
              `Question ${qIndex + 1} in quiz "${lecture.title}" must have question text`
            );
          }

          if (question.type === 'MULTIPLE_CHOICE' || question.type === 'MULTIPLE_ANSWER') {
            if (!question.options || question.options.length < 2) {
              errors.push(
                `Question ${qIndex + 1} in quiz "${lecture.title}" must have at least 2 options`
              );
            }
            if (!question.correctAnswer || (Array.isArray(question.correctAnswer) && question.correctAnswer.length === 0)) {
              errors.push(
                `Question ${qIndex + 1} in quiz "${lecture.title}" must have a correct answer selected`
              );
            }
          }

          if (question.type === 'FILL_BLANK') {
            if (!question.acceptedAnswers || question.acceptedAnswers.length === 0) {
              errors.push(
                `Question ${qIndex + 1} in quiz "${lecture.title}" must have at least one accepted answer`
              );
            }
          }

          if (question.type === 'ORDERING') {
            if (!question.orderingItems || question.orderingItems.length < 2) {
              errors.push(
                `Question ${qIndex + 1} in quiz "${lecture.title}" must have at least 2 items to order`
              );
            }
          }
        });
      }
    });
  });

  return {
    isValid: errors.length === 0,
    errors,
  };
}
