import { AppSidebar } from "@/components/Layouts/AppSidebar/AppSidebar"
import Sidebar from "@/components/Layouts/Sidebar"

import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { Role } from "@/enums/role"
import { getServerSession } from "@/helpers/JwtDecoder"
import { readCurrentUser } from "@/requests/auth.request"
import { TUser } from "@/types/User.type"

export default async function HomeLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await getServerSession()
  const userData = (await readCurrentUser()).data as TUser
  return (
    <>
      <Sidebar userData={userData} roleName={session?.role_name as Role}>
        {/* <SidebarProvider>
        <AppSidebar /> */}
        {/* <main>
          <SidebarTrigger /> */}
        {children}
        {/* </main> */}
        {/* </SidebarProvider> */}
      </Sidebar>
    </>
  )
}
