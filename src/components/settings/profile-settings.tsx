'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { UserRole } from '@/generated/prisma';

interface ProfileSettingsProps {
  role: UserRole;
  settings: any;
  updateSettings: (updates: any) => void;
  isSaving: boolean;
}

export function StudentProfileSettings({ settings, updateSettings, isSaving }: Omit<ProfileSettingsProps, 'role'>) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Student Profile</CardTitle>
        <CardDescription>Update your student profile details</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="gradeLevel">Grade Level *</Label>
          <Select
            value={settings.gradeLevel || ''}
            onValueChange={(value) =>
              updateSettings({ ...settings, gradeLevel: value, profileComplete: true })
            }
            disabled={isSaving}
          >
            <SelectTrigger id="gradeLevel">
              <SelectValue placeholder="Select your grade" />
            </SelectTrigger>
            <SelectContent>
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((grade) => (
                <SelectItem key={grade} value={`grade-${grade}`}>
                  Grade {grade}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="dateOfBirth">Date of Birth *</Label>
          <Input
            id="dateOfBirth"
            type="date"
            value={settings.dateOfBirth || ''}
            onChange={(e) =>
              updateSettings({ ...settings, dateOfBirth: e.target.value, profileComplete: true })
            }
            disabled={isSaving}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="parentContact">Parent Contact *</Label>
          <Input
            id="parentContact"
            type="text"
            value={settings.parentContact || ''}
            onChange={(e) =>
              updateSettings({ ...settings, parentContact: e.target.value, profileComplete: true })
            }
            disabled={isSaving}
            placeholder="parent@example.com or +261 XX XXX XXXX"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="interests">Interests (Optional)</Label>
          <Input
            id="interests"
            type="text"
            value={settings.interests || ''}
            onChange={(e) =>
              updateSettings({ ...settings, interests: e.target.value })
            }
            disabled={isSaving}
            placeholder="e.g., Math, Science, Art"
          />
        </div>
      </CardContent>
    </Card>
  );
}

export function TeacherProfileSettings({ settings, updateSettings, isSaving }: Omit<ProfileSettingsProps, 'role'>) {
  const subjectsString = Array.isArray(settings.subjects) ? settings.subjects.join(', ') : '';

  return (
    <Card>
      <CardHeader>
        <CardTitle>Teacher Profile</CardTitle>
        <CardDescription>Update your teaching profile details</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="subjects">Subjects Taught (comma-separated) *</Label>
          <Input
            id="subjects"
            type="text"
            value={subjectsString}
            onChange={(e) => {
              const subjects = e.target.value.split(',').map((s) => s.trim()).filter(Boolean);
              updateSettings({ ...settings, subjects, profileComplete: true });
            }}
            disabled={isSaving}
            placeholder="e.g., Mathematics, Physics, Chemistry"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="qualifications">Qualifications *</Label>
          <Input
            id="qualifications"
            type="text"
            value={settings.qualifications || ''}
            onChange={(e) =>
              updateSettings({ ...settings, qualifications: e.target.value, profileComplete: true })
            }
            disabled={isSaving}
            placeholder="e.g., Bachelor of Education"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="bio">Bio *</Label>
          <Textarea
            id="bio"
            value={settings.bio || ''}
            onChange={(e) =>
              updateSettings({ ...settings, bio: e.target.value, profileComplete: true })
            }
            disabled={isSaving}
            placeholder="Tell us about yourself and your teaching experience"
            rows={4}
          />
        </div>
      </CardContent>
    </Card>
  );
}

export function ParentProfileSettings({ settings, updateSettings, isSaving }: Omit<ProfileSettingsProps, 'role'>) {
  const contactPreferences = settings.contactPreferences || {};

  return (
    <Card>
      <CardHeader>
        <CardTitle>Parent Profile</CardTitle>
        <CardDescription>Update your parent profile details</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="preferredMethod">Preferred Contact Method *</Label>
          <Select
            value={contactPreferences.preferredMethod || 'email'}
            onValueChange={(value) =>
              updateSettings({
                ...settings,
                contactPreferences: { ...contactPreferences, preferredMethod: value },
                profileComplete: true,
              })
            }
            disabled={isSaving}
          >
            <SelectTrigger id="preferredMethod">
              <SelectValue placeholder="Select contact method" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="email">Email</SelectItem>
              <SelectItem value="phone">Phone</SelectItem>
              <SelectItem value="both">Both</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="preferredTime">Preferred Contact Time (Optional)</Label>
          <Input
            id="preferredTime"
            type="text"
            value={contactPreferences.preferredTime || ''}
            onChange={(e) =>
              updateSettings({
                ...settings,
                contactPreferences: { ...contactPreferences, preferredTime: e.target.value },
              })
            }
            disabled={isSaving}
            placeholder="e.g., Mornings, Afternoons, Evenings"
          />
        </div>

        <p className="text-sm text-muted-foreground">
          Note: You can link your children from the "My Children" section in your dashboard.
        </p>
      </CardContent>
    </Card>
  );
}

export function AdminProfileSettings({ settings, updateSettings, isSaving }: Omit<ProfileSettingsProps, 'role'>) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Admin Profile</CardTitle>
        <CardDescription>Update your administrative profile details</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="department">Department *</Label>
          <Input
            id="department"
            type="text"
            value={settings.department || ''}
            onChange={(e) =>
              updateSettings({ ...settings, department: e.target.value, profileComplete: true })
            }
            disabled={isSaving}
            placeholder="e.g., Academic Affairs, IT, Administration"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="adminLevel">Admin Level *</Label>
          <Select
            value={settings.adminLevel || 'school'}
            onValueChange={(value) =>
              updateSettings({ ...settings, adminLevel: value, profileComplete: true })
            }
            disabled={isSaving}
          >
            <SelectTrigger id="adminLevel">
              <SelectValue placeholder="Select admin level" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="super">Super Admin (Full Access)</SelectItem>
              <SelectItem value="school">School Admin (School-wide)</SelectItem>
              <SelectItem value="department">Department Admin (Limited)</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardContent>
    </Card>
  );
}
