'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Code, X, Plus, Trash2 } from 'lucide-react';
import type { Lecture, CodingExerciseData, TestCase } from '@/types/course';
import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { generateId } from '@/lib/course-utils';

interface CodingExerciseEditorProps {
  lecture: Lecture;
  onUpdate: (updates: Partial<Lecture>) => void;
  onClose: () => void;
}

export function CodingExerciseEditor({ lecture, onUpdate, onClose }: CodingExerciseEditorProps) {
  const [title, setTitle] = useState(lecture.title);
  const [exerciseData, setExerciseData] = useState<CodingExerciseData>(lecture.codingExercise || {
    instructions: '',
    language: 'javascript',
    testCases: [],
    hints: [],
    allowSubmission: true
  });

  const addTestCase = () => {
    const newTestCase: TestCase = {
      id: generateId(),
      input: '',
      expectedOutput: '',
      isHidden: false,
      points: 10
    };
    setExerciseData({
      ...exerciseData,
      testCases: [...exerciseData.testCases, newTestCase]
    });
  };

  const updateTestCase = (id: string, updates: Partial<TestCase>) => {
    setExerciseData({
      ...exerciseData,
      testCases: exerciseData.testCases.map(tc => tc.id === id ? { ...tc, ...updates } : tc)
    });
  };

  const deleteTestCase = (id: string) => {
    setExerciseData({
      ...exerciseData,
      testCases: exerciseData.testCases.filter(tc => tc.id !== id)
    });
  };

  const handleSave = () => {
    onUpdate({
      title,
      codingExercise: exerciseData
    });
    onClose();
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div className="flex items-center gap-2">
          <Code className="h-5 w-5" />
          <CardTitle>Coding Exercise</CardTitle>
          <Badge variant="secondary">Code</Badge>
        </div>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <h3 className="font-semibold">Basic Information</h3>
          <div className="space-y-2">
            <Label>Exercise Title *</Label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter exercise title"
            />
          </div>
          <div className="space-y-2">
            <Label>Programming Language</Label>
            <Select
              value={exerciseData.language}
              onValueChange={(value) => setExerciseData({ ...exerciseData, language: value })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="javascript">JavaScript</SelectItem>
                <SelectItem value="python">Python</SelectItem>
                <SelectItem value="java">Java</SelectItem>
                <SelectItem value="cpp">C++</SelectItem>
                <SelectItem value="ruby">Ruby</SelectItem>
                <SelectItem value="go">Go</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Instructions</Label>
            <Textarea
              value={exerciseData.instructions}
              onChange={(e) => setExerciseData({ ...exerciseData, instructions: e.target.value })}
              placeholder="Describe the coding challenge..."
              className="min-h-32"
            />
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="font-semibold">Code Setup</h3>
          <div className="space-y-2">
            <Label>Starter Code</Label>
            <Textarea
              value={exerciseData.starterCode || ''}
              onChange={(e) => setExerciseData({ ...exerciseData, starterCode: e.target.value })}
              placeholder="// Write your starter code here"
              className="font-mono text-sm min-h-32"
            />
          </div>
          <div className="space-y-2">
            <Label>Solution Code (Hidden)</Label>
            <Textarea
              value={exerciseData.solution || ''}
              onChange={(e) => setExerciseData({ ...exerciseData, solution: e.target.value })}
              placeholder="// Write the solution here"
              className="font-mono text-sm min-h-32"
            />
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold">Test Cases ({exerciseData.testCases.length})</h3>
            <Button onClick={addTestCase} size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Add Test Case
            </Button>
          </div>
          
          {exerciseData.testCases.map((testCase, index) => (
            <Card key={testCase.id}>
              <CardContent className="pt-6 space-y-4">
                <div className="flex items-center justify-between">
                  <Badge variant="outline">Test Case {index + 1}</Badge>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => deleteTestCase(testCase.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
                <div className="space-y-2">
                  <Label>Input</Label>
                  <Textarea
                    value={testCase.input}
                    onChange={(e) => updateTestCase(testCase.id, { input: e.target.value })}
                    placeholder="Input for this test case"
                    rows={2}
                    className="font-mono text-sm"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Expected Output</Label>
                  <Textarea
                    value={testCase.expectedOutput}
                    onChange={(e) => updateTestCase(testCase.id, { expectedOutput: e.target.value })}
                    placeholder="Expected output"
                    rows={2}
                    className="font-mono text-sm"
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label>Hidden Test Case</Label>
                  <Switch
                    checked={testCase.isHidden}
                    onCheckedChange={(checked) => updateTestCase(testCase.id, { isHidden: checked })}
                  />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="flex gap-2 justify-end pt-4 border-t">
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={handleSave}>Save Exercise</Button>
        </div>
      </CardContent>
    </Card>
  );
}
