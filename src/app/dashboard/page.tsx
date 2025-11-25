import { redirect } from 'next/navigation';
import { auth } from '@/auth';
import { UserRole } from '@/generated/prisma';

export default async function DashboardPage() {
  const session = await auth();
  
  if (!session?.user) {
    redirect('/login');
  }

  // Role-based redirect
  const roleRedirects: Record<UserRole, string> = {
    'ADMIN': '/dashboard/admin',
    'EDUCATIONAL_MANAGER': '/dashboard/admin',
    'TEACHER': '/dashboard/teacher',
    'STUDENT': '/dashboard/student',
    'PARENT': '/dashboard/parent',
  };

  const userRole = session.user.role as UserRole;
  const redirectPath = roleRedirects[userRole] || '/dashboard/student';

  redirect(redirectPath);
}
