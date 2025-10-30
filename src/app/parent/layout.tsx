'use client';

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import AuthSessionProvider from "@/components/auth/SessionProvider";
import { usePathname } from "next/navigation";
import Link from "next/link";

// Imports for Navbar functionality
import { useSession, signOut } from "next-auth/react";
import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Sidebar } from "@/components/layout/sidebar";
import { parentNavLinks } from "@/components/parent-sidebar";

export default function ParentLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { data: session } = useSession();
  const { setTheme } = useTheme();

  // Function to generate breadcrumbs based on the current path
  const generateBreadcrumbs = () => {
    const pathSegments = pathname.split('/').filter(segment => segment && segment !== 'parent');
    const breadcrumbs = [];
    let currentPath = '/parent';

    breadcrumbs.push(
      <BreadcrumbItem key="parent-home">
        <BreadcrumbLink asChild>
          <Link href="/parent/dashboard">Parent</Link>
        </BreadcrumbLink>
      </BreadcrumbItem>
    );

    pathSegments.forEach((segment, index) => {
      currentPath += `/${segment}`;
      const isLast = index === pathSegments.length - 1;
      breadcrumbs.push(
        <BreadcrumbSeparator key={`sep-${segment}`} />,
        <BreadcrumbItem key={segment}>
          {isLast ? (
            <BreadcrumbPage>{segment.charAt(0).toUpperCase() + segment.slice(1)}</BreadcrumbPage>
          ) : (
            <BreadcrumbLink asChild>
              <Link href={currentPath}>{segment.charAt(0).toUpperCase() + segment.slice(1)}</Link>
            </BreadcrumbLink>
          )}
        </BreadcrumbItem>
      );
    });
    return breadcrumbs;
  };

  return (
    <AuthSessionProvider>
      <SidebarProvider>
        <Sidebar navLinks={[{ title: "Navigation", links: parentNavLinks }]} />
        <SidebarInset className="flex flex-col h-screen">
          <header className="sticky top-0 z-10 flex h-16 shrink-0 items-center gap-2 border-b bg-background">
            <div className="flex items-center gap-2 px-4">
              <SidebarTrigger className="-ml-1" />
              <Separator
                orientation="vertical"
                className="mr-2 data-[orientation=vertical]:h-4"
              />
              <Breadcrumb>
                <BreadcrumbList>
                  {generateBreadcrumbs()}
                </BreadcrumbList>
              </Breadcrumb>
            </div>

            {/* Theme Toggle and User Profile */}
            <div className="ml-auto flex items-center space-x-4 pr-4">
              {/* Theme Toggle */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                    <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                    <span className="sr-only">Toggle theme</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => setTheme("light")}>
                    Light
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setTheme("dark")}>
                    Dark
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setTheme("system")}>
                    System
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              {/* User Profile / Login Button */}
              {session?.user ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={session.user.image || undefined} alt={session.user.name || "User"} />
                        <AvatarFallback>{session.user.name?.charAt(0) || session.user.email?.charAt(0)}</AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56" align="end" forceMount>
                    <div className="flex flex-col space-y-1 p-2">
                      <p className="text-sm font-medium leading-none">{session.user.name}</p>
                      <p className="text-xs leading-none text-muted-foreground">
                        {session.user.email}
                      </p>
                    </div>
                    <DropdownMenuItem asChild>
                      <Link href="/profile">Profile</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/settings">Settings</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => signOut({ callbackUrl: "/login" })}>
                      Log out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <Link href="/login">
                  <Button variant="outline">Login</Button>
                </Link>
              )}
            </div>
          </header>
          <div className="flex-1 overflow-y-auto p-4">
            {children}
          </div>
        </SidebarInset>
      </SidebarProvider>
    </AuthSessionProvider>
  );
}