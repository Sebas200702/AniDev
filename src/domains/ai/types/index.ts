import type { AnimeRecommendation, JikanRecommendationsRaw } from '@anime/types'

export interface RecommendationContext {
  type:
    | 'general'
    | 'current_search'
    | 'currently_watching'
    | 'mood_based'
    | 'similar_to'
    | 'seasonal'
    | 'marathon'
    | 'quick_watch'
  data: {
    searchQuery?: string
    currentAnime?: { title: string; mal_id: number | null }
    mood?: string
    referenceAnime?: string
    season?: string
    timeAvailable?: string
    preferredLength?: string
  }
  count?: number
  focus?: string
  parentalControl: boolean
}

export interface RecommendationContextData {
  searchQuery?: string
  currentAnime?: string
  mood?: string
  referenceAnime?: string
  season?: string
  timeAvailable?: string
}

// RecommendationContextWithParentalControl is now just an alias for RecommendationContext
export type RecommendationContextWithParentalControl = RecommendationContext

export interface ModelContentPart {
  text?: string
  functionCall?: {
    name?: string
    args?: Record<string, any>
  }
}

export interface ModelCandidateContent {
  parts?: ModelContentPart[]
}

export interface ModelCandidate {
  content?: ModelCandidateContent
  [key: string]: unknown
}

export interface ModelGenerateContentResponse {
  response?: {
    candidates?: ModelCandidate[]
    [key: string]: unknown
  }
  [key: string]: unknown
}

export type FunctionToolArgs = Record<string, unknown>
export type FunctionToolMalIds = string[]

export type FetchRecommendationsFn = (
  malIds: string[],
  targetCount: number,
  currentAnime?: string | undefined,
  jikanRecommendations?: JikanRecommendationsRaw | null
) => Promise<AnimeRecommendation[]>

export type CreateJikanFallbackFn = (
  jikan: JikanRecommendationsRaw | null,
  count: number,
  animeId: string | undefined,
  parentalControl: boolean
) => Promise<AnimeRecommendation[]>

export type SafeRedisOperationFn = <T = unknown>(
  operation: (client: any) => Promise<T> | T
) => Promise<T>

export interface RecommendationsDebugInfo {
  responseType: string
  hasText: boolean
  textLength: number
  [key: string]: unknown
}

export interface RecommendationsApiResponse {
  data: AnimeRecommendation[]
  context: RecommendationContext
  totalRecommendations: number
  wasRetried?: boolean
  quotaExhausted?: boolean
  fallbackUsed?:
    | 'quota-exhausted'
    | 'api-error'
    | 'text-parsing'
    | 'jikan'
    | null
  jikanRecommendations?: {
    count: number
    titles: string[]
    basedOn: string
    isFromFavorites: boolean
    favoriteTitle?: string
  } | null
  debugInfo?: RecommendationsDebugInfo
  wasRetriedByModel?: boolean
}

export interface BuildResponseOptions {
  data: AnimeRecommendation[]
  context: RecommendationContext
  wasRetried?: boolean
  quotaExhausted?: boolean
  fallbackUsed?:
    | 'quota-exhausted'
    | 'api-error'
    | 'text-parsing'
    | 'jikan'
    | null
  jikan?: JikanRecommendationsRaw | null
  animeForJikan: string | undefined
  isFromFavorites?: boolean
  favoriteTitle: string | undefined
}

export interface GeneratePromptProps {
  userProfile: any
  calculatedAge: number | null
  context: RecommendationContext
  jikanRecommendations?: {
    mal_ids: number[]
    titles: string[]
    error?: string
  } | null
  favoriteAnime?: string
}
