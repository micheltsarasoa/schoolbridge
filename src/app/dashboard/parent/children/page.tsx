'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';

const childrenData = [
  {
    id: 'child1',
    name: 'Student A',
    studentId: 'SB-12345',
    class: 'Grade 10',
    school: 'SchoolBridge High School',
    attendanceRate: 95,
    averageGrade: 'A-',
    avatar: '/placeholder.svg?height=64&width=64',
    verificationStatus: 'Verified',
  },
  {
    id: 'child2',
    name: 'Student B',
    studentId: 'SB-67890',
    class: 'Grade 8',
    school: 'SchoolBridge Middle School',
    attendanceRate: 88,
    averageGrade: 'B+',
    avatar: '/placeholder.svg?height=64&width=64',
    verificationStatus: 'Pending',
  },
];

export default function ParentChildrenPage() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">My Children</h1>
        <Button>+ Add Another Child</Button>
      </div>
      <div className="grid gap-6 md:grid-cols-2">
        {childrenData.map(child => (
          <Card key={child.id}>
            <CardHeader className="flex flex-row items-center gap-4">
              <Avatar className="h-16 w-16">
                <AvatarImage src={child.avatar} alt={child.name} />
                <AvatarFallback>{child.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div>
                <CardTitle>{child.name}</CardTitle>
                <CardDescription>{child.studentId}</CardDescription>
                <Badge variant={child.verificationStatus === 'Verified' ? 'default' : 'secondary'} className="mt-2">
                  {child.verificationStatus}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">School: {child.school}</p>
              <p className="text-sm text-muted-foreground">Class: {child.class}</p>
              <div className="grid grid-cols-2 gap-4 mt-4">
                <div>
                  <p className="text-sm font-medium">Attendance</p>
                  <p className="text-lg font-bold">{child.attendanceRate}%</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Average Grade</p>
                  <p className="text-lg font-bold">{child.averageGrade}</p>
                </div>
              </div>
              <div className="mt-4 flex justify-end">
                <Button asChild>
                  <a href={`/parent/children/${child.id}`}>View Details</a>
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}