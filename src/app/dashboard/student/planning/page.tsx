'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FullCalendarComponent } from '@/components/ui/full-calendar';

const deadlines = [
  { title: 'Math Quiz', dueDate: '2025-11-02', subject: 'Mathematics' },
  { title: 'Physics Lab Report', dueDate: '2025-11-05', subject: 'Physics' },
];

export default function StudentPlanningPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">My Planning</h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Weekly Schedule</CardTitle>
            </CardHeader>
            <CardContent>
              <FullCalendarComponent />
            </CardContent>
          </Card>
        </div>
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Upcoming Deadlines</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-4">
                {deadlines.map((deadline, index) => (
                  <li key={index} className="flex justify-between items-center">
                    <div>
                      <p className="font-semibold">{deadline.title}</p>
                      <p className="text-sm text-muted-foreground">{deadline.subject}</p>
                    </div>
                    <p className="text-sm text-muted-foreground">{deadline.dueDate}</p>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}