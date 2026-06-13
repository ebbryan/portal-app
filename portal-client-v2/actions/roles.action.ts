"use server"

import { adminDb } from "@/lib/firebase.admin"
import { Role } from "@/schemas/roles.schema"

export async function getRoleById(id: string): Promise<Role | null> {
  try {
    const doc = await adminDb.collection("roles").doc(id).get()

    if (!doc.exists) {
      return null
    }
    return { id: doc.id, ...doc.data() } as Role
  } catch (error) {
    console.error("Error fetching role:", error)
    throw new Error("Failed to fetch role.")
  }
}
