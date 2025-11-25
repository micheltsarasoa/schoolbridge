'use client'

import { useEffect, useState } from 'react';
import TeacherApprovalBanner from './teacher-approval-banner';

export default function TeacherApprovalStatus() {
  const [approvalStatus, setApprovalStatus] = useState<{
    status: 'PENDING' | 'APPROVED' | 'REJECTED';
    reason?: string;
  } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchApprovalStatus = async () => {
      try {
        const res = await fetch('/api/teacher/approval-status');
        if (res.ok) {
          const data = await res.json();
          setApprovalStatus(data);
        }
      } catch (error) {
        console.error('Failed to fetch approval status:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchApprovalStatus();
  }, []);

  if (loading || !approvalStatus || approvalStatus.status === 'APPROVED') {
    return null;
  }

  return <TeacherApprovalBanner status={approvalStatus.status} reason={approvalStatus.reason} />;
}
