'use client';

import { useState, useEffect } from 'react';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';

interface UserDetailsDialogProps {
  userId: string;
  onClose: () => void;
  onEdit?: (user: any) => void;
}

export default function UserDetailsDialog({ userId, onClose, onEdit }: UserDetailsDialogProps) {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch(`/api/admin/users/${userId}`);
        if (!response.ok) {
          throw new Error('Failed to load user details');
        }
        const data = await response.json();
        setUser(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [userId]);

  const formatDate = (date: string) => {
    return new Date(date).toLocaleString();
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">User Details</DialogTitle>
          <DialogDescription>
            Complete information about the user account
          </DialogDescription>
        </DialogHeader>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
          </div>
        ) : error || !user ? (
          <div className="text-center py-12">
            <p className="text-red-600 dark:text-red-400 text-lg">{error || 'User not found'}</p>
          </div>
        ) : (
          <>
            {/* User Details Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 py-6">
              {/* Name */}
              <div>
                <p className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-2">Name</p>
                <p className="text-lg text-gray-900 dark:text-gray-100">{user.name}</p>
              </div>

              {/* Email */}
              <div>
                <p className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-2">Email</p>
                <p className="text-lg text-gray-900 dark:text-gray-100">{user.email}</p>
              </div>

              {/* Phone */}
              {user.phone && (
                <div>
                  <p className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-2">Phone</p>
                  <p className="text-lg text-gray-900 dark:text-gray-100">{user.phone}</p>
                </div>
              )}

              {/* Role */}
              <div>
                <p className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-2">Role</p>
                <Badge variant="outline" className="text-base px-3 py-1">
                  {user.role}
                </Badge>
              </div>

              {/* Status */}
              <div>
                <p className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-2">Status</p>
                <Badge variant={user.isActive ? 'default' : 'secondary'} className="text-base px-3 py-1">
                  {user.isActive ? '✓ Active' : '✗ Inactive'}
                </Badge>
              </div>

              {/* Created At */}
              <div>
                <p className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-2">Created At</p>
                <p className="text-sm text-gray-900 dark:text-gray-100">{formatDate(user.createdAt)}</p>
              </div>

              {/* Last Login */}
              <div>
                <p className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-2">Last Login</p>
                <p className="text-sm text-gray-900 dark:text-gray-100">
                  {user.lastLogin ? formatDate(user.lastLogin) : 'Never'}
                </p>
              </div>
            </div>

            {/* Classes (for students) */}
            {user.classes && user.classes.length > 0 && (
              <div className="border-t pt-6">
                <p className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-3">Classes</p>
                <div className="flex flex-wrap gap-2">
                  {user.classes.map((cls: any) => (
                    <Badge key={cls.id} variant="secondary" className="text-base px-3 py-1">
                      {cls.name}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex justify-end gap-3 pt-6 border-t mt-6">
              {onEdit && (
                <Button
                  onClick={() => onEdit(user)}
                  className="h-10 px-6 bg-indigo-600 hover:bg-indigo-700"
                >
                  Edit User
                </Button>
              )}
              <Button
                onClick={onClose}
                variant="outline"
                className="h-10 px-6"
              >
                Close
              </Button>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
