import * as dotenv from "dotenv"
dotenv.config({ path: ".env.local" })

import { getFirestore } from "firebase-admin/firestore"
import { getAuth } from "firebase-admin/auth"
import { initSeedFirebaseApp } from "../lib/seeder/initSeedFirebaseApp"
import { seedUsers } from "../lib/seeder/users.seed"

const app = initSeedFirebaseApp()
const db = getFirestore(app)
const auth = getAuth(app)

const result = await seedUsers(db, auth)
console.log(`✅ Seeded ${result.written} documents into ${result.collection}`)
process.exit(0)
