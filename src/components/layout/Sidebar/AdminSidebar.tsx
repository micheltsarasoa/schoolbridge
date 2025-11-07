"use client"

import * as React from "react"
import {
  Activity,
  Award,
  BarChart,
  Bell,
  BookCopy,
  BookmarkCheck,
  BookOpen,
  Bot,
  Briefcase,
  Calendar,
  CalendarCheck,
  CheckSquare,
  CloudUploadIcon,
  FileBarChart,
  FileInput,
  GalleryVerticalEnd,
  Globe,
  GraduationCap,
  Hourglass,
  Layers,
  LayoutDashboard,
  LifeBuoy,
  Mail,
  MessageSquare,
  Pickaxe,
  Plug,
  School,
  Send,
  Settings,
  Settings2,
  ShieldCheck,
  SquaresUnite,
  SquareTerminal,
  StickyNote,
  Swords,
  TrendingUpDown,
  TrophyIcon,
  UserRoundPlus,
  Users,
  UserStar,
  Workflow,
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

const dataAdmin = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  teams: [
    {
      name: "School 1",
      logo: BookOpen, 
      plan: "Administrateur"
    }
  ],
  navMain: [
    {
      title: "Dashboard",
      url: "/dashboard/admin",
      icon: LayoutDashboard,
      items: [],
    },
    {
      title: "Inbox",
      url: "/dashboard/common/inbox",
      icon: Mail,
      items: [],
    },
    {
      title: "User Management",
      url: "/dashboard/admin/users",
      icon: Users,
      isActive: true,
      items: [
        {
          title: "Students",
          url: "/dashboard/admin/users?role=STUDENT",
          icon: GraduationCap
        },
        {
          title: "Parents",
          url: "/dashboard/admin/users?role=PARENT",
          icon: UserRoundPlus
        },
        {
          title: "Teachers",
          url: "/dashboard/admin/users?role=TEACHER",
          icon: UserStar
        },
        {
          title: "Staff",
          url: "/dashboard/admin/users?role=STAFF",
          icon: Briefcase
        },
        {
          title: "Bulk Import",
          url: "/dashboard/admin/users/bulk-import",
          icon: CloudUploadIcon
        }
      ],
    },
    {
      title: "School Management",
      url: "/dashboard/admin/school",
      icon: School,
      items: [
        {
          title: "Academic Structure",
          url: "/dashboard/admin/school/academic-structure",
          icon: SquaresUnite
        },
        {
          title: "Course Management",
          url: "/dashboard/admin/school/course-management",
          icon: BookOpen
        },
        {
          title: "Timetable Management",
          url: "/dashboard/admin/school/timetable-management",
          icon: Calendar
        },
        {
          title: "Grade Levels",
          url: "/dashboard/admin/school/grade-levels",
          icon: Layers
        }
      ],
    },
    {
      title: "System Analytics",
      url: "/dashboard/admin/analytics",
      icon: BarChart,
      items: [
        {
          title: "Platform Usage",
          url: "/dashboard/admin/analytics/performance-usage",
          icon: Activity
        },
        {
          title: "Academic Performance",
          url: "/dashboard/admin/analytics/academic-performance",
          icon: Award
        },
        {
          title: "Attendance Analytics",
          url: "/dashboard/admin/analytics/attendance-analytics",
          icon: CalendarCheck
        },
        {
          title: "Custom Reports",
          url: "/dashboard/admin/analytics/custom-reports",
          icon: FileBarChart
        },
      ],
    },
    {
      title: "System Configuration",
      url: "/dashboard/admin/system-configuration",
      icon: Settings,
      items: [
        {
          title: "Global Settings",
          url: "/dashboard/admin/system-configuration/global-settings",
          icon: Globe
        },
        {
          title: "Permission Management",
          url: "/dashboard/admin/system-configuration/permission-management",
          icon: ShieldCheck
        },
        {
          title: "Notification Settings",
          url: "/dashboard/admin/system-configuration/notification",
          icon: Bell
        },
        {
          title: "Integration Settings",
          url: "/dashboard/admin/system-configuration/integration-settings",
          icon: Plug
        },
      ],
    },
    {
      title: "Workflows & Approvals",
      url: "/dashboard/admin/workflows",
      icon: Workflow,
      isActive: true,
      items: [
        {
          title: "Form Builder",
          url: "/dashboard/admin/workflows/form-builder",
          icon: FileInput
        },
        {
          title: "Pending Approvals",
          url: "/dashboard/admin/workflows/pending-approvals",
          icon: Hourglass
        },
        {
          title: "Approval Workflows",
          url: "/dashboard/admin/workflows/approval-workflows",
          icon: CheckSquare
        }
      ],
    }
  ],
  navSecondary: [
    {
      title: "Feedback",
      url: "#",
      icon: MessageSquare,
    },
    {
      title: "Support",
      url: "#",
      icon: LifeBuoy,
    }
  ],
};

export function AdminSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={dataAdmin.teams} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={dataAdmin.navMain} />
        <NavSecondary items={dataAdmin.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={dataAdmin.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
 