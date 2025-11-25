'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { List, Grid, AlertCircle } from 'lucide-react';

type Course = {
  id: string;
  title: string;
  description?: string;
  subject: string;
  teacher: string;
  teacherId?: string;
  progress: number;
  lastAccessed: string;
  contentCount: number;
};

type CoursesResponse = {
  courses: Course[];
  stats: {
    totalCourses: number;
    subjects: string[];
  };
};

export default function StudentCoursesPage() {
  const router = useRouter();
  const [view, setView] = useState('grid');
  const [courses, setCourses] = useState<Course[]>([]);
  const [filteredCourses, setFilteredCourses] = useState<Course[]>([]);
  const [subjects, setSubjects] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('all');

  // Fetch courses on mount
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/student/courses');

        if (!response.ok) {
          throw new Error('Failed to load courses');
        }

        const data: CoursesResponse = await response.json();
        setCourses(data.courses);
        setSubjects(data.stats.subjects);
        setFilteredCourses(data.courses);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load courses');
        console.error('Error fetching courses:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  // Filter courses based on search query and selected subject
  useEffect(() => {
    let filtered = courses;

    // Filter by subject
    if (selectedSubject !== 'all') {
      filtered = filtered.filter((course) => course.subject === selectedSubject);
    }

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(
        (course) =>
          course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          course.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
          course.teacher.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredCourses(filtered);
  }, [courses, searchQuery, selectedSubject]);

  const handleContinue = (courseId: string) => {
    router.push(`/student/course/${courseId}`);
  };

  if (error) {
    return (
      <div className="w-full p-6">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="flex gap-6">
      <div className="w-1/4">
        <h2 className="text-lg font-semibold mb-4">Filters</h2>
        <div className="space-y-4">
          <div>
            <h3 className="font-medium mb-2">By Subject</h3>
            <Select value={selectedSubject} onValueChange={setSelectedSubject}>
              <SelectTrigger>
                <SelectValue placeholder="All Subjects" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Subjects</SelectItem>
                {subjects.map((subject) => (
                  <SelectItem key={subject} value={subject}>
                    {subject}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
      <div className="w-3/4">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold">My Courses</h1>
          <div className="flex items-center gap-4">
            <Input
              placeholder="Search courses..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-64"
            />
            <div className="flex items-center gap-2">
              <Button
                variant={view === 'grid' ? 'secondary' : 'ghost'}
                size="icon"
                onClick={() => setView('grid')}
              >
                <Grid className="h-5 w-5" />
              </Button>
              <Button
                variant={view === 'list' ? 'secondary' : 'ghost'}
                size="icon"
                onClick={() => setView('list')}
              >
                <List className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center h-64">
            <p className="text-muted-foreground">Loading courses...</p>
          </div>
        ) : filteredCourses.length === 0 ? (
          <div className="flex items-center justify-center h-64">
            <p className="text-muted-foreground">
              {courses.length === 0 ? 'No courses found. You are not enrolled in any courses yet.' : 'No courses match your filters.'}
            </p>
          </div>
        ) : (
          <div className={`grid ${view === 'grid' ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' : 'gap-4'}`}>
            {filteredCourses.map((course) => (
              <Card key={course.id}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle>{course.title}</CardTitle>
                      <CardDescription>{course.subject}</CardDescription>
                    </div>
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
                  <p className="text-xs text-muted-foreground">Content: {course.contentCount} items</p>
                </CardContent>
                <div className="flex justify-end p-4 pt-0">
                  <Button onClick={() => handleContinue(course.id)}>Continue</Button>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}