'use client';

import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Plus, Trash2 } from 'lucide-react';
import { QuizBuilder } from './QuizBuilder';

interface ContentItemEditorProps {
  item: {
    id: string;
    contentOrder: number;
    contentType: 'LESSON' | 'TEXT' | 'VIDEO' | 'PDF' | 'INTERACTIVE' | 'QUIZ' | 'ASSIGNMENT';
    title: string;
    contentData?: any;
    duration?: number;
    points?: number;
  };
  isOpen: boolean;
  onSave: (item: any) => void;
  onClose: () => void;
}

const createValidationSchema = (type: string) => {
  const baseFields = {
    title: z.string().min(1, 'Title is required').max(255),
    duration: z.number().optional(),
    points: z.number().optional(),
    url: z.string().optional(),
    content: z.string().optional(),
    dueDate: z.string().optional(),
  };

  const base = z.object(baseFields);

  switch (type) {
    case 'LESSON':
      return base.extend({
        duration: z.number().min(0, 'Duration must be positive').optional(),
      });
    case 'VIDEO':
      return base.extend({
        url: z.string().url('Must be a valid URL').optional(),
      });
    case 'PDF':
      return base.extend({
        url: z.string().url('Must be a valid URL').optional(),
      });
    case 'INTERACTIVE':
      return base.extend({
        url: z.string().url('Must be a valid URL').optional(),
      });
    case 'QUIZ':
      return base;
    case 'ASSIGNMENT':
      return base.extend({
        points: z.number().min(0, 'Points must be non-negative').optional(),
        dueDate: z.string().optional(),
      });
    default:
      return base;
  }
};

export function ContentItemEditor({
  item,
  isOpen,
  onSave,
  onClose,
}: ContentItemEditorProps) {
  const [formData, setFormData] = useState(item);
  const [activeTab, setActiveTab] = useState('basic');

  const schema = createValidationSchema(item.contentType);
  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      title: item.title,
      ...item.contentData,
      duration: item.duration,
      points: item.points,
    },
  });

  const handleSave = () => {
    form.handleSubmit((data: any) => {
      const updatedItem = {
        ...item,
        title: data.title,
        contentData: data,
        duration: data.duration,
        points: data.points,
      };
      onSave(updatedItem);
    })();
  };

  const renderContentForm = () => {
    switch (item.contentType) {
      case 'LESSON':
        return (
          <>
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Lesson Title *</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter lesson title" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="duration"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Duration (seconds)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="900"
                      {...field}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                    />
                  </FormControl>
                  <FormDescription>
                    Estimated time to complete this lesson
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormItem>
              <FormLabel>Content</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Enter lesson content in markdown..."
                  rows={6}
                  className="resize-none"
                />
              </FormControl>
              <FormDescription>
                Write your lesson content here. Supports markdown formatting.
              </FormDescription>
            </FormItem>
          </>
        );

      case 'TEXT':
        return (
          <>
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Text Block Title *</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter title" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormItem>
              <FormLabel>Content</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Enter text content..."
                  rows={6}
                  className="resize-none"
                />
              </FormControl>
              <FormDescription>
                Plain text or markdown formatted content
              </FormDescription>
            </FormItem>
          </>
        );

      case 'VIDEO':
        return (
          <>
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Video Title *</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter video title" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="url"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Video URL *</FormLabel>
                  <FormControl>
                    <Input
                      type="url"
                      placeholder="https://youtube.com/watch?v=..."
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Link to YouTube or other video hosting platform
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </>
        );

      case 'PDF':
        return (
          <>
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>PDF Title *</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter PDF title" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="url"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>PDF URL *</FormLabel>
                  <FormControl>
                    <Input
                      type="url"
                      placeholder="https://example.com/document.pdf"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Direct link to PDF document
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </>
        );

      case 'INTERACTIVE':
        return (
          <>
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Interactive Content Title *</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter title" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="url"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Content URL *</FormLabel>
                  <FormControl>
                    <Input
                      type="url"
                      placeholder="https://example.com/interactive"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Link to interactive simulation or activity
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </>
        );

      case 'QUIZ':
        return (
          <QuizBuilder
            quiz={formData.contentData || {}}
            onChange={(quiz) => {
              setFormData((prev) => ({
                ...prev,
                contentData: quiz,
              }));
            }}
          />
        );

      case 'ASSIGNMENT':
        return (
          <>
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Assignment Title *</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter assignment title" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Describe the assignment requirements..."
                  rows={4}
                  className="resize-none"
                />
              </FormControl>
            </FormItem>
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="points"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Points</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="10"
                        {...field}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="dueDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Due Date</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
          </>
        );

      default:
        return null;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {item.id.startsWith('temp-') ? 'Add' : 'Edit'} {item.contentType}
          </DialogTitle>
          <DialogDescription>
            Configure the details for this content item
          </DialogDescription>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="basic">Content</TabsTrigger>
            <TabsTrigger value="preview">Preview</TabsTrigger>
          </TabsList>

          <TabsContent value="basic" className="space-y-4 mt-4">
            <Form {...form}>
              {renderContentForm()}
            </Form>
          </TabsContent>

          <TabsContent value="preview" className="space-y-4 mt-4">
            <Card className="p-6 bg-muted">
              <h3 className="font-semibold mb-4">Preview</h3>
              <p className="text-sm text-muted-foreground">
                Preview will be shown after saving
              </p>
            </Card>
          </TabsContent>
        </Tabs>

        <DialogFooter className="gap-3">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSave}>
            Save Content Item
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
