'use client';

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
  SheetClose,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle, Loader2 } from 'lucide-react';

const ROLES = ['ADMIN', 'EDUCATIONAL_MANAGER', 'TEACHER', 'STUDENT', 'PARENT'];

const formSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters.'),
  email: z.string().email('Invalid email address.'),
  phone: z.string().optional(),
  password: z.string().min(8, 'Password must be at least 8 characters.').optional(),
  role: z.enum(ROLES as [string, ...string[]]),
  isActive: z.boolean(),
  classId: z.string().optional(),
}).refine(data => {
    // Password is required only when creating a user
    return !data.password ? false : true;
}, {
    message: "Password is required",
    path: ["password"],
});


interface Class {
  id: string;
  name: string;
}

interface UpsertUserSheetProps {
  user?: any;
  isCreate?: boolean;
  onClose: () => void;
  onSuccess: () => void;
  isOpen: boolean;
}

export function UpsertUserSheet({ user, isCreate = false, onClose, onSuccess, isOpen }: UpsertUserSheetProps) {
  const [classes, setClasses] = useState<Class[]>([]);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      password: '',
      role: 'STUDENT',
      isActive: true,
      classId: '',
    },
  });

  const { isSubmitting, isDirty } = form.formState;
  const role = form.watch('role');

  useEffect(() => {
    if (isOpen) {
      if (!isCreate && user?.id) {
        // Fetch full user data for editing
        const fetchUserData = async () => {
          try {
            const response = await fetch(`/api/admin/users/${user.id}`);
            if (!response.ok) throw new Error('Failed to load user data');
            const userData = await response.json();
            form.reset({
              ...userData,
              classId: userData.classes?.[0]?.id || '',
              password: '', // Don't show password
            });
          } catch (err: any) {
            setError('Failed to load user data: ' + err.message);
          }
        };
        fetchUserData();
      } else {
        // Reset to default for creation
        form.reset();
      }
    }
  }, [isOpen, isCreate, user?.id, form]);

  useEffect(() => {
    if (role === 'STUDENT' && isOpen) {
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
  }, [role, isOpen]);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setError(null);
    try {
      const url = isCreate ? '/api/admin/users' : `/api/admin/users/${user.id}`;
      const method = isCreate ? 'POST' : 'PUT';

      const payload: any = { ...values };
      if (!isCreate) {
        delete payload.password; // Don't send empty password on update
      }
      if (values.password === '') {
        delete payload.password;
      }

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `Failed to ${isCreate ? 'create' : 'update'} user`);
      }

      onSuccess();
      onClose();
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="sm:max-w-lg overflow-y-auto">
        <SheetHeader className="px-6 pt-6">
          <SheetTitle className="text-2xl">
            {isCreate ? 'Create New User' : 'Edit User'}
          </SheetTitle>
          <SheetDescription>
            {isCreate ? 'Add a new user to the system.' : 'Update user information.'}
          </SheetDescription>
        </SheetHeader>
        <div className="px-6 py-4">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter full name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="user@example.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {isCreate && (
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <Input type="password" placeholder="Enter secure password" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}

              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone (Optional)</FormLabel>
                    <FormControl>
                      <Input placeholder="+1 (555) 000-0000" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="role"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Role</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a role" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {ROLES.map((r) => (
                          <SelectItem key={r} value={r}>
                            {r.replace(/_/g, ' ')}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {role === 'STUDENT' && (
                <FormField
                  control={form.control}
                  name="classId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Class</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a class" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {classes.map((c) => (
                            <SelectItem key={c.id} value={c.id}>
                              {c.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}

              <FormField
                control={form.control}
                name="isActive"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                    <div className="space-y-0.5">
                      <FormLabel>User Status</FormLabel>
                      <p className="text-sm text-muted-foreground">
                        Inactive users cannot log in.
                      </p>
                    </div>
                    <FormControl>
                      <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                  </FormItem>
                )}
              />

              <SheetFooter className="pt-4">
                <SheetClose asChild>
                  <Button type="button" variant="outline" disabled={isSubmitting}>
                    Cancel
                  </Button>
                </SheetClose>
                <Button type="submit" disabled={isSubmitting || !isDirty}>
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (isCreate ? 'Create User' : 'Save Changes')}
                </Button>
              </SheetFooter>
            </form>
          </Form>
        </div>
      </SheetContent>
    </Sheet>
  );
}
