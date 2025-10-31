'use client';

import { useState } from 'react';
import { DateRange } from 'react-day-picker';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { DatePickerWithRange } from '@/components/ui/date-range-picker'; // Assuming this component exists

// Dummy data for attendance reports
const reportData = {
  classes: [
    { id: 'class1', name: 'Class 9A - Mathematics' },
    { id: 'class2', name: 'Class 10B - Physics' },
  ],
  attendance: [
    { id: '1', student: 'Student A', class: 'Class 9A', date: '2025-10-30', status: 'Present' },
    { id: '2', student: 'Student B', class: 'Class 9A', date: '2025-10-30', status: 'Absent' },
    { id: '3', student: 'Student C', class: 'Class 9A', date: '2025-10-30', status: 'Present' },
    { id: '4', student: 'Student D', class: 'Class 10B', date: '2025-10-30', status: 'Late' },
  ],
};

export default function AdminAttendancePage() {
  const [selectedClass, setSelectedClass] = useState('all');
  const [dateRange, setDateRange] = useState<DateRange | undefined>();

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Attendance Reports</h1>

      <Card>
        <CardHeader>
          <CardTitle>Filters</CardTitle>
        </CardHeader>
        <CardContent className="flex gap-4">
          <Select value={selectedClass} onValueChange={setSelectedClass}>
            <SelectTrigger className="w-[280px]">
              <SelectValue placeholder="Select a class" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Classes</SelectItem>
              {reportData.classes.map(c => (
                <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <DatePickerWithRange onSelect={setDateRange} />
          <Button>Apply Filters</Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Attendance Data</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Student</TableHead>
                <TableHead>Class</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {reportData.attendance.map(record => (
                <TableRow key={record.id}>
                  <TableCell>{record.student}</TableCell>
                  <TableCell>{record.class}</TableCell>
                  <TableCell>{record.date}</TableCell>
                  <TableCell>{record.status}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <div className="mt-6 flex justify-end">
            <Button variant="outline">Export as CSV</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
