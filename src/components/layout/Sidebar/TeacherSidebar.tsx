"use client"

import * as React from "react"
import {
  BookAIcon,
  BookCopy,
  BookmarkCheck,
  BookOpen,
  Bot,
  CalendarCheck,
  CalendarDays,
  FolderPlus,
  GalleryVerticalEnd,
  LibraryBig,
  LifeBuoy,
  Mail,
  Pickaxe,
  Send,
  Settings2,
  SquareTerminal,
  StickyNote,
  Swords,
  TrendingUpDown,
  TrophyIcon,
  University,
} from "lucide-react"

import { NavMain } from "@/components/layout/nav-main"
import { NavUser } from "@/components/layout/nav-user"
import { NavSecondary } from "@/components/layout/nav-secondary"
import { TeamSwitcher } from "@/components/layout/team-switcher"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar"

const teacherData = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  teams: [ 
    {
      name : "School 1",
      logo: StickyNote,
      plan: "Plan 2"
    },
    {
      name : "School 2",
      logo: Pickaxe,
      plan: "Plan 2"
    }
  ],
  navMain: [
    {
      title: "Dashboard",
      url: "/dashboard/teacher",
      icon: SquareTerminal,
      items: [],
    },
    {
      title: "Inbox",
      url: "/dashboard/inbox",
      icon: Mail,
      items: [],
    },
    {
      title: "Classes",
      url: "/dashboard/classes",
      icon: BookCopy,
      isActive: true,
      items: [
        {
          title: "Class 1 - F1",
          url: "#",
          icon: BookOpen,
        },
        {
          title: "Class 2 - F1",
          url: "#",
          icon: BookOpen,
        } 
      ],
    },
    {
      title: "Teaching Resources",
      url: "/dashboard/teacher/ressources",
      icon: LibraryBig,
      items: [
        {
          title: "Courses",
          url: "/dashboard/teacher/courses",
        },
        {
          title: "Teaching Materials",
          url: "/dashboard/teacher/teaching-materials",
        },
        {
          title: "Shared Ressources",
          url: "/dashboard/teacher/shared-ressources",
        }
      ],
    },
    {
      title: "Assessments",
      url: "/dashboard/teacher/assessments",
      icon: FolderPlus,
      items: [
        {
          title: "Create Quiz/Test",
          url: "/dashboard/teacher/create-quiz-test",
        },
        {
          title: "Grade Assignments",
          url: "/dashboard/teacher/grade-assignments",
        },
        {
          title: "Rubrics",
          url: "/dashboard/teacher/rubrics",
        }
      ],
    },
    {
      title: "Analytics & Reports",
      url: "/dashboard/teacher/analytics-reports",
      icon: TrendingUpDown,
      items: [
        {
          title: "Student Performance",
          url: "/dashboard/teacher/student-performance",
        },
        {
          title: "Class Analytics",
          url: "/dashboard/teacher/class-analytics",
        },
        {
          title: "Rubrics",
          url: "/dashboard/teacher/progress-reports",
        }
      ],
    },
    {
      title: "Teacher Planner",
      url: "/dashboard/teacher/analytics-reports",
      icon: CalendarDays,
      isActive: true,
      items: [
        {
          title: "Daily Schedule",
          url: "/dashboard/teacher/daily-planning",
        },
        {
          title: "Weekly Planning",
          url: "/dashboard/teacher/weekly-planning",
        },
      ],
    },
    {
      title: "School Management",
      url: "/dashboard/teacher/school-management",
      icon: University,
      isActive: true,
      items: [
        {
          title: "Attendance",
          url: "/dashboard/teacher/daily-planning",
        },
      ],
    },
    {
      title: "Forecast",
      url: "/dashboard/teacher/forecast",
      icon: TrendingUpDown,
      items: [],
    }
  ],

  navSecondary: [
    {
      title: "Feedback",
      url: "#",
      icon: Send,
    },
    {
      title: "Support",
      url: "#",
      icon: LifeBuoy,
    }
  ],
}
export function TeacherSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={teacherData.teams} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={teacherData.navMain} />
        <NavSecondary items={teacherData.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={teacherData.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
