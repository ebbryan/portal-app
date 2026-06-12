"use client"

import Sidebar from "@/components/Layouts/Sidebar"
import { TUser } from "@/types/User.type"
import { usePathname } from "next/navigation"

type Props = {
  children: React.ReactNode
  userData?: TUser
}

export default function ConditionalLayout({ children, userData }: Props) {
  const pathname = usePathname()
  return pathname === "/login" ? (
    <>{children}</>
  ) : (
    <Sidebar userData={userData ? userData : undefined}>{children}</Sidebar>
  )
}
