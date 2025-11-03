import MarkdownIt from 'markdown-it';
import YAML from 'js-yaml';

// Type definitions for Prisma enums
export type ContentType = 'LESSON' | 'TEXT' | 'VIDEO' | 'PDF' | 'INTERACTIVE' | 'QUIZ' | 'ASSIGNMENT';
export type Language = 'FR' | 'EN' | 'MG' | 'ES';
export type CourseStatus = 'DRAFT' | 'UNDER_REVIEW' | 'APPROVED' | 'PUBLISHED' | 'ARCHIVED';
export type QuizMode = 'PRACTICE' | 'EXAM' | 'TIMED_EXAM';
export type QuestionType = 'MULTIPLE_CHOICE' | 'TRUE_FALSE' | 'SHORT_ANSWER' | 'ESSAY';

// Types for parsed course data
export interface ParsedCourseContent {
  contentOrder: number;
  contentType: ContentType;
  title: string;
  contentData: Record<string, unknown>;
  offlineAvailable?: boolean;
  appearsAfterSeconds?: number;
  disappearsAfterSeconds?: number;
}

export interface ParsedQuiz {
  title: string;
  description?: string;
  passingScore: number;
  timeLimit?: number;
  mode: QuizMode;
  showAnswersAfter: boolean;
  randomizeQuestions: boolean;
  questions: ParsedQuestion[];
}

export interface ParsedQuestion {
  questionType: QuestionType;
  text: string;
  explanation?: string;
  order: number;
  points: number;
  options: Array<{ id: string; text: string }>;
  correctAnswer: { type: 'single' | 'multiple'; value: string | string[] };
}

export interface ParsedCourse {
  title: string;
  description?: string;
  language: Language;
  status: CourseStatus;
  requiresOnline: boolean;
  thumbnailUrl?: string;
  subjectId: string; // Will need to be resolved by the API
  content: ParsedCourseContent[];
  errors: ParseError[];
}

export interface ParseError {
  line?: number;
  section?: string;
  message: string;
  severity: 'error' | 'warning';
}

const md = new MarkdownIt();
const VALID_CONTENT_TYPES: ContentType[] = ['LESSON', 'TEXT', 'VIDEO', 'PDF', 'INTERACTIVE', 'QUIZ', 'ASSIGNMENT'];
const VALID_LANGUAGES: Language[] = ['FR', 'EN', 'MG', 'ES'];
const VALID_QUIZ_MODES: QuizMode[] = ['PRACTICE', 'EXAM', 'TIMED_EXAM'];
const VALID_QUESTION_TYPES: QuestionType[] = ['MULTIPLE_CHOICE', 'TRUE_FALSE', 'SHORT_ANSWER', 'ESSAY'];
const VALID_COURSE_STATUS: CourseStatus[] = ['DRAFT', 'UNDER_REVIEW', 'APPROVED', 'PUBLISHED', 'ARCHIVED'];

/**
 * Parse a course template file (.course.md)
 * Format: YAML frontmatter + Markdown content
 */
