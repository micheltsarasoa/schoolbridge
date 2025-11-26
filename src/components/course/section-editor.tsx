'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { BookOpen, X } from 'lucide-react';
import type { Section } from '@/types/course';
import { useState } from 'react';

interface SectionEditorProps {
  section: Section;
  onUpdate: (updates: Partial<Section>) => void;
  onClose: () => void;
}

export function SectionEditor({ section, onUpdate, onClose }: SectionEditorProps) {
  const [title, setTitle] = useState(section.title);
  const [description, setDescription] = useState(section.description || '');

  const handleSave = () => {
    onUpdate({ title, description });
    onClose();
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div className="flex items-center gap-2">
          <BookOpen className="h-5 w-5" />
          <CardTitle>Section Details</CardTitle>
        </div>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="section-title">Section Title *</Label>
          <Input
            id="section-title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter section title"
            maxLength={100}
          />
          <p className="text-xs text-muted-foreground">{title.length}/100 characters</p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="section-description">Section Description</Label>
          <Textarea
            id="section-description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe what this section covers (optional)"
            maxLength={500}
            rows={4}
          />
          <p className="text-xs text-muted-foreground">{description.length}/500 characters</p>
        </div>

        <div className="flex gap-2 justify-end">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSave}>
            Save Section
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
