import { Timestamp } from "firebase-admin/firestore"
import * as z from "zod"

export const roleSchema = z.object({
  id: z.string(),
  name: z
    .string()
    .min(1, "name is required and must be at least 1 characters.")
    .max(32, "Username must be at most 32 characters."),
  description: z
    .string()
    .max(20, "description must be at most 20 characters.")
    .optional(),
  createdAt: z.instanceof(Timestamp),
  updatedAt: z.instanceof(Timestamp).optional(),
})

export type Role = z.infer<typeof roleSchema>
