'use client';

import type { Lecture } from '@/types/course';
import { VideoEditor } from '@/components/course/editors/video-editor';
import { ArticleEditor } from '@/components/course/editors/article-editor';
import { QuizEditor } from '@/components/course/editors/quiz-editor';
import { CodingExerciseEditor } from '@/components/course/editors/coding-exercise-editor';
import { AssignmentEditor } from '@/components/course/editors/assignment-editor';
import { ProjectEditor } from '@/components/course/editors/project-editor';
import { ResourceEditor } from '@/components/course/editors/resource-editor';

interface LectureEditorRouterProps {
  lecture: Lecture;
  sectionId: string;
  onUpdate: (updates: Partial<Lecture>) => void;
  onClose: () => void;
}

export function LectureEditorRouter({ lecture, sectionId, onUpdate, onClose }: LectureEditorRouterProps) {
  switch (lecture.type) {
    case 'VIDEO':
      return <VideoEditor lecture={lecture} onUpdate={onUpdate} onClose={onClose} />;
    case 'ARTICLE':
      return <ArticleEditor lecture={lecture} onUpdate={onUpdate} onClose={onClose} />;
    case 'QUIZ':
      return <QuizEditor lecture={lecture} onUpdate={onUpdate} onClose={onClose} />;
    case 'CODING_EXERCISE':
      return <CodingExerciseEditor lecture={lecture} onUpdate={onUpdate} onClose={onClose} />;
    case 'ASSIGNMENT':
      return <AssignmentEditor lecture={lecture} onUpdate={onUpdate} onClose={onClose} />;
    case 'PROJECT':
      return <ProjectEditor lecture={lecture} onUpdate={onUpdate} onClose={onClose} />;
    case 'RESOURCE':
      return <ResourceEditor lecture={lecture} onUpdate={onUpdate} onClose={onClose} />;
    default:
      return null;
  }
}
