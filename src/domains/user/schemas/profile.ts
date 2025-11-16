import { z } from 'zod'

export const userProfileSchema = z.object({
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
  watched_animes: z.array(z.string()).optional()
})

export type UserProfileSchema = z.infer<typeof userProfileSchema>
