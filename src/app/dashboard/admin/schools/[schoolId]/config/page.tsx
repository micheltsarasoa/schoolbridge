
'use client';

import { useState, useEffect, FormEvent } from 'react';
import { SchoolConfig } from '@/generated/prisma';
import { useRole } from '@/hooks/useRole';
import { UserRole } from '@/generated/prisma';
import { useParams } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Loader2 } from 'lucide-react';

export default function SchoolConfigPage() {
  const { isAuthorized, isLoading: isAuthLoading } = useRole(UserRole.ADMIN);
  const params = useParams();
  const schoolId = params.schoolId as string;

  const [config, setConfig] = useState<SchoolConfig | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isAuthorized && schoolId) {
      const fetchConfig = async () => {
        try {
          setIsLoading(true);
          const response = await fetch(`/api/admin/schools/${schoolId}/config`);
          if (!response.ok) {
            throw new Error('Failed to fetch school configuration.');
          }
          const data = await response.json();
          setConfig(data);
        } catch (err: any) {
          setError(err.message);
        } finally {
          setIsLoading(false);
        }
      };
      fetchConfig();
    }
  }, [isAuthorized, schoolId]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    if (!config) return;

    try {
      const response = await fetch(`/api/admin/schools/${schoolId}/config`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          allowVideoDownload: config.allowVideoDownload,
          allowPdfDownload: config.allowPdfDownload,
          allowInteractiveDownload: config.allowInteractiveDownload,
          syncFrequencyHours: Number(config.syncFrequencyHours),
          maxDownloadSizeMB: Number(config.maxDownloadSizeMB),
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update configuration');
      }

      const updatedConfig = await response.json();
      setConfig(updatedConfig);
      setError('Configuration updated successfully!'); // Success message

    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isAuthLoading || isLoading) {
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

  if (!config) {
    return <div className="text-center py-10">No configuration found for this school.</div>;
  }

  return (
    <div className="container mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold mb-6">School Configuration</h1>
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Settings for School ID: {schoolId}</CardTitle>
          <p className="text-sm text-muted-foreground">Manage various settings for this school.</p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="flex items-center justify-between">
              <Label htmlFor="allowVideoDownload">Allow Video Download</Label>
              <Switch
                id="allowVideoDownload"
                checked={config.allowVideoDownload}
                onCheckedChange={(checked) => setConfig({ ...config, allowVideoDownload: checked })}
              />
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="allowPdfDownload">Allow PDF Download</Label>
              <Switch
                id="allowPdfDownload"
                checked={config.allowPdfDownload}
                onCheckedChange={(checked) => setConfig({ ...config, allowPdfDownload: checked })}
              />
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="allowInteractiveDownload">Allow Interactive Download</Label>
              <Switch
                id="allowInteractiveDownload"
                checked={config.allowInteractiveDownload}
                onCheckedChange={(checked) => setConfig({ ...config, allowInteractiveDownload: checked })}
              />
            </div>

            <div>
              <Label htmlFor="syncFrequencyHours">Sync Frequency (hours)</Label>
              <Input
                id="syncFrequencyHours"
                type="number"
                value={config.syncFrequencyHours}
                onChange={(e) => setConfig({ ...config, syncFrequencyHours: Number(e.target.value) })}
                min={1}
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="maxDownloadSizeMB">Max Download Size (MB)</Label>
              <Input
                id="maxDownloadSizeMB"
                type="number"
                value={config.maxDownloadSizeMB}
                onChange={(e) => setConfig({ ...config, maxDownloadSizeMB: Number(e.target.value) })}
                min={1}
                className="mt-1"
              />
            </div>

            {error && <p className="text-red-500 text-sm">{error}</p>}

            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Saving...' : 'Save Configuration'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
