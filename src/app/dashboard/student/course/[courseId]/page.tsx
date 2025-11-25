'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ArrowLeft, AlertCircle, BookOpen, Users, Clock } from 'lucide-react';

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
  description?: string;
  subject: string;
  teacher: string;
  teacherId?: string;
  progress: number;
  contentCount: number;
  content: CourseContent[];
};

type CourseResponse = {
  course: CourseDetail;
  stats: {
    totalContent: number;
    completedContent: number;
  };
};

export default function CourseDetailPage() {
  const params = useParams();
  const router = useRouter();
  const courseId = params.courseId as string;

  const [course, setCourse] = useState<CourseDetail | null>(null);
  const [stats, setStats] = useState<CourseResponse['stats'] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/student/course/${courseId}`);

        if (!response.ok) {
          throw new Error('Failed to load course details');
        }

        const data: CourseResponse = await response.json();
        setCourse(data.course);
        setStats(data.stats);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load course details');
        console.error('Error fetching course:', err);
      } finally {
        setLoading(false);
      }
    };

    if (courseId) {
      fetchCourse();
    }
  }, [courseId]);

  const handleContentClick = (contentId: string, contentType: string) => {
    // Route to appropriate page based on content type
    switch (contentType) {
      case 'LESSON':
        router.push(`/student/course/${courseId}/lesson/${contentId}`);
        break;
      case 'ASSIGNMENT':
        router.push(`/student/course/${courseId}/assignment/${contentId}`);
        break;
      case 'QUIZ':
        router.push(`/student/quizzes`);
        break;
      case 'RESOURCE':
        router.push(`/student/course/${courseId}/resource/${contentId}`);
        break;
      default:
        break;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-linear-to-br from-slate-50 to-slate-100">
        <div className="max-w-6xl mx-auto p-6">
          <Button
            variant="ghost"
            onClick={() => router.back()}
            className="mb-6"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
          <div className="flex items-center justify-center h-64">
            <p className="text-muted-foreground">Loading course details...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !course) {
    return (
      <div className="min-h-screen bg-linear-to-br from-slate-50 to-slate-100">
        <div className="max-w-6xl mx-auto p-6">
          <Button
            variant="ghost"
            onClick={() => router.back()}
            className="mb-6"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error || 'Course not found'}</AlertDescription>
          </Alert>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 to-slate-100">
      <div className="max-w-6xl mx-auto p-6">
        {/* Header */}
        <Button
          variant="ghost"
          onClick={() => router.push('/student/courses')}
          className="mb-6"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Courses
        </Button>

        {/* Course Info Card */}
        <Card className="mb-6 border-2">
          <CardHeader className="bg-linear-to-r from-blue-50 to-indigo-50">
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <CardTitle className="text-3xl mb-2">{course.title}</CardTitle>
                <CardDescription className="text-base">{course.subject}</CardDescription>
              </div>
            </div>
          </CardHeader>

          <CardContent className="pt-6">
            {course.description && (
              <p className="text-muted-foreground mb-6">{course.description}</p>
            )}

            <div className="grid grid-cols-3 gap-4 mb-6">
              <div className="flex items-center gap-3">
                <Users className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Instructor</p>
                  <p className="font-medium">{course.teacher}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <BookOpen className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Content Items</p>
                  <p className="font-medium">{stats?.totalContent || course.contentCount}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Clock className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Progress</p>
                  <p className="font-medium">{course.progress}%</p>
                </div>
              </div>
            </div>

            {/* Progress Bar */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium">Course Progress</span>
                <span className="text-sm text-muted-foreground">
                  {stats?.completedContent || 0} of {stats?.totalContent || course.contentCount} completed
                </span>
              </div>
              <Progress value={course.progress} className="h-3" />
            </div>
          </CardContent>
        </Card>

        {/* Course Content */}
        <div className="grid gap-6">
          <h2 className="text-2xl font-bold">Course Content</h2>

          {course.content && course.content.length > 0 ? (
            <div className="space-y-4">
              {course.content.map((content, index) => (
                <Card
                  key={content.id}
                  className="hover:shadow-md transition-shadow cursor-pointer"
                  onClick={() => handleContentClick(content.id, content.type)}
                >
                  <CardContent className="pt-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <span className="font-medium">{index + 1}.</span>
                          <h3 className="font-semibold text-lg">{content.title}</h3>
                          <Badge variant="outline">{content.type}</Badge>
                          {content.isCompleted && (
                            <Badge variant="default" className="bg-green-600">
                              Completed
                            </Badge>
                          )}
                        </div>
                      </div>
                      <Button onClick={(e) => {
                        e.stopPropagation();
                        handleContentClick(content.id, content.type);
                      }}>
                        {content.type === 'QUIZ' ? 'Take Quiz' : 'View'}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Alert>
              <AlertDescription>No content available for this course yet.</AlertDescription>
            </Alert>
          )}
        </div>
      </div>
    </div>
  );
}
