import { z } from 'zod'
export const signInSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z
    .string()
    .min(6, 'The password must be at least 6 characters long')
    .regex(
      /(?=.*[a-z])/,
      'The password must contain at least one lowercase letter'
    )
    .regex(
      /(?=.*[A-Z])/,
      'The password must contain at least one uppercase letter'
    )
    .regex(/(?=.*\d)/, 'The password must contain at least one number')
    .regex(/(?=.*[!@#$%^&*])/, 'The password must contain at least one symbol')
    .max(20, 'The password cannot have more than 20 characters'),
})
export type SignInSchema = z.infer<typeof signInSchema>
