import { createRequire } from "module"
import { initializeApp, getApps, cert } from "firebase-admin/app"
import { getAuth } from "firebase-admin/auth"
import { getFirestore } from "firebase-admin/firestore"

const require = createRequire(import.meta.url)

const app = (() => {
  if (getApps().length > 0) return getApps()[0]

  const serviceAccount = require("../serviceAccountKey.json")

  return initializeApp({
    credential: cert(serviceAccount),
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  })
})()

export const adminAuth = getAuth(app)
export const adminDb = getFirestore(app)
