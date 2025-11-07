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
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Plus,
  Trash2,
  Edit2,
  GripVertical,
  BookOpen,
  FileText,
  Video,
  FileIcon,
  Zap,
  HelpCircle,
  ClipboardList,
} from 'lucide-react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useSortable } from '@dnd-kit/sortable';
import { ContentItemEditor } from './ContentItemEditor';

interface ContentItem {
  id: string;
  contentOrder: number;
  contentType: 'LESSON' | 'TEXT' | 'VIDEO' | 'PDF' | 'INTERACTIVE' | 'QUIZ' | 'ASSIGNMENT';
  title: string;
  contentData?: any;
  duration?: number;
  points?: number;
}

interface ContentManagerProps {
  content: ContentItem[];
  onChange: (content: ContentItem[]) => void;
  courseId?: string;
}

const CONTENT_TYPES = [
  {
    value: 'LESSON',
    label: 'Lesson',
    icon: BookOpen,
    description: 'Long-form instructional content with optional duration',
  },
  {
    value: 'TEXT',
    label: 'Text',
    icon: FileText,
    description: 'Formatted text blocks and content',
  },
  {
    value: 'VIDEO',
    label: 'Video',
    icon: Video,
    description: 'Embedded video content (requires online access)',
  },
  {
    value: 'PDF',
    label: 'PDF',
    icon: FileIcon,
    description: 'PDF documents and resources',
  },
  {
    value: 'INTERACTIVE',
    label: 'Interactive',
    icon: Zap,
    description: 'Interactive simulations and activities',
  },
  {
    value: 'QUIZ',
    label: 'Quiz',
    icon: HelpCircle,
    description: 'Quizzes with multiple question types',
  },
  {
    value: 'ASSIGNMENT',
    label: 'Assignment',
    icon: ClipboardList,
    description: 'Assignments for grading',
  },
];

// Draggable content item component
function DraggableContentItem({
  item,
  onEdit,
  onDelete,
}: {
  item: ContentItem;
  onEdit: (item: ContentItem) => void;
  onDelete: (id: string) => void;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: item.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const contentTypeConfig = CONTENT_TYPES.find(
    (ct) => ct.value === item.contentType
  );
  const IconComponent = contentTypeConfig?.icon || FileText;

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`flex items-center gap-3 p-4 bg-card border rounded-lg hover:shadow-xs transition-shadow ${
        isDragging ? 'opacity-50' : ''
      }`}
    >
      <div {...attributes} {...listeners} className="cursor-grab active:cursor-grabbing">
        <GripVertical className="h-5 w-5 text-muted-foreground" />
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <IconComponent className="h-4 w-4 shrink-0" />
          <h3 className="font-medium truncate">{item.title}</h3>
        </div>
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Badge variant="secondary" className="text-xs">
            {item.contentType}
          </Badge>
          {item.duration && (
            <span>{Math.round(item.duration / 60)} min</span>
          )}
          {item.points && <span>{item.points} pts</span>}
        </div>
      </div>

      <div className="flex gap-2 shrink-0">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onEdit(item)}
        >
          <Edit2 className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onDelete(item.id)}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}

// Content type selector dialog
function AddContentDialog({
  isOpen,
  onClose,
  onSelect,
}: {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (type: string) => void;
}) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Add Content Item</DialogTitle>
          <DialogDescription>
            Select the type of content you want to add to your course
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {CONTENT_TYPES.map((type) => {
            const Icon = type.icon;
            return (
              <button
                key={type.value}
                onClick={() => {
                  onSelect(type.value);
                  onClose();
                }}
                className="p-4 text-left border rounded-lg hover:bg-accent hover:border-primary transition-colors group"
              >
                <div className="flex items-start gap-3">
                  <Icon className="h-5 w-5 mt-1 text-muted-foreground group-hover:text-primary shrink-0" />
                  <div>
                    <h4 className="font-semibold text-sm">{type.label}</h4>
                    <p className="text-xs text-muted-foreground mt-1">
                      {type.description}
                    </p>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </DialogContent>
    </Dialog>
  );
}

export function ContentManager({
  content,
  onChange,
  courseId,
}: ContentManagerProps) {
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [editingItem, setEditingItem] = useState<ContentItem | null>(null);
  const [showItemEditor, setShowItemEditor] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over || active.id === over.id) return;

    const oldIndex = content.findIndex((item) => item.id === active.id);
    const newIndex = content.findIndex((item) => item.id === over.id);

    const newContent = arrayMove(content, oldIndex, newIndex);
    const reorderedContent = newContent.map((item, idx) => ({
      ...item,
      contentOrder: idx,
    }));

    onChange(reorderedContent);
  };

  const handleAddContent = (type: string) => {
    const newItem: ContentItem = {
      id: `temp-${Date.now()}`,
      contentOrder: content.length,
      contentType: type as ContentItem['contentType'],
      title: '',
      contentData: {},
    };
    setEditingItem(newItem);
    setShowItemEditor(true);
  };

  const handleSaveItem = (item: ContentItem) => {
    if (editingItem?.id.startsWith('temp-')) {
      onChange([...content, item]);
    } else {
      onChange(
        content.map((c) => (c.id === item.id ? item : c))
      );
    }
    setEditingItem(null);
    setShowItemEditor(false);
  };

  const handleDeleteContent = (id: string) => {
    onChange(content.filter((item) => item.id !== id));
  };

  const handleEditContent = (item: ContentItem) => {
    setEditingItem(item);
    setShowItemEditor(true);
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold">Course Content</h2>
          <p className="text-sm text-muted-foreground">
            {content.length} item{content.length !== 1 ? 's' : ''} in this course
          </p>
        </div>
        <Button onClick={() => setShowAddDialog(true)} className="gap-2">
          <Plus className="h-4 w-4" />
          Add Content
        </Button>
      </div>

      {/* Info Alert */}
      {content.length === 0 && (
        <Alert>
          <HelpCircle className="h-4 w-4" />
          <AlertDescription>
            Start building your course by adding your first content item. Drag and drop to reorder items later.
          </AlertDescription>
        </Alert>
      )}

      {/* Content List */}
      <div className="space-y-2">
        {content.length > 0 && (
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={content.map((c) => c.id)}
              strategy={verticalListSortingStrategy}
            >
              {content.map((item) => (
                <DraggableContentItem
                  key={item.id}
                  item={item}
                  onEdit={handleEditContent}
                  onDelete={handleDeleteContent}
                />
              ))}
            </SortableContext>
          </DndContext>
        )}
      </div>

      {/* Add Content Dialog */}
      <AddContentDialog
        isOpen={showAddDialog}
        onClose={() => setShowAddDialog(false)}
        onSelect={handleAddContent}
      />

      {/* Content Item Editor */}
      {editingItem && (
        <ContentItemEditor
          item={editingItem}
          isOpen={showItemEditor}
          onSave={handleSaveItem}
          onClose={() => {
            setShowItemEditor(false);
            setEditingItem(null);
          }}
        />
      )}
    </div>
  );
}
