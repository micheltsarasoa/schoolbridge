'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { List, Grid } from 'lucide-react';

const coursesData = [
  {
    title: 'Algebra I',
    subject: 'Mathematics',
    teacher: 'Mr. Jean-Luc',
    progress: 75,
    lastAccessed: '2 days ago',
    offline: true,
  },
  {
    title: 'Physics Basics',
    subject: 'Science',
    teacher: 'Ms. Sophie',
    progress: 60,
    lastAccessed: 'Yesterday',
    offline: false,
  },
  {
    title: 'Madagascar History',
    subject: 'History',
    teacher: 'Mr. Rakoto',
    progress: 90,
    lastAccessed: 'Today',
    offline: true,
  },
  // Add more courses as needed
];

export default function StudentCoursesPage() {
  const [view, setView] = useState('grid');

  return (
    <div className="flex gap-6">
      <div className="w-1/4">
        <h2 className="text-lg font-semibold mb-4">Filters</h2>
        <div className="space-y-4">
          <div>
            <h3 className="font-medium mb-2">By Subject</h3>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="All Subjects" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Subjects</SelectItem>
                <SelectItem value="math">Mathematics</SelectItem>
                <SelectItem value="science">Science</SelectItem>
                <SelectItem value="history">History</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <h3 className="font-medium mb-2">By Progress</h3>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="All Progress" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Progress</SelectItem>
                <SelectItem value="0-25">0-25%</SelectItem>
                <SelectItem value="25-50">25-50%</SelectItem>
                <SelectItem value="50-75">50-75%</SelectItem>
                <SelectItem value="75-100">75-100%</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <h3 className="font-medium mb-2">Other</h3>
            <div className="flex items-center space-x-2">
              <input type="checkbox" id="downloaded" />
              <label htmlFor="downloaded">Downloaded Only</label>
            </div>
          </div>
        </div>
      </div>
      <div className="w-3/4">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold">My Courses</h1>
          <div className="flex items-center gap-4">
            <Input placeholder="Search courses..." className="w-64" />
            <div className="flex items-center gap-2">
              <Button variant={view === 'grid' ? 'secondary' : 'ghost'} size="icon" onClick={() => setView('grid')}>
                <Grid className="h-5 w-5" />
              </Button>
              <Button variant={view === 'list' ? 'secondary' : 'ghost'} size="icon" onClick={() => setView('list')}>
                <List className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
        <div className={`grid ${view === 'grid' ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' : 'gap-4'}`}>
          {coursesData.map((course, index) => (
            <Card key={index}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle>{course.title}</CardTitle>
                    <CardDescription>{course.subject}</CardDescription>
                  </div>
                  {course.offline && <Badge variant="outline">Offline</Badge>}
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-2">Taught by {course.teacher}</p>
                <div className="flex items-center justify-between text-sm mb-2">
                  <span>Progress</span>
                  <span>{course.progress}%</span>
                </div>
                <Progress value={course.progress} className="h-2" />
                <p className="text-xs text-muted-foreground mt-2">Last accessed: {course.lastAccessed}</p>
              </CardContent>
              <div className="flex justify-end p-4 pt-0">
                <Button>Continue</Button>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}