'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Clock, ChevronLeft, ChevronRight, AlertCircle } from 'lucide-react';

type Question = {
  id: string;
  questionType: 'MULTIPLE_CHOICE' | 'SHORT_ANSWER' | 'TRUE_FALSE' | 'ESSAY';
  text: string;
  explanation?: string;
  order: number;
  points: number;
  options: any[];
};

type Quiz = {
  id: string;
  title: string;
  description?: string;
  passingScore: number;
  timeLimit?: number;
  showAnswersAfter: boolean;
  questions: Question[];
  submissionId: string;
};

export default function QuizPage() {
  const params = useParams();
  const router = useRouter();
  const quizId = params.quizId as string;

  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<{ [key: string]: string | string[] | boolean }>({});
  const [submitting, setSubmitting] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState<number | null>(null);
  const [startTime, setStartTime] = useState<Date | null>(null);

  // Fetch quiz data
  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const res = await fetch(`/api/quizzes/${quizId}`);
        if (!res.ok) throw new Error('Failed to load quiz');
        const data = await res.json();
        setQuiz(data.quiz);
        if (data.quiz.timeLimit) {
          setTimeRemaining(data.quiz.timeLimit * 60); // Convert minutes to seconds
        }
        setStartTime(new Date());
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load quiz');
      } finally {
        setLoading(false);
      }
    };

    fetchQuiz();
  }, [quizId]);

  // Timer effect
  useEffect(() => {
    if (!quiz?.timeLimit || timeRemaining === null) return;

    const interval = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev === null || prev <= 0) {
          clearInterval(interval);
          handleSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [quiz?.timeLimit, timeRemaining]);

  const handleAnswerChange = (questionId: string, answer: string | string[] | boolean) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: answer,
    }));
  };

  const handleSubmit = async () => {
    if (!quiz) return;

    setSubmitting(true);
    try {
      const timeSpent = startTime ? Math.round((Date.now() - startTime.getTime()) / 1000) : undefined;

      const answerArray = quiz.questions.map((q) => ({
        questionId: q.id,
        studentAnswer: answers[q.id] || null,
      }));

      const res = await fetch(`/api/quizzes/${quizId}/submit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          submissionId: quiz.submissionId,
          answers: answerArray,
          timeSpent,
        }),
      });

      if (!res.ok) throw new Error('Failed to submit quiz');

      router.push(`/student/quiz/${quizId}/results`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to submit quiz');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-lg">Loading quiz...</p>
      </div>
    );
  }

  if (!quiz) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error || 'Quiz not found'}</AlertDescription>
        </Alert>
      </div>
    );
  }

  const currentQuestion = quiz.questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / quiz.questions.length) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2">{quiz.title}</h1>
          {quiz.description && <p className="text-muted-foreground">{quiz.description}</p>}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Left Sidebar - Question List */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Questions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {quiz.questions.map((question, index) => (
                    <button
                      key={question.id}
                      onClick={() => setCurrentQuestionIndex(index)}
                      className={`w-full text-left px-3 py-2 rounded transition-colors ${
                        index === currentQuestionIndex
                          ? 'bg-primary text-primary-foreground'
                          : answers[question.id]
                          ? 'bg-green-100 hover:bg-green-200'
                          : 'bg-muted hover:bg-muted/80'
                      }`}
                    >
                      Q{index + 1}
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Timer */}
            {timeRemaining !== null && (
              <Card className="mt-4">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-2 text-sm">
                    <Clock className="h-4 w-4" />
                    <span>
                      {Math.floor(timeRemaining / 60)}:{String(timeRemaining % 60).padStart(2, '0')}
                    </span>
                  </div>
                  {timeRemaining < 300 && (
                    <Alert variant="destructive" className="mt-2">
                      <AlertDescription>Time running out!</AlertDescription>
                    </Alert>
                  )}
                </CardContent>
              </Card>
            )}
          </div>

          {/* Main Content - Question Display */}
          <div className="lg:col-span-3">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <CardTitle>Question {currentQuestionIndex + 1} of {quiz.questions.length}</CardTitle>
                    <p className="text-sm text-muted-foreground mt-1">
                      {currentQuestion.points} point{currentQuestion.points !== 1 ? 's' : ''}
                    </p>
                  </div>
                </div>
                <Progress value={progress} className="h-2" />
              </CardHeader>

              <CardContent className="space-y-6">
                {/* Question Text */}
                <div>
                  <h2 className="text-xl font-semibold mb-4">{currentQuestion.text}</h2>

                  {/* Answer Input Based on Question Type */}
                  <div className="space-y-3">
                    {currentQuestion.questionType === 'MULTIPLE_CHOICE' && (
                      <div className="space-y-2">
                        {currentQuestion.options.map((option) => (
                          <label
                            key={option.id}
                            className={`flex items-center p-4 border rounded-lg cursor-pointer transition-all ${
                              answers[currentQuestion.id] === option.id
                                ? 'border-primary bg-primary/5'
                                : 'border-muted hover:border-muted-foreground/50'
                            }`}
                          >
                            <input
                              type="radio"
                              name={currentQuestion.id}
                              value={option.id}
                              checked={answers[currentQuestion.id] === option.id}
                              onChange={(e) => handleAnswerChange(currentQuestion.id, e.target.value)}
                              className="mr-3"
                            />
                            <span>{option.text}</span>
                          </label>
                        ))}
                      </div>
                    )}

                    {currentQuestion.questionType === 'TRUE_FALSE' && (
                      <div className="space-y-2">
                        {[
                          { id: 'true', text: 'True' },
                          { id: 'false', text: 'False' },
                        ].map((option) => (
                          <label
                            key={option.id}
                            className={`flex items-center p-4 border rounded-lg cursor-pointer transition-all ${
                              answers[currentQuestion.id] === option.id
                                ? 'border-primary bg-primary/5'
                                : 'border-muted hover:border-muted-foreground/50'
                            }`}
                          >
                            <input
                              type="radio"
                              name={currentQuestion.id}
                              value={option.id}
                              checked={answers[currentQuestion.id] === option.id}
                              onChange={(e) => handleAnswerChange(currentQuestion.id, e.target.value)}
                              className="mr-3"
                            />
                            <span>{option.text}</span>
                          </label>
                        ))}
                      </div>
                    )}

                    {currentQuestion.questionType === 'SHORT_ANSWER' && (
                      <input
                        type="text"
                        placeholder="Enter your answer..."
                        value={(answers[currentQuestion.id] as string) || ''}
                        onChange={(e) => handleAnswerChange(currentQuestion.id, e.target.value)}
                        className="w-full px-4 py-2 border rounded-lg"
                      />
                    )}

                    {currentQuestion.questionType === 'ESSAY' && (
                      <textarea
                        placeholder="Write your answer here..."
                        value={(answers[currentQuestion.id] as string) || ''}
                        onChange={(e) => handleAnswerChange(currentQuestion.id, e.target.value)}
                        rows={6}
                        className="w-full px-4 py-2 border rounded-lg"
                      />
                    )}
                  </div>
                </div>

                {/* Explanation (shown after answer selection for some quizzes) */}
                {quiz.showAnswersAfter && answers[currentQuestion.id] && currentQuestion.explanation && (
                  <Alert>
                    <AlertDescription>{currentQuestion.explanation}</AlertDescription>
                  </Alert>
                )}

                {/* Navigation Buttons */}
                <div className="flex gap-4 pt-6 border-t">
                  <Button
                    variant="outline"
                    onClick={() => setCurrentQuestionIndex(Math.max(0, currentQuestionIndex - 1))}
                    disabled={currentQuestionIndex === 0}
                  >
                    <ChevronLeft className="mr-2 h-4 w-4" />
                    Previous
                  </Button>

                  {currentQuestionIndex === quiz.questions.length - 1 ? (
                    <Button
                      onClick={handleSubmit}
                      disabled={submitting}
                      className="ml-auto"
                    >
                      {submitting ? 'Submitting...' : 'Submit Quiz'}
                    </Button>
                  ) : (
                    <Button
                      onClick={() => setCurrentQuestionIndex(Math.min(quiz.questions.length - 1, currentQuestionIndex + 1))}
                      className="ml-auto"
                    >
                      Next
                      <ChevronRight className="ml-2 h-4 w-4" />
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
