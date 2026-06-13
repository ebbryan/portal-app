import { User } from "@/schemas/users.schema"
import * as bcrypt from "bcrypt"
import { Timestamp } from "firebase-admin/firestore"

export type UserFirestoreFields = Omit<User, "id">

const USERS_COLLECTION = "users"
const SALT_ROUNDS = 10
const DEFAULT_PASSWORD = "admin123"

export async function seedUsers(
  db: import("firebase-admin/firestore").Firestore,
  auth: import("firebase-admin/auth").Auth,
  options?: { merge?: boolean }
): Promise<{ collection: string; written: number }> {
  const merge = options?.merge ?? true
  const batch = db.batch()
  const hashedPassword = await bcrypt.hash(DEFAULT_PASSWORD, SALT_ROUNDS)
  let written = 0

  // 1. Fetch roles from Firestore first
  const rolesSnapshot = await db.collection("roles").get()
  if (rolesSnapshot.empty) {
    console.error("❌ No roles found. Please run seed:roles first.")
    process.exit(1)
  }

  // 2. Map role name to document ID
  // e.g. { administrator: "abc123uid", operations: "def456uid" }
  const roleMap: Record<string, string> = {}
  rolesSnapshot.forEach((doc) => {
    const name = doc.data().name as string
    roleMap[name.toLowerCase().replace(" ", "_")] = doc.id
  })

  console.log("📋 Roles found:", roleMap)

  const TEST_USERS = [
    { roleKey: "administrator", lastName: "administrator" },
    { roleKey: "operations", lastName: "operations" },
    { roleKey: "pod_head", lastName: "podhead" },
    { roleKey: "editor", lastName: "editor" },
  ]

  for (const testUser of TEST_USERS) {
    const roleId = roleMap[testUser.roleKey]

    if (!roleId) {
      console.warn(`⚠️ Role not found for key: ${testUser.roleKey}, skipping.`)
      continue
    }

    const firstName = "test"
    const email = `${firstName}@${testUser.lastName}.com`
    const username = `@${testUser.lastName}`

    // 3. Create in Firebase Auth
    let uid: string
    try {
      const authUser = await auth.createUser({
        email,
        password: DEFAULT_PASSWORD,
        displayName: `Test ${testUser.lastName}`,
      })
      uid = authUser.uid
      console.log(`✅ Auth user created: ${email}`)
    } catch (error: any) {
      if (error.code === "auth/email-already-exists") {
        const existing = await auth.getUserByEmail(email)
        uid = existing.uid
        console.log(`⚠️ Auth user already exists, skipping: ${email}`)
      } else {
        throw error
      }
    }

    // 4. Save to Firestore with real role_id from Firestore
    const userData: UserFirestoreFields = {
      username,
      first_name: firstName,
      last_name: testUser.lastName,
      email,
      password: hashedPassword,
      role_id: roleId, // ← real Firestore document ID
      createdAt: Timestamp.now(),
    }

    const ref = db.collection(USERS_COLLECTION).doc(uid)
    batch.set(ref, userData satisfies UserFirestoreFields, { merge })
    written++
  }

  await batch.commit()
  return { collection: USERS_COLLECTION, written }
}
