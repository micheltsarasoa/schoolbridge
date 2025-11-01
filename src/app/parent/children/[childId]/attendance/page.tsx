'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { toast } from 'sonner';

interface AttendanceRecord {
  id: string;
  date: string;
  present: boolean;
  notes: string | null;
}

export default function ParentChildAttendancePage({ params }: { params: { childId: string } }) {
  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>([]);
  const [summary, setSummary] = useState({ present: 0, absent: 0, late: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchAttendance() {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`/api/attendance?studentId=${params.childId}`);
        if (!res.ok) throw new Error('Failed to fetch attendance records');
        const data: { attendanceRecords: AttendanceRecord[] } = await res.json();
        setAttendanceRecords(data.attendanceRecords);

        let presentCount = 0;
        let absentCount = 0;
        let lateCount = 0;

        data.attendanceRecords.forEach(record => {
          if (record.present && record.notes === 'Late') {
            lateCount++;
          } else if (record.present) {
            presentCount++;
          } else {
            absentCount++;
          }
        });
        setSummary({ present: presentCount, absent: absentCount, late: lateCount });

      } catch (err: any) {
        toast.error(err.message);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchAttendance();
  }, [params.childId]);

  if (loading) return <p>Loading attendance data...</p>;
  if (error) return <p className="text-red-500">Error: {error}</p>;

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Attendance for Child {params.childId}</h1>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Present</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{summary.present} days</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Absent</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{summary.absent} days</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Late</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{summary.late} days</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Attendance Log</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Notes</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {attendanceRecords.map(record => (
                <TableRow key={record.id}>
                  <TableCell>{new Date(record.date).toLocaleDateString()}</TableCell>
                  <TableCell>{record.present ? (record.notes === 'Late' ? 'Late' : 'Present') : (record.notes === 'Excused' ? 'Excused' : 'Absent')}</TableCell>
                  <TableCell>{record.notes || '---'}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
