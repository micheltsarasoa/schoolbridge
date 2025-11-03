'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Plus, Upload } from 'lucide-react';

export default function TeacherCoursesPage() {
    const router = useRouter();

    return (
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold">My Courses</h1>
          <p className="text-muted-foreground">Manage and create courses for your classes</p>
        </div>

        <div className="flex gap-3 flex-wrap">
          <Button
            onClick={() => router.push('/teacher/courses/create')}
            className="gap-2"
          >
            <Plus className="h-4 w-4" />
            Create Course
          </Button>
          <Button
            onClick={() => router.push('/teacher/courses/create-from-template')}
            variant="outline"
            className="gap-2 dark:border-slate-600 dark:hover:bg-slate-800"
          >
            <Upload className="h-4 w-4" />
            Import from Template
          </Button>
        </div>

        {/* Placeholder for courses list - to be implemented */}
        <div className="rounded-lg border border-dashed dark:border-slate-700 p-8 text-center">
          <p className="text-muted-foreground">Courses will appear here once created</p>
        </div>
      </div>
    );
  }
