"use client"

// Import from Shadcn
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

// Import Icon
import { Activity, BookOpen, GraduationCap, CheckCircle, Clock, ArrowUpRight, AlertCircle, Users } from 'lucide-react';

//
import { useEffect, useState } from 'react';
import { DashboardCard } from '@/components/dashboard/common/dashboard-card';
import { CourseMinimalistCard } from '@/components/dashboard/common/course-minimalist-card';

type DashboardStudentData = {
  stats: {
    attendanceRate: number;
    submissionsCompleted: number;
    totalSubmissions: number;
    daysUntilYearEnd: number;
    averageGrade: string | null;
  };
  courses: Array<{
    id: string;
    title: string;
    teacher: string;
    subject: string;
    progress: number;
    lastAccessed: string;
    currentModule: string | null;
  }>;
  assignments: Array<{
    id: string;
    courseId: string;
    courseTitle: string;
    dueDate: string;
    assignedAt: string;
  }>;
  recentSubmissions: Array<{
    id: string;
    courseTitle: string;
    contentTitle: string;
    grade: number;
    gradedAt: string | null;
    feedback: string | null;
  }>;
};

export default function StudentDashboard() {
  const [dashboardData, setDashboardData] = useState<DashboardStudentData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/student/dashboard');
      if (!response.ok) throw new Error('Failed to fetch dashboard data');
      const data = await response.json();
      setDashboardData(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load dashboard');
    } finally {
      setIsLoading(false);
    }
  };

    const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = date.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Tomorrow';
    if (diffDays < 7) return `${diffDays} days`;
    return date.toLocaleDateString();
  };

  const getPriorityFromDueDate = (dueDate: string): 'High' | 'Medium' | 'Low' => {
    const date = new Date(dueDate);
    const now = new Date();
    const diffDays = Math.ceil((date.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

    if (diffDays <= 2) return 'High';
    if (diffDays <= 7) return 'Medium';
    return 'Low';
  };

  const getGradeLabel = (grade: number): string => {
    if (grade >= 90) return 'A';
    if (grade >= 80) return 'B';
    if (grade >= 70) return 'C';
    if (grade >= 60) return 'D';
    return 'F';
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-4 w-24" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-8 w-16" />
              </CardContent>
            </Card>
          ))}
        </div>
        <Skeleton className="h-[400px] w-full" />
      </div>
    );
  }

  if (error || !dashboardData) {
    return (
      <div className="space-y-4">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error || 'Failed to load dashboard'}</AlertDescription>
        </Alert>
        <Button onClick={fetchDashboardData}>Retry</Button>
      </div>
    );
  }

  const { stats, courses, assignments, recentSubmissions } = dashboardData;
  return (
    <div className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-4">
        <DashboardCard
          title="Attendance Rate"
          value={`${stats.attendanceRate}%`}
          description="Last 30 days"
          icon={CheckCircle}
        />
        <DashboardCard
          title="Submissions"
          value={`${stats.submissionsCompleted}/${stats.totalSubmissions}`}
          description="Graded submissions"
          icon={BookOpen}
        />
        <DashboardCard 
          title="Days Until Year End"
          value={stats.daysUntilYearEnd}
          description="Academic year ends"
          icon={Clock}
          />
        <DashboardCard 
          title="Average Grade"
          value={
            stats.averageGrade
                ? `${getGradeLabel(parseFloat(stats.averageGrade))} (${stats.averageGrade})`
                : 'N/A'}
          description="Overall performance"
          icon={GraduationCap}
          />
      </div>

      <div className="grid gap-4 md:gap-8 lg:grid-cols-2 xl:grid-cols-3">
        {/* My Courses */}
        <Card className="xl:col-span-2">
          <CardHeader className="flex flex-row items-center">
            <div className="grid gap-2">
              <CardTitle>My Courses</CardTitle>
              <CardDescription>Your enrolled courses for the current semester.</CardDescription>
            </div>
            <Button asChild size="sm" className="ml-auto gap-1">
              <a href="/student/courses">
                View All
                <ArrowUpRight className="h-4 w-4" />
              </a>
            </Button>
          </CardHeader>
          <CardContent>
            {courses.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-8">
                No courses enrolled yet
              </p>
            ) : (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {courses.map((course) => (
                  <CourseMinimalistCard key={course.id} course={course} />
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Upcoming Assignments */}
        <Card>
          <CardHeader>
            <CardTitle>Upcoming Assignments</CardTitle>
            <CardDescription>Due soon</CardDescription>
          </CardHeader>
          <CardContent>
            {assignments.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-8">
                No upcoming assignments
              </p>
            ) : (
              <div className="grid gap-4">
                {assignments.map((assignment) => {
                  const priority = getPriorityFromDueDate(assignment.dueDate);
                  return (
                    <div
                      key={assignment.id}
                      className="flex items-center justify-between p-3 border rounded-md"
                    >
                      <div className="flex-1">
                        <p className="font-semibold">{assignment.courseTitle}</p>
                        <p className="text-sm text-muted-foreground">
                          Due {formatDate(assignment.dueDate)}
                        </p>
                      </div>
                      <Badge
                        variant={
                          priority === 'High'
                            ? 'destructive'
                            : priority === 'Medium'
                            ? 'secondary'
                            : 'outline'
                        }
                      >
                        {priority}
                      </Badge>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}