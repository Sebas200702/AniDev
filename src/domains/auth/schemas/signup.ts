import { z } from 'zod'

export const signUpSchema = z.object({
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
  user_name: z.string().min(3),
  avatar: z.string().url().optional(),
  name: z.string().min(1),
  last_name: z.string().min(1),
  birthday: z.string().optional(),
  gender: z.enum(['male', 'female', 'other']),
  favorite_animes: z.array(z.string()).optional(),
  favorite_genres: z.array(z.string()).optional(),
  favorite_studios: z.array(z.string()).optional(),
  frequency: z.string().optional(),
  fanatic_level: z.string().optional(),
  preferred_format: z.string().optional(),
  watched_animes: z.array(z.string()).optional(),
})

export type SignUpSchema = z.infer<typeof signUpSchema>

// Schema for Google signup (omits step 1 fields)
export const signUpGoogleSchema = z.object({
  avatar: z.string().url().optional(),
  name: z.string().min(1),
  last_name: z.string().min(1),
  birthday: z.string().optional(),
  gender: z.enum(['male', 'female', 'other']),
  favorite_animes: z.array(z.string()).optional(),
  favorite_genres: z.array(z.string()).optional(),
  favorite_studios: z.array(z.string()).optional(),
  frequency: z.string().optional(),
  fanatic_level: z.string().optional(),
  preferred_format: z.string().optional(),
  watched_animes: z.array(z.string()).optional(),
})

export type SignUpGoogleSchema = z.infer<typeof signUpGoogleSchema>
