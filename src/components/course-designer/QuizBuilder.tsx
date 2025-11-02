'use client';

import { useState } from 'react';
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
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Plus, Trash2, Edit2 } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

interface Question {
  id: string;
  text: string;
  type: 'MULTIPLE_CHOICE' | 'TRUE_FALSE' | 'SHORT_ANSWER' | 'ESSAY';
  options?: { id: string; text: string }[];
  correctAnswer?: { type: 'single' | 'multiple'; value: string | string[] };
  explanation?: string;
  points?: number;
  order: number;
}

interface Quiz {
  title?: string;
  description?: string;
  mode?: 'PRACTICE' | 'EXAM' | 'TIMED_EXAM';
  passingScore?: number;
  timeLimit?: number;
  showAnswersAfter?: boolean;
  randomizeQuestions?: boolean;
  questions?: Question[];
}

interface QuizBuilderProps {
  quiz: Quiz;
  onChange: (quiz: Quiz) => void;
}

const questionSchema = z.object({
  text: z.string().min(1, 'Question is required'),
  type: z.enum(['MULTIPLE_CHOICE', 'TRUE_FALSE', 'SHORT_ANSWER', 'ESSAY']),
  explanation: z.string().optional(),
  points: z.number().min(0).optional(),
});

type QuestionFormData = z.infer<typeof questionSchema>;

