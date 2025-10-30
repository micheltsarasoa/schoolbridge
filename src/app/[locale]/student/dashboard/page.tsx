'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import { BookOpen, Clock, TrendingUp, Target, Play } from 'lucide-react';
import Link from 'next/link';

interface Assignment {
  id: string;
  course: {
    id: string;
    title: string;
    description: string;
    thumbnailUrl?: string;
  };
  dueDate: string | null;
  assignedAt: string;
}

interface ProgressStats {
  studentId: string;
  totalCourses: number;
  completedCourses: number;
  inProgressCourses: number;
  averageCompletionPercentage: number;
  totalTimeSpent: number;
  courses: {
    courseId: string;
    courseTitle: string;
    totalContent: number;
    completedContent: number;
    completionPercentage: number;
    totalTimeSpent: number;
  }[];
}

export default function StudentDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [progressStats, setProgressStats] = useState<ProgressStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    } else if (status === 'authenticated' && session?.user?.role !== 'STUDENT') {
      router.push('/dashboard');
    }
  }, [status, session, router]);

  useEffect(() => {
    if (status === 'authenticated') {
      fetchData();
    }
  }, [status]);

  const fetchData = async () => {
    try {
      const [assignmentsRes, statsRes] = await Promise.all([
        fetch('/api/assignments'),
        fetch('/api/progress/stats'),
      ]);

      if (assignmentsRes.ok) {
        const data = await assignmentsRes.json();
        setAssignments(data.assignments || []);
      }

      if (statsRes.ok) {
        const data = await statsRes.json();
        setProgressStats(data.stats);
      }
    } catch (error) {
      console.error('Failed to fetch data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (status === 'loading' || loading) {
    return (
      <div className="container mx-auto p-6 space-y-6">
        <Skeleton className="h-12 w-64" />
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-32" />
          ))}
        </div>
        <Skeleton className="h-96" />
      </div>
    );
  }

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    if (hours > 0) return `${hours}h ${minutes}m`;
    return `${minutes}m`;
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Student Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome back, {session?.user?.name}
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">My Courses</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {progressStats?.totalCourses || 0}
            </div>
            <p className="text-xs text-muted-foreground">
              {progressStats?.completedCourses || 0} completed
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Overall Progress</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {progressStats?.averageCompletionPercentage || 0}%
            </div>
            <p className="text-xs text-muted-foreground">
              Average completion
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Study Time</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatTime(progressStats?.totalTimeSpent || 0)}
            </div>
            <p className="text-xs text-muted-foreground">
              Total time spent
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">In Progress</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {progressStats?.inProgressCourses || 0}
            </div>
            <p className="text-xs text-muted-foreground">
              Active courses
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Content Tabs */}
      <Tabs defaultValue="courses" className="space-y-4">
        <TabsList>
          <TabsTrigger value="courses">
            My Courses ({progressStats?.courses?.length || 0})
          </TabsTrigger>
          <TabsTrigger value="assignments">
            All Assignments ({assignments.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="courses" className="space-y-4">
          {!progressStats || progressStats.courses.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <BookOpen className="h-12 w-12 text-muted-foreground mb-4" />
                <p className="text-lg font-medium mb-2">No courses yet</p>
                <p className="text-sm text-muted-foreground">
                  Your teacher will assign courses to you
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4">
              {progressStats.courses.map((course) => (
                <Card key={course.courseId} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-lg">{course.courseTitle}</CardTitle>
                        <CardDescription className="mt-1">
                          {course.completedContent} of {course.totalContent} items completed
                        </CardDescription>
                      </div>
                      <Badge variant={course.completionPercentage === 100 ? 'default' : 'secondary'}>
                        {course.completionPercentage}%
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <div className="flex items-center justify-between text-sm mb-2">
                        <span className="text-muted-foreground">Progress</span>
                        <span className="font-medium">{course.completionPercentage}%</span>
                      </div>
                      <Progress value={course.completionPercentage} />
                    </div>

                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Clock className="h-4 w-4" />
                        <span>{formatTime(course.totalTimeSpent)} spent</span>
                      </div>
                      <Button asChild size="sm">
                        <Link href={`/student/courses/${course.courseId}`}>
                          <Play className="mr-2 h-4 w-4" />
                          {course.completionPercentage === 0 ? 'Start' : 'Continue'}
                        </Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="assignments" className="space-y-4">
          {assignments.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <p className="text-muted-foreground">No assignments yet</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4">
              {assignments.map((assignment) => (
                <Card key={assignment.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-lg">{assignment.course.title}</CardTitle>
                        <CardDescription className="mt-1">
                          {assignment.course.description || 'No description'}
                        </CardDescription>
                      </div>
                      {assignment.dueDate && (
                        <Badge variant="outline">
                          Due: {new Date(assignment.dueDate).toLocaleDateString()}
                        </Badge>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">
                        Assigned: {new Date(assignment.assignedAt).toLocaleDateString()}
                      </span>
                      <Button asChild size="sm">
                        <Link href={`/student/courses/${assignment.course.id}`}>
                          View Course
                        </Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
