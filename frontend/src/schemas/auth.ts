import { z } from "zod"

export const signInSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters"),
  password: z.string().min(3, "Password must be at least 3 characters"),
})

export type SignInForm = z.infer<typeof signInSchema>

export const signUpSchema = signInSchema

export type SignUpForm = z.infer<typeof signUpSchema>
