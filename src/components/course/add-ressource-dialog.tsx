'use client';

import { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { FileText, Presentation, Sheet, ImageIcon, Music, VideoIcon, Archive, Code, Link2, Upload, X, FileCheck, Calendar, Paperclip } from 'lucide-react';
import type { Resource, ResourceType, ResourceCategory, ResourceVisibility } from '@/types/course';
import { cn } from '@/lib/utils';

interface AddResourceDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAdd: (resource: Omit<Resource, 'id'>) => void;
  editResource?: Resource;
}

const resourceTypes = [
  { type: 'PDF' as ResourceType, label: 'PDF', icon: FileText, accept: '.pdf' },
  { type: 'DOCUMENT' as ResourceType, label: 'Document', icon: FileText, accept: '.doc,.docx,.txt,.rtf' },
  { type: 'PRESENTATION' as ResourceType, label: 'Presentation', icon: Presentation, accept: '.ppt,.pptx,.key' },
  { type: 'SPREADSHEET' as ResourceType, label: 'Spreadsheet', icon: Sheet, accept: '.xls,.xlsx,.csv' },
  { type: 'IMAGE' as ResourceType, label: 'Image', icon: ImageIcon, accept: '.jpg,.jpeg,.png,.gif,.svg' },
  { type: 'AUDIO' as ResourceType, label: 'Audio', icon: Music, accept: '.mp3,.wav,.ogg' },
  { type: 'VIDEO' as ResourceType, label: 'Video', icon: VideoIcon, accept: '.mp4,.mov,.avi,.webm' },
  { type: 'ARCHIVE' as ResourceType, label: 'Archive', icon: Archive, accept: '.zip,.rar,.7z,.tar.gz' },
  { type: 'CODE' as ResourceType, label: 'Code', icon: Code, accept: '.js,.py,.java,.cpp,.zip' },
  { type: 'EXTERNAL_LINK' as ResourceType, label: 'External Link', icon: Link2, accept: '' },
];

