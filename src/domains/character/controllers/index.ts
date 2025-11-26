import { CacheService } from '@cache/services'
import { getCachedOrFetch } from '@cache/utils'
import { CharacterService } from '@character/services'
import {
  type Character,
  type CharacterDetails,
  CharacterFilters,
} from '@character/types'
import { createContextLogger } from '@libs/pino'
import { AppError } from '@shared/errors'
import type { ApiResponse } from '@shared/types/api-response'
import { getFilters } from '@utils/get-filters-of-search-params'

const logger = createContextLogger('CharacterController')

export const CharacterController = {
  parseSearchParams(url: URL) {
    const limit = Number.parseInt(url.searchParams.get('limit_count') ?? '20')
    const page = Number.parseInt(url.searchParams.get('page_number') ?? '1')
    const filters = getFilters(Object.values(CharacterFilters), url, false)

    const { role_filter, search_query, language_filter } = getFilters(
      ['role_filter', 'search_query', 'language_filter'],
      url
    )

    const countFilters = { role_filter, search_query, language_filter }

    return { filters, countFilters, page, limit }
  },

  async handleSearch(url: URL): Promise<ApiResponse<any[]>> {
    const { filters, countFilters, page, limit } = this.parseSearchParams(url)

    return await CharacterService.searchCharacters({
      filters,
      countFilters,
      page,
      limit,
    })
  },

  validateImageParams(url: URL): { animeId: number; limitCount: number } {
    const animeId = Number.parseInt(url.searchParams.get('anime_id') ?? '')
    const limitCount = Number.parseInt(
      url.searchParams.get('limit_count') ?? '10'
    )

    if (!animeId || Number.isNaN(animeId)) {
      throw AppError.validation('anime_id is required')
    }

    return { animeId, limitCount }
  },

  async handleGetCharacterImages(url: URL): Promise<ApiResponse<any[]>> {
    const { animeId, limitCount } = this.validateImageParams(url)
    return await CharacterService.getCharacterImages(animeId, limitCount)
  },

  validateSlug(slug: string | null): number {
    if (!slug) {
      logger.error('[CharacterController.validateSlug] Slug is required')
      throw AppError.validation('Slug is required')
    }

    const lastUnderscoreIndex = slug.lastIndexOf('_')
    if (lastUnderscoreIndex === -1) {
      logger.error('[CharacterController.validateSlug] Invalid slug format', {
        slug,
      })
      throw AppError.validation('Invalid slug format', { slug })
    }

    const idStr = slug.slice(lastUnderscoreIndex + 1)
    const id = Number.parseInt(idStr)

    if (Number.isNaN(id) || id <= 0) {
      throw AppError.validation('Invalid character ID', { idStr })
    }

    return id
  },

  async handleGetCharacter(url: URL): Promise<ApiResponse<CharacterDetails>> {
    const slug = url.searchParams.get('slug')
    const id = this.validateSlug(slug)
    const cacheKey = CacheService.generateKey('character-detail', id.toString())

    return await getCachedOrFetch(cacheKey, () =>
      CharacterService.getCharacterById(id)
    )
  },

  validateAnimeCharactersParams(url: URL): {
    animeId: string
    language: string
  } {
    const animeId = url.searchParams.get('animeId')
    const language = url.searchParams.get('language')

    if (!animeId || !language) {
      throw AppError.validation('Anime ID and language are required')
    }

    return { animeId, language }
  },

  async handleGetAnimeCharacters(url: URL): Promise<ApiResponse<Character[]>> {
    const { animeId, language } = this.validateAnimeCharactersParams(url)
    const cacheKey = CacheService.generateKey(
      'anime-characters',
      `${animeId}-${language}`
    )

    return await getCachedOrFetch(cacheKey, () =>
      CharacterService.getAnimeCharacters(animeId, language)
    )
  },
}
