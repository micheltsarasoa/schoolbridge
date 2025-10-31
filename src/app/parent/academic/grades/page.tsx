'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { DatePickerWithRange } from '@/components/ui/date-range-picker';
import { DateRange } from 'react-day-picker';

const gradesData = {
  children: [
    { id: 'child1', name: 'Student A' },
    { id: 'child2', name: 'Student B' },
  ],
  grades: [
    { childId: 'child1', subject: 'Mathematics', assessment: 'Quiz 3', type: 'Quiz', score: '92%', grade: 'A', date: '2025-10-28', teacher: 'Mr. Jean-Luc', comments: 'Great work!' },
    { childId: 'child1', subject: 'Science', assessment: 'Lab Report', type: 'Assignment', score: '85%', grade: 'B+', date: '2025-10-27', teacher: 'Ms. Sophie', comments: 'Good effort.' },
    { childId: 'child2', subject: 'History', assessment: 'Chapter 2 Test', type: 'Test', score: '88%', grade: 'B+', date: '2025-10-26', teacher: 'Mr. Rakoto', comments: 'Well done.' },
  ],
};

export default function ParentGradesPage() {
  const [selectedChild, setSelectedChild] = useState('child1');
  const [dateRange, setDateRange] = useState<DateRange | undefined>();

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Grades & Reports</h1>
      <Card>
        <CardHeader>
          <CardTitle>Filters</CardTitle>
        </CardHeader>
        <CardContent className="flex gap-4">
          <Select value={selectedChild} onValueChange={setSelectedChild}>
            <SelectTrigger className="w-[280px]">
              <SelectValue placeholder="Select a child" />
            </SelectTrigger>
            <SelectContent>
              {gradesData.children.map(c => (
                <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
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
          <DatePickerWithRange onSelect={setDateRange} />
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Grades</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Subject</TableHead>
                <TableHead>Assessment</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Score</TableHead>
                <TableHead>Grade</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Teacher</TableHead>
                <TableHead>Comments</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {gradesData.grades.filter(g => g.childId === selectedChild).map((grade, index) => (
                <TableRow key={index}>
                  <TableCell>{grade.subject}</TableCell>
                  <TableCell>{grade.assessment}</TableCell>
                  <TableCell>{grade.type}</TableCell>
                  <TableCell>{grade.score}</TableCell>
                  <TableCell>{grade.grade}</TableCell>
                  <TableCell>{grade.date}</TableCell>
                  <TableCell>{grade.teacher}</TableCell>
                  <TableCell>{grade.comments}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