export function AddResourceDialog({ open, onOpenChange, onAdd, editResource }: AddResourceDialogProps) {
  const [selectedType, setSelectedType] = useState<ResourceType>('PDF');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [externalUrl, setExternalUrl] = useState('');
  const [uploadProgress, setUploadProgress] = useState(0);
  const [downloadable, setDownloadable] = useState(true);
  const [category, setCategory] = useState<ResourceCategory>('LECTURE_NOTES');
  const [visibility, setVisibility] = useState<ResourceVisibility>('IMMEDIATE');
  const [visibilityDate, setVisibilityDate] = useState('');
  const [requirePreviousLectures, setRequirePreviousLectures] = useState(false);
  const [watermark, setWatermark] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback(() => {
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) {
      setFile(droppedFile);
      if (!title) {
        setTitle(droppedFile.name.replace(/\.[^/.]+$/, ''));
      }
      // Simulate upload progress
      simulateUpload();
    }
  }, [title]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      if (!title) {
        setTitle(selectedFile.name.replace(/\.[^/.]+$/, ''));
      }
      simulateUpload();
    }
  };

  const simulateUpload = () => {
    setUploadProgress(0);
    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 10;
      });
    }, 200);
  };

  const handleSubmit = () => {
    const resource: Omit<Resource, 'id'> = {
      title,
      description: description || undefined,
      type: selectedType,
      fileName: file?.name,
      fileSize: file?.size,
      url: selectedType === 'EXTERNAL_LINK' ? externalUrl : file ? URL.createObjectURL(file) : undefined,
      externalUrl: selectedType === 'EXTERNAL_LINK' ? externalUrl : undefined,
      uploadDate: new Date().toISOString(),
      downloadable,
      category,
      visibility,
      visibilityDate: visibility === 'SCHEDULED' ? visibilityDate : undefined,
      requirePreviousLectures,
      watermark: selectedType === 'PDF' ? watermark : undefined,
      uploadProgress: 100,
    };

    onAdd(resource);
    resetForm();
  };

  const resetForm = () => {
    setSelectedType('PDF');
    setTitle('');
    setDescription('');
    setFile(null);
    setExternalUrl('');
    setUploadProgress(0);
    setDownloadable(true);
    setCategory('LECTURE_NOTES');
    setVisibility('IMMEDIATE');
    setVisibilityDate('');
    setRequirePreviousLectures(false);
    setWatermark(false);
  };

  const isValid = title && (selectedType === 'EXTERNAL_LINK' ? externalUrl : file);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh]">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <Paperclip className="h-5 w-5" />
            <DialogTitle>Add Resource</DialogTitle>
          </div>
          <DialogDescription>
            Add downloadable files, documents, or external links for your students
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="max-h-[calc(90vh-12rem)] pr-4">
          <div className="space-y-6">
            {/* Resource Type Selection */}
            <div>
              <Label className="mb-3 block">Resource Type</Label>
              <div className="grid grid-cols-5 gap-3">
                {resourceTypes.map(({ type, label, icon: Icon }) => (
                  <button
                    key={type}
                    onClick={() => setSelectedType(type)}
                    className={cn(
                      'flex flex-col items-center gap-2 p-4 rounded-lg border-2 transition-all',
                      selectedType === type
                        ? 'border-primary bg-primary/5'
                        : 'border-border hover:border-primary/50'
                    )}
                  >
                    <Icon className="h-6 w-6" />
                    <span className="text-xs font-medium text-center">{label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Resource Information */}
            <div className="space-y-4">
              <div>
                <Label htmlFor="title">Resource Title *</Label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g., Course Syllabus, Cheat Sheet, Workbook"
                />
              </div>

              <div>
                <Label htmlFor="description">Description (optional)</Label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe what this resource contains..."
                  rows={3}
                />
              </div>
            </div>

            {/* File Upload or External Link */}
            {selectedType === 'EXTERNAL_LINK' ? (
              <div>
                <Label htmlFor="url">URL *</Label>
                <Input
                  id="url"
                  type="url"
                  value={externalUrl}
                  onChange={(e) => setExternalUrl(e.target.value)}
                  placeholder="https://example.com/resource"
                />
                {externalUrl && (
                  <div className="mt-4 p-4 border rounded-lg">
                    <div className="flex items-start gap-3">
                      <Link2 className="h-5 w-5 mt-0.5 text-muted-foreground" />
                      <div className="flex-1">
                        <p className="font-medium">External Link</p>
                        <p className="text-sm text-muted-foreground">{externalUrl}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div>
                <Label>File Upload *</Label>
                {!file ? (
                  <div
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    className={cn(
                      'mt-2 border-2 border-dashed rounded-lg p-8 text-center transition-colors',
                      isDragging ? 'border-primary bg-primary/5' : 'border-border'
                    )}
                  >
                    <Upload className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <p className="font-medium mb-2">Drag and drop your file here</p>
                    <p className="text-sm text-muted-foreground mb-4">or click to browse</p>
                    <input
                      type="file"
                      id="file-upload"
                      className="hidden"
                      accept={resourceTypes.find((r) => r.type === selectedType)?.accept}
                      onChange={handleFileSelect}
                    />
                    <Button variant="outline" size="sm" asChild>
                      <label htmlFor="file-upload" className="cursor-pointer">
                        Browse Files
                      </label>
                    </Button>
                    <p className="text-xs text-muted-foreground mt-4">Maximum file size: 100 MB</p>
                  </div>
                ) : (
                  <div className="mt-2 p-4 border rounded-lg">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-start gap-3 flex-1">
                        <FileCheck className="h-5 w-5 mt-0.5 text-green-600" />
                        <div className="flex-1">
                          <p className="font-medium">{file.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {(file.size / 1024 / 1024).toFixed(2)} MB • {selectedType}
                          </p>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => {
                          setFile(null);
                          setUploadProgress(0);
                        }}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                    {uploadProgress < 100 && (
                      <div className="space-y-1">
                        <div className="h-2 bg-secondary rounded-full overflow-hidden">
                          <div
                            className="h-full bg-primary transition-all duration-300"
                            style={{ width: `${uploadProgress}%` }}
                          />
                        </div>
                        <p className="text-xs text-muted-foreground">{uploadProgress}% Uploading...</p>
                      </div>
                    )}
                    {uploadProgress === 100 && (
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" onClick={() => setFile(null)}>
                          Change File
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setFile(null);
                            setUploadProgress(0);
                          }}
                        >
                          Remove
                        </Button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* Resource Settings */}
            <div className="space-y-4 pt-4 border-t">
              <h4 className="font-semibold">Resource Settings</h4>

              {/* Downloadable */}
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Downloadable</Label>
                  <p className="text-sm text-muted-foreground">Allow students to download this resource</p>
                </div>
                <Switch checked={downloadable} onCheckedChange={setDownloadable} />
              </div>

              {/* Category */}
              <div>
                <Label htmlFor="category">Resource Category (optional)</Label>
                <Select value={category} onValueChange={(value) => setCategory(value as ResourceCategory)}>
                  <SelectTrigger id="category">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="LECTURE_NOTES">Lecture Notes</SelectItem>
                    <SelectItem value="SLIDES">Slides</SelectItem>
                    <SelectItem value="WORKBOOK">Workbook/Worksheet</SelectItem>
                    <SelectItem value="REFERENCE">Reference Material</SelectItem>
                    <SelectItem value="TEMPLATE">Template</SelectItem>
                    <SelectItem value="EXERCISE_FILES">Exercise Files</SelectItem>
                    <SelectItem value="SOLUTION_FILES">Solution Files</SelectItem>
                    <SelectItem value="READING">Reading Material</SelectItem>
                    <SelectItem value="SUPPLEMENTARY">Supplementary</SelectItem>
                    <SelectItem value="OTHER">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Visibility */}
              <div>
                <Label className="mb-3 block">Visibility</Label>
                <RadioGroup value={visibility} onValueChange={(value) => setVisibility(value as ResourceVisibility)}>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="IMMEDIATE" id="immediate" />
                    <Label htmlFor="immediate" className="font-normal">
                      Available immediately
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="AFTER_COMPLETION" id="after-completion" />
                    <Label htmlFor="after-completion" className="font-normal">
                      Available after lecture completion
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="SCHEDULED" id="scheduled" />
                    <Label htmlFor="scheduled" className="font-normal">
                      Available after date
                    </Label>
                  </div>
                </RadioGroup>
                {visibility === 'SCHEDULED' && (
                  <div className="mt-3">
                    <Input
                      type="datetime-local"
                      value={visibilityDate}
                      onChange={(e) => setVisibilityDate(e.target.value)}
                    />
                  </div>
                )}
              </div>

              {/* File Security */}
              <div className="space-y-3">
                <Label>File Security (optional)</Label>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="require-previous"
                    checked={requirePreviousLectures}
                    onCheckedChange={(checked) => setRequirePreviousLectures(checked as boolean)}
                  />
                  <Label htmlFor="require-previous" className="font-normal">
                    Require completion of previous lectures
                  </Label>
                </div>
                {selectedType === 'PDF' && (
                  <div className="flex items-center space-x-2">
                    <Checkbox id="watermark" checked={watermark} onCheckedChange={(checked) => setWatermark(checked as boolean)} />
                    <Label htmlFor="watermark" className="font-normal">
                      Watermark with student name
                    </Label>
                  </div>
                )}
              </div>
            </div>
          </div>
        </ScrollArea>

        <div className="flex justify-end gap-2 pt-4 border-t">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={!isValid}>
            Add Resource
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
