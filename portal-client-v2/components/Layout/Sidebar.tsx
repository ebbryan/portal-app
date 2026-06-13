"use client"

import { useCallback } from "react"
import { useRouter, usePathname } from "next/navigation"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
} from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Home, User, Users, Edit } from "lucide-react"
import { logout } from "@/actions/auth.action"
import { Role } from "@/schemas/roles.schema"
import { User as SessionUser } from "@/schemas/users.schema"
import { Roles } from "@/enums/roles.enum"
import { TooltipProvider } from "../ui/tooltip"

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface HomeSidebarProps {
  user:
    | (Omit<SessionUser, "createdAt"> & {
        createdAt: string
      })
    | null
  children: React.ReactNode
}

interface NavLink {
  key: string
  name: string
  path: string
  roles: Roles[]
  icon: React.ElementType
}

// ---------------------------------------------------------------------------
// Nav config
// ---------------------------------------------------------------------------

const NAV_LINKS: NavLink[] = [
  {
    key: "home",
    name: "Home",
    path: "/home",
    roles: [Roles.Editor, Roles.Operations, Roles["Pod Head"]],
    icon: Home,
  },
  {
    key: "profile",
    name: "Profile",
    path: "/profile",
    roles: [Roles.Editor, Roles.Operations, Roles["Pod Head"]],
    icon: User,
  },
  {
    key: "manage-heads",
    name: "Pod Heads",
    path: "/pod-heads",
    roles: [Roles.Operations],
    icon: Users,
  },
  {
    key: "manage-editors",
    name: "Editors",
    path: "/editors",
    roles: [Roles.Operations],
    icon: Edit,
  },
]

// ---------------------------------------------------------------------------
// HomeSidebar
// ---------------------------------------------------------------------------

export function HomeSidebar({ user, children }: HomeSidebarProps) {
  const parsedUser = {
    ...user,
    role_id: JSON.parse(user?.role_id!),
    createdAt: JSON.parse(user?.createdAt!),
  }

  const router = useRouter()
  const pathname = usePathname()

  const allowedLinks = NAV_LINKS.filter((link) =>
    link.roles.includes(parsedUser?.role_id.name as Roles)
  )

  const isActive = useCallback(
    (path: string) => {
      if (path === "/") return pathname === "/"
      return pathname === path || pathname.startsWith(`${path}/`)
    },
    [pathname]
  )

  const onLogout = async () => {
    try {
      await logout()
    } catch (error) {
      console.error("Logout error:", error)
    } finally {
      router.replace("/")
    }
  }

  return (
    <TooltipProvider>
      <SidebarProvider>
        <Sidebar collapsible="icon">
          {/* Header */}
          <SidebarHeader className="p-4">
            <p className="text-sm text-muted-foreground">Welcome back,</p>
            <h2 className="truncate text-base font-bold">
              {user?.first_name} {user?.last_name}
            </h2>
          </SidebarHeader>

          {/* Nav Links */}
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupLabel>Navigation</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {allowedLinks.map((item) => (
                    <SidebarMenuItem key={item.key}>
                      <SidebarMenuButton
                        isActive={isActive(item.path)}
                        onClick={() => router.replace(item.path)}
                        tooltip={item.name}
                      >
                        <item.icon />
                        <span>{item.name}</span>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>

          {/* Footer - Logout */}
          <SidebarFooter className="p-4">
            <Separator className="mb-4" />
            <Button onClick={onLogout} variant="destructive" className="w-full">
              Logout
            </Button>
          </SidebarFooter>
        </Sidebar>
        {children}
      </SidebarProvider>
    </TooltipProvider>
  )
}
