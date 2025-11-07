"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useEffect, useState } from 'react';
import { Activity, BookOpen, Users, CalendarDays, ArrowUpRight, AlertCircle } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';

type GradingQueueItem = {
  id: string;
  studentName: string;
  studentEmail: string;
  courseTitle: string;
  contentTitle: string;
  submittedAt: string;
};

export default function TeacherDashboard() {
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
    </div>
  );
}