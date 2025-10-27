// @auth/schemas/signup.ts
import { z } from 'zod'

export const signUpSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z
    .string()
    .min(6, 'The password must be at least 6 characters long')
    .regex(/(?=.*[a-z])/, 'Must contain at least one lowercase letter')
    .regex(/(?=.*[A-Z])/, 'Must contain at least one uppercase letter')
    .regex(/(?=.*\d)/, 'Must contain at least one number')
    .regex(/(?=.*[!@#$%^&*])/, 'Must contain at least one symbol')
    .max(20, 'The password cannot exceed 20 characters'),
  user_name: z.string().min(3),
})

export type SignUpSchema = z.infer<typeof signUpSchema>

