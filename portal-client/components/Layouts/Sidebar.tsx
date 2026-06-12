"use client"

import { TUser } from "@/types/User.type"
import { Button } from "../ui/button"
import { usePathname, useRouter } from "next/navigation"
import { useCallback, useState } from "react"
import { Separator } from "../ui/separator"
import { logoutUser } from "@/requests/auth.request"
import { directusClient } from "@/lib/directus"

type Props = {
  children: React.ReactNode
  userData?: TUser
}

function NavItems() {
  const router = useRouter()
  const pathName = usePathname()
  const [pathRendered, setPathRendered] = useState(pathName)

  const navLinks = [
    {
      key: "home",
      name: "Home",
      path: "/",
    },
    {
      key: "profile",
      name: "Profile",
      path: "/profile",
    },
    {
      key: "manage-heads",
      name: "Pod Heads",
      path: "/pod-heads",
    },
    {
      key: "manage-editors",
      name: "Editors",
      path: "/editors",
    },
  ]

  const onRoute = useCallback(
    (path: string) => {
      router.replace(path)
      setPathRendered(pathName)
    },
    [pathRendered]
  )

  return (
    <nav className="flex flex-col gap-1">
      {navLinks.map((items) => (
        <Button
          key={items.key}
          onClick={() => onRoute(items.path)}
          variant={pathName === items.path ? "default" : "secondary"}
          className="cursor-pointer"
        >
          {items.name}
        </Button>
      ))}
    </nav>
  )
}

export default function Sidebar({ children, userData }: Props) {
  const router = useRouter()
  const onLogout = async () => {
    try {
      await logoutUser()
    } catch (error) {
      console.error("Logout error:", error)
    } finally {
      router.replace("/login")
    }
  }

  return (
    <main className="flex">
      <aside className="h-screen w-1/5 bg-accent p-4">
        <h2 className="mb-4 text-xl font-bold">
          Hi! {userData?.first_name} {userData?.last_name}
        </h2>
        <div className="flex flex-col justify-between gap-4">
          <NavItems />
          <Separator />
          <Button
            onClick={onLogout}
            variant={"destructive"}
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
