'use client';

import { useState, FormEvent, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle, Loader2 } from 'lucide-react';

interface UserFormData {
  name: string;
  email: string;
  phone?: string;
  password?: string;
  role: string;
  isActive: boolean;
  schoolId?: string;
  classId?: string;
}

interface Class {
  id: string;
  name: string;
}

interface EditUserModalProps {
  user?: any;
  isCreate?: boolean;
  onClose: () => void;
  onSuccess: (user: any) => void;
  isOpen: boolean;
}

const ROLES = ['ADMIN', 'EDUCATIONAL_MANAGER', 'TEACHER', 'STUDENT', 'PARENT'];

export default function EditUserModal({ user, isCreate = false, onClose, onSuccess, isOpen }: EditUserModalProps) {
  const [formData, setFormData] = useState<UserFormData>({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    password: '',
    role: user?.role || 'STUDENT',
    isActive: user?.isActive !== undefined ? user.isActive : true,
    schoolId: user?.schoolId || '',
    classId: user?.classes?.[0]?.id || '',
  });

  const [classes, setClasses] = useState<Class[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoadingUser, setIsLoadingUser] = useState(false);

  // Fetch user data on edit mode
  useEffect(() => {
    if (!isCreate && user?.id && isOpen) {
      setIsLoadingUser(true);
      const fetchUserData = async () => {
        try {
          const response = await fetch(`/api/admin/users/${user.id}`);
          if (!response.ok) throw new Error('Failed to load user data');
          const userData = await response.json();
          setFormData({
            name: userData.name || '',
            email: userData.email || '',
            phone: userData.phone || '',
            password: '',
            role: userData.role || 'STUDENT',
            isActive: userData.isActive !== undefined ? userData.isActive : true,
            schoolId: userData.schoolId || '',
            classId: userData.classes?.[0]?.id || '',
          });
        } catch (err: any) {
          setError('Failed to load user data: ' + err.message);
        } finally {
          setIsLoadingUser(false);
        }
      };
      fetchUserData();
    }
  }, [isCreate, user?.id, isOpen]);

  // Fetch available classes for student role
  useEffect(() => {
    if (formData.role === 'STUDENT' && isOpen) {
      const fetchClasses = async () => {
        try {
          const response = await fetch('/api/admin/classes');
          if (response.ok) {
            const data = await response.json();
            setClasses(data.classes || []);
          }
        } catch (err) {
          console.error('Failed to fetch classes:', err);
        }
      };
      fetchClasses();
    }
  }, [formData.role, isOpen]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    });
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData({ ...formData, [name]: value });
  };

  const handleCheckboxChange = (checked: boolean) => {
    setFormData({ ...formData, isActive: checked });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      // Validate required fields
      if (!formData.name || !formData.email || (isCreate && !formData.password)) {
        throw new Error('Please fill in all required fields');
      }

      const url = isCreate ? '/api/admin/users' : `/api/admin/users/${user.id}`;
      const method = isCreate ? 'POST' : 'PUT';

      const payload: any = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone || null,
        role: formData.role,
        isActive: formData.isActive,
      };

      if (isCreate) {
        payload.password = formData.password;
      }

      if (formData.role === 'STUDENT' && formData.classId) {
        payload.classId = formData.classId;
      }

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `Failed to ${isCreate ? 'create' : 'update'} user`);
      }

      const result = await response.json();
      onSuccess(result.user || result);
      onClose();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">
            {isCreate ? 'Create New User' : `Edit User: ${formData.name || 'Loading...'}`}
          </DialogTitle>
          <DialogDescription>
            {isCreate
              ? 'Add a new user to the system with their details and role assignment'
              : 'Update user information, role, and class assignment'}
          </DialogDescription>
        </DialogHeader>

        {isLoadingUser && !isCreate ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6 py-4">
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {/* Two Column Layout */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Name */}
              <div className="space-y-2">
                <Label htmlFor="name" className="text-base font-semibold">
                  Name <span className="text-red-500">*</span>
                </Label>
                <Input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter full name"
                  className="h-10"
                  required
                />
              </div>

              {/* Email */}
              <div className="space-y-2">
                <Label htmlFor="email" className="text-base font-semibold">
                  Email <span className="text-red-500">*</span>
                </Label>
                <Input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="user@example.com"
                  className="h-10"
                  required
                />
              </div>

              {/* Phone */}
              <div className="space-y-2">
                <Label htmlFor="phone" className="text-base font-semibold">
                  Phone
                </Label>
                <Input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone || ''}
                  onChange={handleChange}
                  placeholder="+1 (555) 000-0000"
                  className="h-10"
                />
              </div>

              {/* Role */}
              <div className="space-y-2">
                <Label htmlFor="role" className="text-base font-semibold">
                  Role <span className="text-red-500">*</span>
                </Label>
                <Select
                  value={formData.role}
                  onValueChange={(value) => handleSelectChange('role', value)}
                >
                  <SelectTrigger className="h-10">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {ROLES.map((role) => (
                      <SelectItem key={role} value={role}>
                        {role.replace(/_/g, ' ')}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Password (for create only) */}
              {isCreate && (
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-base font-semibold">
                    Password <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    type="password"
                    id="password"
                    name="password"
                    value={formData.password || ''}
                    onChange={handleChange}
                    placeholder="Enter secure password"
                    className="h-10"
                    required
                  />
                </div>
              )}

              {/* Class (for students only) */}
              {formData.role === 'STUDENT' && (
                <div className="space-y-2">
                  <Label htmlFor="classId" className="text-base font-semibold">
                    Class <span className="text-red-500">*</span>
                  </Label>
                  <Select
                    value={formData.classId || ''}
                    onValueChange={(value) => handleSelectChange('classId', value)}
                  >
                    <SelectTrigger className="h-10">
                      <SelectValue placeholder="Select a class" />
                    </SelectTrigger>
                    <SelectContent>
                      {classes.map((cls) => (
                        <SelectItem key={cls.id} value={cls.id}>
                          {cls.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>

            {/* Active Status - Full Width */}
            <div className="flex items-center space-x-3 bg-slate-50 dark:bg-slate-800/50 p-4 rounded-lg">
              <Checkbox
                id="isActive"
                checked={formData.isActive}
                onCheckedChange={handleCheckboxChange}
              />
              <Label htmlFor="isActive" className="text-base font-semibold cursor-pointer">
                User is Active
              </Label>
              <span className="text-sm text-gray-600 dark:text-gray-400 ml-auto">
                {formData.isActive ? '✓ Active' : '✗ Inactive'}
              </span>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end gap-3 pt-4 border-t">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                disabled={isSubmitting}
                className="h-10 px-6"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="h-10 px-6 bg-indigo-600 hover:bg-indigo-700"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {isCreate ? 'Creating...' : 'Saving...'}
                  </>
                ) : isCreate ? (
                  'Create User'
                ) : (
                  'Save Changes'
                )}
              </Button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
