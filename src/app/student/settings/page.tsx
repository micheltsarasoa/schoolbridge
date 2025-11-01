'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { toast } from 'sonner';
import { UserSettings } from '@/types/settings';

export default function StudentSettingsPage() {
  const [settings, setSettings] = useState<UserSettings | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch settings on mount
  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/settings');
      if (!response.ok) throw new Error('Failed to fetch settings');
      const data = await response.json();
      setSettings(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load settings');
      toast.error('Failed to load settings');
    } finally {
      setIsLoading(false);
    }
  };

  const updateSettings = async (updates: Partial<UserSettings>) => {
    setIsSaving(true);
    try {
      const response = await fetch('/api/settings', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });

      if (!response.ok) throw new Error('Failed to save settings');

      const { settings: updatedSettings } = await response.json();
      setSettings(updatedSettings);
      toast.success('Settings saved successfully');
    } catch (err) {
      toast.error('Failed to save settings');
    } finally {
      setIsSaving(false);
    }
  };

  const resetSettings = async () => {
    if (!confirm('Are you sure you want to reset all settings to defaults?')) return;

    try {
      const response = await fetch('/api/settings', { method: 'DELETE' });
      if (!response.ok) throw new Error('Failed to reset settings');

      await fetchSettings();
      toast.success('Settings reset to defaults');
    } catch (err) {
      toast.error('Failed to reset settings');
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-muted-foreground">Loading settings...</p>
      </div>
    );
  }

  if (error || !settings) {
    return (
      <div className="space-y-4">
        <Alert variant="destructive">
          <AlertDescription>{error || 'Failed to load settings'}</AlertDescription>
        </Alert>
        <Button onClick={fetchSettings}>Retry</Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Settings</h1>
          <p className="text-muted-foreground">Manage your account preferences</p>
        </div>
        <Button variant="outline" onClick={resetSettings}>
          Reset to Defaults
        </Button>
      </div>

      <Tabs defaultValue="notifications" className="space-y-4">
        <TabsList>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="display">Display</TabsTrigger>
          <TabsTrigger value="privacy">Privacy</TabsTrigger>
          <TabsTrigger value="accessibility">Accessibility</TabsTrigger>
        </TabsList>

        {/* Notifications Tab */}
        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle>Notification Preferences</CardTitle>
              <CardDescription>
                Choose which notifications you want to receive
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <Label htmlFor="email-notif">Email Notifications</Label>
                  <p className="text-sm text-muted-foreground">
                    Receive notifications via email
                  </p>
                </div>
                <Switch
                  id="email-notif"
                  checked={settings.notifications?.email ?? true}
                  onCheckedChange={(checked) =>
                    updateSettings({ notifications: { ...settings.notifications, email: checked } })
                  }
                  disabled={isSaving}
                />
              </div>

              <div className="flex items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <Label htmlFor="push-notif">Push Notifications</Label>
                  <p className="text-sm text-muted-foreground">
                    Receive push notifications in the app
                  </p>
                </div>
                <Switch
                  id="push-notif"
                  checked={settings.notifications?.push ?? true}
                  onCheckedChange={(checked) =>
                    updateSettings({ notifications: { ...settings.notifications, push: checked } })
                  }
                  disabled={isSaving}
                />
              </div>

              <div className="flex items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <Label htmlFor="grade-notif">Grade Posted</Label>
                  <p className="text-sm text-muted-foreground">
                    Get notified when grades are posted
                  </p>
                </div>
                <Switch
                  id="grade-notif"
                  checked={settings.notifications?.gradePosted ?? true}
                  onCheckedChange={(checked) =>
                    updateSettings({
                      notifications: { ...settings.notifications, gradePosted: checked },
                    })
                  }
                  disabled={isSaving}
                />
              </div>

              <div className="flex items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <Label htmlFor="assignment-notif">Assignment Due</Label>
                  <p className="text-sm text-muted-foreground">
                    Reminders for upcoming assignment deadlines
                  </p>
                </div>
                <Switch
                  id="assignment-notif"
                  checked={settings.notifications?.assignmentDue ?? true}
                  onCheckedChange={(checked) =>
                    updateSettings({
                      notifications: { ...settings.notifications, assignmentDue: checked },
                    })
                  }
                  disabled={isSaving}
                />
              </div>

              <div className="flex items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <Label htmlFor="course-notif">Course Assigned</Label>
                  <p className="text-sm text-muted-foreground">
                    Get notified when new courses are assigned
                  </p>
                </div>
                <Switch
                  id="course-notif"
                  checked={settings.notifications?.courseAssigned ?? true}
                  onCheckedChange={(checked) =>
                    updateSettings({
                      notifications: { ...settings.notifications, courseAssigned: checked },
                    })
                  }
                  disabled={isSaving}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Display Tab */}
        <TabsContent value="display">
          <Card>
            <CardHeader>
              <CardTitle>Display Settings</CardTitle>
              <CardDescription>
                Customize how the app looks and feels
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="theme">Theme</Label>
                <Select
                  value={settings.display?.theme ?? 'system'}
                  onValueChange={(value: 'light' | 'dark' | 'system') =>
                    updateSettings({ display: { ...settings.display, theme: value } })
                  }
                  disabled={isSaving}
                >
                  <SelectTrigger id="theme">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="light">Light</SelectItem>
                    <SelectItem value="dark">Dark</SelectItem>
                    <SelectItem value="system">System</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-sm text-muted-foreground">
                  Choose your preferred color theme
                </p>
              </div>

              <div className="flex items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <Label htmlFor="compact-mode">Compact Mode</Label>
                  <p className="text-sm text-muted-foreground">
                    Reduce spacing for more content density
                  </p>
                </div>
                <Switch
                  id="compact-mode"
                  checked={settings.display?.compactMode ?? false}
                  onCheckedChange={(checked) =>
                    updateSettings({ display: { ...settings.display, compactMode: checked } })
                  }
                  disabled={isSaving}
                />
              </div>

              <div className="flex items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <Label htmlFor="show-avatars">Show Avatars</Label>
                  <p className="text-sm text-muted-foreground">
                    Display user profile pictures
                  </p>
                </div>
                <Switch
                  id="show-avatars"
                  checked={settings.display?.showAvatars ?? true}
                  onCheckedChange={(checked) =>
                    updateSettings({ display: { ...settings.display, showAvatars: checked } })
                  }
                  disabled={isSaving}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="language">Language</Label>
                <Select
                  value={settings.language ?? 'FR'}
                  onValueChange={(value: 'FR' | 'EN' | 'MG' | 'ES') =>
                    updateSettings({ language: value })
                  }
                  disabled={isSaving}
                >
                  <SelectTrigger id="language">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="FR">Français</SelectItem>
                    <SelectItem value="EN">English</SelectItem>
                    <SelectItem value="MG">Malagasy</SelectItem>
                    <SelectItem value="ES">Español</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-sm text-muted-foreground">
                  Choose your preferred interface language
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Privacy Tab */}
        <TabsContent value="privacy">
          <Card>
            <CardHeader>
              <CardTitle>Privacy Settings</CardTitle>
              <CardDescription>
                Control your privacy and visibility
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <Label htmlFor="show-email">Show Email</Label>
                  <p className="text-sm text-muted-foreground">
                    Make your email visible to teachers
                  </p>
                </div>
                <Switch
                  id="show-email"
                  checked={settings.privacy?.showEmail ?? true}
                  onCheckedChange={(checked) =>
                    updateSettings({ privacy: { ...settings.privacy, showEmail: checked } })
                  }
                  disabled={isSaving}
                />
              </div>

              <div className="flex items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <Label htmlFor="show-phone">Show Phone</Label>
                  <p className="text-sm text-muted-foreground">
                    Make your phone number visible to teachers
                  </p>
                </div>
                <Switch
                  id="show-phone"
                  checked={settings.privacy?.showPhone ?? false}
                  onCheckedChange={(checked) =>
                    updateSettings({ privacy: { ...settings.privacy, showPhone: checked } })
                  }
                  disabled={isSaving}
                />
              </div>

              <div className="flex items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <Label htmlFor="teacher-messages">Allow Teacher Messages</Label>
                  <p className="text-sm text-muted-foreground">
                    Teachers can send you direct messages
                  </p>
                </div>
                <Switch
                  id="teacher-messages"
                  checked={settings.privacy?.allowTeacherMessages ?? true}
                  onCheckedChange={(checked) =>
                    updateSettings({
                      privacy: { ...settings.privacy, allowTeacherMessages: checked },
                    })
                  }
                  disabled={isSaving}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Accessibility Tab */}
        <TabsContent value="accessibility">
          <Card>
            <CardHeader>
              <CardTitle>Accessibility Settings</CardTitle>
              <CardDescription>
                Adjust the app for better accessibility
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="font-size">Font Size</Label>
                <Select
                  value={settings.accessibility?.fontSize ?? 'medium'}
                  onValueChange={(
                    value: 'small' | 'medium' | 'large' | 'extra-large'
                  ) =>
                    updateSettings({ accessibility: { ...settings.accessibility, fontSize: value } })
                  }
                  disabled={isSaving}
                >
                  <SelectTrigger id="font-size">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="small">Small</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="large">Large</SelectItem>
                    <SelectItem value="extra-large">Extra Large</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-sm text-muted-foreground">
                  Adjust text size for better readability
                </p>
              </div>

              <div className="flex items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <Label htmlFor="high-contrast">High Contrast</Label>
                  <p className="text-sm text-muted-foreground">
                    Increase contrast for better visibility
                  </p>
                </div>
                <Switch
                  id="high-contrast"
                  checked={settings.accessibility?.highContrast ?? false}
                  onCheckedChange={(checked) =>
                    updateSettings({
                      accessibility: { ...settings.accessibility, highContrast: checked },
                    })
                  }
                  disabled={isSaving}
                />
              </div>

              <div className="flex items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <Label htmlFor="reduce-motion">Reduce Motion</Label>
                  <p className="text-sm text-muted-foreground">
                    Minimize animations and transitions
                  </p>
                </div>
                <Switch
                  id="reduce-motion"
                  checked={settings.accessibility?.reduceMotion ?? false}
                  onCheckedChange={(checked) =>
                    updateSettings({
                      accessibility: { ...settings.accessibility, reduceMotion: checked },
                    })
                  }
                  disabled={isSaving}
                />
              </div>

              <div className="flex items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <Label htmlFor="screen-reader">Screen Reader Optimized</Label>
                  <p className="text-sm text-muted-foreground">
                    Optimize for screen reader users
                  </p>
                </div>
                <Switch
                  id="screen-reader"
                  checked={settings.accessibility?.screenReaderOptimized ?? false}
                  onCheckedChange={(checked) =>
                    updateSettings({
                      accessibility: { ...settings.accessibility, screenReaderOptimized: checked },
                    })
                  }
                  disabled={isSaving}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
