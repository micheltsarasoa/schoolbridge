
'use client';

import { useState, useEffect } from 'react';
import { User } from '@/generated/prisma';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';

type UserProfile = Omit<User, 'password'>;

export default function ProfilePage() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setIsLoading(true);
        const response = await fetch('/api/profile');
        if (!response.ok) {
          throw new Error('Failed to fetch profile. You may not be logged in.');
        }
        const data = await response.json();
        setUser(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, []);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[calc(100vh-64px)]">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (error) {
    return <div className="text-red-500 text-center py-10">Error: {error}</div>;
  }

  if (!user) {
    return <div className="text-center py-10">No user profile found. Please log in.</div>;
  }

  return (
    <div className="container mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold mb-6">User Profile</h1>
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>{user.name}</CardTitle>
          <p className="text-sm text-muted-foreground">{user.role}</p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <p className="text-sm font-medium text-gray-700">Email:</p>
            <p className="text-base">{user.email || 'N/A'}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-700">Phone:</p>
            <p className="text-base">{user.phone || 'N/A'}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-700">Status:</p>
            <p className="text-base">{user.isActive ? 'Active' : 'Inactive'}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-700">Member Since:</p>
            <p className="text-base">{new Date(user.createdAt).toLocaleDateString()}</p>
          </div>
          {/* Add more profile details as needed */}
        </CardContent>
      </Card>
    </div>
  );
}
