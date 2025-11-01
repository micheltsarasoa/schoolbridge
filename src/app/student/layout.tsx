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
  GraduationCap,
  ClipboardList,
  Calendar,
  Target,
  Award,
  Download
} from "lucide-react"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"
import { VerificationBanner } from "@/components/VerificationBanner"

interface CourseGroup {
  subjectId: string;
  subjectName: string;
  courses: {
    id: string;
    title: string;
    hasOfflineContent: boolean;
  }[];
}

interface SidebarItem {
  title: string;
  icon: React.ReactNode;
  href: string;
  items?: SidebarItem[];
  hasOffline?: boolean;
}

const baseSidebarItems: SidebarItem[] = [
    {
        title: "Dashboard",
        icon: <Home />,
        href: "/student/dashboard",
    },
    {
        title: "My Quizzes",
        icon: <ClipboardList />,
        href: "/student/quizzes",
    },
    {
        title: "My Todo",
        icon: <ClipboardList />,
        href: "/student/todo",
    },
    {
        title: "My Planning",
        icon: <Calendar />,
        href: "/student/planning",
    },
    {
        title: "My Forecast",
        icon: <Target />,
        href: "/student/forecast",
    },
    {
        title: "My Results & Badges",
        icon: <Award />,
        href: "/student/results-badges",
    },
    {
        title: "Notifications",
        icon: <Bell />,
        href: "/notifications",
    },
]

export default function StudentLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [expandedItems, setExpandedItems] = useState<Record<string, boolean>>({})
  const [courseGroups, setCourseGroups] = useState<CourseGroup[]>([])
  const [loadingCourses, setLoadingCourses] = useState(true)

  // Fetch courses on mount
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await fetch('/api/student/courses');
        if (response.ok) {
          const data = await response.json();
          setCourseGroups(data);
        }
      } catch (error) {
        console.error('Failed to fetch courses:', error);
      } finally {
        setLoadingCourses(false);
      }
    };

    fetchCourses();
  }, []);

  // Build dynamic courses item
  const coursesItem: SidebarItem = {
    title: "My Courses",
    icon: <BookOpen />,
    href: "/student/courses",
    items: courseGroups.map(group => ({
      title: group.subjectName,
      icon: <BookOpen />,
      href: `/student/courses?subject=${group.subjectId}`,
      items: group.courses.map(course => ({
        title: course.title,
        icon: <BookOpen />,
        href: `/student/courses/${course.id}`,
        hasOffline: course.hasOfflineContent,
      })),
    })),
  };

  // Combine sidebar items
  const sidebarItems = [
    baseSidebarItems[0], // Dashboard
    coursesItem, // Dynamic courses
    ...baseSidebarItems.slice(1), // Rest of the items
  ];

  useEffect(() => {
    const newExpandedItems: Record<string, boolean> = {};
    sidebarItems.forEach(item => {
      if (item.items && item.items.some(subItem => pathname.startsWith(subItem.href))) {
        newExpandedItems[item.title] = true;
      }
    });
    setExpandedItems(newExpandedItems);
  }, [pathname, courseGroups]);

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
          <div className="flex aspect-square size-10 items-center justify-center rounded-2xl bg-gradient-to-br from-green-600 to-lime-600 text-white">
            <GraduationCap className="size-5" />
          </div>
          <div>
            <h2 className="font-semibold">SchoolBridge</h2>
            <p className="text-xs text-muted-foreground">Student Panel</p>
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
                        {item.hasOffline && (
                          <div title="Available offline">
                            <Download className="h-3 w-3 text-green-500 ml-1" />
                          </div>
                        )}
                    </a>
                    {item.items && item.items.length > 0 && (
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
                    <div key={subItem.title} className="mb-1">
                      <div className={cn(
                        "flex w-full items-center justify-between rounded-2xl px-3 py-2 text-sm",
                        subItem.items && subItem.items.some(subSubItem => pathname === subSubItem.href) ? "" : "hover:bg-muted",
                      )}>
                        <a
                          href={subItem.href}
                          className={cn("flex items-center gap-3",
                            pathname === subItem.href ? "bg-primary/10 text-primary" : "",
                          )}
                        >
                          {subItem.icon}
                          <span>{subItem.title}</span>
                          {subItem.hasOffline && (
                            <div title="Available offline">
                              <Download className="h-3 w-3 text-green-500 ml-1" />
                            </div>
                          )}
                        </a>
                        {subItem.items && subItem.items.length > 0 && (
                          <button onClick={() => toggleExpanded(subItem.title)}>
                            <ChevronDown
                              className={cn(
                                "ml-2 h-4 w-4 transition-transform",
                                expandedItems[subItem.title] ? "rotate-180" : "",
                              )}
                            />
                          </button>
                        )}
                      </div>

                      {subItem.items && expandedItems[subItem.title] && (
                        <div className="mt-1 ml-6 space-y-1 border-l pl-3">
                          {subItem.items.map((subSubItem) => (
                            <a
                              key={subSubItem.title}
                              href={subSubItem.href}
                              className={cn("flex items-center gap-3 rounded-2xl px-3 py-2 text-sm hover:bg-muted",
                                pathname === subSubItem.href ? "bg-primary/10 text-primary" : "",
                              )}
                            >
                              {subSubItem.icon}
                              <span>{subSubItem.title}</span>
                              {subSubItem.hasOffline && (
                                <div title="Available offline">
                                  <Download className="h-3 w-3 text-green-500 ml-1" />
                                </div>
                              )}
                            </a>
                          ))}
                        </div>
                      )}
                    </div>
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
                <AvatarImage src="/placeholder.svg?height=32&width=32" alt="Student" />
                <AvatarFallback>S</AvatarFallback>
              </Avatar>
              <span>Student User</span>
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
            <h1 className="text-xl font-semibold">Student Dashboard</h1>
            <div className="flex items-center gap-3">
                <TooltipProvider>
                <Tooltip>
                    <TooltipTrigger asChild>
                    <Button variant="ghost" size="icon" className="rounded-2xl relative">
                        <Bell className="h-5 w-5" />
                        <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs text-white">
                        5
                        </span>
                    </Button>
                    </TooltipTrigger>
                    <TooltipContent>Notifications</TooltipContent>
                </Tooltip>
                </TooltipProvider>

                <Avatar className="h-9 w-9 border-2 border-primary">
                <AvatarImage src="/placeholder.svg?height=40&width=40" alt="Student" />
                <AvatarFallback>S</AvatarFallback>
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