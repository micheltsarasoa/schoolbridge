
'use client';

import { useState, FormEvent, ChangeEvent } from 'react';
import { useRole } from '@/hooks/useRole';
import { UserRole } from '@/generated/prisma';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2, UploadCloudIcon } from 'lucide-react';
import { toast } from 'sonner';

export default function BulkImportPage() {
  const { isAuthorized, isLoading: isAuthLoading } = useRole(UserRole.ADMIN);
  const [file, setFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [importResult, setImportResult] = useState<any | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
      setImportResult(null);
      setError(null);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    setImportResult(null);

    if (!file) {
      setError("Please select a file to upload.");
      setIsSubmitting(false);
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch('/api/admin/users/bulk-import', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Bulk import failed");
      }

      setImportResult(data);
      toast.success(`Bulk import processed: ${data.createdCount} users created.`);

    } catch (err: any) {
      setError(err.message);
      toast.error(err.message || "An error occurred during import.");
    } finally {
      setIsSubmitting(false);
      setFile(null); // Clear file input after submission
    }
  };

  if (isAuthLoading) {
    return (
      <div className="flex justify-center items-center min-h-[calc(100vh-64px)]">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!isAuthorized) {
    return (
      <div className="text-center py-10">
        <h1 className="text-3xl font-bold text-red-600">Access Denied</h1>
        <p className="mt-4">You do not have permission to view this page.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold mb-6">Bulk User Import</h1>
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Upload User Data</CardTitle>
          <p className="text-sm text-muted-foreground">Upload a CSV or JSON file to import multiple users.</p>
          <p className="text-xs text-muted-foreground">Expected fields: `name`, `email`, `password`, `role`, `schoolId` (optional)</p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="flex items-center justify-center w-full">
              <Label
                htmlFor="dropzone-file"
                className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100"
              >
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <UploadCloudIcon className="w-8 h-8 mb-4 text-gray-500" />
                  <p className="mb-2 text-sm text-gray-500">
                    <span className="font-semibold">Click to upload</span> or drag and drop
                  </p>
                  <p className="text-xs text-gray-500">CSV or JSON (MAX. 5MB)</p>
                </div>
                <Input id="dropzone-file" type="file" className="hidden" onChange={handleFileChange} accept=".csv,.json" />
              </Label>
            </div>
            {file && <p className="text-sm text-gray-700">Selected file: {file.name}</p>}
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <Button type="submit" disabled={isSubmitting || !file}>
              {isSubmitting ? 'Importing...' : 'Start Import'}
            </Button>
          </form>

          {importResult && (
            <div className="mt-6 p-4 border rounded-lg bg-gray-50">
              <h3 className="text-lg font-semibold">Import Summary:</h3>
              <p>Users Created: {importResult.createdCount}</p>
              {importResult.errors.length > 0 && (
                <div>
                  <p className="text-red-500">Errors during import:</p>
                  <ul className="list-disc pl-5 text-sm text-red-500">
                    {importResult.errors.map((err: any, index: number) => (
                      <li key={index}>User: {err.user} - {err.error}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
