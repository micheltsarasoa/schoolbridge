'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Video, X, Upload } from 'lucide-react';
import type { Lecture, VideoData, Resource } from '@/types/course';
import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { ResourceManager } from '@/components/course/resource-manager';

interface VideoEditorProps {
  lecture: Lecture;
  onUpdate: (updates: Partial<Lecture>) => void;
  onClose: () => void;
}

export function VideoEditor({ lecture, onUpdate, onClose }: VideoEditorProps) {
  const [title, setTitle] = useState(lecture.title);
  const [description, setDescription] = useState(lecture.description || '');
  const [videoData, setVideoData] = useState<VideoData>(lecture.video || {
    defaultQuality: 'MEDIUM',
    offlineOptimized: false
  });
  const [isPreview, setIsPreview] = useState(lecture.isPreview);
  const [isFree, setIsFree] = useState(lecture.isFree);
  const [offlineAvailable, setOfflineAvailable] = useState(lecture.offlineAvailable);
  const [resources, setResources] = useState<Resource[]>(lecture.resources || []);

  const handleSave = () => {
    onUpdate({
      title,
      description,
      video: videoData,
      isPreview,
      isFree,
      offlineAvailable,
      resources
    });
    onClose();
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
          <Video className="h-5 w-5" />
          <CardTitle>Video Lecture</CardTitle>
          <Badge variant="secondary">Video</Badge>
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
              placeholder="Describe what students will learn"
              rows={3}
            />
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="font-semibold">Video Content</h3>
          <div className="border-2 border-dashed rounded-lg p-8 text-center">
            <Upload className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-sm font-medium mb-2">Upload Video</p>
            <p className="text-xs text-muted-foreground mb-4">
              Drag and drop or click to browse (MP4, MOV, AVI)
            </p>
            <Button variant="outline">Choose File</Button>
          </div>
          <div className="space-y-2">
            <Label>Or Video URL</Label>
            <Input
              value={videoData.url || ''}
              onChange={(e) => setVideoData({ ...videoData, url: e.target.value })}
              placeholder="https://youtube.com/watch?v=..."
            />
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="font-semibold">Video Settings</h3>
          <div className="space-y-2">
            <Label>Default Quality</Label>
            <Select
              value={videoData.defaultQuality}
              onValueChange={(value: any) => setVideoData({ ...videoData, defaultQuality: value })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="LOW">Low</SelectItem>
                <SelectItem value="MEDIUM">Medium</SelectItem>
                <SelectItem value="HIGH">High</SelectItem>
                <SelectItem value="ULTRA">Ultra</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center justify-between">
            <Label>Offline Optimized</Label>
            <Switch
              checked={videoData.offlineOptimized}
              onCheckedChange={(checked) => setVideoData({ ...videoData, offlineOptimized: checked })}
            />
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="font-semibold">Access Settings</h3>
          <div className="flex items-center justify-between">
            <div>
              <Label>Is Preview (Free for everyone)</Label>
              <p className="text-xs text-muted-foreground">Allow non-enrolled users to watch</p>
            </div>
            <Switch checked={isPreview} onCheckedChange={setIsPreview} />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <Label>Is Free Lecture</Label>
              <p className="text-xs text-muted-foreground">Free for enrolled students</p>
            </div>
            <Switch checked={isFree} onCheckedChange={setIsFree} />
          </div>
          <div className="flex items-center justify-between">
            <Label>Offline Available</Label>
            <Switch checked={offlineAvailable} onCheckedChange={setOfflineAvailable} />
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
          <Button onClick={handleSave}>Save Lecture</Button>
        </div>
      </CardContent>
    </Card>
  );
}
