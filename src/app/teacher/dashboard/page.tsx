'use client';

import { Activity, BookOpen, Users, CalendarDays, BellRing, ArrowUpRight } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

export default function TeacherDashboardPage() {
  // Dummy data for teacher dashboard
  const teacherData = {
    classesToday: 3,
    pendingGrading: 12,
    absentStudentsToday: 2,
    upcomingDeadlines: 5,
    currentClass: {
      name: 'Grade 5 - Math',
      subject: 'Mathematics',
      time: '10:00 AM - 11:00 AM',
      room: 'Room 201',
      studentCount: 28,
    },
    gradingQueue: [
      {
        studentName: 'John Doe',
        assignment: 'Chapter 5 Quiz',
        course: 'Algebra I',
        submittedDate: '2 hours ago',
        timeWaiting: '2 hours',
      },
      {
        studentName: 'Alice Williams',
        assignment: 'Lab Report 3',
        course: 'Physics Basics',
        submittedDate: 'Yesterday',
        timeWaiting: '1 day',
      },
    ],
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
            <div className="text-2xl font-bold">{teacherData.pendingGrading}</div>
            <p className="text-xs text-muted-foreground">Assignments to review</p>
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
          <Button variant="outline" size="sm">Take Attendance</Button>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <p className="text-lg font-semibold">{teacherData.currentClass.name}</p>
            <p className="text-sm text-muted-foreground">{teacherData.currentClass.subject} - {teacherData.currentClass.room}</p>
            <p className="text-sm text-muted-foreground">{teacherData.currentClass.time} ({teacherData.currentClass.studentCount} students)</p>
          </div>
        </CardContent>
      </Card>

      {/* Section: Grading Queue */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Grading Queue</CardTitle>
          <Button variant="outline" size="sm">View All Pending</Button>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {teacherData.gradingQueue.map((item, index) => (
              <div key={index} className="flex items-center justify-between p-3 border rounded-md">
                <div className="flex items-center gap-3">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback>{item.studentName.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-semibold">{item.studentName}</p>
                    <p className="text-sm text-muted-foreground">{item.assignment} ({item.course})</p>
                  </div>
                </div>
                <div className="text-right">
                  <Badge variant="secondary">Submitted {item.submittedDate}</Badge>
                  <p className="text-xs text-muted-foreground">Waiting {item.timeWaiting}</p>
                  <Button variant="ghost" size="sm">Grade Now</Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Section: Class Performance Alerts */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Class Performance Alerts</CardTitle>
          <Button variant="outline" size="sm">View Analytics</Button>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {teacherData.classAlerts.map((alert, index) => (
              <div key={index} className="flex items-center justify-between p-3 border rounded-md bg-red-500/10">
                <div>
                  <p className="font-semibold text-red-600">{alert.studentName} - {alert.type}</p>
                  <p className="text-sm text-muted-foreground">{alert.class}</p>
                  <p className="text-xs text-muted-foreground">Recommendation: {alert.recommendation}</p>
                </div>
                <Button variant="ghost" size="sm">View Details</Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Section: This Week */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>This Week</CardTitle>
          <Button variant="outline" size="sm">View Full Planner</Button>
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
