'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { toast } from 'sonner';
import { AttendanceStatus } from '@/generated/prisma';

interface Class {
  id: string;
  name: string;
}

interface Student {
  id: string;
  name: string;
  avatar: string;
}

interface AttendanceRecord {
  studentId: string;
  status: AttendanceStatus;
  notes?: string;
}

export default function TeacherAttendancePage() {
  const [classes, setClasses] = useState<Class[]>([]);
  const [selectedClass, setSelectedClass] = useState<string | undefined>(undefined);
  const [students, setStudents] = useState<Student[]>([]);
  const [attendance, setAttendance] = useState<Record<string, AttendanceStatus>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      setError(null);
      try {
        // Fetch classes taught by the teacher
        const classesRes = await fetch('/api/teacher/classes');
        if (!classesRes.ok) throw new Error('Failed to fetch classes');
        const classesData: Class[] = await classesRes.json();
        setClasses(classesData);
        if (classesData.length > 0 && !selectedClass) {
          setSelectedClass(classesData[0].id);
        }
      } catch (err: any) {
        setError(err.message);
        toast.error(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  useEffect(() => {
    async function fetchClassData() {
      if (!selectedClass) return;

      setLoading(true);
      setError(null);
      try {
        // Fetch students for the selected class
        const studentsRes = await fetch(`/api/classes/${selectedClass}/students`);
        if (!studentsRes.ok) throw new Error('Failed to fetch students');
        const studentsData: Student[] = await studentsRes.json();
        setStudents(studentsData);

        // Fetch existing attendance for today
        const today = new Date().toISOString().split('T')[0];
        const attendanceRes = await fetch(`/api/attendance?classId=${selectedClass}&date=${today}`);
        if (!attendanceRes.ok) throw new Error('Failed to fetch attendance');
        const attendanceData: { attendanceRecords: AttendanceRecord[] } = await attendanceRes.json();

        const initialAttendance: Record<string, AttendanceStatus> = {};
        attendanceData.attendanceRecords.forEach(record => {
          initialAttendance[record.studentId] = record.status;
        });
        setAttendance(initialAttendance);

      } catch (err: any) {
        setError(err.message);
        toast.error(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchClassData();
  }, [selectedClass]);

  const handleStatusChange = (studentId: string, status: AttendanceStatus) => {
    setAttendance(prev => ({ ...prev, [studentId]: status }));
  };

  const saveAttendance = async () => {
    if (!selectedClass) {
      toast.error('Please select a class first.');
      return;
    }
    const date = new Date().toISOString();
    try {
      for (const student of students) {
        const status = attendance[student.id] || AttendanceStatus.ABSENT; // Default to ABSENT if not marked
        const res = await fetch('/api/attendance', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ studentId: student.id, classId: selectedClass, status, date }),
        });
        if (!res.ok) throw new Error(`Failed to save attendance for ${student.name}`);
      }
      toast.success('Attendance saved successfully!');
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  if (loading) return <p>Loading attendance data...</p>;
  if (error) return <p className="text-red-500">Error: {error}</p>;

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
              {classes.map(c => (
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
            {students.length === 0 ? (
              <p>No students found for this class.</p>
            ) : (
              students.map(student => (
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
                      variant={attendance[student.id] === AttendanceStatus.PRESENT ? 'default' : 'outline'}
                      onClick={() => handleStatusChange(student.id, AttendanceStatus.PRESENT)}
                    >
                      Present
                    </Button>
                    <Button
                      variant={attendance[student.id] === AttendanceStatus.ABSENT ? 'destructive' : 'outline'}
                      onClick={() => handleStatusChange(student.id, AttendanceStatus.ABSENT)}
                    >
                      Absent
                    </Button>
                    <Button
                      variant={attendance[student.id] === AttendanceStatus.LATE ? 'secondary' : 'outline'}
                      onClick={() => handleStatusChange(student.id, AttendanceStatus.LATE)}
                    >
                      Late
                    </Button>
                    <Button
                      variant={attendance[student.id] === AttendanceStatus.EXCUSED ? 'secondary' : 'outline'}
                      onClick={() => handleStatusChange(student.id, AttendanceStatus.EXCUSED)}
                    >
                      Excused
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>
          <div className="mt-6 flex justify-end">
            <Button onClick={saveAttendance} disabled={loading}>Save Attendance</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
