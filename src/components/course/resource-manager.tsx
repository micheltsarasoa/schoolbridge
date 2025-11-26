'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Paperclip, Plus } from 'lucide-react';
import type { Resource } from '@/types/course';
import { ResourceList } from '@/components/course/resource-list';
import { AddResourceDialog } from '@/components/course/add-ressource-dialog';

interface ResourceManagerProps {
  resources: Resource[];
  onAddResource: (resource: Omit<Resource, 'id'>) => void;
  onUpdateResource: (id: string, resource: Partial<Resource>) => void;
  onDeleteResource: (id: string) => void;
}

export function ResourceManager({
  resources,
  onAddResource,
  onUpdateResource,
  onDeleteResource,
}: ResourceManagerProps) {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Paperclip className="h-5 w-5" />
          <h3 className="font-semibold">Lecture Resources</h3>
        </div>
        <Button onClick={() => setIsAddDialogOpen(true)} size="sm">
          <Plus className="h-4 w-4 mr-2" />
          Add Resource
        </Button>
      </div>

      {resources.length === 0 ? (
        <div className="text-center py-8 border-2 border-dashed rounded-lg">
          <Paperclip className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <h4 className="font-medium mb-2">No resources yet</h4>
          <p className="text-sm text-muted-foreground mb-4">
            Add downloadable files, documents, or external links for students
          </p>
          <Button onClick={() => setIsAddDialogOpen(true)} variant="outline">
            <Plus className="h-4 w-4 mr-2" />
            Add First Resource
          </Button>
        </div>
      ) : (
        <ResourceList
          resources={resources}
          onEdit={(resource) => {
            // Open edit dialog with resource data
            setIsAddDialogOpen(true);
          }}
          onDelete={onDeleteResource}
        />
      )}

      <AddResourceDialog
        open={isAddDialogOpen}
        onOpenChange={setIsAddDialogOpen}
        onAdd={(resource) => {
          onAddResource(resource);
          setIsAddDialogOpen(false);
        }}
      />
    </Card>
  );
}
