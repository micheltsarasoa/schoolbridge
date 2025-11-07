"use client"

import * as React from "react"
import {
  BookCopy,
  BookmarkCheck,
  BookOpen,
  Bot,
  CalendarCheck,
  GalleryVerticalEnd,
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

const parentData = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  teams: [
     {
      name : "School 1",
      logo: StickyNote,
      plan: ""
    }
  ],
  navMain: [
    {
      title: "Dashboard",
      url: "/dashboard/parent",
      icon: SquareTerminal,
      items: [],
    },
    {
      title: "Inbox",
      url: "/dashboard/Inbox",
      icon: Mail,
      items: [],
    },
    {
      title: "Academic Progress",
      url: "/dashboard/parent/academic-progress",
      icon: BookCopy,
      isActive: true,
      items: [
        {
          title: "Course Overview",
          url: "/dashboard/parent/course-overview",
          icon: BookOpen,
        },
        {
          title: "Attendance",
          url: "/dashboard/parent/attendance",
          icon: BookOpen,
        },
        {
          title: "Grades & Reports",
          url: "/dashboard/parent/grades-reports",
          icon: BookOpen,
        },      
      ],
    },
    {
      title: "Permission & Forms",
      url: "/dashboard/parent/permission",
      icon: CalendarCheck,
      items: [],
    },
    {
      title: "School Communication",
      url: "/dashboard/parent/communication",
      icon: CalendarCheck,
      isActive: true,
      items: [
        {
          title: "Notices & Alerts",
          url: "/dashboard/parent/alerts",
        },
        {
          title: "Teacher Messages",
          url: "/dashboard/parent/teacher-messages",
        },
        {
          title: "Newsletters",
          url: "/dashboard/parent/newsletters",
        },
      ],
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
export function ParentSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={parentData.teams} />
        {/* To-DO: Children switcher */}
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={parentData.navMain} />
        <NavSecondary items={parentData.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={parentData.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
