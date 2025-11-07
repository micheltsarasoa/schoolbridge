"use client"

import * as React from "react"
import {
  BookCopy,
  BookmarkCheck,
  BookOpen,
  CalendarCheck,
  LifeBuoy,
  Mail,
  Pickaxe,
  Send,
  SquareTerminal,
  StickyNote,
  TrendingUpDown,
  TrophyIcon,
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


const studentData = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  teams: [
     {
      name : "School 1",
      logo: StickyNote,
      plan: "student maditra"
    }
   ],
  navMain: [
    {
      title: "Dashboard",
      url: "/dashboard/student",
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
      title: "Courses",
      url: "/dashboard/student/courses",
      icon: BookCopy,
      items: [
        {
          title: "Sciences",
          url: "#",
          icon: BookOpen,
        },
        {
          title: "Languages & Arts",
          url: "#",
          icon: BookOpen,
        },
        {
          title: "Maths",
          url: "#",
          icon: BookOpen,
        },
        {
          title: "Civic & Morals",
          url: "#",
          icon: BookOpen,
        },
        {
          title: "Special Topics",
          url: "#",
          icon: BookOpen,
        },
        {
          title: "Technologies",
          url: "#",
          icon: BookOpen,
        },
        {
          title: "View All Courses",
          url: "#",
          icon: BookOpen,
        },      
      ],
    },
    {
      title: "Planning",
      url: "/dashboard/student/planning",
      icon: CalendarCheck,
      items: [
        {
          title: "Weekly Classes",
          url: "#",
        },
        {
          title: "Monthly Planning",
          url: "#",
        }
      ],
    },
    {
      title: "Exams & Result",
      url: "/dashboard/student/exams-and-results",
      icon: CalendarCheck,
      isActive: true,
      items: [
        {
          title: "Upcoming Exams",
          url: "#",
        },
        {
          title: "Exam Results",
          url: "#",
        }
      ],
    },
    {
      title: "Quizzes",
      url: "/dashboard/student/quizzes",
      icon: BookmarkCheck,
      items: [],
    },
    {
      title: "Badges",
      url: "/dashboard/student/badges",
      icon: TrophyIcon,
      items: [],
    },
    {
      title: "Todos",
      url: "/dashboard/student/todos",
      icon: Pickaxe,
      items: [],
    },
    {
      title: "Forecast",
      url: "/dashboard/student/forecast",
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
export function StudentSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  // Test if teacher
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={studentData.teams} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={studentData.navMain} />
        <NavSecondary items={studentData.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={studentData.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
