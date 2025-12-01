'use client'

import { useState } from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { X, AlertCircle } from 'lucide-react';
import Link from 'next/link';
import { UserRole } from '@/generated/prisma/enums';

interface ProfileCompletionBannerProps {
  userRole: UserRole;
}

export default function ProfileCompletionBanner({ userRole }: ProfileCompletionBannerProps) {
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) return null;

  const getSettingsPath = () => {
    switch (userRole) {
      case 'STUDENT':
        return '/student/settings';
      case 'TEACHER':
        return '/teacher/settings';
      case 'PARENT':
        return '/parent/settings';
      case 'ADMIN':
      case 'EDUCATIONAL_MANAGER':
        return '/admin/settings';
      default:
        return '/profile';
    }
  };

  return (
    <Alert className="mb-4 border-yellow-500 bg-yellow-50 dark:bg-yellow-950" data-testid="profile-completion-banner">
      <AlertCircle className="h-4 w-4 text-yellow-600 dark:text-yellow-400" />
      <AlertDescription className="flex items-center justify-between">
        <div className="flex-1">
          <p className="font-medium text-yellow-800 dark:text-yellow-200">
            Complete Your Profile
          </p>
          <p className="text-sm text-yellow-700 dark:text-yellow-300 mt-1">
            Please complete your profile to access all features and personalize your experience.
          </p>
        </div>
        <div className="flex items-center gap-2 ml-4">
          <Link href={getSettingsPath()}>
            <Button size="sm" variant="default" className="bg-yellow-600 hover:bg-yellow-700 text-white" data-testid="complete-profile-button">
              Complete Profile
            </Button>
          </Link>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => setDismissed(true)}
            className="text-yellow-600 hover:text-yellow-700 hover:bg-yellow-100 dark:hover:bg-yellow-900"
            data-testid="dismiss-banner-button"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </AlertDescription>
    </Alert>
  );
}
