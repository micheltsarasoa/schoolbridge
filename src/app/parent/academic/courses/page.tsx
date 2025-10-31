'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';

const coursesData = {
  children: [
    { id: 'child1', name: 'Student A' },
    { id: 'child2', name: 'Student B' },
  ],
  courses: {
    child1: [
      { name: 'Algebra I', subject: 'Mathematics', teacher: 'Mr. Jean-Luc', grade: 'A', progress: 75 },
      { name: 'Physics Basics', subject: 'Science', teacher: 'Ms. Sophie', grade: 'B+', progress: 60 },
    ],
    child2: [
      { name: 'World History', subject: 'History', teacher: 'Mr. Rakoto', grade: 'A-', progress: 80 },
    ],
  },
};

export default function ParentCoursesPage() {
  const [selectedChild, setSelectedChild] = useState('child1');
  const childCourses = coursesData.courses[selectedChild as keyof typeof coursesData.courses] || [];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Enrolled Courses</h1>
      <div className="flex items-center gap-4">
        <Select value={selectedChild} onValueChange={setSelectedChild}>
          <SelectTrigger className="w-[280px]">
            <SelectValue placeholder="Select a child" />
          </SelectTrigger>
          <SelectContent>
            {coursesData.children.map(c => (
              <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {childCourses.map((course, index) => (
          <Card key={index}>
            <CardHeader>
              <CardTitle>{course.name}</CardTitle>
              <CardDescription>{course.subject}</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">Teacher: {course.teacher}</p>
              <p className="text-sm text-muted-foreground">Grade: {course.grade}</p>
              <div className="flex items-center justify-between text-sm mt-4">
                <span>Progress</span>
                <span>{course.progress}%</span>
              </div>
              <Progress value={course.progress} className="h-2" />
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
