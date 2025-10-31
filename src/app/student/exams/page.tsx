'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';

const examsData = {
  upcoming: [
    {
      subject: 'Mathematics',
      name: 'Mid-Term Exam',
      date: 'Nov 15, 2025',
      time: '9:00 AM',
      duration: '2 hours',
      location: 'Room 301',
      topics: ['Algebra', 'Geometry', 'Trigonometry'],
      status: 'Studying',
    },
    {
      subject: 'Physics',
      name: 'Chapter 4 Test',
      date: 'Nov 20, 2025',
      time: '1:00 PM',
      duration: '1 hour',
      location: 'Room 205',
      topics: ['Kinematics', 'Dynamics'],
      status: 'Not Started',
    },
  ],
  past: [
    {
      subject: 'History',
      name: 'Chapter 2 Test',
      date: 'Oct 10, 2025',
      grade: '85%',
    },
  ],
};

export default function StudentExamsPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Exams</h1>
      <Tabs defaultValue="upcoming">
        <TabsList>
          <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
          <TabsTrigger value="past">Past</TabsTrigger>
          <TabsTrigger value="all">All</TabsTrigger>
        </TabsList>
        <TabsContent value="upcoming">
          <div className="grid gap-6 md:grid-cols-2">
            {examsData.upcoming.map((exam, index) => (
              <Card key={index}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle>{exam.name}</CardTitle>
                      <CardDescription>{exam.subject}</CardDescription>
                    </div>
                    <Badge variant="secondary">{exam.status}</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">Date: {exam.date} at {exam.time}</p>
                  <p className="text-sm text-muted-foreground">Duration: {exam.duration}</p>
                  <p className="text-sm text-muted-foreground">Location: {exam.location}</p>
                  <div className="mt-4">
                    <h4 className="font-semibold">Topics Covered:</h4>
                    <ul className="list-disc list-inside text-sm text-muted-foreground">
                      {exam.topics.map((topic, i) => (
                        <li key={i}>{topic}</li>
                      ))}
                    </ul>
                  </div>
                  <div className="mt-4 flex justify-end">
                    <Button>Study Resources</Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
        <TabsContent value="past">
          <div className="grid gap-6 md:grid-cols-2">
            {examsData.past.map((exam, index) => (
              <Card key={index}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle>{exam.name}</CardTitle>
                      <CardDescription>{exam.subject}</CardDescription>
                    </div>
                    <Badge>{exam.grade}</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">Date: {exam.date}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
        <TabsContent value="all">
          <p>All exams will be displayed here.</p>
        </TabsContent>
      </Tabs>
    </div>
  );
}
