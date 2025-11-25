'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Award, Lock } from 'lucide-react';

const resultsData = {
  overallGPA: 'A-',
  subjects: [
    {
      name: 'Mathematics',
      grade: 'A',
      trend: '↑',
    },
    {
      name: 'Physics',
      grade: 'B+',
      trend: '→',
    },
    {
      name: 'History',
      grade: 'A',
      trend: '↑',
    },
  ],
  badges: {
    earned: [
      { name: 'Math Whiz', description: 'Achieved 95% in 3 consecutive math quizzes.', icon: <Award /> },
      { name: 'History Buff', description: 'Completed all history assignments on time.', icon: <Award /> },
    ],
    locked: [
      { name: 'Physics Genius', description: 'Score 100% on the final physics exam.', icon: <Lock /> },
      { name: 'Perfect Attendance', description: 'Maintain 100% attendance for a month.', icon: <Lock /> },
    ],
  },
};

export default function StudentResultsBadgesPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Results & Badges</h1>
      <Tabs defaultValue="results">
        <TabsList>
          <TabsTrigger value="results">Results</TabsTrigger>
          <TabsTrigger value="badges">Badges</TabsTrigger>
        </TabsList>
        <TabsContent value="results">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <Card className="lg:col-span-1">
              <CardHeader>
                <CardTitle>Overall GPA</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-5xl font-bold">{resultsData.overallGPA}</p>
              </CardContent>
            </Card>
            {resultsData.subjects.map((subject, index) => (
              <Card key={index}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <CardTitle>{subject.name}</CardTitle>
                    <p className="text-lg font-bold">{subject.trend}</p>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold">{subject.grade}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
        <TabsContent value="badges">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Earned Badges</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {resultsData.badges.earned.map((badge, index) => (
                  <div key={index} className="flex items-center gap-4">
                    <div className="text-yellow-500">{badge.icon}</div>
                    <div>
                      <p className="font-semibold">{badge.name}</p>
                      <p className="text-sm text-muted-foreground">{badge.description}</p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Locked Badges</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {resultsData.badges.locked.map((badge, index) => (
                  <div key={index} className="flex items-center gap-4 text-muted-foreground">
                    <div>{badge.icon}</div>
                    <div>
                      <p className="font-semibold">{badge.name}</p>
                      <p className="text-sm">{badge.description}</p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}