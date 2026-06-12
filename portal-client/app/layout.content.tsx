"use client"

import Sidebar from "@/components/Layouts/Sidebar"
import { Role } from "@/enums/role"
import { useSession } from "@/hooks/useSession"
import { TUser } from "@/types/User.type"
import { usePathname } from "next/navigation"

type Props = {
  children: React.ReactNode
  userData?: TUser
}

export default function ConditionalLayout({ children, userData }: Props) {
  const pathname = usePathname()
  const { session } = useSession()
  return pathname === "/login" ? (
    <>{children}</>
  ) : (
    <Sidebar
      userData={userData ? userData : undefined}
      roleName={session?.role_name as Role}
    >
      {children}
    </Sidebar>
  )
}
