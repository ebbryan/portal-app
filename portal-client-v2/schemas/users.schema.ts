import { Timestamp } from "firebase-admin/firestore"
import * as z from "zod"
import * as bcrypt from "bcrypt"

export const userSchema = z.object({
  id: z.string(),
  username: z
    .string()
    .min(1, "Username is required and must be at least 1 character.")
    .max(32, "Username must be at most 32 characters."),
  first_name: z.string().max(50, "First name must be at most 50 characters."),
  middle_name: z
    .string()
    .max(50, "Middle name must be at most 50 characters.")
    .optional(),
  last_name: z.string().max(50, "Last name must be at most 50 characters."),
  email: z.string().email(),
  password: z.string(),
  role_id: z.string(),
  createdAt: z.instanceof(Timestamp),
  updatedAt: z.instanceof(Timestamp).optional(),
})

export type User = z.infer<typeof userSchema>
