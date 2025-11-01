'use client';

import { useState, useEffect } from "react"
import { usePathname } from 'next/navigation';
import {
  Bell,
  BookOpen,
  ChevronDown,
  Home,
  Menu,
  PanelLeft,
  Search,
  Settings,
  Users,
  BarChart,
  Link,
  School,
  ShieldCheck,
  LogOut,
} from "lucide-react"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"
import { VerificationBanner } from "@/components/VerificationBanner"


const sidebarItems = [
  {
    title: "Dashboard",
    icon: <Home />,
    href: "/admin/dashboard",
  },
  {
    title: "User Management",
    icon: <Users />,
    href: "/admin/users",
    items: [
      { title: "All Users", href: "/admin/users" },
      { title: "Students", href: "/admin/users?role=STUDENT" },
      { title: "Parents", href: "/admin/users?role=PARENT" },
      { title: "Teachers", href: "/admin/users?role=TEACHER" },
      { title: "Staff", href: "/admin/users?role=STAFF" },
      { title: "Bulk Import", href: "/admin/users/bulk-import" },
    ],
  },
  {
    title: "School Management",
    icon: <School />,
    href: "/admin/schools",
    items: [
        { title: "Schools", href: "/admin/schools" },
        { title: "Classes", href: "/admin/classes" },
        { title: "Subjects", href: "/admin/subjects" },
        { title: "Academic Years", href: "/admin/academic-years" },
        { title: "Timetables", href: "/admin/timetables" },
    ],
  },
  {
    title: "Relationships",
    icon: <Link />,
    href: "/admin/relationships",
  },
  {
    title: "Course Management",
    icon: <BookOpen />,
    href: "/admin/courses",
  },
  {
    title: "System Analytics",
    icon: <BarChart />,
    href: "/admin/analytics",
    items: [
        { title: "Platform Usage", href: "/admin/analytics/usage" },
        { title: "Academic Performance", href: "/admin/analytics/academic" },
        { title: "Attendance Reports", href: "/admin/analytics/attendance" },
        { title: "Custom Reports", href: "/admin/analytics/custom" },
    ],
  },
  {
    title: "System Configuration",
    icon: <Settings />,
    href: "/admin/config",
    items: [
        { title: "Global Settings", href: "/admin/config/settings" },
        { title: "Permissions", href: "/admin/config/permissions" },
        { title: "Notification Templates", href: "/admin/config/notifications" },
        { title: "Audit Logs", href: "/admin/config/audit-logs" },
    ],
  },
  {
    title: "Notifications",
    icon: <Bell />,
    href: "/notifications",
  },
]

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [expandedItems, setExpandedItems] = useState<Record<string, boolean>>({})

  useEffect(() => {
    const newExpandedItems: Record<string, boolean> = {};
    sidebarItems.forEach(item => {
      if (item.items && item.items.some(subItem => pathname.startsWith(subItem.href))) {
        newExpandedItems[item.title] = true;
      }
    });
    setExpandedItems(newExpandedItems);
  }, [pathname]);

  const toggleExpanded = (title: string) => {
    setExpandedItems((prev) => ({
      ...prev,
      [title]: !prev[title],
    }))
  }

  const SidebarContent = () => (
    <div className="flex h-full flex-col">
      <div className="p-4">
        <div className="flex items-center gap-3">
          <div className="flex aspect-square size-10 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 text-white">
            <ShieldCheck className="size-5" />
          </div>
          <div>
            <h2 className="font-semibold">SchoolBridge</h2>
            <p className="text-xs text-muted-foreground">Admin Panel</p>
          </div>
        </div>
      </div>

      <div className="px-3 py-2">
        <div className="relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input type="search" placeholder="Search..." className="w-full rounded-2xl bg-muted pl-9 pr-4 py-2" />
        </div>
      </div>

      <ScrollArea className="flex-1 px-3 py-2">
        <div className="space-y-1">
          {sidebarItems.map((item) => (
            <div key={item.title} className="mb-1">
                <div className={cn(
                  "flex w-full items-center justify-between rounded-2xl px-3 py-2 text-sm font-medium",
                  item.items && item.items.some(subItem => pathname === subItem.href) ? "" : "hover:bg-muted",
                )}>
                    <a href={item.href} className={cn(
                        "flex items-center gap-3",
                        pathname === item.href ? "text-primary" : "",
                    )}>
                        {item.icon}
                        <span>{item.title}</span>
                    </a>
                    {item.items && (
                    <button onClick={() => toggleExpanded(item.title)}>
                        <ChevronDown
                            className={cn(
                            "ml-2 h-4 w-4 transition-transform",
                            expandedItems[item.title] ? "rotate-180" : "",
                            )}
                        />
                    </button>
                    )}
                </div>

              {item.items && expandedItems[item.title] && (
                <div className="mt-1 ml-6 space-y-1 border-l pl-3">
                  {item.items.map((subItem) => (
                    <a
                      key={subItem.title}
                      href={subItem.href}
                      className={cn("flex items-center justify-between rounded-2xl px-3 py-2 text-sm hover:bg-muted",
                        pathname === subItem.href ? "bg-primary/10 text-primary" : "",
                      )}
                    >
                      {subItem.title}
                    </a>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </ScrollArea>

      <div className="border-t p-3">
        <div className="space-y-1">
          <button className="flex w-full items-center gap-3 rounded-2xl px-3 py-2 text-sm font-medium hover:bg-muted">
            <Settings className="h-5 w-5" />
            <span>Settings</span>
          </button>
          <button className="flex w-full items-center justify-between rounded-2xl px-3 py-2 text-sm font-medium hover:bg-muted">
            <div className="flex items-center gap-3">
              <Avatar className="h-6 w-6">
                <AvatarImage src="/placeholder.svg?height=32&width=32" alt="Admin" />
                <AvatarFallback>A</AvatarFallback>
              </Avatar>
              <span>Admin User</span>
            </div>
            <LogOut className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  )

  return (
    <div className="relative min-h-screen overflow-hidden bg-background">
        {mobileMenuOpen && (
        <div className="fixed inset-0 z-40 bg-black/50 md:hidden" onClick={() => setMobileMenuOpen(false)} />
        )}

        <div
        className={cn(
            "fixed inset-y-0 left-0 z-50 w-64 transform bg-background transition-transform duration-300 ease-in-out md:hidden",
            mobileMenuOpen ? "translate-x-0" : "-translate-x-full",
        )}
        >
        <SidebarContent />
        </div>

        <div
        className={cn(
            "fixed inset-y-0 left-0 z-30 hidden w-64 transform border-r bg-background transition-transform duration-300 ease-in-out md:block",
            sidebarOpen ? "translate-x-0" : "-translate-x-full",
        )}
        >
        <SidebarContent />
        </div>

        <div className={cn("min-h-screen transition-all duration-300 ease-in-out", sidebarOpen ? "md:pl-64" : "md:pl-0")}>
        <header className="sticky top-0 z-10 flex h-16 items-center gap-3 border-b bg-background/95 px-4 backdrop-blur">
            <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setMobileMenuOpen(true)}>
            <Menu className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon" className="hidden md:flex" onClick={() => setSidebarOpen(!sidebarOpen)}>
            <PanelLeft className="h-5 w-5" />
            </Button>
            <div className="flex flex-1 items-center justify-between">
            <h1 className="text-xl font-semibold">Admin Dashboard</h1>
            <div className="flex items-center gap-3">
                <TooltipProvider>
                <Tooltip>
                    <TooltipTrigger asChild>
                    <Button variant="ghost" size="icon" className="rounded-2xl relative">
                        <Bell className="h-5 w-5" />
                        <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs text-white">
                        3
                        </span>
                    </Button>
                    </TooltipTrigger>
                    <TooltipContent>Notifications</TooltipContent>
                </Tooltip>
                </TooltipProvider>

                <Avatar className="h-9 w-9 border-2 border-primary">
                <AvatarImage src="/placeholder.svg?height=40&width=40" alt="Admin" />
                <AvatarFallback>A</AvatarFallback>
                </Avatar>
            </div>
            </div>
        </header>

        <main className="flex-1 p-4 md:p-6">
            <VerificationBanner />
            {children}
        </main>
        </div>
    </div>
  )
}