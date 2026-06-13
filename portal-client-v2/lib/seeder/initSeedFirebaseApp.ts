import { initializeApp, getApps, cert } from "firebase-admin/app"
import { createRequire } from "module"

const require = createRequire(import.meta.url)

export function initSeedFirebaseApp() {
  if (getApps().length > 0) return getApps()[0]

  const pid = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID?.trim()
  if (!pid) {
    console.error(
      "Missing Firebase project id. Add NEXT_PUBLIC_FIREBASE_PROJECT_ID to .env.local"
    )
    process.exit(1)
  }

  const serviceAccount = require("../../serviceAccountKey.json")

  return initializeApp({
    credential: cert(serviceAccount),
    projectId: pid,
  })
}
