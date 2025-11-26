'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { HelpCircle, X, Plus, Trash2 } from 'lucide-react';
import type { Lecture, QuizData, Question, QuestionType } from '@/types/course';
import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { generateId } from '@/lib/course-utils';
import { Slider } from '@/components/ui/slider';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { FillBlankQuestion } from './fill-blank-question';

interface QuizEditorProps {
  lecture: Lecture;
  onUpdate: (updates: Partial<Lecture>) => void;
  onClose: () => void;
}

export function QuizEditor({ lecture, onUpdate, onClose }: QuizEditorProps) {
  const [title, setTitle] = useState(lecture.title);
  const [quizData, setQuizData] = useState<QuizData>(lecture.quiz || {
    passingScore: 70,
    attemptsAllowed: 3,
    shuffleQuestions: false,
    shuffleAnswers: false,
    showCorrectAnswers: true,
    showCorrectAnswersAfter: 'submission',
    questions: []
  });

  const addQuestion = (type: QuestionType) => {
    const newQuestion: Question = {
      id: generateId(),
      order: quizData.questions.length + 1,
      type,
      question: '',
      points: 20,
      partialCredit: false,
      options: type === 'MULTIPLE_CHOICE' || type === 'MULTIPLE_ANSWER' ? ['', '', '', ''] : undefined,
      correctAnswer: type === 'TRUE_FALSE' ? true : (type === 'MULTIPLE_CHOICE' ? 'option-0' : (type === 'MULTIPLE_ANSWER' ? [] : undefined)),
      acceptedAnswers: type === 'FILL_BLANK' ? [''] : undefined,
      orderingItems: type === 'ORDERING' ? [
        { id: generateId(), text: '', correctOrder: 1 },
        { id: generateId(), text: '', correctOrder: 2 },
        { id: generateId(), text: '', correctOrder: 3 }
      ] : undefined,
    };
    
    setQuizData({
      ...quizData,
      questions: [...quizData.questions, newQuestion]
    });
  };

  const updateQuestion = (id: string, updates: Partial<Question>) => {
    setQuizData({
      ...quizData,
      questions: quizData.questions.map(q => q.id === id ? { ...q, ...updates } : q)
    });
  };

  const deleteQuestion = (id: string) => {
    setQuizData({
      ...quizData,
      questions: quizData.questions.filter(q => q.id !== id).map((q, i) => ({ ...q, order: i + 1 }))
    });
  };

  const handleSave = () => {
    onUpdate({
      title,
      quiz: quizData
    });
    onClose();
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div className="flex items-center gap-2">
          <HelpCircle className="h-5 w-5" />
          <CardTitle>Quiz Lecture</CardTitle>
          <Badge variant="secondary">Quiz</Badge>
        </div>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <h3 className="font-semibold">Quiz Settings</h3>
          <div className="space-y-2">
            <Label>Quiz Title</Label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter quiz title"
            />
          </div>
          <div className="space-y-2">
            <Label>Passing Score (%)</Label>
            <Slider
              value={[quizData.passingScore]}
              onValueChange={([value]) => setQuizData({ ...quizData, passingScore: value })}
              max={100}
              step={5}
            />
            <p className="text-sm text-muted-foreground">{quizData.passingScore}%</p>
          </div>
          <div className="space-y-2">
            <Label>Time Limit (minutes, 0 = unlimited)</Label>
            <Input
              type="number"
              value={quizData.timeLimit || 0}
              onChange={(e) => setQuizData({ ...quizData, timeLimit: parseInt(e.target.value) || 0 })}
              min={0}
            />
          </div>
          <div className="space-y-2">
            <Label>Attempts Allowed (0 = unlimited)</Label>
            <Input
              type="number"
              value={quizData.attemptsAllowed}
              onChange={(e) => setQuizData({ ...quizData, attemptsAllowed: parseInt(e.target.value) || 0 })}
              min={0}
            />
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="font-semibold">Quiz Behavior</h3>
          <div className="flex items-center justify-between">
            <Label>Shuffle Questions</Label>
            <Switch 
              checked={quizData.shuffleQuestions} 
              onCheckedChange={(checked) => setQuizData({ ...quizData, shuffleQuestions: checked })}
            />
          </div>
          <div className="flex items-center justify-between">
            <Label>Shuffle Answers</Label>
            <Switch 
              checked={quizData.shuffleAnswers} 
              onCheckedChange={(checked) => setQuizData({ ...quizData, shuffleAnswers: checked })}
            />
          </div>
          <div className="flex items-center justify-between">
            <Label>Show Correct Answers</Label>
            <Switch 
              checked={quizData.showCorrectAnswers} 
              onCheckedChange={(checked) => setQuizData({ ...quizData, showCorrectAnswers: checked })}
            />
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold">Questions ({quizData.questions.length})</h3>
          </div>
          
          {quizData.questions.length === 0 ? (
            <div className="text-center py-12 border-2 border-dashed rounded-lg">
              <HelpCircle className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h4 className="font-semibold mb-2">No Questions Added Yet</h4>
              <p className="text-sm text-muted-foreground mb-4">
                Add your first question to start building your quiz
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {quizData.questions.map((question, index) => {
                if (question.type === 'FILL_BLANK') {
                  return (
                    <FillBlankQuestion
                      key={question.id}
                      question={question}
                      questionNumber={index + 1}
                      onUpdate={(updates) => updateQuestion(question.id, updates)}
                      onDelete={() => deleteQuestion(question.id)}
                    />
                  );
                }
                
                // Existing question rendering for other types
                return (
                  <Card key={question.id}>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Badge variant="outline">Q{index + 1}</Badge>
                          <Badge>{question.type.replace('_', ' ')}</Badge>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => deleteQuestion(question.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <Label>Question *</Label>
                        <Textarea
                          value={question.question}
                          onChange={(e) => updateQuestion(question.id, { question: e.target.value })}
                          placeholder="Enter your question"
                          rows={2}
                        />
                      </div>

                      {(question.type === 'MULTIPLE_CHOICE' || question.type === 'MULTIPLE_ANSWER') && (
                        <div className="space-y-2">
                          <Label>Answer Options</Label>
                          {question.type === 'MULTIPLE_CHOICE' ? (
                            <RadioGroup
                              value={question.correctAnswer as string}
                              onValueChange={(value) => updateQuestion(question.id, { correctAnswer: value })}
                            >
                              {question.options?.map((option, i) => (
                                <div key={i} className="flex items-center gap-2">
                                  <RadioGroupItem value={`option-${i}`} />
                                  <Input
                                    value={option}
                                    onChange={(e) => {
                                      const newOptions = [...(question.options || [])];
                                      newOptions[i] = e.target.value;
                                      updateQuestion(question.id, { options: newOptions });
                                    }}
                                    placeholder={`Option ${i + 1}`}
                                  />
                                </div>
                              ))}
                            </RadioGroup>
                          ) : (
                            <div className="space-y-2">
                              {question.options?.map((option, i) => (
                                <div key={i} className="flex items-center gap-2">
                                  <Checkbox
                                    checked={Array.isArray(question.correctAnswer) && question.correctAnswer.includes(`option-${i}`)}
                                    onCheckedChange={(checked) => {
                                      const current = Array.isArray(question.correctAnswer) ? question.correctAnswer : [];
                                      const updated = checked
                                        ? [...current, `option-${i}`]
                                        : current.filter(v => v !== `option-${i}`);
                                      updateQuestion(question.id, { correctAnswer: updated });
                                    }}
                                  />
                                  <Input
                                    value={option}
                                    onChange={(e) => {
                                      const newOptions = [...(question.options || [])];
                                      newOptions[i] = e.target.value;
                                      updateQuestion(question.id, { options: newOptions });
                                    }}
                                    placeholder={`Option ${i + 1}`}
                                  />
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      )}

                      {question.type === 'TRUE_FALSE' && (
                        <RadioGroup
                          value={question.correctAnswer === true ? 'true' : 'false'}
                          onValueChange={(value) => updateQuestion(question.id, { correctAnswer: value === 'true' })}
                        >
                          <div className="flex items-center gap-2">
                            <RadioGroupItem value="true" />
                            <Label>True</Label>
                          </div>
                          <div className="flex items-center gap-2">
                            <RadioGroupItem value="false" />
                            <Label>False</Label>
                          </div>
                        </RadioGroup>
                      )}

                      {question.type === 'ORDERING' && (
                        <div className="space-y-2">
                          <Label>Items to Order (students will arrange these in correct order)</Label>
                          {question.orderingItems?.map((item, i) => (
                            <div key={item.id} className="flex items-center gap-2">
                              <Badge variant="outline">{item.correctOrder}</Badge>
                              <Input
                                value={item.text}
                                onChange={(e) => {
                                  const newItems = [...(question.orderingItems || [])];
                                  newItems[i] = { ...newItems[i], text: e.target.value };
                                  updateQuestion(question.id, { orderingItems: newItems });
                                }}
                                placeholder={`Item ${i + 1}`}
                              />
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => {
                                  const newItems = question.orderingItems?.filter((_, idx) => idx !== i)
                                    .map((item, idx) => ({ ...item, correctOrder: idx + 1 })) || [];
                                  updateQuestion(question.id, { orderingItems: newItems });
                                }}
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </div>
                          ))}
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              const newItems = [
                                ...(question.orderingItems || []),
                                { id: generateId(), text: '', correctOrder: (question.orderingItems?.length || 0) + 1 }
                              ];
                              updateQuestion(question.id, { orderingItems: newItems });
                            }}
                          >
                            <Plus className="h-4 w-4 mr-2" />
                            Add Item
                          </Button>
                        </div>
                      )}

                      {/* Points input for all question types */}
                      <div className="grid grid-cols-2 gap-4 pt-2 border-t">
                        <div className="space-y-2">
                          <Label className="text-sm">Points</Label>
                          <Input
                            type="number"
                            value={question.points}
                            onChange={(e) => updateQuestion(question.id, { points: parseInt(e.target.value) || 0 })}
                            min={0}
                            className="w-24"
                          />
                        </div>
                        <div className="flex items-center justify-between">
                          <Label className="text-sm">Partial Credit</Label>
                          <Switch
                            checked={question.partialCredit}
                            onCheckedChange={(checked) => updateQuestion(question.id, { partialCredit: checked })}
                          />
                        </div>
                      </div>

                      {/* Optional fields */}
                      <div className="space-y-2">
                        <Label className="text-sm">Explanation (optional)</Label>
                        <Textarea
                          value={question.explanation || ''}
                          onChange={(e) => updateQuestion(question.id, { explanation: e.target.value })}
                          placeholder="Explain why this is the correct answer"
                          rows={2}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label className="text-sm">Hint (optional)</Label>
                        <Input
                          value={question.hint || ''}
                          onChange={(e) => updateQuestion(question.id, { hint: e.target.value })}
                          placeholder="Provide a hint for students"
                        />
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}

          <Select onValueChange={(value) => addQuestion(value as QuestionType)}>
            <SelectTrigger>
              <Plus className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Add Question" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="MULTIPLE_CHOICE">Multiple Choice</SelectItem>
              <SelectItem value="MULTIPLE_ANSWER">Multiple Answer</SelectItem>
              <SelectItem value="TRUE_FALSE">True/False</SelectItem>
              <SelectItem value="FILL_BLANK">Fill in the Blank</SelectItem>
              <SelectItem value="ORDERING">Ordering</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex gap-2 justify-end pt-4 border-t">
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={handleSave}>Save Quiz</Button>
        </div>
      </CardContent>
    </Card>
  );
}
