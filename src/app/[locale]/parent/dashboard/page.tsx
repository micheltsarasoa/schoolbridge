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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Users, BookOpen, Clock, TrendingUp, User } from 'lucide-react';

interface Child {
  id: string;
  name: string;
  email: string;
}

interface ChildProgress {
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

export default function ParentDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [children, setChildren] = useState<Child[]>([]);
  const [selectedChildId, setSelectedChildId] = useState<string>('');
  const [childProgress, setChildProgress] = useState<ChildProgress | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    } else if (status === 'authenticated' && session?.user?.role !== 'PARENT') {
      router.push('/dashboard');
    }
  }, [status, session, router]);

  useEffect(() => {
    if (status === 'authenticated') {
      fetchChildren();
    }
  }, [status]);

  useEffect(() => {
    if (selectedChildId) {
      fetchChildProgress(selectedChildId);
    }
  }, [selectedChildId]);

  const fetchChildren = async () => {
    try {
      const res = await fetch('/api/profile/relationships');
      if (res.ok) {
        const data = await res.json();
        // Filter for student relationships
        const studentRelationships = data.relationships.filter(
          (rel: any) => rel.relationshipType === 'PARENT_CHILD' && rel.isVerified
        );
        const childrenList = studentRelationships.map((rel: any) => rel.relatedUser);
        setChildren(childrenList);

        // Auto-select first child
        if (childrenList.length > 0 && !selectedChildId) {
          setSelectedChildId(childrenList[0].id);
        }
      }
    } catch (error) {
      console.error('Failed to fetch children:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchChildProgress = async (studentId: string) => {
    try {
      const res = await fetch(`/api/progress/stats?studentId=${studentId}`);
      if (res.ok) {
        const data = await res.json();
        setChildProgress(data.stats);
      }
    } catch (error) {
      console.error('Failed to fetch child progress:', error);
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

  const selectedChild = children.find(c => c.id === selectedChildId);

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    if (hours > 0) return `${hours}h ${minutes}m`;
    return `${minutes}m`;
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Parent Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back, {session?.user?.name}
          </p>
        </div>
        {children.length > 0 && (
          <div className="flex items-center gap-2">
            <User className="h-4 w-4 text-muted-foreground" />
            <Select value={selectedChildId} onValueChange={setSelectedChildId}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Select a child" />
              </SelectTrigger>
              <SelectContent>
                {children.map((child) => (
                  <SelectItem key={child.id} value={child.id}>
                    {child.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}
      </div>

      {children.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Users className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-lg font-medium mb-2">No children linked</p>
            <p className="text-sm text-muted-foreground mb-4">
              Link your children to see their progress
            </p>
            <Button asChild>
              <a href="/profile/relationships">Manage Relationships</a>
            </Button>
          </CardContent>
        </Card>
      ) : selectedChild ? (
        <>
          {/* Stats Cards */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Courses</CardTitle>
                <BookOpen className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {childProgress?.totalCourses || 0}
                </div>
                <p className="text-xs text-muted-foreground">
                  {childProgress?.completedCourses || 0} completed
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Average Progress</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {childProgress?.averageCompletionPercentage || 0}%
                </div>
                <p className="text-xs text-muted-foreground">
                  Across all courses
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
                  {formatTime(childProgress?.totalTimeSpent || 0)}
                </div>
                <p className="text-xs text-muted-foreground">
                  Total time spent
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">In Progress</CardTitle>
                <BookOpen className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {childProgress?.inProgressCourses || 0}
                </div>
                <p className="text-xs text-muted-foreground">
                  Active courses
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Course Progress */}
          <Card>
            <CardHeader>
              <CardTitle>{selectedChild.name}'s Courses</CardTitle>
              <CardDescription>
                Track your child's progress across all enrolled courses
              </CardDescription>
            </CardHeader>
            <CardContent>
              {!childProgress || childProgress.courses.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12">
                  <BookOpen className="h-12 w-12 text-muted-foreground mb-4" />
                  <p className="text-lg font-medium mb-2">No courses yet</p>
                  <p className="text-sm text-muted-foreground">
                    {selectedChild.name} hasn't been assigned any courses yet
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {childProgress.courses.map((course) => (
                    <div
                      key={course.courseId}
                      className="border rounded-lg p-4 space-y-3 hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="font-semibold">{course.courseTitle}</h3>
                          <p className="text-sm text-muted-foreground mt-1">
                            {course.completedContent} of {course.totalContent} items completed
                          </p>
                        </div>
                        <Badge variant={course.completionPercentage === 100 ? 'default' : 'secondary'}>
                          {course.completionPercentage}%
                        </Badge>
                      </div>

                      <div>
                        <div className="flex items-center justify-between text-sm mb-2">
                          <span className="text-muted-foreground">Progress</span>
                          <span className="font-medium">{course.completionPercentage}%</span>
                        </div>
                        <Progress value={course.completionPercentage} />
                      </div>

                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          <span>{formatTime(course.totalTimeSpent)} spent</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* All Children Overview */}
          {children.length > 1 && (
            <Card>
              <CardHeader>
                <CardTitle>All Children Overview</CardTitle>
                <CardDescription>
                  Quick overview of all your children's progress
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {children.map((child) => (
                    <div
                      key={child.id}
                      className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                        child.id === selectedChildId ? 'border-primary bg-primary/5' : 'hover:bg-muted/50'
                      }`}
                      onClick={() => setSelectedChildId(child.id)}
                    >
                      <h4 className="font-semibold mb-2">{child.name}</h4>
                      <p className="text-sm text-muted-foreground">
                        Click to view details
                      </p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </>
      ) : null}
    </div>
  );
}
