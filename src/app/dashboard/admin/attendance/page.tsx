'use client';

import { useState, useEffect } from 'react';
import { DateRange } from 'react-day-picker';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { DatePickerWithRange } from '@/components/ui/date-range-picker';
import { toast } from 'sonner';

interface Class {
  id: string;
  name: string;
}

interface AttendanceRecord {
  id: string;
  student: { name: string };
  class: { name: string };
  date: string;
  present: boolean;
  notes: string | null;
}

export default function AdminAttendancePage() {
  const [classes, setClasses] = useState<Class[]>([]);
  const [selectedClass, setSelectedClass] = useState('all');
  const [dateRange, setDateRange] = useState<DateRange | undefined>();
  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchClasses() {
      try {
        const res = await fetch('/api/classes');
        if (!res.ok) throw new Error('Failed to fetch classes');
        const data: Class[] = await res.json();
        setClasses(data);
      } catch (err: any) {
        toast.error(err.message);
        setError(err.message);
      }
    }
    fetchClasses();
  }, []);

  const applyFilters = async () => {
    setLoading(true);
    setError(null);
    try {
      let url = '/api/attendance?';
      if (selectedClass !== 'all') {
        url += `classId=${selectedClass}&`;
      }
      if (dateRange?.from) {
        url += `startDate=${dateRange.from.toISOString()}&`;
      }
      if (dateRange?.to) {
        url += `endDate=${dateRange.to.toISOString()}&`;
      }

      const res = await fetch(url);
      if (!res.ok) throw new Error('Failed to fetch attendance records');
      const data: { attendanceRecords: AttendanceRecord[] } = await res.json();
      setAttendanceRecords(data.attendanceRecords);
    } catch (err: any) {
      toast.error(err.message);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    applyFilters(); // Apply filters on initial load and when filters change
  }, [selectedClass, dateRange]);

  if (loading) return <p>Loading attendance data...</p>;
  if (error) return <p className="text-red-500">Error: {error}</p>;

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
              {classes.map(c => (
                <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <DatePickerWithRange onSelect={setDateRange} />
          <Button onClick={applyFilters}>Apply Filters</Button>
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
                <TableHead>Notes</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {attendanceRecords.map(record => (
                <TableRow key={record.id}>
                  <TableCell>{record.student.name}</TableCell>
                  <TableCell>{record.class.name}</TableCell>
                  <TableCell>{new Date(record.date).toLocaleDateString()}</TableCell>
                  <TableCell>{record.present ? 'Present' : 'Absent'}</TableCell>
                  <TableCell>{record.notes || '---'}</TableCell>
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
