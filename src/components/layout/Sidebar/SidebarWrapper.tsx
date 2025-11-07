import { StudentSidebar } from './StudentSidebar';
import { $Enums } from '@/generated/prisma';
import { TeacherSidebar } from './TeacherSidebar';
import { AdminSidebar } from './AdminSidebar';
import { ParentSidebar } from './ParentSidebar';

export default function SidebarWrapper({ userRole }: { userRole: $Enums.UserRole }) {
  switch (userRole) {
    case $Enums.UserRole.STUDENT:
      return <StudentSidebar />;
    case $Enums.UserRole.TEACHER:
      return <TeacherSidebar />;
    case $Enums.UserRole.ADMIN:
      return <AdminSidebar />;
    case $Enums.UserRole.PARENT:
      return <ParentSidebar />;
    default:
      return null;
  }
}