export function parseCourseMd(fileContent: string): ParsedCourse {
  const errors: ParseError[] = [];

  try {
    // Extract YAML frontmatter
    const frontmatterMatch = fileContent.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
    if (!frontmatterMatch) {
      errors.push({
        message: 'Invalid file format. Must start with YAML frontmatter between --- lines',
        severity: 'error',
      });
      throw new Error('Invalid frontmatter');
    }

    const [, yamlContent, markdownContent] = frontmatterMatch;

    // Parse YAML
    let frontmatter: any;
    try {
      frontmatter = YAML.load(yamlContent) as any;
    } catch (err) {
      errors.push({
        message: `YAML parsing error: ${err instanceof Error ? err.message : 'Unknown error'}`, 
        severity: 'error',
      });
      throw err;
    }

    // Validate metadata
    if (!frontmatter?.metadata) {
      errors.push({
        message: 'Missing metadata section in frontmatter',
        severity: 'error',
      });
      throw new Error('Missing metadata');
    }

    const metadata = frontmatter.metadata;

    // Required fields
    if (!metadata.title || typeof metadata.title !== 'string') {
      errors.push({
        message: 'Missing or invalid required field: title',
        severity: 'error',
      });
      throw new Error('Invalid title');
    }

    if (!metadata.description || typeof metadata.description !== 'string') {
      errors.push({
        message: 'Missing or invalid required field: description',
        severity: 'error',
      });
      throw new Error('Invalid description');
    }

    if (!metadata.subject || typeof metadata.subject !== 'string') {
      errors.push({
        message: 'Missing or invalid required field: subject',
        severity: 'error',
      });
      throw new Error('Invalid subject');
    }

    if (!metadata.language || !VALID_LANGUAGES.includes(metadata.language)) {
      errors.push({
        message: `Invalid language. Must be one of: ${VALID_LANGUAGES.join(', ')}`, 
        severity: 'error',
      });
      throw new Error('Invalid language');
    }

    // Parse course metadata
    const course: ParsedCourse = {
      title: metadata.title.trim(),
      description: metadata.description.trim(),
      language: metadata.language as Language,
      status: (metadata.status as CourseStatus) || 'DRAFT',
      requiresOnline: metadata.requiresOnline !== false,
      thumbnailUrl: metadata.thumbnail,
      subjectId: metadata.subject, // This will be resolved by the API
      content: [],
      errors,
    };

    // Validate status
    if (!VALID_COURSE_STATUS.includes(course.status)) {
      errors.push({
        message: `Invalid course status: ${course.status}. Must be one of: ${VALID_COURSE_STATUS.join(', ')}`, 
        severity: 'warning',
      });
      course.status = 'DRAFT';
    }

    // Parse markdown content sections
    const contentItems = parseMarkdownContent(markdownContent, errors);

    course.content = contentItems;

    return course;
  } catch (error) {
    if (errors.length === 0) {
      errors.push({
        message: `Parsing failed: ${error instanceof Error ? error.message : 'Unknown error'}`, 
        severity: 'error',
      });
    }
    throw new Error(`Failed to parse course: ${errors.map((e) => e.message).join('; ')}`);
  }
}

/**
 * Parse markdown content sections into structured content items
 */
function parseMarkdownContent(content: string, errors: ParseError[]): ParsedCourseContent[] {
  const items: ParsedCourseContent[] = [];
  let contentOrder = 1;

  // Split by ---, which separates content items
  const sections = content.split(/\n---\n/);

  sections.forEach((section) => {
    const trimmedSection = section.trim();
    if (trimmedSection.length === 0) return;

    const lines = trimmedSection.split('\n');
    const titleLineIndex = lines.findIndex((line) => line.startsWith('### '));

    // Each content item must have a title starting with ###
    if (titleLineIndex === -1) {
      // This section might be the main title or a module title, so we can ignore it.
      return;
    }

    const title = lines[titleLineIndex].substring(4).trim();

    try {
      // Extract metadata from bold lines at the beginning of the body
      const metadataLines: string[] = [];
      const contentBodyLines: string[] = [];
      let inMetadataSection = true;

      for (const line of lines.slice(titleLineIndex + 1)) { // Start after the title
        if (line.match(/^\*\*(\w+):\*\*\s*(.+)$/) && inMetadataSection) {
          metadataLines.push(line);
        } else {
          inMetadataSection = false; // Once a non-metadata line is found, stop looking for metadata
          contentBodyLines.push(line);
        }
      }

      const metadata = extractMetadata(metadataLines);
      const contentBody = contentBodyLines.join('\n').trim();

      if (!metadata.type) {
        errors.push({
          section: title,
          message: 'Missing required field: **Type:**',
          severity: 'error',
        });
        return;
      }

      if (!VALID_CONTENT_TYPES.includes(metadata.type as ContentType)) {
        errors.push({
          section: title,
          message: `Invalid content type: ${metadata.type}. Must be one of: ${VALID_CONTENT_TYPES.join(', ')}`, 
          severity: 'error',
        });
        return;
      }

      // Create content item based on type
      const contentItem: ParsedCourseContent = {
        contentOrder,
        contentType: metadata.type as ContentType,
        title: title.trim(),
        contentData: {},
        offlineAvailable: metadata.offline !== false,
        appearsAfterSeconds: metadata.appearAfter || 0,
        disappearsAfterSeconds: metadata.disappearAfter,
      };

      switch (metadata.type) {
        case 'LESSON':
        case 'TEXT':
          contentItem.contentData = {
            text: contentBody,
            duration: metadata.duration,
          };
          break;

        case 'VIDEO':
          contentItem.contentData = {
            videoUrl: metadata.url,
            duration: metadata.duration,
          };
          contentItem.offlineAvailable = false; // Videos can't be offline
          break;

        case 'PDF':
          contentItem.contentData = {
            pdfUrl: metadata.url,
          };
          break;

        case 'INTERACTIVE':
          contentItem.contentData = {
            interactiveUrl: metadata.url,
          };
          contentItem.offlineAvailable = false;
          break;

        case 'QUIZ':
          const quiz = parseQuiz(contentBody, metadata, errors, title);
          contentItem.contentData = quiz as unknown as Record<string, unknown>;
          break;

        case 'ASSIGNMENT':
          contentItem.contentData = {
            description: contentBody,
            dueDate: metadata.dueDate,
            points: metadata.points,
          };
          break;
      }

      items.push(contentItem);
      contentOrder++;
    } catch (err) {
      errors.push({
        section: title,
        message: `Error parsing section: ${err instanceof Error ? err.message : 'Unknown error'}`, 
        severity: 'error',
      });
    }
  });

  return items;
}



