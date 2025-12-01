'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Users, Calendar, BookOpen, ClipboardList, BarChart3, AlertCircle } from 'lucide-react';

interface PlanningData {
  teacher: {
    id: string;
    name: string;
    email: string;
  };
  class: {
    id: string;
    name: string;
    studentCount: number;
  };
  statistics: {
    totalStudents: number;
    totalClasses: number;
    weeklyHours: number;
    attendanceRate: number;
    quizzesCreated: number;
    lessonsCreated: number;
  };
  schedules: Array<{
    dayOfWeek: string;
    plannedStartTime: string;
    plannedDuration: number;
    sessionCount?: number;
  }>;
  lessons: Array<{
    id: string;
    title: string;
    course: string;
    contentType: string;
    language: string;
  }>;
  quizzes: Array<{
    id: string;
    title: string;
    mode: string;
    questionCount: number;
    totalPoints: number;
    passingScore: number;
  }>;
  attendanceSummary: {
    totalRecords: number;
    presentCount: number;
    absentCount: number;
    lateCount: number;
    excusedCount: number;
  };
}

export default function TeacherPlanningPage() {
  const [data, setData] = useState<PlanningData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPlanningData = async () => {
      try {
        // For demo purposes, we'll show the seeded data that was created
        // In a real app, this would fetch from an API based on the logged-in teacher
        setData({
          teacher: {
            id: 'teacher-1',
            name: 'Mme. Marie Martin',
            email: 'marie.martin@ecole-jaurès.fr',
          },
          class: {
            id: 'cm2-a',
            name: 'CM2 - Classe A',
            studentCount: 25,
          },
          statistics: {
            totalStudents: 25,
            totalClasses: 1,
            weeklyHours: 7.75, // 465 minutes / 60
            attendanceRate: 84,
            quizzesCreated: 1,
            lessonsCreated: 9,
          },
          schedules: [
            { dayOfWeek: 'Monday', plannedStartTime: '09:00', plannedDuration: 90, sessionCount: 2 },
            { dayOfWeek: 'Tuesday', plannedStartTime: '10:00', plannedDuration: 105, sessionCount: 2 },
            { dayOfWeek: 'Wednesday', plannedStartTime: '09:30', plannedDuration: 90, sessionCount: 1 },
            { dayOfWeek: 'Thursday', plannedStartTime: '10:00', plannedDuration: 120, sessionCount: 2 },
            { dayOfWeek: 'Friday', plannedStartTime: '09:00', plannedDuration: 120, sessionCount: 2 },
          ],
          lessons: [
            { id: '1', title: 'Les types de phrases', course: 'Français', contentType: 'LESSON', language: 'FRENCH' },
            { id: '2', title: 'Fractions simples', course: 'Mathématiques', contentType: 'LESSON', language: 'FRENCH' },
            { id: '3', title: 'Cycle de vie des plantes', course: 'Sciences', contentType: 'LESSON', language: 'FRENCH' },
            { id: '4', title: 'Le Moyen-Âge', course: 'Histoire-Géographie', contentType: 'LESSON', language: 'FRENCH' },
            { id: '5', title: 'Grammaire: Les pronoms', course: 'Français', contentType: 'LESSON', language: 'FRENCH' },
            { id: '6', title: 'Géométrie: Périmètre et Aire', course: 'Mathématiques', contentType: 'LESSON', language: 'FRENCH' },
            { id: '7', title: 'Système solaire', course: 'Sciences', contentType: 'LESSON', language: 'FRENCH' },
            { id: '8', title: 'Géographie: Les continents', course: 'Histoire-Géographie', contentType: 'LESSON', language: 'FRENCH' },
            { id: '9', title: 'Art et Couleurs', course: 'Arts Plastiques', contentType: 'LESSON', language: 'FRENCH' },
          ],
          quizzes: [
            {
              id: 'quiz-1',
              title: 'Quiz: Les types de phrases',
              mode: 'EXAM',
              questionCount: 4,
              totalPoints: 7,
              passingScore: 70,
            },
          ],
          attendanceSummary: {
            totalRecords: 100,
            presentCount: 84,
            absentCount: 10,
            lateCount: 4,
            excusedCount: 2,
          },
        });
      } catch (err) {
        setError('Failed to load planning data');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchPlanningData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-lg text-muted-foreground">Loading Q1 planning data...</p>
      </div>
    );
  }

  if (error || !data) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>{error || 'Failed to load planning data'}</AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 to-slate-100 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold mb-2">Q1 Planning Overview</h1>
          <p className="text-muted-foreground">
            Teacher: <span className="font-semibold text-foreground">{data.teacher.name}</span> |
            Class: <span className="font-semibold text-foreground">{data.class.name}</span>
          </p>
        </div>

        {/* Key Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <Users className="h-8 w-8 text-blue-500 mx-auto mb-2" />
                <p className="text-3xl font-bold">{data.statistics.totalStudents}</p>
                <p className="text-xs text-muted-foreground mt-1">Students</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <Calendar className="h-8 w-8 text-green-500 mx-auto mb-2" />
                <p className="text-3xl font-bold">{data.statistics.weeklyHours.toFixed(1)}h</p>
                <p className="text-xs text-muted-foreground mt-1">Weekly Hours</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <BookOpen className="h-8 w-8 text-purple-500 mx-auto mb-2" />
                <p className="text-3xl font-bold">{data.statistics.lessonsCreated}</p>
                <p className="text-xs text-muted-foreground mt-1">Lessons</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <ClipboardList className="h-8 w-8 text-orange-500 mx-auto mb-2" />
                <p className="text-3xl font-bold">{data.statistics.quizzesCreated}</p>
                <p className="text-xs text-muted-foreground mt-1">Quizzes</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <BarChart3 className="h-8 w-8 text-red-500 mx-auto mb-2" />
                <p className="text-3xl font-bold">{data.statistics.attendanceRate}%</p>
                <p className="text-xs text-muted-foreground mt-1">Attendance</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Weekly Schedule */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Weekly Schedule
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              {data.schedules.map((schedule, index) => (
                <div key={index} className="border rounded-lg p-4 bg-slate-50">
                  <h3 className="font-semibold text-sm mb-3">{schedule.dayOfWeek}</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-muted-foreground">Start:</span>
                      <span className="font-mono font-bold">{schedule.plannedStartTime}</span>
                    </div>
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-muted-foreground">Duration:</span>
                      <span className="font-mono font-bold">{schedule.plannedDuration} min</span>
                    </div>
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-muted-foreground">Sessions:</span>
                      <Badge variant="secondary" className="text-xs">{schedule.sessionCount}</Badge>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Lessons Overview */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="h-5 w-5" />
                Lessons ({data.lessons.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {data.lessons.map((lesson) => (
                  <div key={lesson.id} className="flex items-start justify-between p-3 border rounded-lg bg-slate-50">
                    <div className="flex-1">
                      <p className="font-semibold text-sm">{lesson.title}</p>
                      <p className="text-xs text-muted-foreground mt-1">{lesson.course}</p>
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {lesson.language === 'FRENCH' ? '🇫🇷 Français' : lesson.language}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Quizzes & Assessments */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ClipboardList className="h-5 w-5" />
                Assessments
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {data.quizzes.map((quiz) => (
                  <div key={quiz.id} className="border rounded-lg p-4 bg-slate-50">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h3 className="font-semibold text-sm">{quiz.title}</h3>
                      </div>
                      <Badge className="text-xs">
                        {quiz.mode === 'EXAM' ? '📝 Exam' : quiz.mode === 'PRACTICE' ? '✏️ Practice' : '⏱️ Timed'}
                      </Badge>
                    </div>
                    <div className="grid grid-cols-3 gap-2 text-xs">
                      <div>
                        <p className="text-muted-foreground">Questions</p>
                        <p className="font-bold text-lg">{quiz.questionCount}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Points</p>
                        <p className="font-bold text-lg">{quiz.totalPoints}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Pass Score</p>
                        <p className="font-bold text-lg">{quiz.passingScore}%</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Attendance Summary */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              September Attendance Summary
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              <div className="text-center p-4 border rounded-lg bg-green-50">
                <p className="text-2xl font-bold text-green-600">{data.attendanceSummary.presentCount}</p>
                <p className="text-xs text-muted-foreground mt-1">Present</p>
              </div>
              <div className="text-center p-4 border rounded-lg bg-red-50">
                <p className="text-2xl font-bold text-red-600">{data.attendanceSummary.absentCount}</p>
                <p className="text-xs text-muted-foreground mt-1">Absent</p>
              </div>
              <div className="text-center p-4 border rounded-lg bg-yellow-50">
                <p className="text-2xl font-bold text-yellow-600">{data.attendanceSummary.lateCount}</p>
                <p className="text-xs text-muted-foreground mt-1">Late</p>
              </div>
              <div className="text-center p-4 border rounded-lg bg-blue-50">
                <p className="text-2xl font-bold text-blue-600">{data.attendanceSummary.excusedCount}</p>
                <p className="text-xs text-muted-foreground mt-1">Excused</p>
              </div>
              <div className="text-center p-4 border rounded-lg bg-slate-100">
                <p className="text-2xl font-bold text-slate-700">{data.attendanceSummary.totalRecords}</p>
                <p className="text-xs text-muted-foreground mt-1">Total Records</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Summary Note */}
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            <strong>Q1 Planning Summary:</strong> This dashboard displays your realistic Q1 (September-November) planning for CM2 - Classe A.
            You have 25 students, 9 lessons spread across 4 courses, 1 exam-mode quiz, and a weekly schedule of 7.75 hours.
            September attendance data shows an 84% attendance rate with 100 attendance records for the first 4 weeks.
          </AlertDescription>
        </Alert>
      </div>
    </div>
  );
}