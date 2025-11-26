'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { Upload, Download, AlertCircle, CheckCircle2, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

export default function CreateFromTemplatePage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [file, setFile] = useState<File | null>(null);
  const [subject, setSubject] = useState('');
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [errors, setErrors] = useState<Array<{ message: string; severity: 'error' | 'warning' }>>([]);
  const [success, setSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  // Download sample template
  const downloadSampleTemplate = () => {
    const sampleContent = `---
metadata:
  title: "My Course Title"
  description: "What this course teaches"
  subject: "Subject Name"
  language: "FR"
  requiresOnline: true
  status: "DRAFT"
---

# My Course Title

## Module 1: Introduction

### Lesson 1.1: Getting Started
**Type:** LESSON
**Duration:** 900
**Offline:** true

Write your lesson content here. This is a brief introduction to the topic.

Key points:
- Point 1
- Point 2
- Point 3

---

### Content 1.2: Additional Reading
**Type:** TEXT
**Offline:** true

Provide additional reading material or detailed explanations here.

---

### Quiz 1.3: Knowledge Check
**Type:** QUIZ
**Mode:** PRACTICE
**PassingScore:** 70
**TimeLimit:** null

#### Question 1
**Type:** MULTIPLE_CHOICE
**Points:** 1

What is the main concept here?

a) Option A
b) Option B
c) Option C

**Answer:** a
**Explanation:** Explanation of why this is correct.

---

#### Question 2
**Type:** TRUE_FALSE
**Points:** 1

Is this statement true?

**Answer:** true
**Explanation:** Explanation of the answer.
`;

    const blob = new Blob([sampleContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'sample_course.course.md';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success('Sample template downloaded');
  };

  // Handle file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      // Validate file
      if (!selectedFile.name.endsWith('.course.md') && !selectedFile.name.endsWith('.md')) {
        toast.error('Invalid file type. Please upload a .course.md or .md file');
        return;
      }
      if (selectedFile.size > 5 * 1024 * 1024) {
        toast.error('File too large. Maximum size is 5MB');
        return;
      }
      setFile(selectedFile);
      setErrors([]);
      setSuccess(false);
    }
  };

  // Handle drag and drop
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();

    const droppedFile = e.dataTransfer.files?.[0];
    if (droppedFile) {
      const input = fileInputRef.current;
      if (input) {
        const dataTransfer = new DataTransfer();
        dataTransfer.items.add(droppedFile);
        input.files = dataTransfer.files;
        handleFileChange({ target: input } as React.ChangeEvent<HTMLInputElement>);
      }
    }
  };

  // Handle upload
  const handleUpload = async () => {
    if (!file) {
      toast.error('Please select a file');
      return;
    }

    if (!subject.trim()) {
      toast.error('Please enter a subject name');
      return;
    }

    setUploading(true);
    setProgress(0);
    setErrors([]);
    setSuccess(false);

    try {
      // Simulate progress
      setProgress(30);

      const formData = new FormData();
      formData.append('file', file);
      formData.append('subject', subject);

      setProgress(70);

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 180000); // 180 seconds

      const response = await fetch('/api/teacher/courses/import', {
        method: 'POST',
        body: formData,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      setProgress(90);

      const data = await response.json();

      if (!response.ok) {
        if (data.errors) {
          setErrors(data.errors);
        }
        toast.error(data.message || 'Failed to import course');
        setProgress(0);
        return;
      }

      setProgress(100);
      setSuccess(true);
      setSuccessMessage(`Course "${data.courseName}" imported successfully with ${data.contentCount} content items`);
      setFile(null);
      setSubject('');
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }

      toast.success('Course imported successfully!');

      // Redirect after 2 seconds
      setTimeout(() => {
        router.push(`/teacher/courses`);
      }, 2000);
    } catch (error) {
      console.error('Upload error:', error);
      if (error instanceof DOMException && error.name === 'AbortError') {
        toast.error('Course import timed out after 180 seconds. Please try again or check the server logs.');
        setErrors([{ message: 'Import timed out', severity: 'error' }]);
      } else {
        toast.error('Failed to import course');
        setErrors([{ message: error instanceof Error ? error.message : 'Unknown error', severity: 'error' }]);
      }
      setProgress(0);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="flex flex-col gap-6 p-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold">Create Course from Template</h1>
        <p className="text-muted-foreground">Upload a .course.md template file to create a new course</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Left side: Instructions */}
        <Card className="dark:border-slate-700">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Download className="h-5 w-5" />
              Getting Started
            </CardTitle>
            <CardDescription>How to create your course template</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <h3 className="font-semibold">Step 1: Download Template</h3>
              <p className="text-sm text-muted-foreground">
                Click the button below to download a sample course template. Edit it with your course content.
              </p>
              <Button
                variant="outline"
                className="w-full dark:border-slate-600 dark:hover:bg-slate-800"
                onClick={downloadSampleTemplate}
              >
                <Download className="mr-2 h-4 w-4" />
                Download Sample Template
              </Button>
            </div>

            <div className="space-y-2">
              <h3 className="font-semibold">Step 2: Edit Your Course</h3>
              <p className="text-sm text-muted-foreground">
                Open the template in any text editor (Word, Google Docs, VS Code) and add your course content following the format.
              </p>
            </div>

            <div className="space-y-2">
              <h3 className="font-semibold">Step 3: Upload File</h3>
              <p className="text-sm text-muted-foreground">
                Upload your completed .course.md file and select the subject. The system will validate and import your course.
              </p>
            </div>

            <Alert className="dark:bg-slate-900 dark:border-slate-700">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>File Requirements</AlertTitle>
              <AlertDescription>
                • File type: .course.md or .md
                <br />• Maximum size: 5MB
                <br />• Must include YAML frontmatter
                <br />• Valid metadata required
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>

        {/* Right side: Upload area */}
        <div className="flex flex-col gap-6">
          <Card className="dark:border-slate-700">
            <CardHeader>
              <CardTitle>Upload Course Template</CardTitle>
              <CardDescription>Drag and drop or click to select your file</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Drag and drop area */}
              <div
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                className="border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors
                  dark:border-slate-600 dark:hover:bg-slate-900 hover:bg-muted"
                onClick={() => fileInputRef.current?.click()}
              >
                <Upload className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                <p className="font-semibold">Drop your file here or click to browse</p>
                <p className="text-sm text-muted-foreground mt-1">Supported: .course.md, .md files up to 5MB</p>
              </div>

              <input
                ref={fileInputRef}
                type="file"
                onChange={handleFileChange}
                accept=".md,.course.md"
                className="hidden"
              />

              {/* Selected file info */}
              {file && (
                <div className="p-3 bg-muted dark:bg-slate-900 rounded-lg flex items-center justify-between">
                  <div className="flex items-center gap-2 flex-1">
                    <CheckCircle2 className="h-5 w-5 text-green-500" />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">{file.name}</p>
                      <p className="text-xs text-muted-foreground">{(file.size / 1024).toFixed(2)} KB</p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setFile(null);
                      if (fileInputRef.current) {
                        fileInputRef.current.value = '';
                      }
                    }}
                    className="dark:hover:bg-slate-800"
                  >
                    Change
                  </Button>
                </div>
              )}

              {/* Subject input */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Subject Name</label>
                <Input
                  placeholder="e.g., Biology, Mathematics, English"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  disabled={uploading}
                  className="dark:bg-slate-900 dark:border-slate-700"
                />
                <p className="text-xs text-muted-foreground">
                  The subject will be created if it doesn't already exist
                </p>
              </div>

              {/* Progress bar */}
              {uploading && progress > 0 && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Uploading...</span>
                    <span className="text-sm text-muted-foreground">{progress}%</span>
                  </div>
                  <Progress value={progress} className="dark:bg-slate-800" />
                </div>
              )}

              {/* Upload button */}
              <Button
                onClick={handleUpload}
                disabled={!file || uploading}
                className="w-full"
              >
                {uploading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Importing Course...
                  </>
                ) : (
                  <>
                    <Upload className="mr-2 h-4 w-4" />
                    Import Course
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          {/* Errors */}
          {errors.length > 0 && (
            <Alert variant="destructive" className="dark:bg-red-950 dark:border-red-900">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Import Failed</AlertTitle>
              <AlertDescription>
                <ul className="list-disc list-inside space-y-1 mt-2">
                  {errors.map((error, idx) => (
                    <li key={idx} className="text-sm">
                      {error.message}
                    </li>
                  ))}
                </ul>
              </AlertDescription>
            </Alert>
          )}

          {/* Success */}
          {success && (
            <Alert className="border-green-600 dark:bg-green-950 dark:border-green-900">
              <CheckCircle2 className="h-4 w-4 text-green-600" />
              <AlertTitle className="text-green-600">Success</AlertTitle>
              <AlertDescription className="text-green-700 dark:text-green-400">
                {successMessage}
              </AlertDescription>
            </Alert>
          )}
        </div>
      </div>
    </div>
  );
}
