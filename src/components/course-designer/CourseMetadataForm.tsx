'use client';

import { useEffect, useState } from 'react';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { AlertCircle, Image as ImageIcon } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Checkbox } from '@/components/ui/checkbox';

interface CourseMetadataFormProps {
  course: {
    title: string;
    description: string;
    subjectId: string;
    language: 'EN' | 'FR' | 'ES' | 'MG';
    requiresOnline: boolean;
    thumbnailUrl?: string;
  };
  onChange: (metadata: any) => void;
}

const LANGUAGES = [
  { value: 'EN', label: 'English' },
  { value: 'FR', label: 'French' },
  { value: 'ES', label: 'Spanish' },
  { value: 'MG', label: 'Malagasy' },
];

const courseMetadataSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters').max(255),
  description: z.string().min(10, 'Description must be at least 10 characters').max(2000),
  subjectId: z.string().min(1, 'Subject is required'),
  language: z.enum(['EN', 'FR', 'ES', 'MG']),
  requiresOnline: z.boolean(),
  thumbnailUrl: z.string().url('Invalid URL').optional().or(z.literal('')),
});

type CourseMetadata = z.infer<typeof courseMetadataSchema>;

export function CourseMetadataForm({
  course,
  onChange,
}: CourseMetadataFormProps) {
  const [subjects, setSubjects] = useState<Array<{ id: string; name: string }>>([]);
  const [loadingSubjects, setLoadingSubjects] = useState(true);
  const [subjectsError, setSubjectsError] = useState<string | null>(null);

  const form = useForm<CourseMetadata>({
    resolver: zodResolver(courseMetadataSchema),
    defaultValues: {
      title: course.title,
      description: course.description,
      subjectId: course.subjectId,
      language: course.language,
      requiresOnline: course.requiresOnline,
      thumbnailUrl: course.thumbnailUrl || '',
    },
  });

  // Fetch available subjects
  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        setLoadingSubjects(true);
        // TODO: Replace with actual API call
        const response = await fetch('/api/subjects');
        if (!response.ok) throw new Error('Failed to fetch subjects');
        const data = await response.json();
        setSubjects(data.subjects || []);
      } catch (error) {
        console.error('Error fetching subjects:', error);
        setSubjectsError('Failed to load subjects');
        // Hardcode some subjects for now
        setSubjects([
          { id: '1', name: 'Mathematics' },
          { id: '2', name: 'Science' },
          { id: '3', name: 'English' },
          { id: '4', name: 'History' },
          { id: '5', name: 'Geography' },
        ]);
      } finally {
        setLoadingSubjects(false);
      }
    };

    fetchSubjects();
  }, []);

  const onSubmit = (data: CourseMetadata) => {
    onChange(data);
  };

  return (
    <div className="space-y-6">
      {/* Course Info Card */}
      <Card className="p-6">
        <h2 className="text-lg font-semibold mb-6">Course Information</h2>

        {subjectsError && (
          <Alert className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{subjectsError}</AlertDescription>
          </Alert>
        )}

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Title */}
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Course Title *</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="e.g., Introduction to Web Development"
                      {...field}
                      className="text-base"
                    />
                  </FormControl>
                  <FormDescription>
                    This is the name students will see when browsing courses
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Description */}
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description *</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Describe what students will learn in this course..."
                      {...field}
                      rows={6}
                      className="resize-none"
                    />
                  </FormControl>
                  <FormDescription>
                    Provide a clear overview of the course content and learning objectives
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Subject */}
              <FormField
                control={form.control}
                name="subjectId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Subject *</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      disabled={loadingSubjects}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a subject" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {subjects.map((subject) => (
                          <SelectItem key={subject.id} value={subject.id}>
                            {subject.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      What subject is this course about?
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Language */}
              <FormField
                control={form.control}
                name="language"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Language *</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select language" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {LANGUAGES.map((lang) => (
                          <SelectItem key={lang.value} value={lang.value}>
                            {lang.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      What language is this course taught in?
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Thumbnail URL */}
            <FormField
              control={form.control}
              name="thumbnailUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Course Thumbnail URL</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="https://example.com/image.jpg"
                      {...field}
                      type="url"
                    />
                  </FormControl>
                  <FormDescription>
                    A cover image for your course (optional)
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Requires Online */}
            <FormField
              control={form.control}
              name="requiresOnline"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center gap-3 rounded-lg border p-4">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="flex-1">
                    <FormLabel className="cursor-pointer">
                      Requires Online Access
                    </FormLabel>
                    <FormDescription>
                      Check if this course requires internet connection to view all content
                    </FormDescription>
                  </div>
                </FormItem>
              )}
            />
          </form>
        </Form>
      </Card>

      {/* Tips Card */}
      <Card className="p-4 bg-muted/50 border-muted">
        <h3 className="font-semibold mb-2 text-sm">Tips for a Great Course</h3>
        <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
          <li>Use a descriptive title that clearly indicates the course topic</li>
          <li>Write a compelling description to attract students</li>
          <li>Add a professional thumbnail image to increase engagement</li>
          <li>Ensure your course content is well-organized and easy to follow</li>
          <li>Consider making your course available offline for better accessibility</li>
        </ul>
      </Card>
    </div>
  );
}
