'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { FolderKanban, X, Plus, Trash2, Tag } from 'lucide-react';
import type { Lecture, ProjectData, Milestone } from '@/types/course';
import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { generateId } from '@/lib/course-utils';

interface ProjectEditorProps {
  lecture: Lecture;
  onUpdate: (updates: Partial<Lecture>) => void;
  onClose: () => void;
}

export function ProjectEditor({ lecture, onUpdate, onClose }: ProjectEditorProps) {
  const [title, setTitle] = useState(lecture.title);
  const [projectData, setProjectData] = useState<ProjectData>(lecture.project || {
    description: '',
    complexity: 'intermediate',
    technologies: [],
    learningObjectives: [],
    milestones: []
  });
  const [newTech, setNewTech] = useState('');
  const [newObjective, setNewObjective] = useState('');

  const addTechnology = () => {
    if (newTech.trim()) {
      setProjectData({
        ...projectData,
        technologies: [...projectData.technologies, newTech.trim()]
      });
      setNewTech('');
    }
  };

  const removeTechnology = (index: number) => {
    setProjectData({
      ...projectData,
      technologies: projectData.technologies.filter((_, i) => i !== index)
    });
  };

  const addObjective = () => {
    if (newObjective.trim()) {
      setProjectData({
        ...projectData,
        learningObjectives: [...projectData.learningObjectives, newObjective.trim()]
      });
      setNewObjective('');
    }
  };

  const removeObjective = (index: number) => {
    setProjectData({
      ...projectData,
      learningObjectives: projectData.learningObjectives.filter((_, i) => i !== index)
    });
  };

  const addMilestone = () => {
    const newMilestone: Milestone = {
      id: generateId(),
      title: '',
      description: '',
      deliverables: []
    };
    setProjectData({
      ...projectData,
      milestones: [...projectData.milestones, newMilestone]
    });
  };

  const updateMilestone = (id: string, updates: Partial<Milestone>) => {
    setProjectData({
      ...projectData,
      milestones: projectData.milestones.map(m => m.id === id ? { ...m, ...updates } : m)
    });
  };

  const deleteMilestone = (id: string) => {
    setProjectData({
      ...projectData,
      milestones: projectData.milestones.filter(m => m.id !== id)
    });
  };

  const handleSave = () => {
    onUpdate({
      title,
      project: projectData
    });
    onClose();
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div className="flex items-center gap-2">
          <FolderKanban className="h-5 w-5" />
          <CardTitle>Project</CardTitle>
          <Badge variant="secondary">Project</Badge>
        </div>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <h3 className="font-semibold">Project Overview</h3>
          <div className="space-y-2">
            <Label>Project Title *</Label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter project title"
            />
          </div>
          <div className="space-y-2">
            <Label>Description</Label>
            <Textarea
              value={projectData.description}
              onChange={(e) => setProjectData({ ...projectData, description: e.target.value })}
              placeholder="Describe the project..."
              className="min-h-32"
            />
          </div>
          <div className="space-y-2">
            <Label>Complexity Level</Label>
            <Select
              value={projectData.complexity}
              onValueChange={(value) => setProjectData({ ...projectData, complexity: value })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="beginner">Beginner</SelectItem>
                <SelectItem value="intermediate">Intermediate</SelectItem>
                <SelectItem value="advanced">Advanced</SelectItem>
                <SelectItem value="expert">Expert</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="font-semibold">Technologies/Tools</h3>
          <div className="flex gap-2">
            <Input
              value={newTech}
              onChange={(e) => setNewTech(e.target.value)}
              placeholder="e.g., React, Node.js"
              onKeyPress={(e) => e.key === 'Enter' && addTechnology()}
            />
            <Button onClick={addTechnology} type="button">
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          <div className="flex flex-wrap gap-2">
            {projectData.technologies.map((tech, index) => (
              <Badge key={index} variant="secondary" className="gap-2">
                <Tag className="h-3 w-3" />
                {tech}
                <button onClick={() => removeTechnology(index)} className="ml-1">
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="font-semibold">Learning Objectives</h3>
          <div className="flex gap-2">
            <Input
              value={newObjective}
              onChange={(e) => setNewObjective(e.target.value)}
              placeholder="What will students learn?"
              onKeyPress={(e) => e.key === 'Enter' && addObjective()}
            />
            <Button onClick={addObjective} type="button">
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          <ul className="space-y-2">
            {projectData.learningObjectives.map((objective, index) => (
              <li key={index} className="flex items-start gap-2 p-2 rounded bg-muted">
                <span className="flex-1 text-sm">{objective}</span>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6"
                  onClick={() => removeObjective(index)}
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
              </li>
            ))}
          </ul>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold">Project Milestones</h3>
            <Button onClick={addMilestone} size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Add Milestone
            </Button>
          </div>
          
          {projectData.milestones.map((milestone, index) => (
            <Card key={milestone.id}>
              <CardContent className="pt-6 space-y-4">
                <div className="flex items-center justify-between">
                  <Badge variant="outline">Milestone {index + 1}</Badge>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => deleteMilestone(milestone.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
                <div className="space-y-2">
                  <Label>Milestone Title</Label>
                  <Input
                    value={milestone.title}
                    onChange={(e) => updateMilestone(milestone.id, { title: e.target.value })}
                    placeholder="e.g., Setup Project Structure"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Description</Label>
                  <Textarea
                    value={milestone.description}
                    onChange={(e) => updateMilestone(milestone.id, { description: e.target.value })}
                    placeholder="What needs to be accomplished?"
                    rows={2}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Due Date (Optional)</Label>
                  <Input
                    type="date"
                    value={milestone.dueDate || ''}
                    onChange={(e) => updateMilestone(milestone.id, { dueDate: e.target.value })}
                  />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="flex gap-2 justify-end pt-4 border-t">
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={handleSave}>Save Project</Button>
        </div>
      </CardContent>
    </Card>
  );
}
