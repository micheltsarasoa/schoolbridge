'use client';

import { Activity, BookOpen, GraduationCap, CheckCircle, Clock, ArrowUpRight } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export default function StudentDashboardPage() {
  // Dummy data for student dashboard
  const studentData = {
    attendanceRate: 92,
    quizzesCompleted: 15,
    totalQuizzes: 20,
    daysUntilYearEnd: 45,
    averageGrade: 'B+',
    upcomingDeadlines: 3,
    currentClass: {
      subject: 'Mathematics',
      teacher: 'Mr. Jean-Luc',
      time: '10:00 AM - 11:00 AM',
      location: 'Room 201',
      countdown: '15 minutes',
    },
    courses: [
      {
        title: 'Algebra I',
        teacher: 'Mr. Jean-Luc',
        progress: 75,
        nextAssignment: 'Chapter 5 Quiz',
        dueDate: 'Tomorrow',
        offline: true,
      },
      {
        title: 'Physics Basics',
        teacher: 'Ms. Sophie',
        progress: 60,
        nextAssignment: 'Lab Report 3',
        dueDate: 'Friday',
        offline: false,
      },
      {
        title: 'Madagascar History',
        teacher: 'Mr. Rakoto',
        progress: 90,
        nextAssignment: 'Final Project',
        dueDate: 'Next Week',
        offline: true,
      },
    ],
    assignments: [
      {
        title: 'Chapter 5 Quiz',
        course: 'Algebra I',
        dueDate: 'Tomorrow',
        priority: 'High',
        status: 'To Do',
      },
      {
        title: 'Lab Report 3',
        course: 'Physics Basics',
        dueDate: 'Friday',
        priority: 'Medium',
        status: 'To Do',
      },
      {
        title: 'Essay on Colonialism',
        course: 'Madagascar History',
        dueDate: 'Next Monday',
        priority: 'High',
        status: 'In Progress',
      },
    ],
    upcomingExams: [
      {
        subject: 'Mathematics',
        name: 'Mid-Term Exam',
        date: 'Nov 15',
        time: '9:00 AM',
        status: 'Studying',
      },
      {
        subject: 'Physics',
        name: 'Chapter 4 Test',
        date: 'Nov 20',
        time: '1:00 PM',
        status: 'Not Started',
      },
    ],
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Student Dashboard</h1>

      {/* Top Row - Overview Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Attendance Rate</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{studentData.attendanceRate}%</div>
            <p className="text-xs text-muted-foreground">Last 30 days</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Quizzes Completed</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{studentData.quizzesCompleted}/{studentData.totalQuizzes}</div>
            <p className="text-xs text-muted-foreground">Total this semester</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Days Until Year End</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{studentData.daysUntilYearEnd}</div>
            <p className="text-xs text-muted-foreground">Academic year ends</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Grade</CardTitle>
            <GraduationCap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{studentData.averageGrade}</div>
            <p className="text-xs text-muted-foreground">Overall performance</p>
          </CardContent>
        </Card>
      </div>

      {/* Section: Today's Schedule */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Today's Schedule</CardTitle>
          <Button variant="outline" size="sm">View Full Week</Button>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 border rounded-md bg-secondary/20">
              <div>
                <p className="text-lg font-semibold">{studentData.currentClass.subject}</p>
                <p className="text-sm text-muted-foreground">{studentData.currentClass.teacher} - {studentData.currentClass.location}</p>
                <p className="text-sm text-muted-foreground">{studentData.currentClass.time}</p>
              </div>
              <Badge variant="default">Starts in {studentData.currentClass.countdown}</Badge>
            </div>
            {/* Placeholder for full schedule list */}
            <p className="text-sm text-muted-foreground">... Full schedule for today ...</p>
          </div>
        </CardContent>
      </Card>

      {/* Section: My Courses */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>My Courses</CardTitle>
          <Button variant="outline" size="sm">View All Courses</Button>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {studentData.courses.map((course, index) => (
              <Card key={index}>
                <CardHeader>
                  <CardTitle className="text-lg">{course.title}</CardTitle>
                  <CardDescription>{course.teacher}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between text-sm mb-2">
                    <span>Progress</span>
                    <span>{course.progress}%</span>
                  </div>
                  <Progress value={course.progress} className="h-2" />
                  <p className="text-xs text-muted-foreground mt-2">Next: {course.nextAssignment} ({course.dueDate})</p>
                </CardContent>
                <div className="flex justify-between items-center p-4 pt-0">
                  <Button variant="secondary" size="sm">Continue Learning</Button>
                  {course.offline && <Badge variant="outline">Offline</Badge>}
                </div>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Section: Assignments & Quizzes */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Assignments & Quizzes</CardTitle>
          <Button variant="outline" size="sm">View All</Button>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {studentData.assignments.map((assignment, index) => (
              <div key={index} className="flex items-center justify-between p-3 border rounded-md">
                <div>
                  <p className="font-semibold">{assignment.title}</p>
                  <p className="text-sm text-muted-foreground">{assignment.course} - Due {assignment.dueDate}</p>
                </div>
                <Badge variant={assignment.priority === 'High' ? 'destructive' : assignment.priority === 'Medium' ? 'warning' : 'outline'}>{assignment.status}</Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Section: Upcoming Exams */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Upcoming Exams</CardTitle>
          <Button variant="outline" size="sm">View All Exams</Button>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {studentData.upcomingExams.map((exam, index) => (
              <div key={index} className="flex items-center justify-between p-3 border rounded-md">
                <div>
                  <p className="font-semibold">{exam.name}</p>
                  <p className="text-sm text-muted-foreground">{exam.subject} - {exam.date} at {exam.time}</p>
                </div>
                <Badge variant="secondary">{exam.status}</Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
