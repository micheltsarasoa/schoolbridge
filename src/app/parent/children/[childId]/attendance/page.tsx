'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

// Dummy data for child's attendance
const attendanceData = {
  summary: {
    present: 95,
    absent: 3,
    late: 2,
  },
  log: [
    { date: '2025-10-30', status: 'Present' },
    { date: '2025-10-29', status: 'Present' },
    { date: '2025-10-28', status: 'Absent' },
    { date: '2025-10-27', status: 'Late' },
  ],
};

export default function ParentChildAttendancePage({ params }: { params: { childId: string } }) {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Attendance for Child {params.childId}</h1>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Present</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{attendanceData.summary.present} days</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Absent</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{attendanceData.summary.absent} days</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Late</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{attendanceData.summary.late} days</div>
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
              </TableRow>
            </TableHeader>
            <TableBody>
              {attendanceData.log.map((record, index) => (
                <TableRow key={index}>
                  <TableCell>{record.date}</TableCell>
                  <TableCell>{record.status}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
