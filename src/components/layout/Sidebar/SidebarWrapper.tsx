import { UserRole } from '@/generated/prisma';
import DynamicSidebar from './DynamicSidebar';


export default function SidebarWrapper({ userRole }: { userRole: UserRole | undefined }) {
  if (!userRole) {
    return <div>Loading sidebar...</div>;
  }
  return <DynamicSidebar userRole={userRole} />;
}