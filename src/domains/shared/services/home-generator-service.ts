import { aiService } from '@ai/services'
import { CacheService } from '@cache/services'
import { TtlValues } from '@cache/types'
import { RecommendationsService } from '@recommendations/services'
import {
  HOME_CACHE_CONFIG,
  STATIC_SECTIONS,
} from '@shared/constants/home-constants'
import type {
  AIResponse,
  AISuggestion,
  HomeSection,
  ProcessedSuggestion,
} from '@shared/types/home-types'
import { HomeUrlBuilder } from './home-url-builder'

const SECTION_MAPPING = {
  'collection-1': 0,
  'banner-1': 1,
  'slider-1': 2,
  'slider-2': 3,
  'banner-2': 4,
  'slider-3': 5,
  'collection-2': 6,
  'banner-3': 7,
  'slider-4': 8,
} as const

export const HomeGeneratorService = {

  buildHomeSections: async (userId: string | null): Promise<HomeSection[]> => {
    const cacheKey = `${HOME_CACHE_CONFIG.REDIS_KEY_PREFIX}${userId ?? 'guest'}`
    const cached = await CacheService.get<HomeSection[]>(cacheKey)

    if (cached) return cached

    const suggestions = userId
      ? await HomeGeneratorService.getAISuggestions(userId)
      : []
    const sections = STATIC_SECTIONS.map((section) => {
      const aiIndex =
        SECTION_MAPPING[section.id as keyof typeof SECTION_MAPPING]
      const ai = suggestions[aiIndex]

      return ai
        ? { ...section, url: ai.url, urls: ai.urls, title: ai.title }
        : section
    })

    await CacheService.set(cacheKey, sections, TtlValues.DAY)
    return sections
  },

  getAISuggestions: async (userId: string): Promise<ProcessedSuggestion[]> => {
    try {
      const { userProfile, calculatedAge } =
        await RecommendationsService.getUserPreferences(userId)
      if (!userProfile) return []

      const prompt = HomeGeneratorService.buildPrompt(
        userProfile,
        calculatedAge ?? 18
      )
      const response = await aiService.generateJSON<AIResponse>(prompt)

      return (response?.sections || []).map((s) => ({
        url: HomeGeneratorService.buildUrl(s),
        urls: s.values?.map((g) => HomeUrlBuilder.buildGenreUrl(g, 24)),
        title: s.title,
      }))
    } catch {
      return []
    }
  },


  buildUrl: (s: AISuggestion): string => {
    if (s.value === 'Movie') return HomeUrlBuilder.buildTypeUrl('Movie')
    if (s.type === 'banner') return HomeUrlBuilder.buildGenreUrl(s.value, 1)
    return HomeUrlBuilder.buildGenreUrl(s.value, 24)
  },


  buildPrompt: (profile: { favorite_genres?: string[] }, age: number) => `
Analyze this anime fan profile and generate 9 personalized sections in EXACT order:
1. collection (4 genres), 2. banner (1 genre), 3. slider (action-like genre), 4. slider ("Movie"),
5. banner (1 genre), 6. slider (comedy-like genre), 7. collection (4 genres), 8. banner (1 genre), 9. slider (drama-like genre)

Profile: Age ${age}, Genres: ${profile.favorite_genres?.join(', ') || 'Various'}

Response JSON:
{
  "sections": [
    {"type": "collection", "value": "Fantasy", "values": ["Fantasy", "Adventure", "Supernatural", "Magic"], "title": "Fantasy Worlds"},
    {"type": "banner", "value": "Sci-Fi", "title": "Featured: Sci-Fi"},
    {"type": "slider", "value": "Action", "title": "Action Adventures"},
    {"type": "slider", "value": "Movie", "title": "Top Movies"},
    {"type": "banner", "value": "Romance", "title": "Featured: Romance"},
    {"type": "slider", "value": "Comedy", "title": "Laugh Out Loud"},
    {"type": "collection", "value": "Mystery", "values": ["Mystery", "Thriller", "Detective", "Psychological"], "title": "Mystery Zone"},
    {"type": "banner", "value": "Horror", "title": "Featured: Horror"},
    {"type": "slider", "value": "Drama", "title": "Emotional Stories"}
  ]
}`,

  invalidateCache: async (userId: string | null) => {
    await CacheService.delete(
      `${HOME_CACHE_CONFIG.REDIS_KEY_PREFIX}${userId ?? 'guest'}`
    )
  },
}
