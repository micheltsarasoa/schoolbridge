'use client';

import { useParams } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
// Define the enum directly in the file to avoid import issues
enum UserRole {
    STUDENT = "STUDENT",
    TEACHER = "TEACHER",
    ADMIN = "ADMIN",
    PARENT = "PARENT",
}
import { Loader2 } from 'lucide-react'; // For loading indicator

interface SchoolSettings {
  otpEnabled: boolean;
}

export default function SchoolSettingsPage() {
  const params = useParams();
  const schoolId = params.schoolId as string;
  const { data: session, status: sessionStatus } = useSession();

  const [settings, setSettings] = useState<SchoolSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Check user authorization
  const isAdmin = session?.user?.role === UserRole.ADMIN; // Assuming session.user.role is UserRole

  useEffect(() => {
    if (sessionStatus === 'loading' || !isAdmin || !schoolId) return;

    const fetchSettings = async () => {
      try {
        const res = await fetch(`/api/admin/school-settings/${schoolId}`);
        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(errorData.message || 'Failed to fetch school settings');
        }
        const data = await res.json();
        setSettings(data);
      } catch (err: any) {
        setError(err.message);
        toast.error('Error', { description: err.message });
      } finally {
        setLoading(false);
      }
    };

    fetchSettings();
  }, [schoolId, sessionStatus, isAdmin]);

  const handleOtpToggle = async (checked: boolean) => {
    if (!isAdmin) {
      toast.error('Permission Denied', { description: 'You do not have permission to change this setting.' });
      return;
    }

    setIsUpdating(true);
    try {
      const res = await fetch(`/api/admin/school-settings/${schoolId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ otpEnabled: checked }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Failed to update OTP setting');
      }

      const data = await res.json();
      setSettings(data);
      toast.success('Success', { description: 'OTP setting updated successfully.' });
    } catch (err: any) {
      setError(err.message);
      toast.error('Error', { description: err.message });
    } finally {
      setIsUpdating(false);
    }
  };

  if (sessionStatus === 'loading' || loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
        <p className="ml-2">Loading settings...</p>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Access Denied</CardTitle>
          </CardHeader>
          <CardContent>
            <p>You do not have the necessary permissions to view this page.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Error</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-red-500">{error}</p>
            <Button className="mt-4" onClick={() => window.location.reload()}>
              Retry
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!settings) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Not Found</CardTitle>
          </CardHeader>
          <CardContent>
            <p>School settings for ID "{schoolId}" not found.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 p-4 md:p-6">
      <Card>
        <CardHeader>
          <CardTitle>School Settings for {schoolId}</CardTitle>
          <CardDescription>Manage general settings for this school.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between space-x-2">
            <Label htmlFor="otp-toggle" className="flex flex-col space-y-1">
              <span>Enable OTP for Registration</span>
              <span className="font-normal leading-snug text-muted-foreground">
                When enabled, new users registering for this school will be required to verify their email with a One-Time Password.
              </span>
            </Label>
            <Switch
              id="otp-toggle"
              checked={settings.otpEnabled}
              onCheckedChange={handleOtpToggle}
              disabled={isUpdating}
              aria-readonly={isUpdating}
            />
          </div>
          {isUpdating && (
            <div className="mt-4 flex items-center text-sm text-muted-foreground">
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Updating setting...
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
