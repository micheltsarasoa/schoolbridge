'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { ClipboardList, X, Plus, Trash2 } from 'lucide-react';
import type { Lecture, AssignmentData, RubricCriterion } from '@/types/course';
import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { generateId } from '@/lib/course-utils';

interface AssignmentEditorProps {
  lecture: Lecture;
  onUpdate: (updates: Partial<Lecture>) => void;
  onClose: () => void;
}

export function AssignmentEditor({ lecture, onUpdate, onClose }: AssignmentEditorProps) {
  const [title, setTitle] = useState(lecture.title);
  const [assignmentData, setAssignmentData] = useState<AssignmentData>(lecture.assignment || {
    instructions: '',
    allowedFileTypes: ['PDF'],
    maxFileSize: 10,
    rubric: []
  });

  const fileTypes = [
    { value: 'PDF', label: 'PDF' },
    { value: 'DOC', label: 'Word Documents (.doc, .docx)' },
    { value: 'PPT', label: 'PowerPoint (.ppt, .pptx)' },
    { value: 'XLS', label: 'Excel (.xls, .xlsx)' },
    { value: 'IMG', label: 'Images (.jpg, .png, .gif)' },
    { value: 'ZIP', label: 'Archives (.zip, .rar)' },
    { value: 'CODE', label: 'Code files (.js, .py, etc.)' },
  ];

  const toggleFileType = (type: string) => {
    const current = assignmentData.allowedFileTypes;
    const updated = current.includes(type)
      ? current.filter(t => t !== type)
      : [...current, type];
    setAssignmentData({ ...assignmentData, allowedFileTypes: updated });
  };

  const addRubricCriterion = () => {
    const newCriterion: RubricCriterion = {
      id: generateId(),
      name: '',
      description: '',
      maxPoints: 10
    };
    setAssignmentData({
      ...assignmentData,
      rubric: [...(assignmentData.rubric || []), newCriterion]
    });
  };

  const updateRubricCriterion = (id: string, updates: Partial<RubricCriterion>) => {
    setAssignmentData({
      ...assignmentData,
      rubric: assignmentData.rubric?.map(c => c.id === id ? { ...c, ...updates } : c)
    });
  };

  const deleteRubricCriterion = (id: string) => {
    setAssignmentData({
      ...assignmentData,
      rubric: assignmentData.rubric?.filter(c => c.id !== id)
    });
  };

  const handleSave = () => {
    onUpdate({
      title,
      assignment: assignmentData
    });
    onClose();
  };

  const totalPoints = assignmentData.rubric?.reduce((sum, c) => sum + c.maxPoints, 0) || 0;

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div className="flex items-center gap-2">
          <ClipboardList className="h-5 w-5" />
          <CardTitle>Assignment</CardTitle>
          <Badge variant="secondary">Assignment</Badge>
        </div>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <h3 className="font-semibold">Basic Information</h3>
          <div className="space-y-2">
            <Label>Assignment Title *</Label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter assignment title"
            />
          </div>
          <div className="space-y-2">
            <Label>Instructions</Label>
            <Textarea
              value={assignmentData.instructions}
              onChange={(e) => setAssignmentData({ ...assignmentData, instructions: e.target.value })}
              placeholder="Detailed instructions for students..."
              className="min-h-32"
            />
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="font-semibold">Submission Settings</h3>
          <div className="space-y-2">
            <Label>Allowed File Types</Label>
            <div className="space-y-2">
              {fileTypes.map((type) => (
                <div key={type.value} className="flex items-center gap-2">
                  <Checkbox
                    checked={assignmentData.allowedFileTypes.includes(type.value)}
                    onCheckedChange={() => toggleFileType(type.value)}
                  />
                  <Label className="font-normal">{type.label}</Label>
                </div>
              ))}
            </div>
          </div>
          <div className="space-y-2">
            <Label>Max File Size (MB)</Label>
            <Input
              type="number"
              value={assignmentData.maxFileSize || 10}
              onChange={(e) => setAssignmentData({ ...assignmentData, maxFileSize: parseInt(e.target.value) || 10 })}
              min={1}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Start Date (Optional)</Label>
              <Input
                type="datetime-local"
                value={assignmentData.startDate || ''}
                onChange={(e) => setAssignmentData({ ...assignmentData, startDate: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>Due Date (Optional)</Label>
              <Input
                type="datetime-local"
                value={assignmentData.dueDate || ''}
                onChange={(e) => setAssignmentData({ ...assignmentData, dueDate: e.target.value })}
              />
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold">Grading Rubric</h3>
              {totalPoints > 0 && (
                <p className="text-sm text-muted-foreground">Total: {totalPoints} points</p>
              )}
            </div>
            <Button onClick={addRubricCriterion} size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Add Criterion
            </Button>
          </div>
          
          {assignmentData.rubric && assignmentData.rubric.length > 0 ? (
            <div className="space-y-4">
              {assignmentData.rubric.map((criterion, index) => (
                <Card key={criterion.id}>
                  <CardContent className="pt-6 space-y-4">
                    <div className="flex items-center justify-between">
                      <Badge variant="outline">Criterion {index + 1}</Badge>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => deleteRubricCriterion(criterion.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="space-y-2">
                      <Label>Criterion Name</Label>
                      <Input
                        value={criterion.name}
                        onChange={(e) => updateRubricCriterion(criterion.id, { name: e.target.value })}
                        placeholder="e.g., Code Quality"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Description</Label>
                      <Textarea
                        value={criterion.description}
                        onChange={(e) => updateRubricCriterion(criterion.id, { description: e.target.value })}
                        placeholder="What you're looking for..."
                        rows={2}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Max Points</Label>
                      <Input
                        type="number"
                        value={criterion.maxPoints}
                        onChange={(e) => updateRubricCriterion(criterion.id, { maxPoints: parseInt(e.target.value) || 0 })}
                        min={0}
                      />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground text-center py-4">
              No grading criteria added yet
            </p>
          )}
        </div>

        <div className="flex gap-2 justify-end pt-4 border-t">
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={handleSave}>Save Assignment</Button>
        </div>
      </CardContent>
    </Card>
  );
}
