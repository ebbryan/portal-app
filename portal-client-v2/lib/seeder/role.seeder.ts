import { Roles } from "@/schemas/roles.schema"
import { Timestamp } from "firebase-admin/firestore"

export const ROLES_COLLECTION = "roles"

type RolesFirestoreFields = Omit<Roles, "id">

export const ROLES: readonly RolesFirestoreFields[] = [
  {
    name: "Administrator",
    description: "Full access to all system features",
    createdAt: Timestamp.now(),
  },
  {
    name: "Operations",
    description: "Manages day-to-day operational tasks",
    createdAt: Timestamp.now(),
  },
  {
    name: "Pod Head",
    description: "Leads a specific pod or team",
    createdAt: Timestamp.now(),
  },
  {
    name: "Editor",
    description: "Can view and edit assigned content",
    createdAt: Timestamp.now(),
  },
] as const

export async function seedRoles(
  db: import("firebase-admin/firestore").Firestore,
  options?: { merge?: boolean }
): Promise<{ collection: string; written: number }> {
  const merge = options?.merge ?? true
  const batch = db.batch()

  for (const role of ROLES) {
    const { ...fields } = role
    const ref = db.collection(ROLES_COLLECTION).doc()
    batch.set(ref, fields satisfies RolesFirestoreFields, { merge })
  }

  await batch.commit()
  return { collection: ROLES_COLLECTION, written: ROLES.length }
}
