'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CheckCircle, XCircle, HelpCircle, ArrowLeft } from 'lucide-react';

type QuizResult = {
  submission: {
    id: string;
    score: number;
    totalPoints: number;
    submittedAt: string;
    timeSpent: number;
    responses: Array<{
      questionId: string;
      studentAnswer: any;
      isCorrect: boolean | null;
      pointsEarned: number;
      question: {
        text: string;
        correctAnswer: any;
        points: number;
      };
    }>;
  };
  passed: boolean;
  score: number;
  earnedPoints: number;
  totalPoints: number;
};

export default function QuizResultsPage() {
  const params = useParams();
  const router = useRouter();
  const quizId = params.quizId as string;

  const [result, setResult] = useState<QuizResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Note: In a real app, you'd fetch the results from an API
    // For now, this is a placeholder that would be called after quiz submission
    setLoading(false);
  }, [quizId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-lg">Loading results...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <Button
          variant="ghost"
          onClick={() => router.push('/student/quizzes')}
          className="mb-6"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Quizzes
        </Button>

        {/* Results Summary */}
        <Card className="mb-6 border-2">
          <CardHeader className={`${result?.passed ? 'bg-green-50' : 'bg-red-50'}`}>
            <div className="text-center">
              <div className="flex justify-center mb-4">
                {result?.passed ? (
                  <CheckCircle className="h-16 w-16 text-green-500" />
                ) : (
                  <XCircle className="h-16 w-16 text-red-500" />
                )}
              </div>
              <CardTitle className="text-2xl mb-2">
                {result?.passed ? 'Great Job!' : 'Quiz Completed'}
              </CardTitle>
              <Badge variant={result?.passed ? 'default' : 'destructive'} className="text-lg px-4 py-1">
                {Math.round(result?.score || 0)}%
              </Badge>
            </div>
          </CardHeader>

          <CardContent className="grid grid-cols-3 gap-4 py-6">
            <div className="text-center">
              <p className="text-3xl font-bold">{Math.round(result?.earnedPoints || 0)}</p>
              <p className="text-sm text-muted-foreground">Points Earned</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold">{Math.round(result?.totalPoints || 0)}</p>
              <p className="text-sm text-muted-foreground">Total Points</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold">
                {result?.submission.responses.filter((r) => r.isCorrect === true).length || 0}
              </p>
              <p className="text-sm text-muted-foreground">Correct Answers</p>
            </div>
          </CardContent>
        </Card>

        {/* Detailed Results */}
        <Card>
          <CardHeader>
            <CardTitle>Detailed Results</CardTitle>
          </CardHeader>

          <CardContent className="space-y-4">
            {result?.submission.responses.map((response, index) => (
              <div
                key={response.questionId}
                className={`border rounded-lg p-4 ${
                  response.isCorrect === true
                    ? 'bg-green-50 border-green-200'
                    : response.isCorrect === false
                    ? 'bg-red-50 border-red-200'
                    : 'bg-yellow-50 border-yellow-200'
                }`}
              >
                <div className="flex items-start gap-3 mb-2">
                  <div>
                    {response.isCorrect === true ? (
                      <CheckCircle className="h-5 w-5 text-green-600" />
                    ) : response.isCorrect === false ? (
                      <XCircle className="h-5 w-5 text-red-600" />
                    ) : (
                      <HelpCircle className="h-5 w-5 text-yellow-600" />
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold">Question {index + 1}</p>
                    <p className="text-sm text-muted-foreground mt-1">{response.question.text}</p>
                  </div>
                  <Badge variant={response.isCorrect === true ? 'default' : 'secondary'}>
                    {response.pointsEarned}/{response.question.points} pts
                  </Badge>
                </div>

                <div className="ml-8 space-y-2 text-sm">
                  <div>
                    <p className="font-medium text-muted-foreground">Your Answer:</p>
                    <p className="text-foreground">
                      {typeof response.studentAnswer === 'object'
                        ? JSON.stringify(response.studentAnswer)
                        : response.studentAnswer || 'No answer provided'}
                    </p>
                  </div>

                  {response.isCorrect === false && (
                    <div>
                      <p className="font-medium text-muted-foreground">Correct Answer:</p>
                      <p className="text-green-700 font-semibold">
                        {typeof response.question.correctAnswer === 'object'
                          ? JSON.stringify(response.question.correctAnswer.value)
                          : response.question.correctAnswer}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex gap-4 mt-6">
          <Button variant="outline" onClick={() => router.push('/student/quizzes')}>
            Back to Quizzes
          </Button>
          <Button onClick={() => router.push('/student/dashboard')} className="ml-auto">
            Go to Dashboard
          </Button>
        </div>
      </div>
    </div>
  );
}
