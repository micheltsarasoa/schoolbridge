'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

// Dummy data for teacher's classes and students
const attendanceData = {
  classes: [
    { id: 'class1', name: 'Class 9A - Mathematics' },
    { id: 'class2', name: 'Class 10B - Physics' },
  ],
  students: {
    class1: [
      { id: 'student1', name: 'Student A', avatar: '/placeholder.svg?height=32&width=32' },
      { id: 'student2', name: 'Student B', avatar: '/placeholder.svg?height=32&width=32' },
      { id: 'student3', name: 'Student C', avatar: '/placeholder.svg?height=32&width=32' },
    ],
    class2: [
      { id: 'student4', name: 'Student D', avatar: '/placeholder.svg?height=32&width=32' },
      { id: 'student5', name: 'Student E', avatar: '/placeholder.svg?height=32&width=32' },
    ],
  },
};

export default function TeacherAttendancePage() {
  const [selectedClass, setSelectedClass] = useState('class1');
  const [attendance, setAttendance] = useState<Record<string, string>>({});

  const handleStatusChange = (studentId: string, status: 'Present' | 'Absent' | 'Late' | 'Excused') => {
    setAttendance(prev => ({ ...prev, [studentId]: status }));
  };

  const saveAttendance = async () => {
    const date = new Date().toISOString();
    for (const studentId in attendance) {
      const status = attendance[studentId];
      await fetch('/api/attendance', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ studentId, classId: selectedClass, status, date }),
      });
    }
    // Add some user feedback here, e.g., a toast notification
    console.log('Attendance saved!');
  };

  const students = attendanceData.students[selectedClass as keyof typeof attendanceData.students] || [];

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Take Attendance</h1>

      <Card>
        <CardHeader>
          <CardTitle>Select Class</CardTitle>
        </CardHeader>
        <CardContent>
          <Select value={selectedClass} onValueChange={setSelectedClass}>
            <SelectTrigger className="w-[280px]">
              <SelectValue placeholder="Select a class" />
            </SelectTrigger>
            <SelectContent>
              {attendanceData.classes.map(c => (
                <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Student List</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {students.map(student => (
              <div key={student.id} className="flex items-center justify-between p-3 border rounded-md">
                <div className="flex items-center gap-3">
                  <Avatar className="h-9 w-9">
                    <AvatarImage src={student.avatar} alt={student.name} />
                    <AvatarFallback>{student.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <p className="font-semibold">{student.name}</p>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant={attendance[student.id] === 'Present' ? 'default' : 'outline'}
                    onClick={() => handleStatusChange(student.id, 'Present')}
                  >
                    Present
                  </Button>
                  <Button
                    variant={attendance[student.id] === 'Absent' ? 'destructive' : 'outline'}
                    onClick={() => handleStatusChange(student.id, 'Absent')}
                  >
                    Absent
                  </Button>
                  <Button
                    variant={attendance[student.id] === 'Late' ? 'secondary' : 'outline'}
                    onClick={() => handleStatusChange(student.id, 'Late')}
                  >
                    Late
                  </Button>
                  <Button
                    variant={attendance[student.id] === 'Excused' ? 'secondary' : 'outline'}
                    onClick={() => handleStatusChange(student.id, 'Excused')}
                  >
                    Excused
                  </Button>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-6 flex justify-end">
            <Button onClick={saveAttendance}>Save Attendance</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
