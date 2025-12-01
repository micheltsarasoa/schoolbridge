'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';

const noticesData = [
  { title: 'School Holiday Announced', school: 'SchoolBridge High School', date: 'Oct 29, 2025', priority: 'High', read: false, preview: 'Please be advised that the school will be closed on...' },
  { title: 'Annual Sports Day', school: 'SchoolBridge High School', date: 'Oct 25, 2025', priority: 'Normal', read: true, preview: 'The annual sports day will be held on...' },
];

export default function ParentNoticesPage() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">School Notices</h1>
        <div className="flex items-center gap-4">
          <Input placeholder="Search notices..." className="w-64" />
        </div>
      </div>
      <div className="flex gap-2">
        <Button variant="secondary">All</Button>
        <Button variant="outline">Urgent</Button>
        <Button variant="outline">My School</Button>
        <Button variant="outline">Class-specific</Button>
      </div>
      <div className="grid gap-6">
        {noticesData.map((notice, index) => (
          <Card key={index}>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle>{notice.title}</CardTitle>
                  <CardDescription>{notice.school} - {notice.date}</CardDescription>
                </div>
                <div className="flex gap-2 items-center">
                  {notice.priority === 'High' && <Badge variant="destructive">Urgent</Badge>}
                  <Badge variant={notice.read ? 'outline' : 'default'}>{notice.read ? 'Read' : 'Unread'}</Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">{notice.preview}</p>
              <div className="mt-4 flex justify-end">
                <Button>Read More</Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
