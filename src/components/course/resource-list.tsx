'use client';

import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { FileText, Presentation, Sheet, ImageIcon, Music, VideoIcon, Archive, Code, Link2, Eye, Download, Edit2, Trash2, ExternalLink } from 'lucide-react';
import type { Resource, ResourceType } from '@/types/course';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

interface ResourceListProps {
  resources: Resource[];
  onEdit: (resource: Resource) => void;
  onDelete: (id: string) => void;
}

const getResourceIcon = (type: ResourceType) => {
  switch (type) {
    case 'PDF':
      return FileText;
    case 'DOCUMENT':
      return FileText;
    case 'PRESENTATION':
      return Presentation;
    case 'SPREADSHEET':
      return Sheet;
    case 'IMAGE':
      return ImageIcon;
    case 'AUDIO':
      return Music;
    case 'VIDEO':
      return VideoIcon;
    case 'ARCHIVE':
      return Archive;
    case 'CODE':
      return Code;
    case 'EXTERNAL_LINK':
      return Link2;
    default:
      return FileText;
  }
};

const formatFileSize = (bytes?: number) => {
  if (!bytes) return '';
  const mb = bytes / 1024 / 1024;
  return `${mb.toFixed(2)} MB`;
};

export function ResourceList({ resources, onEdit, onDelete }: ResourceListProps) {
  return (
    <div className="space-y-3">
      {resources.map((resource, index) => {
        const Icon = getResourceIcon(resource.type);
        return (
          <div key={resource.id} className="flex items-center gap-4 p-4 border rounded-lg hover:bg-accent/50 transition-colors">
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <div className="shrink-0">
                <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Icon className="h-5 w-5 text-primary" />
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-medium text-muted-foreground">
                    {index + 1}.
                  </span>
                  <h4 className="font-medium truncate">{resource.title}</h4>
                  {!resource.downloadable && (
                    <Badge variant="secondary" className="text-xs">
                      View Only
                    </Badge>
                  )}
                </div>
                <p className="text-sm text-muted-foreground">
                  {resource.type === 'EXTERNAL_LINK' ? (
                    <span className="flex items-center gap-1">
                      <ExternalLink className="h-3 w-3" />
                      {resource.externalUrl}
                    </span>
                  ) : (
                    <>
                      {resource.fileName} {resource.fileSize && `• ${formatFileSize(resource.fileSize)}`}
                    </>
                  )}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-1">
              {resource.type === 'EXTERNAL_LINK' ? (
                <Button variant="ghost" size="sm">
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Open Link
                </Button>
              ) : (
                <>
                  <Button variant="ghost" size="sm">
                    <Eye className="h-4 w-4 mr-2" />
                    Preview
                  </Button>
                  {resource.downloadable && (
                    <Button variant="ghost" size="sm">
                      <Download className="h-4 w-4 mr-2" />
                      Download
                    </Button>
                  )}
                </>
              )}
              <Button variant="ghost" size="sm" onClick={() => onEdit(resource)}>
                <Edit2 className="h-4 w-4" />
              </Button>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="ghost" size="sm">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Delete resource?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This will permanently delete "{resource.title}". This action cannot be undone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={() => onDelete(resource.id)} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                      Delete
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </div>
        );
      })}
    </div>
  );
}
