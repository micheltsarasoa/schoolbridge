
"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"

import { cn } from "@/lib/utils"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Bell, User } from "lucide-react"
import { useSession } from "next-auth/react"

interface NavLink {
  title: string;
  href: string;
  icon: React.ElementType;
  submenu?: NavLink[];
}

interface NavLinkGroup {
  title: string;
  links: NavLink[];
}

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {
  navLinks: NavLinkGroup[];
}

export function Sidebar({ className, navLinks, ...props }: SidebarProps) {
  const pathname = usePathname();
  const { data: session } = useSession();

  const renderLinks = (links: NavLink[], isSubmenu: boolean = false) => {
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
    <div className={cn("flex h-full max-h-screen flex-col gap-2", className)} {...props}>
      <div className="flex h-[52px] items-center justify-center border-b px-4">
        <Link href="/dashboard" className="font-bold text-lg">SchoolBridge</Link>
      </div>
      <ScrollArea className="flex-1 px-3 py-2">
        <nav className="grid items-start gap-1">
          {navLinks.map((group, index) => (
            <React.Fragment key={group.title}>
              {group.title && (
                <h2 className="mb-2 px-2 text-lg font-semibold tracking-tight">
                  {group.title}
                </h2>
              )}
              {renderLinks(group.links)}
              {index < navLinks.length - 1 && <Separator className="my-4" />}
            </React.Fragment>
          ))}
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
