"use server"

import { adminDb } from "@/lib/firebase.admin"
import { User } from "@/schemas/users.schema"

export async function getUserByUsername(
  username: string
): Promise<User | null> {
  try {
    const usersRef = adminDb.collection("users")

    const snapshot = await usersRef
      .where("username", "==", username)
      .limit(1)
      .get()

    if (snapshot.empty) {
      return null
    }

    const doc = snapshot.docs[0]
    return { id: doc.id, ...doc.data() } as User
  } catch (error) {
    console.error("Error fetching user:", error)
    throw new Error("Failed to fetch user.")
  }
}

export async function getUserById(id: string): Promise<User | null> {
  try {
    const doc = await adminDb.collection("users").doc(id).get()

    if (!doc.exists) {
      return null
    }

    return { id: doc.id, ...doc.data() } as User
  } catch (error) {
    console.error("Error fetching user:", error)
    throw new Error("Failed to fetch user.")
  }
}