/**
 * Extract metadata from metadata lines (e.g., **Type:** LESSON)
 */
function extractMetadata(content: string | string[]): Record<string, any> {
  const metadata: Record<string, any> = {};
  const lines = Array.isArray(content) ? content : content.split('\n');

  for (const line of lines) {
    const match = line.match(/^\*\*(\w+):\*\*\s*(.+)$/);
    if (match) {
      const [, key, value] = match;
      const lowerKey = key.toLowerCase();

      switch (lowerKey) {
        case 'type':
          metadata.type = value.toUpperCase();
          break;
        case 'duration':
          metadata.duration = parseInt(value);
          break;
        case 'offline':
          metadata.offline = value.toLowerCase() !== 'false';
          break;
        case 'url':
          metadata.url = value.trim();
          break;
        case 'appearafter':
          metadata.appearAfter = parseInt(value);
          break;
        case 'disappearafter':
          metadata.disappearAfter = parseInt(value);
          break;
        case 'mode':
          metadata.mode = value.toUpperCase();
          break;
        case 'passingscore':
          metadata.passingScore = parseInt(value);
          break;
        case 'timelimit':
          metadata.timeLimit = parseInt(value);
          break;
        case 'showanswersafter':
          metadata.showAnswersAfter = value.toLowerCase() !== 'false';
          break;
        case 'randomizequestions':
          metadata.randomizeQuestions = value.toLowerCase() === 'true';
          break;
        case 'duedate':
          metadata.dueDate = value.trim();
          break;
        case 'points':
          metadata.points = parseInt(value);
          break;
      }
    }
  }
  return metadata;
}

/**
 * Parse quiz content into structured quiz data
 */
