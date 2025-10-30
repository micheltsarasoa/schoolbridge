"use client"

import * as React from "react"
import {
  LayoutDashboardIcon,
  SchoolIcon,
  UsersIcon,
  GalleryVerticalEnd
} from "lucide-react"

import { NavMain } from "@/components/nav-main"
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

const data = {
  navMain: [
    {
      title: "Dashboard",
      url: "/en/admin/dashboard",
      icon: LayoutDashboardIcon,
    },
    {
      title: "Schools",
      url: "/en/admin/schools",
      icon: SchoolIcon,
    },
    {
      title: "Users",
      url: "/en/admin/dashboard", // User management is on the dashboard page
      icon: UsersIcon,
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!p-1.5"
            >
              <a href="/en/admin/dashboard">
                <GalleryVerticalEnd className="h-5 w-5" />
                <span className="text-base font-semibold">SchoolBridge</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
      {/* <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter> */}
    </Sidebar>
  )
}
