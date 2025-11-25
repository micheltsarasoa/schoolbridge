'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';

const assignmentsData = {
  todo: [
    {
      title: 'Essay on Colonialism',
      course: 'Madagascar History',
      dueDate: 'Next Monday',
      priority: 'High',
      status: 'In Progress',
    },
    {
      title: 'Lab Report 3',
      course: 'Physics Basics',
      dueDate: 'Friday',
      priority: 'Medium',
      status: 'To Do',
    },
  ],
  submitted: [
    {
      title: 'Chapter 4 Homework',
      course: 'Algebra I',
      submittedDate: 'Yesterday',
      status: 'Submitted',
    },
  ],
  graded: [
    {
      title: 'Chapter 3 Quiz',
      course: 'Algebra I',
      grade: '92%',
      feedback: 'Great work!',
    },
  ],
};

export default function StudentAssignmentsPage() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Assignments</h1>
        <div className="flex items-center gap-4">
          <Select>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Sort by Due Date" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="dueDate">Due Date</SelectItem>
              <SelectItem value="subject">Subject</SelectItem>
              <SelectItem value="priority">Priority</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <Tabs defaultValue="todo">
        <TabsList>
          <TabsTrigger value="todo">To Do</TabsTrigger>
          <TabsTrigger value="submitted">Submitted</TabsTrigger>
          <TabsTrigger value="graded">Graded</TabsTrigger>
        </TabsList>
        <TabsContent value="todo">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {assignmentsData.todo.map((assignment, index) => (
              <Card key={index}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <CardTitle>{assignment.title}</CardTitle>
                    <Badge variant={assignment.priority === 'High' ? 'destructive' : 'secondary'}>{assignment.priority}</Badge>
                  </div>
                  <CardDescription>{assignment.course}</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">Due: {assignment.dueDate}</p>
                  <p className="text-sm text-muted-foreground">Status: {assignment.status}</p>
                  <div className="mt-4 flex justify-end">
                    <Button>View Details</Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
        <TabsContent value="submitted">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {assignmentsData.submitted.map((assignment, index) => (
              <Card key={index}>
                <CardHeader>
                  <CardTitle>{assignment.title}</CardTitle>
                  <CardDescription>{assignment.course}</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">Submitted: {assignment.submittedDate}</p>
                  <p className="text-sm text-muted-foreground">Status: {assignment.status}</p>
                  <div className="mt-4 flex justify-end">
                    <Button variant="outline">View Submission</Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
        <TabsContent value="graded">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {assignmentsData.graded.map((assignment, index) => (
              <Card key={index}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <CardTitle>{assignment.title}</CardTitle>
                    <Badge>{assignment.grade}</Badge>
                  </div>
                  <CardDescription>{assignment.course}</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">Feedback: {assignment.feedback}</p>
                  <div className="mt-4 flex justify-end">
                    <Button variant="outline">View Graded Work</Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
