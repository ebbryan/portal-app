import * as z from "zod"

export const loginSchema = z.object({
  username: z
    .string()
    .min(5, "Username is required and must be at least 5 characters.")
    .max(32, "Username must be at most 32 characters."),
  password: z
    .string()
    .min(8, "Password is required and must be at least 8 characters.")
    .max(16, "Password must be at most 16 characters."),
})

export type TLogin = z.infer<typeof loginSchema>
