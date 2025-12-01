import type { AnimeCardInfo } from '@anime/types'

export interface Session {
  name: string | null
  avatar: string | null
}

export interface ImagePayload {
  image: string | null
  type: string | null
  filename: string | null
  isBanner: boolean
  prompt?: string
}

export interface PersonAbout {
  description: string
  members: Member[]
  details: Record<string, string | string[]>
  favorites: Record<string, string[]>
  awards: string[]
  links: Links
}

export interface Member {
  name: string
  role: string
}

export interface Links {
  twitter?: string
  instagram?: string
  profile?: string
  website?: string
  [key: string]: string | undefined
}

export interface WatchList extends AnimeCardInfo {
  id: string
  user_id: string
  anime_id: string
  type: string
}

export interface UserProfile {
  id?: string | number
  name?: string
  email?: string
  favorite_animes?: string[]
  [key: string]: unknown
}

export interface GetUserDataToRecommendationsResult {
  userProfile?: UserProfile | null
  calculatedAge?: number | null
  error?: string | null
}

export interface UserInfo {
  id: string | null
  name: string | null
  avatar: string | null
  banner_image: string | null
}
