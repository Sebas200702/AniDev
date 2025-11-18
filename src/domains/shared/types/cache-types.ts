import type {
  AnimeBannerInfo,
  AnimeCardInfo,
  AnimeCollectionInfo,
} from '@anime/types'

export type AnimeCardData =
  | AnimeBannerInfo
  | AnimeCardInfo
  | AnimeCollectionInfo

export interface CachedAnimeResponse {
  url: string
  data: AnimeCardData[]
  timestamp: number
  status: 'success' | 'error' | 'empty'
  error?: string
  retryCount?: number
}

export interface SectionCache {
  sectionId: string
  responses: CachedAnimeResponse[]
  lastUpdated: number
}

export interface HomeCache {
  userId: string | null
  sections: Record<string, SectionCache>
  version: number
}

export interface RetryOptions {
  maxRetries: number
  fallbackGenres?: string[]
  generateNewUrl?: boolean
}

export interface SyncOptions {
  syncToRedis: boolean
  userId: string | null
}
