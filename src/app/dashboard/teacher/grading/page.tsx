'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { SubmissionStatus } from '@/generated/prisma';

type Submission = {
  id: string;
  studentId: string;
  studentName: string;
  studentEmail: string;
  courseId: string;
  courseTitle: string;
  subjectName: string;
  contentTitle: string;
  submittedAt: string;
  content: any;
  status: SubmissionStatus;
  grade?: number | null;
};

type Course = {
  id: string;
  title: string;
  subject: {
    name: string;
  };
};

type Class = {
  id: string;
  name: string;
};

export default function TeacherGradingPage() {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [classes, setClasses] = useState<Class[]>([]);
  const [selectedSubmission, setSelectedSubmission] = useState<Submission | null>(null);
  const [grade, setGrade] = useState('');
  const [feedback, setFeedback] = useState('');
  const [selectedCourseFilter, setSelectedCourseFilter] = useState<string>('all');
  const [selectedClassFilter, setSelectedClassFilter] = useState<string>('all');
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch courses and classes for filters
  useEffect(() => {
    const fetchFilters = async () => {
      try {
        const [coursesRes, classesRes] = await Promise.all([
          fetch('/api/teacher/courses'),
          fetch('/api/teacher/classes'),
        ]);

        if (coursesRes.ok) {
          const coursesData = await coursesRes.json();
          setCourses(coursesData);
        }

        if (classesRes.ok) {
          const classesData = await classesRes.json();
          setClasses(classesData);
        }
      } catch (err) {
        console.error('Error fetching filters:', err);
      }
    };

    fetchFilters();
  }, []);

  // Fetch submissions based on filters
  useEffect(() => {
    const fetchSubmissions = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const params = new URLSearchParams();
        if (selectedCourseFilter !== 'all') {
          params.append('courseId', selectedCourseFilter);
        }
        if (selectedClassFilter !== 'all') {
          params.append('classId', selectedClassFilter);
        }

        const response = await fetch(`/api/submissions?${params.toString()}`);

        if (!response.ok) {
          throw new Error('Failed to fetch submissions');
        }

        const data = await response.json();
        setSubmissions(data);

        // If current selection is not in the new list, clear it
        if (selectedSubmission && !data.find((s: Submission) => s.id === selectedSubmission.id)) {
          setSelectedSubmission(null);
          setGrade('');
          setFeedback('');
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load submissions');
      } finally {
        setIsLoading(false);
      }
    };

    fetchSubmissions();
  }, [selectedCourseFilter, selectedClassFilter]);

  const handleGradeSubmission = async () => {
    if (!selectedSubmission || !grade) return;

    setIsSubmitting(true);
    setError(null);

    try {
      const response = await fetch(`/api/submissions/${selectedSubmission.id}/grade`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ grade: parseFloat(grade), feedback }),
      });

      if (!response.ok) {
        throw new Error('Failed to submit grade');
      }

      // Remove graded submission from list
      setSubmissions((prev) => prev.filter((s) => s.id !== selectedSubmission.id));
      setSelectedSubmission(null);
      setGrade('');
      setFeedback('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to submit grade');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Filter Submissions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <label className="text-sm font-medium mb-2 block">Course</label>
              <Select value={selectedCourseFilter} onValueChange={setSelectedCourseFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="All Courses" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Courses</SelectItem>
                  {courses.map((course) => (
                    <SelectItem key={course.id} value={course.id}>
                      {course.title} ({course.subject.name})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex-1">
              <label className="text-sm font-medium mb-2 block">Class</label>
              <Select value={selectedClassFilter} onValueChange={setSelectedClassFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="All Classes" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Classes</SelectItem>
                  {classes.map((cls) => (
                    <SelectItem key={cls.id} value={cls.id}>
                      {cls.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Error Alert */}
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Pending Submissions ({submissions.length})</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="text-center py-8 text-muted-foreground">Loading submissions...</div>
              ) : submissions.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">No pending submissions</div>
              ) : (
                <ul className="space-y-2">
                  {submissions.map((submission) => (
                    <li
                      key={submission.id}
                      onClick={() => {
                        setSelectedSubmission(submission);
                        setGrade('');
                        setFeedback('');
                      }}
                      className={`p-3 rounded-md cursor-pointer hover:bg-muted flex items-start gap-3 transition-colors ${
                        selectedSubmission?.id === submission.id ? 'bg-muted' : ''
                      }`}
                    >
                      <Avatar className="h-9 w-9 mt-0.5">
                        <AvatarFallback>{submission.studentName.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold truncate">{submission.contentTitle}</p>
                        <p className="text-sm text-muted-foreground truncate">
                          {submission.studentName}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {submission.courseTitle}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(submission.submittedAt).toLocaleDateString()}
                        </p>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </CardContent>
          </Card>
        </div>
        <div className="lg:col-span-2">
          {selectedSubmission ? (
            <Card>
              <CardHeader>
                <CardTitle>Grade Submission: {selectedSubmission.contentTitle}</CardTitle>
                <CardDescription>
                  Student: {selectedSubmission.studentName} | Course: {selectedSubmission.courseTitle} ({selectedSubmission.subjectName})
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="font-semibold mb-2">Submission Content:</h3>
                  <div className="border p-3 rounded-md bg-muted/50 min-h-[100px] max-h-[300px] overflow-y-auto">
                    {selectedSubmission.content ? (
                      <pre className="whitespace-pre-wrap text-sm">
                        {JSON.stringify(selectedSubmission.content, null, 2)}
                      </pre>
                    ) : (
                      <p className="text-muted-foreground">No content provided</p>
                    )}
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Grade:</h3>
                  <Input
                    type="number"
                    placeholder="Enter grade (e.g., 85)"
                    value={grade}
                    onChange={(e) => setGrade(e.target.value)}
                    min="0"
                    max="100"
                    disabled={isSubmitting}
                  />
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Feedback:</h3>
                  <Textarea
                    placeholder="Provide feedback to the student..."
                    value={feedback}
                    onChange={(e) => setFeedback(e.target.value)}
                    rows={5}
                    disabled={isSubmitting}
                  />
                </div>
                <div className="flex justify-end gap-2">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setSelectedSubmission(null);
                      setGrade('');
                      setFeedback('');
                    }}
                    disabled={isSubmitting}
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleGradeSubmission}
                    disabled={!grade || isSubmitting}
                  >
                    {isSubmitting ? 'Submitting...' : 'Submit Grade'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="flex items-center justify-center h-[500px]">
              <p className="text-muted-foreground">Select a submission to grade</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
