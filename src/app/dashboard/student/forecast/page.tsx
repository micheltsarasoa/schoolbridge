'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const forecastData = {
  currentGPA: 'B+',
  subjects: [
    {
      name: 'Mathematics',
      currentGrade: 'A-',
      predictedGrade: 'A',
      confidence: 'High',
      suggestions: 'Keep up the good work!',
    },
    {
      name: 'Physics',
      currentGrade: 'B',
      predictedGrade: 'B+',
      confidence: 'Medium',
      suggestions: 'Review chapter 4 for the next exam.',
    },
    {
      name: 'History',
      currentGrade: 'A',
      predictedGrade: 'A',
      confidence: 'High',
      suggestions: 'Excellent work!',
    },
  ],
  gradeTrend: [
    { name: 'Week 1', grade: 85 },
    { name: 'Week 2', grade: 88 },
    { name: 'Week 3', grade: 87 },
    { name: 'Week 4', grade: 90 },
    { name: 'Week 5', grade: 92 },
  ],
};

export default function StudentForecastPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">My Forecast</h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Current GPA</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-5xl font-bold">{forecastData.currentGPA}</p>
            </CardContent>
          </Card>
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Grade Trend</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={forecastData.gradeTrend}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="grade" stroke="#8884d8" activeDot={{ r: 8 }} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Subject-wise Predicted Grades</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {forecastData.subjects.map((subject, index) => (
                <Card key={index}>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle>{subject.name}</CardTitle>
                        <CardDescription>Current Grade: {subject.currentGrade}</CardDescription>
                      </div>
                      <p className="text-lg font-bold">{subject.predictedGrade}</p>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">Confidence: {subject.confidence}</p>
                    <p className="text-sm text-muted-foreground">Suggestion: {subject.suggestions}</p>
                  </CardContent>
                </Card>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
      <p className="text-sm text-muted-foreground text-center">Disclaimer: Predictions are based on current performance and may not be accurate.</p>
    </div>
  );
}