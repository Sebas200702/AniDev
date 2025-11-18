import { CharacterService } from '@character/services'
import { CharacterFilters } from '@character/types'
import { getFilters } from '@utils/get-filters-of-search-params'

/**
 * Character Controller
 *
 * @description
 * Controller layer for character endpoints. Handles request parsing,
 * validation, and response formatting.
 */
export const CharacterController = {
  /**
   * Parse search parameters for character search
   */
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

  /**
   * Handle character search request
   */
  async handleSearch(url: URL) {
    const { filters, countFilters, page, limit } = this.parseSearchParams(url)

    return await CharacterService.searchCharacters({
      filters,
      countFilters,
      page,
      limit,
    })
  },

  /**
   * Validate and parse anime ID and limit count
   */
  validateImageParams(url: URL): { animeId: number; limitCount: number } {
    const animeId = Number.parseInt(url.searchParams.get('anime_id') ?? '')
    const limitCount = Number.parseInt(
      url.searchParams.get('limit_count') ?? '10'
    )

    if (!animeId || Number.isNaN(animeId)) {
      throw new Error('anime_id is required')
    }

    return { animeId, limitCount }
  },

  /**
   * Handle get character images request
   */
  async handleGetCharacterImages(url: URL) {
    const { animeId, limitCount } = this.validateImageParams(url)
    return await CharacterService.getCharacterImages(animeId, limitCount)
  },

  /**
   * Validate character slug
   */
  validateSlug(slug: string | null): number {
    if (!slug) {
      throw new Error('Slug is required')
    }

    const lastUnderscoreIndex = slug.lastIndexOf('_')
    if (lastUnderscoreIndex === -1) {
      throw new Error('Invalid slug format')
    }

    const idStr = slug.slice(lastUnderscoreIndex + 1)
    const id = Number.parseInt(idStr)

    if (Number.isNaN(id) || id <= 0) {
      throw new Error('Invalid character ID')
    }

    return id
  },

  /**
   * Handle get character request
   */
  async handleGetCharacter(url: URL) {
    const slug = url.searchParams.get('slug')
    const id = this.validateSlug(slug)
    return await CharacterService.getCharacterDetails(id)
  },

  /**
   * Validate anime characters request
   */
  validateAnimeCharactersParams(url: URL): {
    animeId: string
    language: string
  } {
    const animeId = url.searchParams.get('animeId')
    const language = url.searchParams.get('language')

    if (!animeId || !language) {
      throw new Error('Anime ID and language are required')
    }

    return { animeId, language }
  },

  /**
   * Handle get anime characters request
   */
  async handleGetAnimeCharacters(url: URL) {
    const { animeId, language } = this.validateAnimeCharactersParams(url)
    return await CharacterService.getAnimeCharacters(animeId, language)
  },
}
