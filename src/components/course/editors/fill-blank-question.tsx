'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Plus, X, GripVertical, Info } from 'lucide-react';
import type { Question } from '@/types/course';
import { Switch } from '@/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface FillBlankQuestionProps {
  question: Question;
  questionNumber: number;
  onUpdate: (updates: Partial<Question>) => void;
  onDelete: () => void;
}

export function FillBlankQuestion({ question, questionNumber, onUpdate, onDelete }: FillBlankQuestionProps) {
  const [isRequired, setIsRequired] = useState(true);
  const [estimationTime, setEstimationTime] = useState(2);
  const [markAsPoint, setMarkAsPoint] = useState(question.points || 1);
  const [randomizeOrder, setRandomizeOrder] = useState('current');

  // Parse the question text to find blanks marked with [blank]
  const parseQuestionText = (text: string) => {
    const parts: Array<{ type: 'text' | 'blank'; content: string; index?: number }> = [];
    const regex = /\[([^\]]+)\]/g;
    let lastIndex = 0;
    let match;
    let blankIndex = 1;

    while ((match = regex.exec(text)) !== null) {
      if (match.index > lastIndex) {
        parts.push({ type: 'text', content: text.slice(lastIndex, match.index) });
      }
      parts.push({ type: 'blank', content: match[1], index: blankIndex });
      blankIndex++;
      lastIndex = match.index + match[0].length;
    }

    if (lastIndex < text.length) {
      parts.push({ type: 'text', content: text.slice(lastIndex) });
    }

    return parts;
  };

  const parts = parseQuestionText(question.question || '');
  const correctAnswers = question.acceptedAnswers || [];
  const incorrectAnswers = question.options?.filter(opt => !correctAnswers.includes(opt)) || [];
  const allAnswers = [...correctAnswers, ...incorrectAnswers];

  const addCorrectAnswer = () => {
    const updated = [...correctAnswers, ''];
    onUpdate({ acceptedAnswers: updated });
  };

  const addIncorrectAnswer = () => {
    const updated = [...(question.options || []), ''];
    onUpdate({ options: updated });
  };

  const updateCorrectAnswer = (index: number, value: string) => {
    const updated = [...correctAnswers];
    updated[index] = value;
    onUpdate({ acceptedAnswers: updated });
  };

  const updateIncorrectAnswer = (index: number, value: string) => {
    const updated = [...(question.options || [])];
    const incorrectIndex = correctAnswers.length + index;
    updated[incorrectIndex] = value;
    onUpdate({ options: updated });
  };

  const removeAnswer = (answer: string) => {
    const updatedCorrect = correctAnswers.filter(a => a !== answer);
    const updatedOptions = (question.options || []).filter(a => a !== answer);
    onUpdate({ 
      acceptedAnswers: updatedCorrect,
      options: updatedOptions 
    });
  };

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Select value="FILL_BLANK" disabled>
                <SelectTrigger className="w-[160px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="FILL_BLANK">Fill in the Blank</SelectItem>
                </SelectContent>
              </Select>
              
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">Required</span>
                <Switch checked={isRequired} onCheckedChange={setIsRequired} />
              </div>
            </div>

            <Button variant="ghost" size="icon" onClick={onDelete}>
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* Question Display */}
          <div className="space-y-3">
            <div className="flex items-start gap-2">
              <Badge variant="secondary" className="mt-1">
                Question {questionNumber}
              </Badge>
            </div>

            <div className="rounded-lg border bg-background p-4">
              <div className="flex flex-wrap items-center gap-2 text-base leading-relaxed">
                {parts.map((part, idx) => {
                  if (part.type === 'text') {
                    return <span key={idx}>{part.content}</span>;
                  } else {
                    const answerIndex = correctAnswers.findIndex(a => a.toLowerCase() === part.content.toLowerCase());
                    const isCorrect = answerIndex !== -1;
                    return (
                      <div key={idx} className="relative inline-flex items-center">
                        <Badge 
                          variant={isCorrect ? "default" : "secondary"}
                          className="px-3 py-1.5 bg-purple-100 text-purple-900 border border-purple-300 relative"
                        >
                          <span className="absolute -top-2 -left-2 flex h-5 w-5 items-center justify-center rounded-full bg-purple-600 text-[10px] font-medium text-white">
                            {part.index}
                          </span>
                          {part.content}
                        </Badge>
                      </div>
                    );
                  }
                })}
              </div>
            </div>

            {/* Edit Question Text */}
            <div className="space-y-2">
              <Label className="text-xs text-muted-foreground">
                Edit question (use [answer] to mark blanks)
              </Label>
              <Input
                value={question.question}
                onChange={(e) => onUpdate({ question: e.target.value })}
                placeholder="E.g., When selecting a style [Direction] for designing..."
                className="font-mono text-sm"
              />
            </div>
          </div>

          {/* Add Answers Buttons */}
          <div className="flex gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={addCorrectAnswer}
              className="border-dashed"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add answers correct
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={addIncorrectAnswer}
              className="border-dashed"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add answers incorrect
            </Button>
          </div>

          {/* Answer Options */}
          {allAnswers.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label>Answer Options*</Label>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Info className="h-3 w-3" />
                  Students will see shuffled answer options
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                {allAnswers.map((answer, idx) => {
                  const isCorrect = correctAnswers.includes(answer);
                  const correctIndex = correctAnswers.indexOf(answer);
                  
                  return (
                    <div key={idx} className="relative group">
                      {isCorrect && (
                        <span className="absolute -top-2 -left-2 flex h-5 w-5 items-center justify-center rounded-full bg-purple-600 text-[10px] font-medium text-white z-10">
                          {correctIndex + 1}
                        </span>
                      )}
                      <Badge
                        variant={isCorrect ? "default" : "secondary"}
                        className={`px-3 py-1.5 text-sm cursor-pointer ${
                          isCorrect 
                            ? 'bg-purple-100 text-purple-900 border border-purple-300' 
                            : 'bg-gray-100 text-gray-700 border border-gray-300'
                        }`}
                      >
                        {answer}
                        <button
                          onClick={() => removeAnswer(answer)}
                          className="ml-2 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    </div>
                  );
                })}
              </div>

              {/* Edit Answers */}
              <div className="space-y-3 pt-2">
                {correctAnswers.length > 0 && (
                  <div className="space-y-2">
                    <Label className="text-xs text-muted-foreground">Correct Answers</Label>
                    {correctAnswers.map((answer, idx) => (
                      <Input
                        key={idx}
                        value={answer}
                        onChange={(e) => updateCorrectAnswer(idx, e.target.value)}
                        placeholder={`Correct answer ${idx + 1}`}
                        className="text-sm"
                      />
                    ))}
                  </div>
                )}

                {incorrectAnswers.length > 0 && (
                  <div className="space-y-2">
                    <Label className="text-xs text-muted-foreground">Incorrect Answers (Distractors)</Label>
                    {incorrectAnswers.map((answer, idx) => (
                      <Input
                        key={idx}
                        value={answer}
                        onChange={(e) => updateIncorrectAnswer(idx, e.target.value)}
                        placeholder={`Incorrect answer ${idx + 1}`}
                        className="text-sm"
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Settings Row */}
          <div className="grid grid-cols-3 gap-4 pt-4 border-t">
            <div className="space-y-2">
              <Label className="text-sm">Randomize Order</Label>
              <Select value={randomizeOrder} onValueChange={setRandomizeOrder}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="current">Keep choices in current order</SelectItem>
                  <SelectItem value="random">Randomize for each student</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-sm">Estimation time</Label>
              <div className="flex items-center gap-2">
                <Input
                  type="number"
                  value={estimationTime}
                  onChange={(e) => setEstimationTime(parseInt(e.target.value) || 0)}
                  className="w-20"
                  min={0}
                />
                <span className="text-sm text-muted-foreground">Mins</span>
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-sm">Mark as point</Label>
              <div className="flex items-center gap-2">
                <Input
                  type="number"
                  value={markAsPoint}
                  onChange={(e) => {
                    const value = parseInt(e.target.value) || 0;
                    setMarkAsPoint(value);
                    onUpdate({ points: value });
                  }}
                  className="w-20"
                  min={0}
                />
                <span className="text-sm text-muted-foreground">Points</span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
