import EditorPage from "@/components/Editor/EditorPage"
import OperationPage from "@/components/Operations/OperationPage"
import PodHeadPage from "@/components/PooHead/PodHeadPage"
import { Role } from "@/enums/role"
import { cookieTokenGrabber } from "@/helpers/CookieGrabber"
import { getServerSession } from "@/helpers/JwtDecoder"

export default async function Page() {
  const session = await getServerSession()
  console.log("🚀 ~ Page ~ session:", session)
  return (
    <div>
      <h1>Welcome to the Home Page</h1>
      <p>This is the main landing page of the application.</p>
      <EditorPage visible={session.role_name === Role.Editor} />
      <OperationPage visible={session.role_name === Role.Operations} />
      <PodHeadPage visible={session.role_name === Role["Pod Head"]} />
    </div>
  )
}
