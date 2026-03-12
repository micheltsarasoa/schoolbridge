'use client';

import React, { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { Sidebar, SidebarContent, SidebarMenuItem } from '@/components/ui/sidebar';
import { Home, BookOpen, Cog } from 'lucide-react';
import Link from 'next/link';
import { useIsMobile } from '@/hooks/use-mobile';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from '@/components/ui/sheet';
import { UserRole } from '@/generated/prisma';

// Define a type for a single sidebar item
interface SidebarItemConfig {
  id: string;
  type: 'link' | 'divider' | 'group';
  label?: string;
  icon?: string;
  href?: string;
  roles: string[];
  children?: Omit<SidebarItemConfig, 'children' | 'roles'>[];
}

// Define the structure of the sidebar configuration
interface SidebarConfig {
  items: SidebarItemConfig[];
}

const iconMap: { [key: string]: React.ElementType } = {
  Home,
  BookOpen,
  Cog,
};

const DynamicSidebar = ({ userRole }: { userRole: UserRole }) => {
  const { data: session } = useSession();
  const [config, setConfig] = useState<SidebarConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const isMobile = useIsMobile();
  const [openMobile, setOpenMobile] = useState(false);

  useEffect(() => {
    const fetchConfig = async () => {
      if (session?.user?.schoolId) {
        try {
          const res = await fetch(`/api/admin/schools/${session.user.schoolId}/sidebar`);
          if (!res.ok) {
            throw new Error('Failed to fetch sidebar configuration');
          }
          const data = await res.json();
          setConfig(data);
        } catch (err) {
          setError(err instanceof Error ? err.message : 'An unknown error occurred');
        } finally {
          setLoading(false);
        }
      }
    };

    fetchConfig();
  }, [session]);

  if (loading) {
    return <div>Loading sidebar...</div>;
  }

  if (error) {
    return <div>Error loading sidebar: {error}</div>;
  }

  if (!config) {
    return null;
  }

  const renderSidebarItems = (items: SidebarItemConfig[]) => {
    return items.filter(item => item.roles.includes(userRole || '')).map((item, index) => {
      if (item.type === 'divider') {
        return <hr key={index} className="my-2" />;
      }

      const Icon = item.icon ? iconMap[item.icon] : null;

      if (item.type === 'group') {
        return (
          <div key={item.id}>
            <h3 className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">{item.label}</h3>
            {item.children && item.children.map(child => {
                 const ChildIcon = child.icon ? iconMap[child.icon] : null;
                 return(
              <SidebarMenuItem key={child.id}>
                {ChildIcon && <ChildIcon className="h-5 w-5" />}
                <Link href={child.href || '#'}>{child.label}</Link>
              </SidebarMenuItem>
            )})}
          </div>
        );
      }
      
      return (
        <SidebarMenuItem key={item.id}>
          {Icon && <Icon className="h-5 w-5" />}
          <Link href={item.href || '#'}>{item.label}</Link>
        </SidebarMenuItem>
      );
    });
  };

  if (isMobile) {
    return (
      <Sheet open={openMobile} onOpenChange={setOpenMobile}>
        <SheetContent side="left" className="w-72 bg-gray-800 text-white p-0">
          <SheetHeader>
            <SheetTitle className="sr-only">Sidebar</SheetTitle>
            <SheetDescription className="sr-only">Mobile sidebar</SheetDescription>
          </SheetHeader>
          <div className="flex h-full w-full flex-col">
            {renderSidebarItems(config.items)}
          </div>
        </SheetContent>
      </Sheet>
    );
  }

  return (
    <Sidebar>
      <SidebarContent>
        {renderSidebarItems(config.items)}
      </SidebarContent>
    </Sidebar>
  );
};

export default DynamicSidebar;