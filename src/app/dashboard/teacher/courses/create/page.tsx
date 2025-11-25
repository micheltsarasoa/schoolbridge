'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Settings, BookOpen, Eye, Send, AlertCircle, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

// Import components we'll build
import { CourseMetadataForm } from '@/components/course-designer/CourseMetadataForm';
import { ContentManager } from '@/components/course-designer/ContentManager';
import { CoursePreview } from '@/components/course-designer/CoursePreview';

interface CourseDesignerState {
  id?: string;
  title: string;
  description: string;
  subjectId: string;
  language: 'EN' | 'FR' | 'ES' | 'MG';
  requiresOnline: boolean;
  thumbnailUrl?: string;
  status: 'DRAFT' | 'UNDER_REVIEW' | 'APPROVED' | 'PUBLISHED' | 'ARCHIVED';
  content: any[];
}

const INITIAL_COURSE_STATE: CourseDesignerState = {
  title: '',
  description: '',
  subjectId: '',
  language: 'EN',
  requiresOnline: false,
  status: 'DRAFT',
  content: [],
};

export default function CourseDesignerPage() {
  const router = useRouter();
  const [course, setCourse] = useState<CourseDesignerState>(INITIAL_COURSE_STATE);
  const [activeTab, setActiveTab] = useState('metadata');
  const [isSaving, setIsSaving] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);

  const handleMetadataChange = (metadata: Partial<CourseDesignerState>) => {
    setCourse((prev) => ({ ...prev, ...metadata }));
    setErrors([]);
  };

  const handleContentChange = (content: any[]) => {
    setCourse((prev) => ({ ...prev, content }));
  };

  const validateCourse = (): boolean => {
    const newErrors: string[] = [];

    if (!course.title.trim()) {
      newErrors.push('Course title is required');
    }

    if (!course.description.trim()) {
      newErrors.push('Course description is required');
    }

    if (!course.subjectId) {
      newErrors.push('Subject is required');
    }

    if (course.content.length === 0) {
      newErrors.push('Course must have at least one content item');
    }

    setErrors(newErrors);
    return newErrors.length === 0;
  };

  const handleSaveDraft = async () => {
    setIsSaving(true);
    try {
      // TODO: Save to API
      console.log('Saving draft:', course);
      // api call here
      await new Promise((resolve) => setTimeout(resolve, 1000));
      // router.push('/teacher/courses');
    } catch (error) {
      console.error('Error saving draft:', error);
      setErrors(['Failed to save draft']);
    } finally {
      setIsSaving(false);
    }
  };

  const handleSubmitForReview = async () => {
    if (!validateCourse()) {
      setActiveTab('metadata');
      return;
    }

    setIsSaving(true);
    try {
      // TODO: Submit to API
      console.log('Submitting for review:', course);
      // api call here
      await new Promise((resolve) => setTimeout(resolve, 1000));
      router.push('/teacher/courses');
    } catch (error) {
      console.error('Error submitting:', error);
      setErrors(['Failed to submit course for review']);
    } finally {
      setIsSaving(false);
    }
  };

  const completionPercentage = Math.round(
    ((course.title ? 25 : 0) +
      (course.description ? 25 : 0) +
      (course.subjectId ? 25 : 0) +
      (course.content.length > 0 ? 25 : 0)) /
      4
  );

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/teacher/courses">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div className="flex flex-col gap-1">
            <h1 className="text-3xl font-bold">
              {course.title || 'Untitled Course'}
            </h1>
            <p className="text-sm text-muted-foreground">
              {course.status === 'DRAFT' ? 'Draft' : course.status}
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={handleSaveDraft}
            disabled={isSaving}
          >
            Save Draft
          </Button>
          <Button
            onClick={handleSubmitForReview}
            disabled={isSaving}
            className="gap-2"
          >
            <Send className="h-4 w-4" />
            Submit for Review
          </Button>
        </div>
      </div>

      {/* Completion Progress */}
      <Card className="p-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-semibold">Course Completion</h3>
            <p className="text-sm text-muted-foreground">
              {completionPercentage}% complete
            </p>
          </div>
          <div className="w-48 h-2 bg-muted rounded-full overflow-hidden">
            <div
              className="h-full bg-primary transition-all"
              style={{ width: `${completionPercentage}%` }}
            />
          </div>
        </div>
      </Card>

      {/* Errors Display */}
      {errors.length > 0 && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            <ul className="list-disc list-inside">
              {errors.map((error, idx) => (
                <li key={idx}>{error}</li>
              ))}
            </ul>
          </AlertDescription>
        </Alert>
      )}

      {/* Main Content Area with Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="metadata" className="gap-2">
            <Settings className="h-4 w-4" />
            <span className="hidden sm:inline">Course Info</span>
          </TabsTrigger>
          <TabsTrigger value="content" className="gap-2">
            <BookOpen className="h-4 w-4" />
            <span className="hidden sm:inline">Content</span>
          </TabsTrigger>
          <TabsTrigger value="preview" className="gap-2">
            <Eye className="h-4 w-4" />
            <span className="hidden sm:inline">Preview</span>
          </TabsTrigger>
        </TabsList>

        {/* Metadata Tab */}
        <TabsContent value="metadata" className="space-y-4">
          <CourseMetadataForm
            course={course}
            onChange={handleMetadataChange}
          />
        </TabsContent>

        {/* Content Tab */}
        <TabsContent value="content" className="space-y-4">
          <ContentManager
            content={course.content}
            onChange={handleContentChange}
            courseId={course.id}
          />
        </TabsContent>

        {/* Preview Tab */}
        <TabsContent value="preview" className="space-y-4">
          <CoursePreview course={course} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