function parseQuiz(content: string, metadata: Record<string, any>, errors: ParseError[], sectionTitle: string): ParsedQuiz {
  const quiz: ParsedQuiz = {
    title: metadata.title || sectionTitle,
    description: metadata.description,
    passingScore: metadata.passingScore || 70,
    timeLimit: metadata.timeLimit,
    mode: (metadata.mode as QuizMode) || 'PRACTICE',
    showAnswersAfter: metadata.showAnswersAfter !== false,
    randomizeQuestions: metadata.randomizeQuestions || false,
    questions: [],
  };

  // Validate mode
  if (!VALID_QUIZ_MODES.includes(quiz.mode)) {
    errors.push({
      section: sectionTitle,
      message: `Invalid quiz mode: ${quiz.mode}. Must be one of: ${VALID_QUIZ_MODES.join(', ')}`, 
      severity: 'warning',
    });
    quiz.mode = 'PRACTICE';
  }

  // Split by level 4 headings (####) for questions
  const questionSections = content.split(/\n####\s+/);

  let questionOrder = 1;
  questionSections.forEach((questionSection, index) => {
    if (index === 0 && questionSection.trim().length === 0) return;

    const lines = questionSection.split('\n');
    const questionTitle = lines[0];
    const questionBody = lines.slice(1).join('\n').trim();

    try {
      const question = parseQuestion(questionTitle, questionBody, questionOrder, errors, sectionTitle);
      if (question) {
        quiz.questions.push(question);
        questionOrder++;
      }
    } catch (err) {
      errors.push({
        section: `${sectionTitle} - ${questionTitle}`,
        message: `Error parsing question: ${err instanceof Error ? err.message : 'Unknown error'}`, 
        severity: 'error',
      });
    }
  });

  return quiz;
}

/**
 * Parse individual quiz question
 */
function parseQuestion(
  title: string,
  content: string,
  order: number,
  errors: ParseError[],
  sectionTitle: string
): ParsedQuestion | null {
  const metadata = extractMetadata(content);

  if (!metadata.type || !VALID_QUESTION_TYPES.includes(metadata.type as QuestionType)) {
    errors.push({
      section: `${sectionTitle} - ${title}`,
      message: `Invalid question type: ${metadata.type}. Must be one of: ${VALID_QUESTION_TYPES.join(', ')}`, 
      severity: 'error',
    });
    return null;
  }

  // Remove metadata lines from content
  const contentLines = content
    .split('\n')
    .filter((line) => !line.match(/^\*\*(\w+):\*\*/))
    .join('\n')
    .trim();

  // Split question text from options and answer
  const parts = contentLines.split(/^\s*\*\*Answer:\*\*/m);
  if (parts.length < 2) {
    errors.push({
      section: `${sectionTitle} - ${title}`,
      message: 'Missing **Answer:** field in question',
      severity: 'error',
    });
    return null;
  }

  const [questionAndOptions, answerSection] = parts;
  const answerParts = answerSection.split(/\n\*\*Explanation:\*\*/);
  const correctAnswerStr = answerParts[0].trim();
  const explanation = answerParts[1]?.trim();

  // Parse question text (before options)
  const optionsMatch = questionAndOptions.match(/^([\s\S]*?)\n\n((?:[a-z]\)|^-).*)$/);
  const questionText = optionsMatch ? optionsMatch[1].trim() : questionAndOptions.trim();

  // Parse options for multiple choice and true/false
  const options: Array<{ id: string; text: string }> = [];
  const questionType = metadata.type as QuestionType;

  if (questionType === 'MULTIPLE_CHOICE') {
    const optionText = optionsMatch ? optionsMatch[2] : '';
    const optionLines = optionText.split('\n').filter((l) => l.trim());
    optionLines.forEach((line) => {
      const match = line.match(/^[a-z]\)\s*(.+)$/);
      if (match) {
        const id = line[0]; // a, b, c, etc.
        options.push({ id, text: match[1].trim() });
      }
    });
  } else if (questionType === 'TRUE_FALSE') {
    options.push({ id: 'true', text: 'True' });
    options.push({ id: 'false', text: 'False' });
  }

  // Determine correct answer type
  let correctAnswerType: 'single' | 'multiple' = 'single';
  let correctAnswerValue: string | string[] = correctAnswerStr;

  if (questionType === 'MULTIPLE_CHOICE' || questionType === 'TRUE_FALSE') {
    correctAnswerValue = correctAnswerStr.toLowerCase();
  }

  return {
    questionType,
    text: questionText,
    explanation,
    order,
    points: metadata.points || 1,
    options,
    correctAnswer: {
      type: correctAnswerType,
      value: correctAnswerValue,
    },
  };
}