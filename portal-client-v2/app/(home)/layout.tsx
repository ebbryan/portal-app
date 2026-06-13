import { getSessionUser } from "@/actions/auth.action"
import { HomeSidebar } from "@/components/Layout/Sidebar"

export default async function HomeLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const user = await getSessionUser()

  return (
    <>
      <HomeSidebar user={user}> {children}</HomeSidebar>
    </>
  )
}
