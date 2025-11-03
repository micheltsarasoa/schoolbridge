'use client';

import { useSearchParams } from 'next/navigation';
import { UserTable } from "@/components/admin/UserTable";

export default function UsersPage() {
  const searchParams = useSearchParams();
  const roleFilter = searchParams.get('role');

  const roleLabels: Record<string, string> = {
    'STUDENT': 'Students',
    'PARENT': 'Parents',
    'TEACHER': 'Teachers',
    'ADMIN': 'Admins',
    'EDUCATIONAL_MANAGER': 'Educational Managers',
  };

  const pageTitle = roleFilter ? roleLabels[roleFilter] || 'Users' : 'All Users';

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-4">{pageTitle}</h1>
      <UserTable roleFilter={roleFilter || undefined} />
    </div>
  );
}