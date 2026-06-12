"use client"

import { useCallback, useState } from "react"
import { useRouter, usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Role } from "@/enums/role"
import { logoutUser } from "@/requests/auth.request"

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface Props {
  children: React.ReactNode
  userData?: {
    first_name?: string
    last_name?: string
  }
  roleName: Role // role_name from getServerSession() passed by the parent
}

interface NavLink {
  key: string
  name: string
  path: string
  roles: Role[]
}

// ---------------------------------------------------------------------------
// Nav config
// ---------------------------------------------------------------------------

const NAV_LINKS: NavLink[] = [
  {
    key: "home",
    name: "Home",
    path: "/home",
    roles: [Role.Editor, Role.Operations, Role["Pod Head"]],
  },
  {
    key: "profile",
    name: "Profile",
    path: "/profile",
    roles: [Role.Editor, Role.Operations, Role["Pod Head"]],
  },
  {
    key: "manage-heads",
    name: "Pod Heads",
    path: "/pod-heads",
    roles: [Role.Operations],
  },
  {
    key: "manage-editors",
    name: "Editors",
    path: "/editors",
    roles: [Role.Operations],
  },
]

// ---------------------------------------------------------------------------
// NavItems
// ---------------------------------------------------------------------------

function NavItems({ roleName }: { roleName: Role }) {
  const router = useRouter()
  const pathName = usePathname()

  const allowedLinks = NAV_LINKS.filter((link) => link.roles.includes(roleName))

  const onRoute = useCallback(
    (path: string) => {
      router.replace(path)
    },
    [router]
  )

  const isActive = (path: string) => {
    if (path === "/") return pathName === "/"
    return pathName === path || pathName.startsWith(`${path}/`)
  }

  return (
    <nav className="flex flex-col gap-1">
      {allowedLinks.map((item) => (
        <Button
          key={item.key}
          onClick={() => onRoute(item.path)}
          variant={isActive(item.path) ? "default" : "secondary"}
          className="cursor-pointer"
        >
          {item.name}
        </Button>
      ))}
    </nav>
  )
}

// ---------------------------------------------------------------------------
// Sidebar
// ---------------------------------------------------------------------------

export default function Sidebar({ children, userData, roleName }: Props) {
  const router = useRouter()

  const onLogout = async () => {
    try {
      await logoutUser()
    } catch (error) {
      console.error("Logout error:", error)
    } finally {
      router.replace("/")
    }
  }

  return (
    <main className="flex">
      <aside className="h-screen w-1/5 bg-accent p-4">
        <h2 className="mb-4 text-xl font-bold">
          Hi! {userData?.first_name} {userData?.last_name}
        </h2>
        <div className="flex flex-col justify-between gap-4">
          <NavItems roleName={roleName} />
          <Separator />
          <Button
            onClick={onLogout}
            variant="destructive"
            className="flex-end flex"
          >
            Logout
          </Button>
        </div>
      </aside>
      <section className="h-screen w-full">{children}</section>
    </main>
  )
}
