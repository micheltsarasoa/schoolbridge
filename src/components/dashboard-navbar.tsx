'use client';

import { useState, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useTheme } from 'next-themes';
import {
  Bell,
  Menu,
  PanelLeft,
  Settings,
  LogOut,
  Moon,
  Sun,
} from 'lucide-react';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { Notifications } from '@/components/notifications';
import { signOut } from 'next-auth/react';

interface DashboardNavbarProps {
  sidebarOpen: boolean;
  onSidebarToggle: (open: boolean) => void;
  onMobileMenuToggle: () => void;
  breadcrumbPathMap?: Record<string, string>;
}

interface UserInfo {
  name: string;
  email: string;
  role?: string;
}

export function DashboardNavbar({
  sidebarOpen,
  onSidebarToggle,
  onMobileMenuToggle,
  breadcrumbPathMap = {},
}: DashboardNavbarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);

  // Prevent hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  // Fetch user session info
  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const response = await fetch('/api/auth/session');
        const session = await response.json();
        if (session?.user) {
          setUserInfo({
            name: session.user.name || 'User',
            email: session.user.email || '',
            role: session.user.role || '',
          });
        }
      } catch (error) {
        console.error('Failed to fetch user info:', error);
      }
    };

    if (mounted) {
      fetchUserInfo();
    }
  }, [mounted]);

  // Default path map for common routes
  const defaultPathMap: Record<string, string> = {
    'dashboard': 'Dashboard',
    'courses': 'My Courses',
    'quizzes': 'My Quizzes',
    'todo': 'My Todo',
    'planning': 'My Planning',
    'forecast': 'My Forecast',
    'results-badges': 'Results & Badges',
    'submissions': 'Submissions',
    'settings': 'Settings',
    'attendance': 'Attendance',
    'grading': 'Grading',
    'classes': 'My Classes',
    'children': 'My Children',
    ...breadcrumbPathMap,
  };

  function generateBreadcrumbs(pathname: string) {
    const pathSegments = pathname.split('/').filter(Boolean);
    const role = pathSegments[0]; // Get the role (student, teacher, parent, etc.)
    const segments = pathSegments.slice(1); // Get segments after the role

    const roleLabels: Record<string, string> = {
      student: 'Student',
      teacher: 'Teacher',
      parent: 'Parent',
      admin: 'Admin',
    };

    const breadcrumbs = [
      {
        label: roleLabels[role] || 'Dashboard',
        href: `/${role}/dashboard`,
      },
    ];

    let currentPath = `/${role}`;
    for (const segment of segments) {
      currentPath += `/${segment}`;
      const label = defaultPathMap[segment] || segment.charAt(0).toUpperCase() + segment.slice(1);
      breadcrumbs.push({ label, href: currentPath });
    }

    return breadcrumbs;
  }

  const breadcrumbs = generateBreadcrumbs(pathname);
  const getInitials = (name: string | null) => {
    if (!name) return 'U';
    return name
      .split(' ')
      .map((n) => n.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <header className="sticky top-0 z-10 flex h-16 items-center gap-3 border-b bg-background/95 px-4 backdrop-blur">
      <Button
        variant="ghost"
        size="icon"
        className="md:hidden"
        onClick={onMobileMenuToggle}
      >
        <Menu className="h-5 w-5" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        className="hidden md:flex"
        onClick={() => onSidebarToggle(!sidebarOpen)}
      >
        <PanelLeft className="h-5 w-5" />
      </Button>

      <div className="flex flex-1 items-center justify-between gap-4">
        <div className="flex-1 min-w-0">
          <Breadcrumb>
            <BreadcrumbList>
              {breadcrumbs.map((item, index, array) => (
                <div key={`breadcrumb-${index}-${item.href}`} className="flex items-center gap-1">
                  {index > 0 && <BreadcrumbSeparator className="hidden sm:inline" />}
                  <BreadcrumbItem className="hidden sm:inline-flex">
                    {index === array.length - 1 ? (
                      <BreadcrumbPage className="text-sm font-medium">
                        {item.label}
                      </BreadcrumbPage>
                    ) : (
                      <BreadcrumbLink
                        href={item.href}
                        className="text-sm hover:text-primary"
                      >
                        {item.label}
                      </BreadcrumbLink>
                    )}
                  </BreadcrumbItem>
                  {index === array.length - 1 && (
                    <BreadcrumbPage className="text-sm font-medium sm:hidden">
                      {item.label}
                    </BreadcrumbPage>
                  )}
                </div>
              ))}
            </BreadcrumbList>
          </Breadcrumb>
        </div>

        <div className="flex items-center gap-2 ml-auto">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="rounded-lg"
                  onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                >
                  {mounted ? (
                    theme === 'dark' ? (
                      <Sun className="h-5 w-5" />
                    ) : (
                      <Moon className="h-5 w-5" />
                    )
                  ) : (
                    <Moon className="h-5 w-5" />
                  )}
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                {mounted
                  ? theme === 'dark'
                    ? 'Light mode'
                    : 'Dark mode'
                  : 'Toggle theme'}
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div>
                  <Notifications />
                </div>
              </TooltipTrigger>
              <TooltipContent>Notifications</TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="rounded-lg relative"
              >
                <Avatar className="h-8 w-8 border border-primary/20">
                  <AvatarImage
                    src="/placeholder.svg?height=32&width=32"
                    alt={userInfo?.name}
                  />
                  <AvatarFallback>
                    {getInitials(userInfo?.name || null)}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel className="flex flex-col gap-1">
                <div className="text-sm font-semibold">
                  {userInfo?.name || 'User'}
                </div>
                <div className="text-xs text-muted-foreground">
                  {userInfo?.email}
                </div>
                {userInfo?.role && (
                  <div className="text-xs text-primary/70 capitalize">
                    {userInfo.role.replace(/_/g, ' ')}
                  </div>
                )}
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => {
                  const role = pathname.split('/')[1];
                  router.push(`/${role}/settings`);
                }}
              >
                <Settings className="mr-2 h-4 w-4" />
                <span>Settings</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={async () => await signOut({ redirect: false })}
              >
                <LogOut className="mr-2 h-4 w-4" />
                <span>Sign out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
