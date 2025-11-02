'use client';

import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  BookOpen,
  FileText,
  Video,
  FileIcon,
  Zap,
  HelpCircle,
  ClipboardList,
  AlertCircle,
  Clock,
  Award,
} from 'lucide-react';

interface CoursePreviewProps {
  course: {
    title: string;
    description: string;
    subjectId: string;
    language: 'EN' | 'FR' | 'ES' | 'MG';
    requiresOnline: boolean;
    thumbnailUrl?: string;
    status: string;
    content: any[];
  };
}

const CONTENT_ICONS: Record<string, React.ReactNode> = {
  LESSON: <BookOpen className="h-5 w-5" />,
  TEXT: <FileText className="h-5 w-5" />,
  VIDEO: <Video className="h-5 w-5" />,
  PDF: <FileIcon className="h-5 w-5" />,
  INTERACTIVE: <Zap className="h-5 w-5" />,
  QUIZ: <HelpCircle className="h-5 w-5" />,
  ASSIGNMENT: <ClipboardList className="h-5 w-5" />,
};

const LANGUAGE_NAMES: Record<string, string> = {
  EN: 'English',
  FR: 'French',
  ES: 'Spanish',
  MG: 'Malagasy',
};

export function CoursePreview({ course }: CoursePreviewProps) {
  const totalDuration = course.content
    .filter((c) => c.duration)
    .reduce((sum, c) => sum + (c.duration || 0), 0);

  const totalPoints = course.content
    .filter((c) => c.points)
    .reduce((sum, c) => sum + (c.points || 0), 0);

  const quizzes = course.content.filter((c) => c.contentType === 'QUIZ');
  const assignments = course.content.filter((c) => c.contentType === 'ASSIGNMENT');
  const lessons = course.content.filter((c) => c.contentType === 'LESSON');

  const renderValidationWarnings = () => {
    const warnings = [];

    if (!course.title) {
      warnings.push('Course title is required');
    }

    if (!course.description) {
      warnings.push('Course description is required');
    }

    if (course.content.length === 0) {
      warnings.push('Course must have at least one content item');
    }

    if (course.content.some((c) => !c.title)) {
      warnings.push('All content items must have titles');
    }

    return warnings;
  };

  const warnings = renderValidationWarnings();
  const isValid = warnings.length === 0;

  return (
    <div className="space-y-6">
      {/* Validation Alert */}
      {!isValid && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            <p className="font-semibold mb-2">Please fix the following issues:</p>
            <ul className="list-disc list-inside space-y-1">
              {warnings.map((warning, idx) => (
                <li key={idx} className="text-sm">
                  {warning}
                </li>
              ))}
            </ul>
          </AlertDescription>
        </Alert>
      )}

      {/* Course Header Preview */}
      <Card className="overflow-hidden">
        {course.thumbnailUrl && (
          <div className="w-full h-48 bg-muted overflow-hidden">
            <img
              src={course.thumbnailUrl}
              alt={course.title}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
              }}
            />
          </div>
        )}
        <div className={`p-6 ${!course.thumbnailUrl ? 'bg-muted' : ''}`}>
          <div className="flex items-start justify-between gap-4 mb-4">
            <div className="flex-1">
              <h1 className="text-3xl font-bold mb-2">
                {course.title || 'Untitled Course'}
              </h1>
              <div className="flex flex-wrap gap-2 mb-4">
                <Badge variant="default">{LANGUAGE_NAMES[course.language] || course.language}</Badge>
                {course.requiresOnline && (
                  <Badge variant="secondary">Requires Online</Badge>
                )}
              </div>
            </div>
          </div>

          <p className="text-muted-foreground mb-6 max-w-2xl">
            {course.description || 'No description provided'}
          </p>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="flex items-center gap-2">
              <BookOpen className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-xs text-muted-foreground">Items</p>
                <p className="font-semibold">{course.content.length}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <HelpCircle className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-xs text-muted-foreground">Quizzes</p>
                <p className="font-semibold">{quizzes.length}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <ClipboardList className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-xs text-muted-foreground">Assignments</p>
                <p className="font-semibold">{assignments.length}</p>
              </div>
            </div>
            {totalDuration > 0 && (
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-xs text-muted-foreground">Duration</p>
                  <p className="font-semibold">
                    {Math.round(totalDuration / 60)} min
                  </p>
                </div>
              </div>
            )}
            {totalPoints > 0 && (
              <div className="flex items-center gap-2">
                <Award className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-xs text-muted-foreground">Points</p>
                  <p className="font-semibold">{totalPoints}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </Card>

      {/* Course Content Preview */}
      {course.content.length > 0 ? (
        <Card className="p-6">
          <h2 className="text-lg font-semibold mb-4">Course Content</h2>
          <div className="space-y-3">
            {course.content.map((item, index) => (
              <div
                key={item.id}
                className="flex items-start gap-4 p-3 rounded-lg hover:bg-muted/50 transition-colors"
              >
                <div className="flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-full bg-muted text-muted-foreground">
                  {CONTENT_ICONS[item.contentType]}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-baseline gap-2 mb-1">
                    <span className="text-sm text-muted-foreground">
                      {index + 1}.
                    </span>
                    <h3 className="font-medium truncate">
                      {item.title || '(No title)'}
                    </h3>
                  </div>
                  <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                    <Badge variant="secondary" className="text-xs">
                      {item.contentType}
                    </Badge>
                    {item.duration && (
                      <span>
                        <Clock className="h-3 w-3 inline mr-1" />
                        {Math.round(item.duration / 60)} min
                      </span>
                    )}
                    {item.points && (
                      <span>
                        <Award className="h-3 w-3 inline mr-1" />
                        {item.points} pts
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      ) : (
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            No content items yet. Go to the Content tab to add content to your course.
          </AlertDescription>
        </Alert>
      )}

      {/* Course Info Box */}
      <Card className="p-6 bg-muted/50 border-muted">
        <h3 className="font-semibold mb-4">Course Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-muted-foreground">Status</p>
            <p className="font-medium">{course.status}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Language</p>
            <p className="font-medium">
              {LANGUAGE_NAMES[course.language] || course.language}
            </p>
          </div>
          <div>
            <p className="text-muted-foreground">Online Access Required</p>
            <p className="font-medium">{course.requiresOnline ? 'Yes' : 'No'}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Total Content Items</p>
            <p className="font-medium">{course.content.length}</p>
          </div>
        </div>
      </Card>

      {/* How This Looks to Students */}
      <Card className="p-6 border-blue-200 bg-blue-50 dark:bg-blue-950 dark:border-blue-800">
        <h3 className="font-semibold mb-2 text-sm">How This Looks to Students</h3>
        <p className="text-sm text-muted-foreground mb-4">
          This preview shows how students will see your course when it's published. They'll
          be able to access content in order and track their progress through the course.
        </p>
        <Button variant="outline" size="sm">
          View as Student
        </Button>
      </Card>
    </div>
  );
}
