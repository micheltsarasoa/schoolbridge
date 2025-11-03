'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';

interface Quiz {
  id: string;
  title: string;
  description: string | null;
  course: string;
  subject: string;
  dueDate: string | null;
  timeLimit: string;
  questions: number;
  attempts: number;
  maxAttempts: number;
  status: string;
  displayStatus: string;
  score: number | null;
  totalPoints: number | null;
  correctAnswers: number;
  totalQuestionsAttempted: number;
  submittedAt: string | null;
  startedAt: string | null;
  timeSpent: number | null;
  latestSubmissionId: string | null;
}

interface QuizzesResponse {
  todo: Quiz[];
  inProgress: Quiz[];
  completed: Quiz[];
  stats: {
    totalQuizzes: number;
    todoCount: number;
    inProgressCount: number;
    completedCount: number;
    totalAttempts: number;
    averageScore: number;
  };
}

export default function StudentQuizzesPage() {
  const router = useRouter();
  const [quizzesData, setQuizzesData] = useState<QuizzesResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedSubject, setSelectedSubject] = useState<string>('all');
  const [subjects, setSubjects] = useState<string[]>([]);

  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/student/quizzes');
        if (!response.ok) {
          throw new Error('Failed to fetch quizzes');
        }
        const data: QuizzesResponse = await response.json();
        setQuizzesData(data);

        // Extract unique subjects
        const allQuizzes = [...data.todo, ...data.inProgress, ...data.completed];
        const uniqueSubjects = Array.from(new Set(allQuizzes.map((q) => q.subject))).sort();
        setSubjects(uniqueSubjects);
      } catch (error) {
        console.error('Error fetching quizzes:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchQuizzes();
  }, []);

  const filterQuizzesBySubject = (quizzes: Quiz[]) => {
    if (selectedSubject === 'all') return quizzes;
    return quizzes.filter((q) => q.subject === selectedSubject);
  };

  const handleStartQuiz = (quizId: string) => {
    router.push(`/student/quiz/${quizId}`);
  };

  const handleResumeQuiz = (quizId: string) => {
    router.push(`/student/quiz/${quizId}`);
  };

  const handleReviewQuiz = (quizId: string, submissionId: string | null) => {
    if (!submissionId) {
      console.error('No submission ID available for review');
      return;
    }
    router.push(`/student/quiz/${quizId}/results?submissionId=${submissionId}`);
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const formatTime = (seconds: number | null) => {
    if (!seconds) return '0m';
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    if (hours > 0) return `${hours}h ${minutes % 60}m`;
    return `${minutes}m`;
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Quizzes</h1>
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[...Array(3)].map((_, i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-1/2 mt-2" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-full mb-4" />
                <Skeleton className="h-10 w-24 ml-auto" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (!quizzesData) {
    return <div className="text-center py-12">Failed to load quizzes</div>;
  }

  const todoQuizzes = filterQuizzesBySubject(quizzesData.todo);
  const inProgressQuizzes = filterQuizzesBySubject(quizzesData.inProgress);
  const completedQuizzes = filterQuizzesBySubject(quizzesData.completed);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Quizzes</h1>
          <p className="text-sm text-muted-foreground mt-1">
            {quizzesData.stats.totalQuizzes} total • {quizzesData.stats.inProgressCount} in progress •{' '}
            {quizzesData.stats.completedCount} completed
          </p>
        </div>
        <div className="flex items-center gap-4">
          <Select value={selectedSubject} onValueChange={setSelectedSubject}>
            <SelectTrigger className="w-[280px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Subjects</SelectItem>
              {subjects.map((subject) => (
                <SelectItem key={subject} value={subject}>
                  {subject}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <Tabs defaultValue="todo">
        <TabsList>
          <TabsTrigger value="todo">
            To Do <Badge variant="secondary" className="ml-2">{todoQuizzes.length}</Badge>
          </TabsTrigger>
          <TabsTrigger value="inProgress">
            In Progress <Badge variant="secondary" className="ml-2">{inProgressQuizzes.length}</Badge>
          </TabsTrigger>
          <TabsTrigger value="completed">
            Completed <Badge variant="secondary" className="ml-2">{completedQuizzes.length}</Badge>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="todo">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {todoQuizzes.length > 0 ? (
              todoQuizzes.map((quiz) => (
                <Card key={quiz.id}>
                  <CardHeader>
                    <CardTitle className="text-lg">{quiz.title}</CardTitle>
                    <CardDescription>{quiz.course}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    {quiz.subject && <p className="text-xs text-muted-foreground">Subject: {quiz.subject}</p>}
                    <p className="text-sm text-muted-foreground">Due: {quiz.dueDate || 'No due date'}</p>
                    <p className="text-sm text-muted-foreground">Time Limit: {quiz.timeLimit}</p>
                    <p className="text-sm text-muted-foreground">Questions: {quiz.questions}</p>
                    <p className="text-sm text-muted-foreground">
                      Attempts: {quiz.attempts} of {quiz.maxAttempts}
                    </p>
                    <div className="mt-4 flex justify-end">
                      <Button onClick={() => handleStartQuiz(quiz.id)}>Start Quiz</Button>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <div className="col-span-full text-center py-12 text-muted-foreground">
                No quizzes to do. Great job!
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="inProgress">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {inProgressQuizzes.length > 0 ? (
              inProgressQuizzes.map((quiz) => (
                <Card key={quiz.id}>
                  <CardHeader>
                    <CardTitle className="text-lg">{quiz.title}</CardTitle>
                    <CardDescription>{quiz.course}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    {quiz.subject && <p className="text-xs text-muted-foreground">Subject: {quiz.subject}</p>}
                    <p className="text-sm text-muted-foreground">Due: {quiz.dueDate || 'No due date'}</p>
                    <p className="text-sm text-muted-foreground">Time Limit: {quiz.timeLimit}</p>
                    <p className="text-sm text-muted-foreground">
                      Questions: {quiz.totalQuestionsAttempted} of {quiz.questions}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Attempts: {quiz.attempts} of {quiz.maxAttempts}
                    </p>
                    {quiz.timeSpent && (
                      <p className="text-sm text-muted-foreground">Time spent: {formatTime(quiz.timeSpent)}</p>
                    )}
                    <div className="mt-4 flex justify-end">
                      <Button onClick={() => handleResumeQuiz(quiz.id)}>Resume</Button>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <div className="col-span-full text-center py-12 text-muted-foreground">
                No quizzes in progress.
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="completed">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {completedQuizzes.length > 0 ? (
              completedQuizzes.map((quiz) => (
                <Card key={quiz.id}>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg">{quiz.title}</CardTitle>
                        <CardDescription>{quiz.course}</CardDescription>
                      </div>
                      {quiz.score !== null && (
                        <Badge variant={quiz.score >= 70 ? 'default' : 'destructive'}>
                          {Math.round(quiz.score)}%
                        </Badge>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    {quiz.subject && <p className="text-xs text-muted-foreground">Subject: {quiz.subject}</p>}
                    <p className="text-sm text-muted-foreground">Completed: {formatDate(quiz.submittedAt)}</p>
                    <p className="text-sm text-muted-foreground">
                      Correct: {quiz.correctAnswers} of {quiz.totalQuestionsAttempted}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Attempts: {quiz.attempts} of {quiz.maxAttempts}
                    </p>
                    {quiz.timeSpent && (
                      <p className="text-sm text-muted-foreground">Time spent: {formatTime(quiz.timeSpent)}</p>
                    )}
                    <div className="mt-4 flex justify-end">
                      <Button
                        variant="outline"
                        onClick={() => handleReviewQuiz(quiz.id, quiz.latestSubmissionId)}
                        disabled={!quiz.latestSubmissionId}
                      >
                        Review
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <div className="col-span-full text-center py-12 text-muted-foreground">
                No completed quizzes yet.
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}