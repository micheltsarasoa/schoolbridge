"use client"
import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { SheetClose, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle } from '../ui/sheet';
import { Button } from '../ui/button';
import { Loader2 } from 'lucide-react';
import { Badge } from '../ui/badge';
import { Separator } from '../ui/separator';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Form, FormControl, FormField, FormItem, FormLabel } from '../ui/form';

const userSchema = z.object({
  name: z.string(),
  email: z.string().email(),
  phone: z.string().optional(),
  role: z.string(),
  isActive: z.boolean(),
  createdAt: z.string(),
  lastLogin: z.string().optional().nullable(),
  classes: z.array(z.object({ id: z.string(), name: z.string() })).optional(),
  avatarUrl: z.string().optional(),
});

type UserFormData = z.infer<typeof userSchema>;

interface UserDetailsSheetProps {
  userId: string;
  onClose: () => void;
  onEdit?: (user: any) => void;
}

export default function UserDetailsSheet({ userId, onClose, onEdit }: UserDetailsSheetProps) {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<UserFormData>({
    resolver: zodResolver(userSchema),
  });

  const classes = form.watch('classes');

  useEffect(() => {
    const fetchUser = async () => {
      setLoading(true);
      try {
        const response = await fetch(`/api/admin/users/${userId}`);
        if (!response.ok) {
          throw new Error('Failed to load user details');
        }
        const data = await response.json();
        setUser(data);
        form.reset(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchUser();
    }
  }, [userId, form]);

  const formatDate = (date: string) => {
    if (!date) return 'N/A';
    return new Date(date).toLocaleString();
  };

  return (
    <SheetContent className="sm:max-w-lg">
      <SheetHeader className="px-6 pt-6">
        <SheetTitle className="text-2xl">User Details</SheetTitle>
        <SheetDescription>Complete information about the user account.</SheetDescription>
      </SheetHeader>

      <div className="px-6 py-4">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
          </div>
        ) : error || !user ? (
          <div className="text-center py-12">
            <p className="text-red-600 dark:text-red-400 text-lg">{error || 'User not found'}</p>
          </div>
        ) : (
          <Form {...form}>
            <div className="space-y-6">
              <div className="flex items-center space-x-4">
                <Avatar className="h-16 w-16">
                  <AvatarImage src={form.getValues('avatarUrl')} />
                  <AvatarFallback>{form.getValues('name')?.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="text-xl font-bold">{form.getValues('name')}</h3>
                  <p className="text-muted-foreground">{form.getValues('email')}</p>
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="role"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Role</FormLabel>
                      <FormControl>
                        <Badge variant="outline">{field.value}</Badge>
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="isActive"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Status</FormLabel>
                      <FormControl>
                        <Badge variant={field.value ? 'default' : 'secondary'}>
                          {field.value ? 'Active' : 'Inactive'}
                        </Badge>
                      </FormControl>
                    </FormItem>
                  )}
                />
                {form.getValues('phone') && (
                   <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Phone</FormLabel>
                        <FormControl>
                          <p className="text-sm font-medium">{field.value}</p>
                        </FormControl>
                      </FormItem>
                    )}
                  />
                )}
                <FormField
                  control={form.control}
                  name="createdAt"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Created At</FormLabel>
                      <FormControl>
                        <p className="text-sm font-medium">{formatDate(field.value)}</p>
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="lastLogin"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Last Login</FormLabel>
                      <FormControl>
                        <p className="text-sm font-medium">{formatDate(field.value as string)}</p>
                      </FormControl>
                    </FormItem>
                  )}
                />
                
                {classes && classes.length > 0 && (
                  <>
                    <Separator />
                    <FormField
                      control={form.control}
                      name="classes"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Classes</FormLabel>
                          <FormControl>
                            <p className="text-sm font-medium">
                              {field.value?.map((cls) => cls.name).join(', ')}
                            </p>
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </>
                )}
              </div>
            </div>
          </Form>
        )}
      </div>

      {user && !loading && !error && (
        <SheetFooter className="px-6 py-4 border-t">
          <div className="flex w-full justify-end gap-3">
            {onEdit && (
              <Button onClick={() => onEdit(user)} className="bg-indigo-600 hover:bg-indigo-700">
                Edit User
              </Button>
            )}
            <SheetClose asChild>
              <Button onClick={onClose} variant="outline">
                Close
              </Button>
            </SheetClose>
          </div>
        </SheetFooter>
      )}
    </SheetContent>
  );
}