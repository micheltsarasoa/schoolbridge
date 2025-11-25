'use client'

import { Alert, AlertDescription } from '@/components/ui/alert';
import { Clock, CheckCircle, XCircle } from 'lucide-react';

interface TeacherApprovalBannerProps {
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  reason?: string;
}

export default function TeacherApprovalBanner({ status, reason }: TeacherApprovalBannerProps) {
  if (status === 'APPROVED') {
    return null; // Don't show banner if approved
  }

  if (status === 'REJECTED') {
    return (
      <Alert className="mb-4 border-red-500 bg-red-50 dark:bg-red-950" data-testid="teacher-rejected-banner">
        <XCircle className="h-4 w-4 text-red-600 dark:text-red-400" />
        <AlertDescription>
          <div className="flex flex-col gap-1">
            <p className="font-medium text-red-800 dark:text-red-200">
              Application Rejected
            </p>
            <p className="text-sm text-red-700 dark:text-red-300">
              {reason || 'Your teacher application has been rejected by the school admin. Please contact your school for more information.'}
            </p>
          </div>
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <Alert className="mb-4 border-blue-500 bg-blue-50 dark:bg-blue-950" data-testid="teacher-pending-banner">
      <Clock className="h-4 w-4 text-blue-600 dark:text-blue-400" />
      <AlertDescription>
        <div className="flex flex-col gap-1">
          <p className="font-medium text-blue-800 dark:text-blue-200">
            Pending Approval
          </p>
          <p className="text-sm text-blue-700 dark:text-blue-300">
            Your teacher account is pending approval from the school administration. You will be notified once your account is approved.
          </p>
        </div>
      </AlertDescription>
    </Alert>
  );
}
