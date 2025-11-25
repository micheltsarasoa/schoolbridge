'use client'

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { GalleryVerticalEnd } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Link from 'next/link';
import { showToast } from '@/lib/toast-utils';
import { UserRole } from '@/generated/prisma';

export default function OnboardingPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [role, setRole] = useState<UserRole | null>(null);
  const [formData, setFormData] = useState<any>({});

  useEffect(() => {
    // Fetch current user to get role
    const fetchUserRole = async () => {
      try {
        const res = await fetch('/api/auth/session');
        const session = await res.json();
        
        if (!session?.user) {
          router.push('/login');
          return;
        }
        
        setRole(session.user.role);
        
        // Check if profile is already complete
        const settingsRes = await fetch('/api/settings');
        if (settingsRes.ok) {
          const settings = await settingsRes.json();
          if (settings.profileComplete) {
            showToast.info('Profile Already Complete', 'Redirecting to your dashboard...');
            router.push(getRoleRedirect(session.user.role));
          }
        }
      } catch (error) {
        console.error('Error fetching user role:', error);
        router.push('/login');
      }
    };

    fetchUserRole();
  }, [router]);

  const getRoleRedirect = (userRole: UserRole) => {
    // Dashboard will handle role-based routing
    return '/dashboard';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Validate based on role
      if (role === 'STUDENT') {
        if (!formData.gradeLevel || !formData.dateOfBirth || !formData.parentContact) {
          showToast.warning('Required Fields', 'Please fill in all required fields.');
          setLoading(false);
          return;
        }
      } else if (role === 'TEACHER') {
        if (!formData.subjects || !formData.qualifications || !formData.bio) {
          showToast.warning('Required Fields', 'Please fill in all required fields.');
          setLoading(false);
          return;
        }
      } else if (role === 'PARENT') {
        if (!formData.preferredMethod) {
          showToast.warning('Required Fields', 'Please fill in all required fields.');
          setLoading(false);
          return;
        }
      } else if (role === 'ADMIN' || role === 'EDUCATIONAL_MANAGER') {
        if (!formData.department || !formData.adminLevel) {
          showToast.warning('Required Fields', 'Please fill in all required fields.');
          setLoading(false);
          return;
        }
      }

      // Build profile data based on role
      let profileData: any = { profileComplete: true };

      if (role === 'STUDENT') {
        profileData = {
          gradeLevel: formData.gradeLevel,
          dateOfBirth: formData.dateOfBirth,
          parentContact: formData.parentContact,
          interests: formData.interests || '',
          profileComplete: true,
        };
      } else if (role === 'TEACHER') {
        profileData = {
          subjects: formData.subjects ? formData.subjects.split(',').map((s: string) => s.trim()) : [],
          qualifications: formData.qualifications,
          bio: formData.bio,
          profileComplete: true,
        };
      } else if (role === 'PARENT') {
        profileData = {
          linkedChildren: [],
          contactPreferences: {
            preferredMethod: formData.preferredMethod,
            preferredTime: formData.preferredTime || '',
          },
          profileComplete: true,
        };
      } else if (role === 'ADMIN' || role === 'EDUCATIONAL_MANAGER') {
        profileData = {
          department: formData.department,
          adminLevel: formData.adminLevel,
          profileComplete: true,
        };
      }

      // Save to settings
      const res = await fetch('/api/settings', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(profileData),
      });

      if (!res.ok) {
        throw new Error('Failed to save profile');
      }

      showToast.success('Profile Complete!', 'Your profile has been set up successfully.');
      
      // Redirect to role-based dashboard
      setTimeout(() => {
        router.push(getRoleRedirect(role!));
      }, 1000);
    } catch (error) {
      showToast.error('Error', 'Failed to save profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field: string, value: any) => {
    setFormData((prev: any) => ({ ...prev, [field]: value }));
  };

  if (!role) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      <div className="bg-muted relative hidden lg:block">
        <img
          src="https://images.unsplash.com/photo-1519681393784-d120267933ba?q=80&w=2070&auto=format&fit=crop"
          alt="SchoolBridge Onboarding"
          className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
        />
      </div>

      <div className="flex flex-col gap-4 p-6 md:p-10">
        <div className="flex justify-center gap-2 md:justify-start">
          <Link href="/" className="flex items-center gap-2 font-medium">
            <div className="bg-primary text-primary-foreground flex size-8 items-center justify-center rounded-md">
              <GalleryVerticalEnd className="size-5" />
            </div>
            <span className="text-xl font-semibold">SchoolBridge</span>
          </Link>
        </div>
        
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-md">
            <Card className="overflow-hidden">
              <CardContent className="p-6 md:p-8">
                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                  <div className="flex flex-col items-center gap-2 text-center mb-2">
                    <h1 className="text-2xl font-bold">Complete Your Profile</h1>
                    <p className="text-muted-foreground text-sm">
                      Please provide the following information to complete your setup
                    </p>
                  </div>

                  {/* STUDENT FIELDS */}
                  {role === 'STUDENT' && (
                    <>
                      <div className="grid gap-2">
                        <Label htmlFor="gradeLevel">Grade Level *</Label>
                        <Select onValueChange={(value) => handleChange('gradeLevel', value)} required>
                          <SelectTrigger id="gradeLevel">
                            <SelectValue placeholder="Select your grade" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="grade-1">Grade 1</SelectItem>
                            <SelectItem value="grade-2">Grade 2</SelectItem>
                            <SelectItem value="grade-3">Grade 3</SelectItem>
                            <SelectItem value="grade-4">Grade 4</SelectItem>
                            <SelectItem value="grade-5">Grade 5</SelectItem>
                            <SelectItem value="grade-6">Grade 6</SelectItem>
                            <SelectItem value="grade-7">Grade 7</SelectItem>
                            <SelectItem value="grade-8">Grade 8</SelectItem>
                            <SelectItem value="grade-9">Grade 9</SelectItem>
                            <SelectItem value="grade-10">Grade 10</SelectItem>
                            <SelectItem value="grade-11">Grade 11</SelectItem>
                            <SelectItem value="grade-12">Grade 12</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="grid gap-2">
                        <Label htmlFor="dateOfBirth">Date of Birth *</Label>
                        <Input
                          id="dateOfBirth"
                          type="date"
                          value={formData.dateOfBirth || ''}
                          onChange={(e) => handleChange('dateOfBirth', e.target.value)}
                          required
                        />
                      </div>

                      <div className="grid gap-2">
                        <Label htmlFor="parentContact">Parent Contact (Email or Phone) *</Label>
                        <Input
                          id="parentContact"
                          type="text"
                          placeholder="parent@example.com or +261 XX XXX XXXX"
                          value={formData.parentContact || ''}
                          onChange={(e) => handleChange('parentContact', e.target.value)}
                          required
                        />
                      </div>

                      <div className="grid gap-2">
                        <Label htmlFor="interests">Interests (Optional)</Label>
                        <Input
                          id="interests"
                          type="text"
                          placeholder="e.g., Math, Science, Art"
                          value={formData.interests || ''}
                          onChange={(e) => handleChange('interests', e.target.value)}
                        />
                      </div>
                    </>
                  )}

                  {/* TEACHER FIELDS */}
                  {role === 'TEACHER' && (
                    <>
                      <div className="grid gap-2">
                        <Label htmlFor="subjects">Subjects Taught (comma-separated) *</Label>
                        <Input
                          id="subjects"
                          type="text"
                          placeholder="e.g., Mathematics, Physics, Chemistry"
                          value={formData.subjects || ''}
                          onChange={(e) => handleChange('subjects', e.target.value)}
                          required
                        />
                      </div>

                      <div className="grid gap-2">
                        <Label htmlFor="qualifications">Qualifications *</Label>
                        <Input
                          id="qualifications"
                          type="text"
                          placeholder="e.g., Bachelor of Education"
                          value={formData.qualifications || ''}
                          onChange={(e) => handleChange('qualifications', e.target.value)}
                          required
                        />
                      </div>

                      <div className="grid gap-2">
                        <Label htmlFor="bio">Bio *</Label>
                        <Textarea
                          id="bio"
                          placeholder="Tell us about yourself and your teaching experience"
                          value={formData.bio || ''}
                          onChange={(e) => handleChange('bio', e.target.value)}
                          required
                          rows={4}
                        />
                      </div>
                    </>
                  )}

                  {/* PARENT FIELDS */}
                  {role === 'PARENT' && (
                    <>
                      <div className="grid gap-2">
                        <Label htmlFor="preferredMethod">Preferred Contact Method *</Label>
                        <Select onValueChange={(value) => handleChange('preferredMethod', value)} required>
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

                      <div className="grid gap-2">
                        <Label htmlFor="preferredTime">Preferred Contact Time (Optional)</Label>
                        <Input
                          id="preferredTime"
                          type="text"
                          placeholder="e.g., Mornings, Afternoons, Evenings"
                          value={formData.preferredTime || ''}
                          onChange={(e) => handleChange('preferredTime', e.target.value)}
                        />
                      </div>

                      <p className="text-sm text-muted-foreground">
                        Note: You can link your children in the settings later.
                      </p>
                    </>
                  )}

                  {/* ADMIN FIELDS */}
                  {(role === 'ADMIN' || role === 'EDUCATIONAL_MANAGER') && (
                    <>
                      <div className="grid gap-2">
                        <Label htmlFor="department">Department *</Label>
                        <Input
                          id="department"
                          type="text"
                          placeholder="e.g., Academic Affairs, IT, Administration"
                          value={formData.department || ''}
                          onChange={(e) => handleChange('department', e.target.value)}
                          required
                        />
                      </div>

                      <div className="grid gap-2">
                        <Label htmlFor="adminLevel">Admin Level *</Label>
                        <Select onValueChange={(value) => handleChange('adminLevel', value)} required>
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
                    </>
                  )}

                  <Button type="submit" disabled={loading} className="w-full mt-2" data-testid="submit-profile-button">
                    {loading ? 'Saving...' : 'Complete Setup'}
                  </Button>
                </form>
              </CardContent>
            </Card>
            
            <div className="mt-4 text-balance text-center text-xs text-muted-foreground">
              You can update these details later from your settings page.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