export function QuizBuilder({ quiz, onChange }: QuizBuilderProps) {
  const [showQuestionDialog, setShowQuestionDialog] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState<Question | null>(null);
  const questions = quiz.questions || [];

  const form = useForm({
    defaultValues: {
      title: quiz.title || '',
      description: quiz.description || '',
      mode: quiz.mode || 'PRACTICE',
      passingScore: quiz.passingScore || 70,
      timeLimit: quiz.timeLimit || undefined,
      showAnswersAfter: quiz.showAnswersAfter ?? true,
      randomizeQuestions: quiz.randomizeQuestions ?? false,
    },
  });

  const handleQuizSettingsChange = (field: string, value: any) => {
    const currentValues = form.getValues();
    const newQuiz = {
      ...quiz,
      [field]: value,
      ...currentValues,
    };
    onChange(newQuiz);
  };

  const handleAddQuestion = () => {
    setEditingQuestion(null);
    setShowQuestionDialog(true);
  };

  const handleEditQuestion = (question: Question) => {
    setEditingQuestion(question);
    setShowQuestionDialog(true);
  };

  const handleSaveQuestion = (question: Question) => {
    if (editingQuestion?.id.startsWith('temp-')) {
      const newQuestions = [...questions, question];
      onChange({
        ...quiz,
        questions: newQuestions.map((q, i) => ({ ...q, order: i })),
      });
    } else {
      const newQuestions = questions.map((q) =>
        q.id === question.id ? question : q
      );
      onChange({
        ...quiz,
        questions: newQuestions,
      });
    }
    setShowQuestionDialog(false);
    setEditingQuestion(null);
  };

  const handleDeleteQuestion = (id: string) => {
    const newQuestions = questions.filter((q) => q.id !== id);
    onChange({
      ...quiz,
      questions: newQuestions.map((q, i) => ({ ...q, order: i })),
    });
  };

  return (
    <div className="space-y-6">
      {/* Quiz Settings */}
      <Card className="p-4">
        <h3 className="font-semibold mb-4">Quiz Settings</h3>
        <div className="space-y-4">
          <FormItem>
            <FormLabel>Quiz Title</FormLabel>
            <FormControl>
              <Input
                placeholder="Enter quiz title"
                value={form.getValues().title}
                onChange={(e) => handleQuizSettingsChange('title', e.target.value)}
              />
            </FormControl>
          </FormItem>

          <FormItem>
            <FormLabel>Description</FormLabel>
            <FormControl>
              <Textarea
                placeholder="Describe the quiz..."
                rows={3}
                className="resize-none"
                value={form.getValues().description}
                onChange={(e) => handleQuizSettingsChange('description', e.target.value)}
              />
            </FormControl>
          </FormItem>

          <div className="grid grid-cols-2 gap-4">
            <FormItem>
              <FormLabel>Quiz Mode</FormLabel>
              <Select
                value={form.getValues().mode}
                onValueChange={(value) => handleQuizSettingsChange('mode', value)}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="PRACTICE">Practice (Instant Feedback)</SelectItem>
                  <SelectItem value="EXAM">Exam (Feedback After Submit)</SelectItem>
                  <SelectItem value="TIMED_EXAM">Timed Exam</SelectItem>
                </SelectContent>
              </Select>
              <FormDescription>
                How will students take this quiz?
              </FormDescription>
            </FormItem>

            <FormItem>
              <FormLabel>Passing Score (%)</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  placeholder="70"
                  min="0"
                  max="100"
                  value={form.getValues().passingScore}
                  onChange={(e) =>
                    handleQuizSettingsChange('passingScore', Number(e.target.value))
                  }
                />
              </FormControl>
            </FormItem>
          </div>

          {form.getValues().mode === 'TIMED_EXAM' && (
            <FormItem>
              <FormLabel>Time Limit (minutes)</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  placeholder="30"
                  min="1"
                  value={form.getValues().timeLimit}
                  onChange={(e) =>
                    handleQuizSettingsChange('timeLimit', Number(e.target.value))
                  }
                />
              </FormControl>
            </FormItem>
          )}

          <div className="space-y-2">
            <label className="flex items-center gap-2 cursor-pointer">
              <Checkbox
                checked={form.getValues().showAnswersAfter}
                onCheckedChange={(checked) =>
                  handleQuizSettingsChange('showAnswersAfter', checked)
                }
              />
              <span className="text-sm">Show answers after completion</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <Checkbox
                checked={form.getValues().randomizeQuestions}
                onCheckedChange={(checked) =>
                  handleQuizSettingsChange('randomizeQuestions', checked)
                }
              />
              <span className="text-sm">Randomize question order</span>
            </label>
          </div>
        </div>
      </Card>

      {/* Questions List */}
      <Card className="p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold">Questions</h3>
          <Button onClick={handleAddQuestion} size="sm" className="gap-2">
            <Plus className="h-4 w-4" />
            Add Question
          </Button>
        </div>

        {questions.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            No questions yet. Add your first question to get started.
          </p>
        ) : (
          <div className="space-y-2">
            {questions.map((question, index) => (
              <div
                key={question.id}
                className="flex items-center gap-3 p-3 border rounded-lg hover:bg-muted/50 transition-colors"
              >
                <Badge variant="secondary">{index + 1}</Badge>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm truncate">
                    {question.text}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Type: {question.type} • Points: {question.points || 1}
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleEditQuestion(question)}
                >
                  <Edit2 className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDeleteQuestion(question.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        )}
      </Card>

      {/* Question Editor Dialog */}
      <QuestionEditorDialog
        question={editingQuestion}
        isOpen={showQuestionDialog}
        onSave={handleSaveQuestion}
        onClose={() => {
          setShowQuestionDialog(false);
          setEditingQuestion(null);
        }}
      />
    </div>
  );
}

// Question Editor Dialog Component
function QuestionEditorDialog({
  question,
  isOpen,
  onSave,
  onClose,
}: {
  question: Question | null;
  isOpen: boolean;
  onSave: (question: Question) => void;
  onClose: () => void;
}) {
  const [formData, setFormData] = useState<Question>(
    question || {
      id: `temp-${Date.now()}`,
      text: '',
      type: 'MULTIPLE_CHOICE',
      options: [
        { id: 'a', text: '' },
        { id: 'b', text: '' },
      ],
      correctAnswer: { type: 'single', value: 'a' },
      points: 1,
      order: 0,
    }
  );

  const form = useForm({
    resolver: zodResolver(questionSchema),
    defaultValues: {
      text: formData.text,
      type: formData.type,
      explanation: formData.explanation,
      points: formData.points,
    },
  });

  const handleSave = () => {
    form.handleSubmit((data) => {
      onSave({
        ...formData,
        ...data,
      });
    })();
  };

  const handleAddOption = () => {
    const newOptions = [
      ...(formData.options || []),
      { id: String.fromCharCode(97 + (formData.options?.length || 0)), text: '' },
    ];
    setFormData((prev) => ({ ...prev, options: newOptions }));
  };

  const handleUpdateOption = (id: string, text: string) => {
    const updatedOptions = (formData.options || []).map((opt) =>
      opt.id === id ? { ...opt, text } : opt
    );
    setFormData((prev) => ({ ...prev, options: updatedOptions }));
  };

  const handleRemoveOption = (id: string) => {
    const updatedOptions = (formData.options || []).filter((opt) => opt.id !== id);
    setFormData((prev) => ({ ...prev, options: updatedOptions }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            {question?.id.startsWith('temp-') ? 'Add' : 'Edit'} Question
          </DialogTitle>
          <DialogDescription>
            Create a question for your quiz
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="text"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Question Text *</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Enter your question..."
                      rows={3}
                      className="resize-none"
                      {...field}
                      onChange={(e) => {
                        field.onChange(e);
                        setFormData((prev) => ({ ...prev, text: e.target.value }));
                      }}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Question Type *</FormLabel>
                  <Select
                    value={field.value}
                    onValueChange={(value) => {
                      field.onChange(value);
                      setFormData((prev) => ({
                        ...prev,
                        type: value as Question['type'],
                      }));
                    }}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="MULTIPLE_CHOICE">Multiple Choice</SelectItem>
                      <SelectItem value="TRUE_FALSE">True/False</SelectItem>
                      <SelectItem value="SHORT_ANSWER">Short Answer</SelectItem>
                      <SelectItem value="ESSAY">Essay</SelectItem>
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />

          {(formData.type === 'MULTIPLE_CHOICE' ||
            formData.type === 'TRUE_FALSE') && (
            <div className="space-y-3">
              <FormLabel>Options</FormLabel>
              {(formData.options || []).map((option) => (
                <div key={option.id} className="flex gap-2">
                  <Input
                    placeholder={`Option ${option.id.toUpperCase()}`}
                    value={option.text}
                    onChange={(e) => handleUpdateOption(option.id, e.target.value)}
                    className="flex-1"
                  />
                  {(formData.options?.length || 0) > 2 && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleRemoveOption(option.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))}
              {formData.type === 'MULTIPLE_CHOICE' && (
                <Button variant="outline" size="sm" onClick={handleAddOption}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Option
                </Button>
              )}
            </div>
          )}

          <FormField
            control={form.control}
            name="points"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Points</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="1"
                    min="0"
                    {...field}
                    onChange={(e) => {
                      field.onChange(Number(e.target.value));
                      setFormData((prev) => ({
                        ...prev,
                        points: Number(e.target.value),
                      }));
                    }}
                  />
                </FormControl>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="explanation"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Explanation (Optional)</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Explain the correct answer..."
                    rows={3}
                    className="resize-none"
                    {...field}
                    onChange={(e) => {
                      field.onChange(e);
                      setFormData((prev) => ({
                        ...prev,
                        explanation: e.target.value,
                      }));
                    }}
                  />
                </FormControl>
              </FormItem>
            )}
            />
          </div>
        </Form>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSave}>
            Save Question
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
