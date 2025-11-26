'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Loader2, Save, Eye, Upload, Globe, TrendingUp, Monitor } from 'lucide-react';
import type { Course } from '@/types/course';
import { getStatusColor } from '@/lib/course-utils';
import Link from 'next/link';

interface CourseHeaderProps {
  course: Course | null;
  onUpdate: (field: string, value: any) => void;
  onSave: () => void;
  isSaving: boolean;
  lastSaved: Date | null;
  hasUnsavedChanges: boolean;
}

export function CourseHeader({ course, onUpdate, onSave, isSaving, lastSaved, hasUnsavedChanges }: CourseHeaderProps) {
  if (!course) return null;

  return (
    <div className="border-b bg-card">
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Create Course</h1>
            <p className="text-sm text-muted-foreground mt-1">
              {lastSaved ? `Last saved ${lastSaved.toLocaleTimeString()}` : 'Not saved yet'}
              {hasUnsavedChanges && ' • Unsaved changes'}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" asChild>
              <Link href="/preview" target="_blank">
                <Eye className="h-4 w-4 mr-2" />
                Preview
              </Link>
            </Button>
            <Button onClick={onSave} disabled={isSaving} size="sm">
              {isSaving ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Save Draft
                </>
              )}
            </Button>
            <Button 
              onClick={() => {
                onUpdate('status', course.status === 'DRAFT' ? 'PUBLISHED' : 'DRAFT');
              }}
              variant={course.status === 'PUBLISHED' ? 'default' : 'outline'}
              size="sm"
            >
              <Upload className="h-4 w-4 mr-2" />
              {course.status === 'PUBLISHED' ? 'Published' : 'Publish Course'}
            </Button>
          </div>
        </div>

        <Card className="p-6">
          <div className="space-y-4">
            <div>
              <Input
                placeholder="Enter course title..."
                value={course.title}
                onChange={(e) => onUpdate('title', e.target.value)}
                className="text-2xl font-semibold h-auto py-2"
                maxLength={200}
              />
              <p className="text-xs text-muted-foreground mt-1">
                {course.title.length}/200 characters
              </p>
            </div>

            <div>
              <Input
                placeholder="Enter course subtitle (optional)..."
                value={course.subtitle || ''}
                onChange={(e) => onUpdate('subtitle', e.target.value)}
                maxLength={150}
              />
              <p className="text-xs text-muted-foreground mt-1">
                {(course.subtitle || '').length}/150 characters
              </p>
            </div>

            <div>
              <Textarea
                placeholder="Describe what students will learn in this course..."
                value={course.description || ''}
                onChange={(e) => onUpdate('description', e.target.value)}
                className="min-h-24"
                maxLength={2000}
              />
              <p className="text-xs text-muted-foreground mt-1">
                {(course.description || '').length}/2000 characters
              </p>
            </div>

            <div className="grid grid-cols-4 gap-4">
              <div className="space-y-2">
                <Label className="text-xs">Language</Label>
                <Select value={course.language} onValueChange={(value) => onUpdate('language', value)}>
                  <SelectTrigger>
                    <Globe className="h-4 w-4 mr-2" />
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="FR">French (FR)</SelectItem>
                    <SelectItem value="EN">English (EN)</SelectItem>
                    <SelectItem value="MG">Malagasy (MG)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="text-xs">Course Level</Label>
                <Select value={course.level} onValueChange={(value) => onUpdate('level', value)}>
                  <SelectTrigger>
                    <TrendingUp className="h-4 w-4 mr-2" />
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="BEGINNER">Beginner</SelectItem>
                    <SelectItem value="INTERMEDIATE">Intermediate</SelectItem>
                    <SelectItem value="ADVANCED">Advanced</SelectItem>
                    <SelectItem value="ALL_LEVELS">All Levels</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="text-xs">Content Type</Label>
                <Select value={course.contentType} onValueChange={(value) => onUpdate('contentType', value)}>
                  <SelectTrigger>
                    <Monitor className="h-4 w-4 mr-2" />
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="LECTURE">Lecture (In-person)</SelectItem>
                    <SelectItem value="ONLINE">Online</SelectItem>
                    <SelectItem value="HYBRID">Hybrid</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="text-xs">Status</Label>
                <div className="h-10 flex items-center">
                  <Badge className={getStatusColor(course.status)}>
                    {course.status}
                  </Badge>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
