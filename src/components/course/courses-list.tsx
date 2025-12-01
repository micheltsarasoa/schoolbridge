'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, Upload, Search, Filter, Loader2 } from 'lucide-react';
import { CourseCard } from '@/components/course/course-card';
import { toast } from 'sonner';

interface Course {
  id: string;
  title: string;
  subtitle?: string | null;
  description?: string | null;
  status: string;
  language: string;
  level: string;
  contentType: string;
  totalSections: number;
  totalLectures: number;
  totalDuration: number;
  totalEnrollments: number;
  totalReviews: number;
  averageRating: number;
  isPublic: boolean;
  offlineAvailable: boolean;
  requiresOnline: boolean;
  publishedAt?: Date | null;
  updatedAt: Date;
  tags?: string[];
}

interface Category {
  categoryId: string;
  categoryName: string;
  courses: Course[];
}

export function CoursesList() {
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
  const [filteredCategories, setFilteredCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [levelFilter, setLevelFilter] = useState<string>('all');

  useEffect(() => {
    fetchCourses();
  }, []);

  useEffect(() => {
    filterCourses();
  }, [categories, searchQuery, statusFilter, levelFilter]);

  const fetchCourses = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/teacher/courses/list');
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch courses');
      }

      setCategories(data.categories || []);
    } catch (error) {
      console.error('Error fetching courses:', error);
      toast.error('Failed to load courses');
    } finally {
      setLoading(false);
    }
  };

  const filterCourses = () => {
    let filtered = categories.map((category) => ({
      ...category,
      courses: category.courses.filter((course) => {
        // Search filter
        const matchesSearch =
          searchQuery === '' ||
          course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          course.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          course.subtitle?.toLowerCase().includes(searchQuery.toLowerCase());

        // Status filter
        const matchesStatus =
          statusFilter === 'all' || course.status === statusFilter;

        // Level filter
        const matchesLevel =
          levelFilter === 'all' || course.level === levelFilter;

        return matchesSearch && matchesStatus && matchesLevel;
      }),
    }));

    // Remove empty categories
    filtered = filtered.filter((category) => category.courses.length > 0);

    setFilteredCategories(filtered);
  };

  const handleDeleteCourse = (courseId: string) => {
    // Refresh the list after deletion
    fetchCourses();
  };

  const handleDuplicateCourse = async (courseId: string) => {
    // TODO: Implement course duplication
    toast.info('Course duplication feature coming soon!');
  };

  const totalCourses = categories.reduce(
    (sum, cat) => sum + cat.courses.length,
    0
  );

  const draftCount = categories.reduce(
    (sum, cat) =>
      sum + cat.courses.filter((c) => c.status === 'DRAFT').length,
    0
  );

  const publishedCount = categories.reduce(
    (sum, cat) =>
      sum + cat.courses.filter((c) => c.status === 'PUBLISHED').length,
    0
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold">My Courses</h1>
        <p className="text-muted-foreground">
          Manage and create courses for your classes
        </p>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3 flex-wrap">
        <Button
          onClick={() => router.push('/dashboard/teacher/courses/course-builder')}
          className="gap-2"
        >
          <Plus className="h-4 w-4" />
          Create Course
        </Button>
        <Button
          onClick={() =>
            router.push('/dashboard/teacher/courses/create-from-template')
          }
          variant="outline"
          className="gap-2"
        >
          <Upload className="h-4 w-4" />
          Import from Template
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="rounded-lg border p-4">
          <div className="text-2xl font-bold">{totalCourses}</div>
          <div className="text-sm text-muted-foreground">Total Courses</div>
        </div>
        <div className="rounded-lg border p-4">
          <div className="text-2xl font-bold">{publishedCount}</div>
          <div className="text-sm text-muted-foreground">Published</div>
        </div>
        <div className="rounded-lg border p-4">
          <div className="text-2xl font-bold">{draftCount}</div>
          <div className="text-sm text-muted-foreground">Drafts</div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search courses..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <Filter className="h-4 w-4 mr-2" />
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="DRAFT">Draft</SelectItem>
            <SelectItem value="PUBLISHED">Published</SelectItem>
            <SelectItem value="UNPUBLISHED">Unpublished</SelectItem>
          </SelectContent>
        </Select>
        <Select value={levelFilter} onValueChange={setLevelFilter}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="Level" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Levels</SelectItem>
            <SelectItem value="BEGINNER">Beginner</SelectItem>
            <SelectItem value="INTERMEDIATE">Intermediate</SelectItem>
            <SelectItem value="ADVANCED">Advanced</SelectItem>
            <SelectItem value="ALL_LEVELS">All Levels</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Courses by Category */}
      {filteredCategories.length === 0 ? (
        <div className="rounded-lg border border-dashed p-12 text-center">
          <div className="mx-auto max-w-md">
            <h3 className="text-lg font-semibold mb-2">No courses found</h3>
            <p className="text-muted-foreground mb-4">
              {totalCourses === 0
                ? 'Start by creating your first course'
                : 'Try adjusting your filters or search query'}
            </p>
            {totalCourses === 0 && (
              <Button
                onClick={() =>
                  router.push('/dashboard/teacher/courses/course-builder')
                }
              >
                <Plus className="h-4 w-4 mr-2" />
                Create Your First Course
              </Button>
            )}
          </div>
        </div>
      ) : (
        <div className="space-y-8">
          {filteredCategories.map((category) => (
            <div key={category.categoryId}>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-semibold">{category.categoryName}</h2>
                <span className="text-sm text-muted-foreground">
                  {category.courses.length}{' '}
                  {category.courses.length === 1 ? 'course' : 'courses'}
                </span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {category.courses.map((course) => (
                  <CourseCard
                    key={course.id}
                    course={course}
                    onDelete={handleDeleteCourse}
                    onDuplicate={handleDuplicateCourse}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
