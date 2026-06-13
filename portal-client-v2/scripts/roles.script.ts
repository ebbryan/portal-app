import * as dotenv from "dotenv"
dotenv.config({ path: ".env.local" })

import { getFirestore } from "firebase-admin/firestore"
import { seedRoles } from "../lib/seeder/role.seeder"
import { initSeedFirebaseApp } from "@/lib/seeder/initSeedFirebaseApp"

const db = getFirestore(initSeedFirebaseApp())
const result = await seedRoles(db)

console.log(`✅ Seeded ${result.written} documents into ${result.collection}`)
process.exit(0)
