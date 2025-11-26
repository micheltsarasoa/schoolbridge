'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { FileText, X } from 'lucide-react';
import type { Lecture, ArticleData, Resource } from '@/types/course';
import { useState, useEffect } from 'react';
import { Badge } from '@/components/ui/badge';
import { calculateReadingTime, countWords } from '@/lib/course-utils';
import { RichTextEditor } from '@/components/course/editors/rich-text-editor'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ImageGallery } from '@/components/course/editors/image-gallery';
import { ResourceManager } from '@/components/course/resource-manager';

interface ArticleEditorProps {
  lecture: Lecture;
  onUpdate: (updates: Partial<Lecture>) => void;
  onClose: () => void;
}

export function ArticleEditor({ lecture, onUpdate, onClose }: ArticleEditorProps) {
  const [title, setTitle] = useState(lecture.title);
  const [description, setDescription] = useState(lecture.description || '');
  const [articleData, setArticleData] = useState<ArticleData>(lecture.article || {
    content: '',
    contentHtml: '',
    wordCount: 0
  });
  const [isPreview, setIsPreview] = useState(lecture.isPreview);
  const [isFree, setIsFree] = useState(lecture.isFree);
  const [hasDownloadableResources, setHasDownloadableResources] = useState(false);
  const [images, setImages] = useState<Array<{ id: string; url: string; alt: string; caption?: string }>>(
    lecture.article?.images || []
  );
  const [resources, setResources] = useState<Resource[]>(lecture.resources || []);

  useEffect(() => {
    const words = countWords(articleData.content);
    const readingTime = calculateReadingTime(articleData.content);
    setArticleData(prev => ({
      ...prev,
      wordCount: words,
      estimatedReadingTime: readingTime
    }));
  }, [articleData.content]);

  const handleSave = () => {
    onUpdate({
      title,
      description,
      article: {
        ...articleData,
        images
      },
      isPreview,
      isFree,
      resources
    });
    onClose();
  };

  const handleContentUpdate = (html: string, text: string) => {
    setArticleData(prev => ({
      ...prev,
      content: text,
      contentHtml: html
    }));
  };

  const handleAddResource = (resource: Omit<Resource, 'id'>) => {
    const newResource: Resource = {
      ...resource,
      id: `res-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    };
    setResources([...resources, newResource]);
  };

  const handleUpdateResource = (id: string, updates: Partial<Resource>) => {
    setResources(resources.map(r => r.id === id ? { ...r, ...updates } : r));
  };

  const handleDeleteResource = (id: string) => {
    setResources(resources.filter(r => r.id !== id));
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div className="flex items-center gap-2">
          <FileText className="h-5 w-5" />
          <CardTitle>Article Lecture</CardTitle>
          <Badge variant="secondary">Article</Badge>
        </div>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <h3 className="font-semibold">Basic Information</h3>
          <div className="space-y-2">
            <Label>Lecture Title *</Label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter lecture title"
            />
          </div>
          <div className="space-y-2">
            <Label>Description</Label>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Brief description"
              rows={2}
            />
          </div>
          <div className="space-y-2">
            <Label>Order in Section</Label>
            <Input
              type="number"
              value={lecture.order}
              disabled
              className="w-20"
            />
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold">Article Content</h3>
            <div className="text-xs text-muted-foreground">
              Words: {articleData.wordCount} | Characters: {articleData.content?.length || 0} | Reading time: ~{articleData.estimatedReadingTime} min
            </div>
          </div>
          
          <RichTextEditor
            initialContent={articleData.contentHtml || articleData.content}
            onUpdate={handleContentUpdate}
          />
        </div>

        <div className="space-y-4">
          <h3 className="font-semibold">Images & Media</h3>
          <ImageGallery
            images={images}
            onImagesChange={setImages}
          />
          <p className="text-xs text-muted-foreground">
            Click on an image to edit alt text, caption, or remove
          </p>
        </div>

        <div className="space-y-4">
          <h3 className="font-semibold">Access Settings</h3>
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Is Preview Lecture</Label>
              <p className="text-xs text-muted-foreground">Allow students to preview this lecture before enrolling</p>
            </div>
            <Switch checked={isPreview} onCheckedChange={setIsPreview} />
          </div>
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Is Free Lecture</Label>
              <p className="text-xs text-muted-foreground">Make this lecture accessible to everyone</p>
            </div>
            <Switch checked={isFree} onCheckedChange={setIsFree} />
          </div>
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Has Downloadable Resources</Label>
              <p className="text-xs text-muted-foreground">Provide supplementary files for students</p>
            </div>
            <Switch checked={hasDownloadableResources} onCheckedChange={setHasDownloadableResources} />
          </div>
        </div>

        <ResourceManager
          resources={resources}
          onAddResource={handleAddResource}
          onUpdateResource={handleUpdateResource}
          onDeleteResource={handleDeleteResource}
        />

        <div className="flex gap-2 justify-end pt-4 border-t">
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={handleSave}>Save Article</Button>
        </div>
      </CardContent>
    </Card>
  );
}
