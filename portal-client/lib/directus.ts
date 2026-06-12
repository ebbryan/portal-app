import { authentication, createDirectus, rest } from "@directus/sdk"

const baseUrl = process.env.DIRECTUS_BASE_URL || "http://localhost:8055"
if (!baseUrl) {
  throw new Error("DIRECTUS_BASE_URL environment variable is not set")
}
// Create a Directus instance
export const directusClient = createDirectus(baseUrl)
  .with(rest())
  .with(authentication("json"))
