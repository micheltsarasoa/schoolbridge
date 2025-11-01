'use client';

import { useEffect, useState } from 'react';
import { Activity, BookOpen, Users, CalendarDays, ArrowUpRight, AlertCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';

type GradingQueueItem = {
  id: string;
  studentName: string;
  studentEmail: string;
  courseTitle: string;
  contentTitle: string;
  submittedAt: string;
};

export default function TeacherDashboardPage() {
  const [gradingQueue, setGradingQueue] = useState<GradingQueueItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchGradingQueue();
  }, []);

  const fetchGradingQueue = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/submissions');
      if (!response.ok) throw new Error('Failed to fetch grading queue');
      const data = await response.json();
      setGradingQueue(data.slice(0, 5)); // Show top 5
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load grading queue');
    } finally {
      setIsLoading(false);
    }
  };

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 60) return `${diffMins} minutes ago`;
    if (diffHours < 24) return `${diffHours} hours ago`;
    if (diffDays === 1) return 'Yesterday';
    return `${diffDays} days ago`;
  };

  // Dummy data for other sections (to be replaced later)
  const teacherData = {
    classesToday: 3,
    pendingGrading: gradingQueue.length,
    absentStudentsToday: 2,
    upcomingDeadlines: 5,
    currentClass: {
      name: 'Grade 5 - Math',
      subject: 'Mathematics',
      time: '10:00 AM - 11:00 AM',
      room: 'Room 201',
      studentCount: 28,
    },
    classAlerts: [
      {
        studentName: 'Bob Johnson',
        type: 'Falling behind',
        class: 'Grade 5 - Math',
        recommendation: 'Provide extra support',
      },
    ],
    upcomingWeek: [
      { date: 'Nov 15', event: 'Parent-Teacher Meeting' },
      { date: 'Nov 17', event: 'Chapter 6 Test - Math' },
    ],
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Teacher Dashboard</h1>

      {/* Top Row - Quick Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Classes Today</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{teacherData.classesToday}</div>
            <p className="text-xs text-muted-foreground">Scheduled</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Grading</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-8 w-12" />
            ) : (
              <>
                <div className="text-2xl font-bold">{gradingQueue.length}</div>
                <p className="text-xs text-muted-foreground">Assignments to review</p>
              </>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Absent Students Today</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{teacherData.absentStudentsToday}</div>
            <p className="text-xs text-muted-foreground">Marked absent</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Upcoming Deadlines</CardTitle>
            <CalendarDays className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{teacherData.upcomingDeadlines}</div>
            <p className="text-xs text-muted-foreground">Next 7 days</p>
          </CardContent>
        </Card>
      </div>

      {/* Section: Today's Classes */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Current Class</CardTitle>
          <Button variant="outline" size="sm" asChild>
            <a href="/teacher/attendance">Take Attendance</a>
          </Button>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <p className="text-lg font-semibold">{teacherData.currentClass.name}</p>
            <p className="text-sm text-muted-foreground">
              {teacherData.currentClass.subject} - {teacherData.currentClass.room}
            </p>
            <p className="text-sm text-muted-foreground">
              {teacherData.currentClass.time} ({teacherData.currentClass.studentCount} students)
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Section: Grading Queue */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Grading Queue</CardTitle>
            <CardDescription>Submissions waiting to be graded</CardDescription>
          </div>
          <Button variant="outline" size="sm" asChild>
            <a href="/teacher/grading">
              View All
              <ArrowUpRight className="ml-1 h-4 w-4" />
            </a>
          </Button>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="flex items-center gap-4 p-3 border rounded-md">
                  <Skeleton className="h-10 w-10 rounded-full" />
                  <div className="space-y-2 flex-1">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-3 w-48" />
                  </div>
                  <Skeleton className="h-8 w-20" />
                </div>
              ))}
            </div>
          ) : error ? (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          ) : gradingQueue.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No submissions pending</p>
              <p className="text-sm text-muted-foreground mt-2">All caught up!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {gradingQueue.map((item) => (
                <div key={item.id} className="flex items-center justify-between p-3 border rounded-md hover:bg-muted/50 transition-colors">
                  <div className="flex items-center gap-3 flex-1">
                    <Avatar className="h-10 w-10">
                      <AvatarFallback>{item.studentName.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold">{item.studentName}</p>
                      <p className="text-sm text-muted-foreground truncate">
                        {item.contentTitle} ({item.courseTitle})
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Submitted {formatTimeAgo(item.submittedAt)}
                      </p>
                    </div>
                  </div>
                  <Button variant="secondary" size="sm" asChild>
                    <a href={`/teacher/grading?submission=${item.id}`}>Grade Now</a>
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Section: Class Performance Alerts */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Class Performance Alerts</CardTitle>
          <Button variant="outline" size="sm">
            View Analytics
          </Button>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {teacherData.classAlerts.map((alert, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 border rounded-md bg-red-500/10"
              >
                <div>
                  <p className="font-semibold text-red-600">
                    {alert.studentName} - {alert.type}
                  </p>
                  <p className="text-sm text-muted-foreground">{alert.class}</p>
                  <p className="text-xs text-muted-foreground">
                    Recommendation: {alert.recommendation}
                  </p>
                </div>
                <Button variant="ghost" size="sm">
                  View Details
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Section: This Week */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>This Week</CardTitle>
          <Button variant="outline" size="sm">
            View Full Planner
          </Button>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {teacherData.upcomingWeek.map((item, index) => (
              <div key={index} className="flex items-center justify-between text-sm">
                <p className="font-medium">{item.date}</p>
                <p>{item.event}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
