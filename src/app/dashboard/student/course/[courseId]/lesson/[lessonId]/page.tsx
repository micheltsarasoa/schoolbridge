'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { ArrowLeft, AlertCircle, BookOpen, CheckCircle2, Clock, PlayCircle, FileText } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

type Lesson = {
  id: string;
  courseId: string;
  courseName: string;
  title: string;
  type: string;
  content: any;
  order: number;
  offlineAvailable: boolean;
};

type CourseContent = {
  id: string;
  title: string;
  type: string;
  order: number;
  isCompleted?: boolean;
};

type CourseDetail = {
  id: string;
  title: string;
  content: CourseContent[];
};

export default function LessonPage() {
  const params = useParams();
  const router = useRouter();
  const courseId = params.courseId as string;
  const lessonId = params.lessonId as string;

  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [courseDetail, setCourseDetail] = useState<CourseDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [completedContent, setCompletedContent] = useState<Set<string>>(new Set());

  // Fetch lesson and course details
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Fetch lesson details
        const lessonResponse = await fetch(`/api/student/course/${courseId}/lesson/${lessonId}`);
        if (!lessonResponse.ok) {
          throw new Error('Failed to load lesson');
        }
        const lessonData = await lessonResponse.json();
        setLesson(lessonData.lesson);

        // Fetch course details
        const courseResponse = await fetch(`/api/student/course/${courseId}`);
        if (!courseResponse.ok) {
          throw new Error('Failed to load course');
        }
        const courseData = await courseResponse.json();
        setCourseDetail(courseData.course || courseData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load content');
        console.error('Error fetching data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [courseId, lessonId]);

  // Mark current content as completed
  useEffect(() => {
    if (lesson && !completedContent.has(lessonId)) {
      const newCompleted = new Set(completedContent);
      newCompleted.add(lessonId);
      setCompletedContent(newCompleted);
    }
  }, [lesson, lessonId, completedContent]);

  const handleNavigateToContent = (contentId: string) => {
    router.push(`/student/course/${courseId}/lesson/${contentId}`);
  };

  const getContentIcon = (type: string) => {
    switch (type) {
      case 'VIDEO':
        return <PlayCircle className="h-4 w-4" />;
      case 'QUIZ':
        return <FileText className="h-4 w-4" />;
      case 'LESSON':
      case 'TEXT':
        return <BookOpen className="h-4 w-4" />;
      default:
        return <FileText className="h-4 w-4" />;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="flex items-center justify-center h-screen">
          <p className="text-muted-foreground">Loading lesson...</p>
        </div>
      </div>
    );
  }

  if (error || !lesson || !courseDetail) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-6xl mx-auto">
          <Button
            variant="ghost"
            onClick={() => router.push(`/student/course/${courseId}`)}
            className="mb-6"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Course
          </Button>
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error || 'Content not found'}</AlertDescription>
          </Alert>
        </div>
      </div>
    );
  }

  const totalContent = courseDetail.content?.length || 0;
  const completedCount = Array.from(completedContent).length;
  const progressPercentage = totalContent > 0 ? (completedCount / totalContent) * 100 : 0;

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b sticky top-0 z-40 py-4 shrink-0">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-between mb-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.push(`/student/course/${courseId}`)}
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </Button>
            <div className="text-right">
              <h1 className="text-lg font-bold text-gray-900">{lesson.courseName}</h1>
              <p className="text-sm text-muted-foreground">{lesson.title}</p>
            </div>
          </div>

          {/* Course Progress Bar */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-muted-foreground">
                Course Progress
              </span>
              <span className="text-xs font-medium text-muted-foreground">
                {completedCount} of {totalContent} completed
              </span>
            </div>
            <Progress value={progressPercentage} className="h-2" />
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* Main Content Area - 80% (left) */}
          <div className="lg:col-span-3">
            {/* VIDEO Card with Video Frame */}
            {lesson.type === 'VIDEO' && lesson.content?.videoUrl && (
              <Card className="overflow-hidden mb-6">
                <div className="bg-black aspect-video">
                  <iframe
                    src={lesson.content.videoUrl}
                    className="w-full h-full"
                    allowFullScreen
                    title={lesson.title}
                  />
                </div>
              </Card>
            )}

            {/* QUIZ Card */}
            {lesson.type === 'QUIZ' && (
              <Card className="overflow-hidden mb-6">
                <div className="bg-linear-to-br from-blue-500 to-blue-600 aspect-video flex items-center justify-center">
                  <div className="text-center text-white">
                    <FileText className="h-16 w-16 mx-auto mb-4" />
                    <p className="text-xl font-bold mb-2">Quiz</p>
                    <p className="text-blue-100 text-sm">Click below to take the quiz</p>
                  </div>
                </div>
              </Card>
            )}

            <Card className="overflow-hidden">
              {/* Content Info and Description */}
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-6">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant="outline">{lesson.type}</Badge>
                      {completedContent.has(lessonId) && (
                        <Badge variant="default" className="bg-green-600">
                          <CheckCircle2 className="h-3 w-3 mr-1" />
                          Completed
                        </Badge>
                      )}
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">{lesson.title}</h2>
                    <p className="text-gray-600 mb-4">
                      Lesson {lesson.order} of {totalContent}
                    </p>
                  </div>
                </div>

                {/* Lesson Content */}
                <div className="border-t pt-6">
                  {lesson.type === 'LESSON' || lesson.type === 'TEXT' ? (
                    <div className="prose prose-sm max-w-none text-gray-700">
                      {lesson.content?.text ? (
                        <div
                          className="whitespace-pre-wrap leading-relaxed"
                          dangerouslySetInnerHTML={{ __html: lesson.content.text }}
                        />
                      ) : (
                        <p className="text-muted-foreground italic">
                          No content available for this lesson.
                        </p>
                      )}
                    </div>
                  ) : lesson.type === 'VIDEO' && lesson.content?.description ? (
                    <div className="text-gray-700">
                      <h3 className="font-semibold mb-2">Description</h3>
                      <p>{lesson.content.description}</p>
                    </div>
                  ) : null}
                </div>

                {/* Navigation Buttons */}
                <div className="flex gap-3 mt-8 pt-6 border-t">
                  <Button
                    variant="outline"
                    onClick={() => {
                      const currentOrder = Number(lesson.order);
                      const prevContent = courseDetail.content?.find(
                        (c) => Number(c.order) === currentOrder - 1
                      );
                      if (prevContent) {
                        handleNavigateToContent(prevContent.id);
                      }
                    }}
                    disabled={Number(lesson.order) === 1}
                  >
                    ← Previous
                  </Button>
                  {Number(lesson.order) === totalContent ? (
                    <Button
                      onClick={async () => {
                        try {
                          // Mark course as completed
                          await fetch('/api/student/course/complete', {
                            method: 'POST',
                            headers: {
                              'Content-Type': 'application/json',
                            },
                            body: JSON.stringify({ courseId }),
                          });
                          // Navigate back to course page
                          router.push(`/student/course/${courseId}`);
                        } catch (error) {
                          console.error('Error completing course:', error);
                          // Still navigate back even if completion tracking fails
                          router.push(`/student/course/${courseId}`);
                        }
                      }}
                    >
                      Finish
                    </Button>
                  ) : (
                    <Button
                      onClick={() => {
                        const currentOrder = Number(lesson.order);
                        const nextContent = courseDetail.content?.find(
                          (c) => Number(c.order) === currentOrder + 1
                        );
                        if (nextContent) {
                          handleNavigateToContent(nextContent.id);
                        }
                      }}
                    >
                      Next →
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar Content List - 20% (right) */}
          <div className="lg:col-span-2">
            <Card className="sticky top-32">
              <CardContent className="p-6">
                <h3 className="font-bold text-lg mb-4 text-gray-900">Course Content</h3>
                <div className="space-y-2 max-h-96 overflow-y-auto">
                  {courseDetail.content && courseDetail.content.length > 0 ? (
                    courseDetail.content.map((content) => (
                      <button
                        key={content.id}
                        onClick={() => handleNavigateToContent(content.id)}
                        className={`w-full text-left p-3 rounded-lg transition-colors flex items-start gap-3 ${
                          content.id === lessonId
                            ? 'bg-blue-50 border-l-4 border-blue-600'
                            : 'hover:bg-gray-50 border-l-4 border-transparent'
                        }`}
                      >
                        <div className="shrink-0 mt-1">
                          {completedContent.has(content.id) ? (
                            <CheckCircle2 className="h-5 w-5 text-green-600" />
                          ) : (
                            getContentIcon(content.type)
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p
                            className={`text-sm font-medium truncate ${
                              content.id === lessonId
                                ? 'text-blue-600'
                                : 'text-gray-900'
                            }`}
                          >
                            {content.order}. {content.title}
                          </p>
                          <p className="text-xs text-gray-500">{content.type}</p>
                        </div>
                      </button>
                    ))
                  ) : (
                    <p className="text-sm text-muted-foreground">No content available</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
        </div>
      </div>
    </div>
  );
}
