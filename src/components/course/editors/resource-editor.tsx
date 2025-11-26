'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Upload, LinkIcon, FileText, FileSpreadsheet, Presentation, FileArchive, FileCode, FileAudio, FileVideo, Image, ExternalLink, Download, Eye, Pencil, Trash2, AlertCircle, CheckCircle2, Loader2, X, Calendar } from 'lucide-react';
import type { Lecture, Resource, ResourceType, ResourceCategory, ResourceVisibility } from '@/types/course';
import { useState } from 'react';
import { toast, Toaster } from 'sonner';

interface ResourceEditorProps {
  lecture: Lecture;
  onUpdate: (updates: Partial<Lecture>) => void;
  onClose: () => void;
}

export function ResourceEditor({ lecture, onUpdate }: ResourceEditorProps) {
  const [resources, setResources] = useState<Resource[]>(lecture.resources || []);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingResource, setEditingResource] = useState<Resource | null>(null);

  const updateResources = (newResources: Resource[]) => {
    setResources(newResources);
    onUpdate({ resources: newResources });
  };

  const handleAddResource = (resource: Resource) => {
    updateResources([...resources, resource]);
    setIsAddDialogOpen(false);
    toast.success(`${resource.title} has been added successfully.`, {
      description: 'Resource added',
    });
  };

  const handleUpdateResource = (resourceId: string, updates: Partial<Resource>) => {
    updateResources(resources.map(r => r.id === resourceId ? { ...r, ...updates } : r));
    setEditingResource(null);
    toast.success('The resource has been updated successfully.', {
      description: 'Resource updated',
    });
  };

  const handleDeleteResource = (resourceId: string) => {
    const resource = resources.find(r => r.id === resourceId);
    updateResources(resources.filter(r => r.id !== resourceId));
    toast.success(`${resource?.title} has been removed.`, {
      description: 'Resource deleted',
    });
  };

  return (
    <ScrollArea className="h-full">
      <div className="p-6 space-y-6">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Resource Manager</CardTitle>
                <CardDescription>
                  Add files, documents, and external links for students to access
                </CardDescription>
              </div>
              <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                <DialogTrigger asChild>
                  <Button>
                    <Upload className="h-4 w-4 mr-2" />
                    Add Resource
                  </Button>
                </DialogTrigger>
                <AddResourceDialog onAdd={handleAddResource} onCancel={() => setIsAddDialogOpen(false)} />
              </Dialog>
            </div>
          </CardHeader>
          <CardContent>
            {resources.length === 0 ? (
              <div className="text-center py-12 border-2 border-dashed rounded-lg">
                <Upload className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="font-semibold mb-2">No resources yet</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Add files, documents, or external links for your students
                </p>
                <Button onClick={() => setIsAddDialogOpen(true)}>
                  <Upload className="h-4 w-4 mr-2" />
                  Add First Resource
                </Button>
              </div>
            ) : (
              <div className="space-y-3">
                {resources.map((resource) => (
                  <ResourceItem
                    key={resource.id}
                    resource={resource}
                    onEdit={() => setEditingResource(resource)}
                    onDelete={() => handleDeleteResource(resource.id)}
                  />
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {editingResource && (
          <EditResourceDialog
            resource={editingResource}
            onUpdate={(updates) => handleUpdateResource(editingResource.id, updates)}
            onCancel={() => setEditingResource(null)}
          />
        )}
      </div>
      <Toaster />
    </ScrollArea>
  );
}

function AddResourceDialog({ onAdd, onCancel }: { onAdd: (resource: Resource) => void; onCancel: () => void }) {
  const [uploadType, setUploadType] = useState<'file' | 'external'>('file');
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: 'PDF' as ResourceType,
    category: 'LECTURE_NOTES' as ResourceCategory,
    externalUrl: '',
    downloadable: true,
    visibility: 'IMMEDIATE' as ResourceVisibility,
    watermark: false,
  });

  const handleSubmit = () => {
    if (!formData.title) return;

    const newResource: Resource = {
      id: Math.random().toString(36).substr(2, 9),
      title: formData.title,
      description: formData.description,
      type: formData.type,
      category: formData.category,
      downloadable: formData.downloadable,
      visibility: formData.visibility,
      watermark: formData.watermark,
      uploadDate: new Date().toISOString(),
      ...(uploadType === 'external' ? { externalUrl: formData.externalUrl } : {}),
    };

    onAdd(newResource);
  };

  return (
    <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
      <DialogHeader>
        <DialogTitle>Add Resource</DialogTitle>
        <DialogDescription>
          Upload files or add external links for students to access
        </DialogDescription>
      </DialogHeader>

      <Tabs value={uploadType} onValueChange={(v) => setUploadType(v as 'file' | 'external')}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="file">
            <Upload className="h-4 w-4 mr-2" />
            Upload File
          </TabsTrigger>
          <TabsTrigger value="external">
            <LinkIcon className="h-4 w-4 mr-2" />
            External Link
          </TabsTrigger>
        </TabsList>

        <TabsContent value="file" className="space-y-4">
          <div className="border-2 border-dashed rounded-lg p-8 text-center">
            <Upload className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-sm font-medium mb-2">Drop files here or click to browse</p>
            <p className="text-xs text-muted-foreground mb-4">
              Supported formats: PDF, DOCX, PPTX, XLSX, ZIP, and more
            </p>
            <Button variant="outline" size="sm">
              Browse Files
            </Button>
          </div>
        </TabsContent>

        <TabsContent value="external" className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="external-url">External URL</Label>
            <Input
              id="external-url"
              placeholder="https://example.com/resource"
              value={formData.externalUrl}
              onChange={(e) => setFormData({ ...formData, externalUrl: e.target.value })}
            />
          </div>
        </TabsContent>
      </Tabs>

      <Separator />

      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="title">Title *</Label>
          <Input
            id="title"
            placeholder="Resource title"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            placeholder="Brief description of this resource"
            rows={3}
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="type">Type</Label>
            <Select value={formData.type} onValueChange={(v) => setFormData({ ...formData, type: v as ResourceType })}>
              <SelectTrigger id="type">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="PDF">PDF Document</SelectItem>
                <SelectItem value="DOCUMENT">Word Document</SelectItem>
                <SelectItem value="PRESENTATION">Presentation</SelectItem>
                <SelectItem value="SPREADSHEET">Spreadsheet</SelectItem>
                <SelectItem value="IMAGE">Image</SelectItem>
                <SelectItem value="AUDIO">Audio File</SelectItem>
                <SelectItem value="VIDEO">Video File</SelectItem>
                <SelectItem value="ARCHIVE">Archive/ZIP</SelectItem>
                <SelectItem value="CODE">Code Files</SelectItem>
                <SelectItem value="EXTERNAL_LINK">External Link</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <Select value={formData.category} onValueChange={(v) => setFormData({ ...formData, category: v as ResourceCategory })}>
              <SelectTrigger id="category">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="LECTURE_NOTES">Lecture Notes</SelectItem>
                <SelectItem value="SLIDES">Presentation Slides</SelectItem>
                <SelectItem value="WORKBOOK">Workbook/Worksheet</SelectItem>
                <SelectItem value="REFERENCE">Reference Material</SelectItem>
                <SelectItem value="TEMPLATE">Template</SelectItem>
                <SelectItem value="EXERCISE_FILES">Exercise Files</SelectItem>
                <SelectItem value="SOLUTION_FILES">Solution Files</SelectItem>
                <SelectItem value="READING">Additional Reading</SelectItem>
                <SelectItem value="SUPPLEMENTARY">Supplementary Material</SelectItem>
                <SelectItem value="OTHER">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="visibility">Visibility</Label>
          <Select value={formData.visibility} onValueChange={(v) => setFormData({ ...formData, visibility: v as ResourceVisibility })}>
            <SelectTrigger id="visibility">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="IMMEDIATE">Immediately Available</SelectItem>
              <SelectItem value="AFTER_COMPLETION">After Lecture Completion</SelectItem>
              <SelectItem value="SCHEDULED">Scheduled Release</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="downloadable">Allow Downloads</Label>
            <p className="text-xs text-muted-foreground">Students can download this resource</p>
          </div>
          <Switch
            id="downloadable"
            checked={formData.downloadable}
            onCheckedChange={(checked) => setFormData({ ...formData, downloadable: checked })}
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="watermark">Add Watermark</Label>
            <p className="text-xs text-muted-foreground">Protect content with student watermark</p>
          </div>
          <Switch
            id="watermark"
            checked={formData.watermark}
            onCheckedChange={(checked) => setFormData({ ...formData, watermark: checked })}
          />
        </div>
      </div>

      <DialogFooter>
        <Button variant="outline" onClick={onCancel}>Cancel</Button>
        <Button onClick={handleSubmit} disabled={!formData.title}>
          Add Resource
        </Button>
      </DialogFooter>
    </DialogContent>
  );
}

function EditResourceDialog({ resource, onUpdate, onCancel }: { resource: Resource; onUpdate: (updates: Partial<Resource>) => void; onCancel: () => void }) {
  const [formData, setFormData] = useState(resource);

  return (
    <Dialog open={true} onOpenChange={onCancel}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Resource</DialogTitle>
          <DialogDescription>Update resource details and settings</DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="edit-title">Title</Label>
            <Input
              id="edit-title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-description">Description</Label>
            <Textarea
              id="edit-description"
              rows={3}
              value={formData.description || ''}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="edit-category">Category</Label>
              <Select value={formData.category} onValueChange={(v) => setFormData({ ...formData, category: v as ResourceCategory })}>
                <SelectTrigger id="edit-category">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="LECTURE_NOTES">Lecture Notes</SelectItem>
                  <SelectItem value="SLIDES">Presentation Slides</SelectItem>
                  <SelectItem value="WORKBOOK">Workbook/Worksheet</SelectItem>
                  <SelectItem value="REFERENCE">Reference Material</SelectItem>
                  <SelectItem value="TEMPLATE">Template</SelectItem>
                  <SelectItem value="EXERCISE_FILES">Exercise Files</SelectItem>
                  <SelectItem value="SOLUTION_FILES">Solution Files</SelectItem>
                  <SelectItem value="READING">Additional Reading</SelectItem>
                  <SelectItem value="SUPPLEMENTARY">Supplementary Material</SelectItem>
                  <SelectItem value="OTHER">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-visibility">Visibility</Label>
              <Select value={formData.visibility} onValueChange={(v) => setFormData({ ...formData, visibility: v as ResourceVisibility })}>
                <SelectTrigger id="edit-visibility">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="IMMEDIATE">Immediately Available</SelectItem>
                  <SelectItem value="AFTER_COMPLETION">After Lecture Completion</SelectItem>
                  <SelectItem value="SCHEDULED">Scheduled Release</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="edit-downloadable">Allow Downloads</Label>
              <p className="text-xs text-muted-foreground">Students can download this resource</p>
            </div>
            <Switch
              id="edit-downloadable"
              checked={formData.downloadable}
              onCheckedChange={(checked) => setFormData({ ...formData, downloadable: checked })}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="edit-watermark">Add Watermark</Label>
              <p className="text-xs text-muted-foreground">Protect content with student watermark</p>
            </div>
            <Switch
              id="edit-watermark"
              checked={formData.watermark}
              onCheckedChange={(checked) => setFormData({ ...formData, watermark: checked })}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onCancel}>Cancel</Button>
          <Button onClick={() => onUpdate(formData)}>Save Changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function ResourceItem({ resource, onEdit, onDelete }: { resource: Resource; onEdit: () => void; onDelete: () => void }) {
  const getResourceIcon = (type: ResourceType) => {
    switch (type) {
      case 'PDF': return FileText;
      case 'DOCUMENT': return FileText;
      case 'PRESENTATION': return Presentation;
      case 'SPREADSHEET': return FileSpreadsheet;
      case 'IMAGE': return Image;
      case 'AUDIO': return FileAudio;
      case 'VIDEO': return FileVideo;
      case 'ARCHIVE': return FileArchive;
      case 'CODE': return FileCode;
      case 'EXTERNAL_LINK': return ExternalLink;
      default: return FileText;
    }
  };

  const Icon = getResourceIcon(resource.type);
  const isExternal = resource.type === 'EXTERNAL_LINK' || resource.externalUrl;

  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-start gap-4">
          <div className="p-3 bg-primary/10 rounded-lg">
            <Icon className="h-6 w-6 text-primary" />
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2 mb-1">
              <h4 className="font-medium truncate">{resource.title}</h4>
              <div className="flex gap-1">
                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={onEdit}>
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={onDelete}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
            
            {resource.description && (
              <p className="text-sm text-muted-foreground mb-2">{resource.description}</p>
            )}
            
            <div className="flex flex-wrap gap-2 mb-2">
              <Badge variant="secondary">{resource.category?.replace('_', ' ')}</Badge>
              <Badge variant="outline">{resource.type.replace('_', ' ')}</Badge>
              {resource.downloadable && <Badge variant="outline">Downloadable</Badge>}
              {resource.watermark && <Badge variant="outline">Watermarked</Badge>}
            </div>

            {isExternal && resource.externalUrl && (
              <a 
                href={resource.externalUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-sm text-primary hover:underline flex items-center gap-1"
              >
                <ExternalLink className="h-3 w-3" />
                {resource.externalUrl}
              </a>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
