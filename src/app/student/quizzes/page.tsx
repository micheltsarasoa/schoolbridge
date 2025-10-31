'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';

const quizzesData = {
  todo: [
    {
      title: 'Chapter 5 Quiz',
      course: 'Algebra I',
      dueDate: 'Tomorrow',
      timeLimit: '30 minutes',
      questions: 15,
      attempts: '0 of 3',
    },
  ],
  inProgress: [
    {
      title: 'Lab Safety Quiz',
      course: 'Physics Basics',
      dueDate: 'Friday',
      timeLimit: '15 minutes',
      questions: 10,
      attempts: '1 of 2',
    },
  ],
  completed: [
    {
      title: 'Chapter 1 Quiz',
      course: 'Madagascar History',
      completedDate: 'Oct 20, 2025',
      score: '95%',
    },
  ],
};

export default function StudentQuizzesPage() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Quizzes</h1>
        <div className="flex items-center gap-4">
          <Select>
            <SelectTrigger className="w-[280px]">
              <SelectValue placeholder="All Subjects" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Subjects</SelectItem>
              <SelectItem value="math">Mathematics</SelectItem>
              <SelectItem value="science">Science</SelectItem>
              <SelectItem value="history">History</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <Tabs defaultValue="todo">
        <TabsList>
          <TabsTrigger value="todo">To Do</TabsTrigger>
          <TabsTrigger value="inProgress">In Progress</TabsTrigger>
          <TabsTrigger value="completed">Completed</TabsTrigger>
        </TabsList>
        <TabsContent value="todo">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {quizzesData.todo.map((quiz, index) => (
              <Card key={index}>
                <CardHeader>
                  <CardTitle>{quiz.title}</CardTitle>
                  <CardDescription>{quiz.course}</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">Due: {quiz.dueDate}</p>
                  <p className="text-sm text-muted-foreground">Time Limit: {quiz.timeLimit}</p>
                  <p className="text-sm text-muted-foreground">Questions: {quiz.questions}</p>
                  <p className="text-sm text-muted-foreground">Attempts: {quiz.attempts}</p>
                  <div className="mt-4 flex justify-end">
                    <Button>Start Quiz</Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
        <TabsContent value="inProgress">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {quizzesData.inProgress.map((quiz, index) => (
              <Card key={index}>
                <CardHeader>
                  <CardTitle>{quiz.title}</CardTitle>
                  <CardDescription>{quiz.course}</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">Due: {quiz.dueDate}</p>
                  <p className="text-sm text-muted-foreground">Time Limit: {quiz.timeLimit}</p>
                  <p className="text-sm text-muted-foreground">Questions: {quiz.questions}</p>
                  <p className="text-sm text-muted-foreground">Attempts: {quiz.attempts}</p>
                  <div className="mt-4 flex justify-end">
                    <Button>Resume</Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
        <TabsContent value="completed">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {quizzesData.completed.map((quiz, index) => (
              <Card key={index}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle>{quiz.title}</CardTitle>
                      <CardDescription>{quiz.course}</CardDescription>
                    </div>
                    <Badge>{quiz.score}</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">Completed: {quiz.completedDate}</p>
                  <div className="mt-4 flex justify-end">
                    <Button variant="outline">Review</Button>
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