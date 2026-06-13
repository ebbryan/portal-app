import EditorPage from "@/components/Editor/EditorPage"
import OperationPage from "@/components/Operations/OperationPage"
import PodHeadPage from "@/components/PooHead/PodHeadPage"
import { Role } from "@/enums/role"
import { getServerSession } from "@/helpers/JwtDecoder"

export default async function LeavesPage() {
  const session = await getServerSession()
  console.log("🚀 ~ Page ~ session:", session)
  return (
    <div>
      <h1>Leave page here</h1>
      <p>This is the main landing page of the application.</p>
    </div>
  )
}
