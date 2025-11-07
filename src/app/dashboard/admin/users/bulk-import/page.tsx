'use client';

import { useState, FormEvent, ChangeEvent, DragEvent } from 'react';
import { Upload, Download, AlertCircle, CheckCircle2, Loader2, FileText, FileJson } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

interface ImportResult {
  message: string;
  createdCount: number;
  errors: Array<{ user: string; error: string }>;
}

type FileType = 'csv' | 'json';

export default function BulkImportPage() {
  const [file, setFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [importResult, setImportResult] = useState<ImportResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<FileType>('csv');
  const [isDragging, setIsDragging] = useState(false);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>, expectedType: FileType) => {
    const selectedFile = e.target.files?.[0];
    processFile(selectedFile, expectedType);
  };

  const processFile = (selectedFile: File | undefined, expectedType: FileType) => {
    if (selectedFile) {
      const fileExtension = selectedFile.name.toLowerCase().endsWith(`.${expectedType}`);

      if (!fileExtension) {
        setError(`Please select a ${expectedType.toUpperCase()} file`);
        setFile(null);
        return;
      }

      setFile(selectedFile);
      setImportResult(null);
      setError(null);
    }
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>, expectedType: FileType) => {
    e.preventDefault();
    setIsDragging(false);

    const droppedFile = e.dataTransfer.files?.[0];
    processFile(droppedFile, expectedType);
  };

  const downloadCsvTemplate = () => {
    const csvContent = `name,email,phone,role,isActive
John Doe,john.doe@example.com,+1 (555) 123-4567,STUDENT,true
Jane Smith,jane.smith@example.com,+1 (555) 234-5678,TEACHER,true
Bob Johnson,bob.johnson@example.com,+1 (555) 345-6789,PARENT,true
Alice Williams,alice.williams@example.com,+1 (555) 456-7890,ADMIN,true
Charlie Brown,charlie.brown@example.com,+1 (555) 567-8901,EDUCATIONAL_MANAGER,true`;

    downloadFile(csvContent, 'bulk-import-template.csv', 'text/csv');
  };

  const downloadJsonTemplate = () => {
    const jsonContent = {
      users: [
        {
          name: "John Doe",
          email: "john.doe@example.com",
          phone: "+1 (555) 123-4567",
          role: "STUDENT",
          isActive: true
        },
        {
          name: "Jane Smith",
          email: "jane.smith@example.com",
          phone: "+1 (555) 234-5678",
          role: "TEACHER",
          isActive: true
        },
        {
          name: "Bob Johnson",
          email: "bob.johnson@example.com",
          phone: "+1 (555) 345-6789",
          role: "PARENT",
          isActive: true
        },
        {
          name: "Alice Williams",
          email: "alice.williams@example.com",
          phone: "+1 (555) 456-7890",
          role: "ADMIN",
          isActive: true
        },
        {
          name: "Charlie Brown",
          email: "charlie.brown@example.com",
          phone: "+1 (555) 567-8901",
          role: "EDUCATIONAL_MANAGER",
          isActive: true
        }
      ]
    };

    downloadFile(JSON.stringify(jsonContent, null, 2), 'bulk-import-template.json', 'application/json');
  };

  const downloadFile = (content: string, filename: string, mimeType: string) => {
    const blob = new Blob([content], { type: `${mimeType};charset=utf-8;` });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);

    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!file) {
      setError('Please select a file to upload');
      return;
    }

    setIsSubmitting(true);
    setError(null);
    setImportResult(null);
    setUploadProgress(10);

    const formData = new FormData();
    formData.append('file', file);

    try {
      setUploadProgress(30);
      const response = await fetch('/api/admin/users/bulk-import', {
        method: 'POST',
        body: formData,
      });

      setUploadProgress(70);
      const data = await response.json();

      setUploadProgress(90);

      if (!response.ok && response.status !== 207) {
        throw new Error(data.message || 'Bulk import failed');
      }

      setImportResult(data);
      setFile(null);
      setUploadProgress(100);

      // Reset file inputs
      const csvInput = document.getElementById('csv-upload') as HTMLInputElement;
      const jsonInput = document.getElementById('json-upload') as HTMLInputElement;
      if (csvInput) csvInput.value = '';
      if (jsonInput) jsonInput.value = '';

      // Reset progress after a delay
      setTimeout(() => setUploadProgress(0), 1000);

    } catch (err: any) {
      setError(err.message || 'An error occurred during import');
      setUploadProgress(0);
    } finally {
      setIsSubmitting(false);
    }
  };

  const UploadZone = ({ fileType }: { fileType: FileType }) => (
    <div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={(e) => handleDrop(e, fileType)}
      className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
        isDragging
          ? 'border-primary bg-primary/5'
          : 'border-muted-foreground/25 hover:border-muted-foreground/50'
      }`}
    >
      <div className="flex flex-col items-center gap-3">
        {fileType === 'csv' ? (
          <FileText className="h-12 w-12 text-muted-foreground" />
        ) : (
          <FileJson className="h-12 w-12 text-muted-foreground" />
        )}
        <div>
          <p className="text-sm font-medium">
            Drop your {fileType.toUpperCase()} file here, or click to browse
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            Maximum file size: 5MB
          </p>
        </div>
        <Input
          id={`${fileType}-upload`}
          type="file"
          accept={`.${fileType}`}
          onChange={(e) => handleFileChange(e, fileType)}
          className="max-w-xs"
        />
      </div>
    </div>
  );

  return (
    <div className="container mx-auto py-8 max-w-5xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Bulk User Import</h1>
        <p className="text-muted-foreground mt-2">
          Import multiple users at once using CSV or JSON files
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as FileType)} className="space-y-6">
        <TabsList className="grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="csv" className="gap-2">
            <FileText className="h-4 w-4" />
            CSV Import
          </TabsTrigger>
          <TabsTrigger value="json" className="gap-2">
            <FileJson className="h-4 w-4" />
            JSON Import
          </TabsTrigger>
        </TabsList>

        {/* CSV Import Tab */}
        <TabsContent value="csv" className="space-y-6">
          {/* CSV Template Download Card */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    Download CSV Template
                    <Badge variant="outline" className="gap-1">
                      <FileText className="h-3 w-3" />
                      CSV
                    </Badge>
                  </CardTitle>
                  <CardDescription>
                    Download a sample CSV template to see the required format
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Button
                variant="outline"
                onClick={downloadCsvTemplate}
                className="w-full sm:w-auto"
              >
                <Download className="mr-2 h-4 w-4" />
                Download CSV Template
              </Button>
              <div className="mt-6 space-y-3">
                <div>
                  <p className="text-sm font-semibold mb-2">Required fields (case-sensitive):</p>
                  <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                    <div className="flex items-start gap-2 text-sm">
                      <code className="bg-muted px-2 py-1 rounded text-xs font-mono">name</code>
                      <span className="text-muted-foreground">Full name</span>
                    </div>
                    <div className="flex items-start gap-2 text-sm">
                      <code className="bg-muted px-2 py-1 rounded text-xs font-mono">email</code>
                      <span className="text-muted-foreground">Email (unique)</span>
                    </div>
                    <div className="flex items-start gap-2 text-sm">
                      <code className="bg-muted px-2 py-1 rounded text-xs font-mono">role</code>
                      <span className="text-muted-foreground">User role</span>
                    </div>
                  </div>
                </div>
                <div>
                  <p className="text-sm font-semibold mb-2">Optional fields:</p>
                  <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                    <div className="flex items-start gap-2 text-sm">
                      <code className="bg-muted px-2 py-1 rounded text-xs font-mono">phone</code>
                      <span className="text-muted-foreground">Phone number</span>
                    </div>
                    <div className="flex items-start gap-2 text-sm">
                      <code className="bg-muted px-2 py-1 rounded text-xs font-mono">isActive</code>
                      <span className="text-muted-foreground">true/false</span>
                    </div>
                  </div>
                </div>
                <div className="bg-muted/50 rounded-lg p-4 mt-4">
                  <p className="text-sm font-semibold mb-2">Valid roles:</p>
                  <div className="flex flex-wrap gap-2">
                    {['STUDENT', 'TEACHER', 'PARENT', 'ADMIN', 'EDUCATIONAL_MANAGER'].map((role) => (
                      <Badge key={role} variant="secondary">
                        {role}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* CSV Upload Card */}
          <Card>
            <CardHeader>
              <CardTitle>Upload CSV File</CardTitle>
              <CardDescription>
                Select a CSV file containing user data to import
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <UploadZone fileType="csv" />

                {file && activeTab === 'csv' && (
                  <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <FileText className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="text-sm font-medium">{file.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {(file.size / 1024).toFixed(2)} KB
                        </p>
                      </div>
                    </div>
                    <Button
                      type="submit"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Importing
                        </>
                      ) : (
                        <>
                          <Upload className="mr-2 h-4 w-4" />
                          Import CSV
                        </>
                      )}
                    </Button>
                  </div>
                )}

                {isSubmitting && uploadProgress > 0 && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Upload Progress</span>
                      <span className="font-medium">{uploadProgress}%</span>
                    </div>
                    <Progress value={uploadProgress} className="h-2" />
                  </div>
                )}
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        {/* JSON Import Tab */}
        <TabsContent value="json" className="space-y-6">
          {/* JSON Template Download Card */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    Download JSON Template
                    <Badge variant="outline" className="gap-1">
                      <FileJson className="h-3 w-3" />
                      JSON
                    </Badge>
                  </CardTitle>
                  <CardDescription>
                    Download a sample JSON template to see the required format
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Button
                variant="outline"
                onClick={downloadJsonTemplate}
                className="w-full sm:w-auto"
              >
                <Download className="mr-2 h-4 w-4" />
                Download JSON Template
              </Button>
              <div className="mt-6 space-y-4">
                <div>
                  <p className="text-sm font-semibold mb-2">JSON Structure:</p>
                  <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-xs">
{`{
  "users": [
    {
      "name": "John Doe",
      "email": "john@example.com",
      "phone": "+1 (555) 123-4567",
      "role": "STUDENT",
      "isActive": true
    }
  ]
}`}
                  </pre>
                </div>
                <div>
                  <p className="text-sm font-semibold mb-2">Required fields (case-sensitive):</p>
                  <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                    <div className="flex items-start gap-2 text-sm">
                      <code className="bg-muted px-2 py-1 rounded text-xs font-mono">name</code>
                      <span className="text-muted-foreground">Full name</span>
                    </div>
                    <div className="flex items-start gap-2 text-sm">
                      <code className="bg-muted px-2 py-1 rounded text-xs font-mono">email</code>
                      <span className="text-muted-foreground">Email (unique)</span>
                    </div>
                    <div className="flex items-start gap-2 text-sm">
                      <code className="bg-muted px-2 py-1 rounded text-xs font-mono">role</code>
                      <span className="text-muted-foreground">User role</span>
                    </div>
                  </div>
                </div>
                <div>
                  <p className="text-sm font-semibold mb-2">Optional fields:</p>
                  <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                    <div className="flex items-start gap-2 text-sm">
                      <code className="bg-muted px-2 py-1 rounded text-xs font-mono">phone</code>
                      <span className="text-muted-foreground">Phone number</span>
                    </div>
                    <div className="flex items-start gap-2 text-sm">
                      <code className="bg-muted px-2 py-1 rounded text-xs font-mono">isActive</code>
                      <span className="text-muted-foreground">true/false</span>
                    </div>
                  </div>
                </div>
                <div className="bg-muted/50 rounded-lg p-4">
                  <p className="text-sm font-semibold mb-2">Valid roles:</p>
                  <div className="flex flex-wrap gap-2">
                    {['STUDENT', 'TEACHER', 'PARENT', 'ADMIN', 'EDUCATIONAL_MANAGER'].map((role) => (
                      <Badge key={role} variant="secondary">
                        {role}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* JSON Upload Card */}
          <Card>
            <CardHeader>
              <CardTitle>Upload JSON File</CardTitle>
              <CardDescription>
                Select a JSON file containing user data to import
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <UploadZone fileType="json" />

                {file && activeTab === 'json' && (
                  <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <FileJson className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="text-sm font-medium">{file.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {(file.size / 1024).toFixed(2)} KB
                        </p>
                      </div>
                    </div>
                    <Button
                      type="submit"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Importing
                        </>
                      ) : (
                        <>
                          <Upload className="mr-2 h-4 w-4" />
                          Import JSON
                        </>
                      )}
                    </Button>
                  </div>
                )}

                {isSubmitting && uploadProgress > 0 && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Upload Progress</span>
                      <span className="font-medium">{uploadProgress}%</span>
                    </div>
                    <Progress value={uploadProgress} className="h-2" />
                  </div>
                )}
              </form>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Error Alert */}
      {error && (
        <Alert variant="destructive" className="mt-6">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Success Result */}
      {importResult && (
        <Alert className="mt-6 border-green-500 bg-green-50 dark:bg-green-950/20">
          <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-400" />
          <AlertTitle className="text-green-800 dark:text-green-300">
            Import Completed Successfully
          </AlertTitle>
          <AlertDescription className="text-green-700 dark:text-green-400">
            <p className="font-medium mb-2">
              {importResult.createdCount} user{importResult.createdCount !== 1 ? 's' : ''} imported successfully
            </p>

            {importResult.errors && importResult.errors.length > 0 && (
              <div className="mt-4 space-y-2">
                <p className="font-medium text-red-600 dark:text-red-400">
                  {importResult.errors.length} error{importResult.errors.length !== 1 ? 's' : ''} occurred:
                </p>
                <div className="bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800 rounded-md p-3 max-h-60 overflow-y-auto">
                  <ul className="space-y-1 text-sm text-red-700 dark:text-red-300">
                    {importResult.errors.map((err, index) => (
                      <li key={index} className="flex gap-2">
                        <span className="font-medium">{err.user}:</span>
                        <span>{err.error}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </AlertDescription>
        </Alert>
      )}

      {/* Information Card */}
      <Card className="mt-6 bg-muted/50 dark:bg-muted/20">
        <CardHeader>
          <CardTitle className="text-lg">Important Notes</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          <ul className="list-disc list-inside space-y-1.5 text-muted-foreground">
            <li>Both CSV and JSON formats are supported for bulk import</li>
            <li>CSV files must include headers in the first row</li>
            <li>JSON files should contain a "users" array with user objects</li>
            <li>Email addresses must be unique - duplicates will be skipped</li>
            <li>Default password will be auto-generated for each user</li>
            <li>Users will receive an email with their login credentials (when email is configured)</li>
            <li>Maximum file size: 5MB</li>
            <li>All imported users will be marked as active by default (unless specified)</li>
            <li>Field names are case-sensitive in both formats</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
