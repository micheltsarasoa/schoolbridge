'use client';

import { Activity, BookOpen, Users, CalendarDays, BellRing, ArrowUpRight, CheckCircle, GraduationCap } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';

export default function ParentDashboardPage() {
  // Dummy data for parent dashboard
  const parentData = {
    children: [
      {
        id: 'child1',
        name: 'Student A',
        attendanceRate: 95,
        averageGrade: 'A-',
        pendingAssignments: 2,
        unreadMessages: 1,
        avatar: '/placeholder.svg?height=32&width=32',
      },
      {
        id: 'child2',
        name: 'Student B',
        attendanceRate: 88,
        averageGrade: 'B+',
        pendingAssignments: 3,
        unreadMessages: 0,
        avatar: '/placeholder.svg?height=32&width=32',
      },
    ],
    selectedChildId: 'child1',
    recentGrades: [
      { subject: 'Math', assessment: 'Quiz 3', grade: '92%', date: 'Oct 28', teacherComment: 'Great work!' },
      { subject: 'Science', assessment: 'Lab Report', grade: '85%', date: 'Oct 27', teacherComment: 'Good effort.' },
    ],
    attendanceSummary: [
      { day: 'Mon', status: 'Present' },
      { day: 'Tue', status: 'Present' },
      { day: 'Wed', status: 'Absent' },
      { day: 'Thu', status: 'Present' },
      { day: 'Fri', status: 'Late' },
    ],
    upcomingEvents: [
      { name: 'Parent-Teacher Conference', date: 'Nov 15', time: '3:00 PM', type: 'Meeting' },
      { name: 'School Play', date: 'Dec 10', time: '6:00 PM', type: 'Event' },
    ],
    schoolNotices: [
      { title: 'School Holiday Announced', date: 'Oct 29', priority: 'High', read: false },
      { title: 'Annual Sports Day', date: 'Oct 25', priority: 'Normal', read: true },
    ],
    teacherMessages: [
      { teacher: 'Mr. Jean-Luc', subject: 'Regarding Student A\'s progress', preview: 'Student A is doing well...', date: 'Oct 29', unread: true },
    ],
    pendingActions: [
      { type: 'Permission Slip', title: 'Field Trip Consent Form', dueDate: 'Nov 10' },
    ],
  };

  const selectedChild = parentData.children.find(child => child.id === parentData.selectedChildId);

  return (
    <div className="space-y-4">
        <Tabs defaultValue={parentData.selectedChildId} className="space-y-4">
          <div className="flex items-center gap-4">
            <h2 className="text-xl font-semibold">My Children:</h2>
            <TabsList>
              {parentData.children.map(child => (
                <TabsTrigger key={child.id} value={child.id}>
                  <Avatar className="h-6 w-6 mr-2">
                    <AvatarImage src={child.avatar} alt={child.name} />
                    <AvatarFallback>{child.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  {child.name}
                </TabsTrigger>
              ))}
            </TabsList>
            <Button variant="outline" size="sm">+ Add Child</Button>
          </div>

          {parentData.children.map(child => (
            <TabsContent key={child.id} value={child.id} className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Attendance Rate</CardTitle>
                    <CheckCircle className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{child.attendanceRate}%</div>
                    <p className="text-xs text-muted-foreground">Last 30 days</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Average Grade</CardTitle>
                    <GraduationCap className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{child.averageGrade}</div>
                    <p className="text-xs text-muted-foreground">Overall performance</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Pending Assignments</CardTitle>
                    <BookOpen className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{child.pendingAssignments}</div>
                    <p className="text-xs text-muted-foreground">To be completed</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Unread Messages</CardTitle>
                    <BellRing className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{child.unreadMessages}</div>
                    <p className="text-xs text-muted-foreground">From teachers/school</p>
                  </CardContent>
                </Card>
              </div>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                <Card className="col-span-4">
                  <CardHeader>
                    <CardTitle>Recent Grades</CardTitle>
                  </CardHeader>
                  <CardContent className="pl-2">
                    <div className="space-y-4">
                      {parentData.recentGrades.map((grade, index) => (
                        <div key={index} className="flex items-center justify-between p-3 border rounded-md">
                          <div>
                            <p className="font-semibold">{grade.assessment} ({grade.subject})</p>
                            <p className="text-sm text-muted-foreground">{grade.teacherComment}</p>
                          </div>
                          <Badge variant="secondary">{grade.grade}</Badge>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
                <Card className="col-span-3">
                  <CardHeader>
                    <CardTitle>Upcoming Events</CardTitle>
                  </CardHeader>
                  <CardContent className="grid gap-4">
                    {parentData.upcomingEvents.map((event, index) => (
                      <div key={index} className="flex items-center justify-between p-3 border rounded-md">
                        <div>
                          <p className="font-semibold">{event.name}</p>
                          <p className="text-sm text-muted-foreground">{event.date} at {event.time}</p>
                        </div>
                        <Badge variant="secondary">{event.type}</Badge>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          ))}
        </Tabs>
    </div>
  );
}