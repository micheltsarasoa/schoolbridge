'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const childData = {
  id: 'child1',
  name: 'Student A',
  class: 'Grade 10',
  school: 'SchoolBridge High School',
  avatar: '/placeholder.svg?height=96&width=96',
  overview: {
    attendanceRate: 95,
    averageGrade: 'A-',
    assignmentsCompleted: 15,
    upcomingAssessments: 2,
  },
  academic: {
    subjects: [
      { name: 'Mathematics', grade: 'A' },
      { name: 'Physics', grade: 'B+' },
      { name: 'History', grade: 'A' },
    ],
  },
  attendance: {
    log: [
      { date: '2025-10-30', status: 'Present' },
      { date: '2025-10-29', status: 'Present' },
      { date: '2025-10-28', status: 'Absent' },
    ],
  },
  behavior: {
    notes: [
      { date: '2025-10-25', note: 'Excellent participation in class discussion.', teacher: 'Mr. Jean-Luc' },
    ],
  },
};

export default function ParentChildDetailPage({ params }: { params: { childId: string } }) {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-6">
        <Avatar className="h-24 w-24">
          <AvatarImage src={childData.avatar} alt={childData.name} />
          <AvatarFallback>{childData.name.charAt(0)}</AvatarFallback>
        </Avatar>
        <div>
          <h1 className="text-3xl font-bold">{childData.name}</h1>
          <p className="text-muted-foreground">{childData.class} - {childData.school}</p>
        </div>
      </div>
      <Tabs defaultValue="overview">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="academic">Academic</TabsTrigger>
          <TabsTrigger value="attendance">Attendance</TabsTrigger>
          <TabsTrigger value="behavior">Behavior</TabsTrigger>
        </TabsList>
        <TabsContent value="overview">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader>
                <CardTitle>Attendance Rate</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold">{childData.overview.attendanceRate}%</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Average Grade</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold">{childData.overview.averageGrade}</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Assignments Completed</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold">{childData.overview.assignmentsCompleted}</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Upcoming Assessments</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold">{childData.overview.upcomingAssessments}</p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        <TabsContent value="academic">
          <Card>
            <CardHeader>
              <CardTitle>Grade Summary by Subject</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {childData.academic.subjects.map((subject, index) => (
                  <li key={index} className="flex justify-between items-center">
                    <p className="font-semibold">{subject.name}</p>
                    <p className="text-lg font-bold">{subject.grade}</p>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="attendance">
          <Card>
            <CardHeader>
              <CardTitle>Attendance Log</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {childData.attendance.log.map((entry, index) => (
                  <li key={index} className="flex justify-between items-center">
                    <p>{entry.date}</p>
                    <p>{entry.status}</p>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="behavior">
          <Card>
            <CardHeader>
              <CardTitle>Behavior Notes</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-4">
                {childData.behavior.notes.map((note, index) => (
                  <li key={index}>
                    <p>"{note.note}"</p>
                    <p className="text-sm text-muted-foreground text-right">- {note.teacher}, {note.date}</p>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
