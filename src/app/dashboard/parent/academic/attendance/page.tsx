'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';

const attendanceData = {
  children: [
    { id: 'child1', name: 'Student A' },
    { id: 'child2', name: 'Student B' },
  ],
  attendance: {
    child1: {
      stats: { present: 95, absent: 3, late: 2, excused: 0 },
      log: {
        '2025-10-30': 'Present',
        '2025-10-29': 'Present',
        '2025-10-28': 'Absent',
        '2025-10-27': 'Late',
      },
    },
    child2: {
      stats: { present: 88, absent: 5, late: 7, excused: 2 },
      log: {},
    },
  },
};

export default function ParentAttendancePage() {
  const [selectedChild, setSelectedChild] = useState('child1');
  const childAttendance = attendanceData.attendance[selectedChild as keyof typeof attendanceData.attendance];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Attendance</h1>
      <div className="flex items-center gap-4">
        <Select value={selectedChild} onValueChange={setSelectedChild}>
          <SelectTrigger className="w-[280px]">
            <SelectValue placeholder="Select a child" />
          </SelectTrigger>
          <SelectContent>
            {attendanceData.children.map(c => (
              <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Monthly View</CardTitle>
            </CardHeader>
            <CardContent>
              <Calendar
                mode="single"
                // selected={new Date()} // This would be dynamic
                className="rounded-md border"
                // Add modifiers to color-code the days
              />
            </CardContent>
          </Card>
        </div>
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Attendance Statistics</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex justify-between"><span>Present:</span> <span>{childAttendance.stats.present} days</span></div>
              <div className="flex justify-between"><span>Absent:</span> <span>{childAttendance.stats.absent} days</span></div>
              <div className="flex justify-between"><span>Late:</span> <span>{childAttendance.stats.late} days</span></div>
              <div className="flex justify-between"><span>Excused:</span> <span>{childAttendance.stats.excused} days</span></div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
