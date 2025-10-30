
'use client';

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LucideIcon, LayoutDashboard, BookOpen, FileQuestion, ListTodo, Calendar, TrendingUp, Award, User, Bell } from "lucide-react";

import { cn } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useSession } from "next-auth/react";

interface SidebarLink {
  title: string;
  href: string;
  icon: LucideIcon;
  submenu?: SidebarLink[];
}

const studentLinks: SidebarLink[] = [
  {
    title: "Dashboard",
    href: "/student/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "My Courses",
    href: "/student/courses",
    icon: BookOpen,
    submenu: [
      {
        title: "Mathematics",
        href: "/student/courses/mathematics",
        icon: BookOpen, // Placeholder icon
        submenu: [
          { title: "Algebra I", href: "/student/courses/mathematics/algebra-i", icon: BookOpen },
          { title: "Geometry", href: "/student/courses/mathematics/geometry", icon: BookOpen },
        ],
      },
      {
        title: "Science",
        href: "/student/courses/science",
        icon: BookOpen, // Placeholder icon
        submenu: [
          { title: "Physics", href: "/student/courses/science/physics", icon: BookOpen },
          { title: "Chemistry", href: "/student/courses/science/chemistry", icon: BookOpen },
        ],
      },
    ],
  },
  {
    title: "My Quizzes",
    href: "/student/quizzes",
    icon: FileQuestion,
  },
  {
    title: "My Todo",
    href: "/student/todo",
    icon: ListTodo,
  },
  {
    title: "My Planning",
    href: "/student/planning",
    icon: Calendar,
  },
  {
    title: "My Forecast",
    href: "/student/forecast",
    icon: TrendingUp,
  },
  {
    title: "My Results & Badges",
    href: "/student/results-badges",
    icon: Award,
  },
];

export function StudentSidebar() {
  const pathname = usePathname();
  const { data: session } = useSession();

  const renderLinks = (links: SidebarLink[], isSubmenu: boolean = false) => {
    return links.map((link) => (
      <div key={link.title}>
        <Link href={link.href}>
          <Button
            variant="ghost"
            className={cn(
              "w-full justify-start",
              isSubmenu && "pl-6",
              pathname === link.href && "bg-muted hover:bg-muted"
            )}
          >
            <link.icon className="mr-2 h-4 w-4" />
            {link.title}
          </Button>
        </Link>
        {link.submenu && (
          <div className="ml-4">
            {renderLinks(link.submenu, true)}
          </div>
        )}
      </div>
    ));
  };

  return (
    <div className="flex h-full max-h-screen flex-col gap-2">
      <div className="flex h-[52px] items-center justify-center border-b px-4">
        <Link href="/student/dashboard" className="font-bold text-lg">SchoolBridge</Link>
      </div>
      <ScrollArea className="flex-1 px-3 py-2">
        <nav className="grid items-start gap-1">
          {renderLinks(studentLinks)}
        </nav>
      </ScrollArea>
      <div className="mt-auto p-4 border-t">
        {/* Last Notification */}
        <Button variant="ghost" className="w-full justify-start mb-2">
          <Bell className="mr-2 h-4 w-4" />
          Last Notification: No new messages
        </Button>

        {/* Profile Button */}
        {session?.user ? (
          <Link href="/profile">
            <Button variant="ghost" className="w-full justify-start">
              <Avatar className="mr-2 h-6 w-6">
                <AvatarImage src={session.user.image || undefined} alt={session.user.name || "User"} />
                <AvatarFallback>{session.user.name?.charAt(0) || session.user.email?.charAt(0)}</AvatarFallback>
              </Avatar>
              {session.user.name || session.user.email}
            </Button>
          </Link>
        ) : (
          <Link href="/login">
            <Button variant="ghost" className="w-full justify-start">
              <User className="mr-2 h-4 w-4" />
              Login
            </Button>
          </Link>
        )}
      </div>
    </div>
  );
}
