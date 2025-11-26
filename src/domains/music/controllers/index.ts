import { MusicService } from '@music/services'
import { MusicFilters } from '@music/types'
import { AppError } from '@shared/errors'
import { getFilters } from '@utils/get-filters-of-search-params'

/**
 * Music Controller
 *
 * @description
 * Controller layer for music endpoints. Handles request parsing,
 * validation, and response formatting.
 */
export const MusicController = {
  /**
   * Parse search parameters for music search
   */
  parseSearchParams(url: URL) {
    const limit = Number.parseInt(url.searchParams.get('limit_count') ?? '10')
    const page = Number.parseInt(url.searchParams.get('page_number') ?? '1')

    const filters = getFilters(Object.values(MusicFilters), url, true)

    const CountFilters = Object.keys(MusicFilters).filter(
      (key) =>
        key !== 'limit_count' && key !== 'page_number' && key !== 'order_by'
    )
    const countFilters = getFilters(CountFilters, url, false)

    return { filters, countFilters, page, limit }
  },

  /**
   * Handle music search request
   */
  async handleSearch(url: URL) {
    const { filters, countFilters, page, limit } = this.parseSearchParams(url)

    return await MusicService.searchMusic({
      filters,
      countFilters,
      page,
      limit,
    })
  },

  /**
   * Validate and parse theme ID from request
   */
  validateThemeId(url: URL): number {
    const themeId = Number.parseInt(url.searchParams.get('themeId') ?? '')

    if (!themeId || Number.isNaN(themeId)) {
      throw AppError.validation('Theme ID is required')
    }

    return themeId
  },

  /**
   * Handle get music info request
   */
  async handleGetMusicInfo(url: URL) {
    const themeId = this.validateThemeId(url)
    return await MusicService.getMusicById(themeId)
  },

  /**
   * Validate and parse anime ID from request
   */
  validateAnimeId(url: URL): number {
    const animeId = Number.parseInt(url.searchParams.get('animeId') ?? '')

    if (!animeId || Number.isNaN(animeId)) {
      throw AppError.validation('Anime ID is required')
    }

    return animeId
  },

  /**
   * Handle get anime music request
   */
  async handleGetAnimeMusic(url: URL) {
    const animeId = this.validateAnimeId(url)
    return await MusicService.getMusicByAnimeId(animeId)
  },
}
