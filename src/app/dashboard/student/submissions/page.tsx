'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { SubmissionStatus } from '@/generated/prisma';

type SubmissionRecord = {
  id: string;
  assignmentTitle: string;
  course: string;
  submittedDate: string;
  grade?: number | null;
  feedback?: string;
  status: SubmissionStatus;
};

const submissionsData: SubmissionRecord[] = [
  {
    id: 'sub1',
    assignmentTitle: 'Chapter 5 Quiz',
    course: 'Algebra I',
    submittedDate: 'Oct 30, 2025',
    grade: 92,
    feedback: 'Great work on understanding the concepts. A few minor calculation errors.',
    status: SubmissionStatus.GRADED,
  },
  {
    id: 'sub2',
    assignmentTitle: 'Lab Report 3',
    course: 'Physics Basics',
    submittedDate: 'Oct 29, 2025',
    grade: null,
    feedback: 'Good effort, but ensure all units are consistent.',
    status: SubmissionStatus.SUBMITTED,
  },
];

export default function StudentSubmissionsPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">My Submissions</h1>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {submissionsData.map(submission => (
          <Card key={submission.id}>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle>{submission.assignmentTitle}</CardTitle>
                  <CardDescription>{submission.course}</CardDescription>
                </div>
                <div className="flex gap-2">
                  <Badge variant={submission.status === SubmissionStatus.GRADED ? 'default' : 'secondary'}>
                    {submission.status}
                  </Badge>
                  {submission.grade !== null && submission.grade !== undefined && (
                    <Badge variant="outline">{submission.grade}%</Badge>
                  )}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">Submitted: {submission.submittedDate}</p>
              {submission.feedback && (
                <div className="mt-4">
                  <h3 className="font-semibold">Feedback:</h3>
                  <p className="text-sm text-muted-foreground">{submission.feedback}</p>
                </div>
              )}
              {submission.status === SubmissionStatus.RESUBMISSION_REQUESTED && (
                <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded">
                  <p className="text-sm font-semibold text-yellow-800">Resubmission Requested</p>
                  <p className="text-sm text-yellow-700">{submission.feedback}</p>
                </div>
              )}
              <div className="mt-4 flex justify-end">
                <Button variant="outline">View Submission</Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
