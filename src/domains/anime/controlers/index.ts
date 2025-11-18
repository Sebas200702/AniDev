import { AnimeService } from '@anime/services'
import { MetadataService } from '@shared/services/metadata-service'
import { Filters } from '@shared/types'
import { getFilters } from '@utils/get-filters-of-search-params'

/**
 * Anime Controller
 *
 * @description
 * Controller layer for anime endpoints. Handles request parsing,
 * validation, and response formatting.
 */
export const AnimeController = {
  /**
   * Validate anime ID parameter
   */
  validateAnimeId(url: URL): string {
    const animeId = url.searchParams.get('animeId')

    if (!animeId) {
      throw new Error('Anime ID is required')
    }

    return animeId
  },

  /**
   * Validate numeric ID parameter
   */
  validateNumericId(id: string | null): number {
    if (!id) {
      throw new Error('ID is required')
    }

    const idResult = Number.parseInt(id)

    if (Number.isNaN(idResult) || idResult <= 0) {
      throw new Error('Invalid anime ID')
    }

    return idResult
  },

  /**
   * Handle get random anime request
   */
  async handleGetRandomAnime(url: URL) {
    const parentalControl = url.searchParams.get('parental_control') !== 'false'
    const userId = url.searchParams.get('user_id')

    const result = await AnimeService.getRandomAnime(parentalControl, userId)

    if (!result) {
      throw new Error('No se encontró un anime aleatorio.')
    }

    return result
  },

  /**
   * Handle search anime request
   */
  async handleSearchAnime(url: URL) {
    const format = url.searchParams.get('format') ?? 'anime-card'
    const limit = Number.parseInt(url.searchParams.get('limit_count') ?? '10')
    const page = Number.parseInt(url.searchParams.get('page_number') ?? '1')

    const CountFilters = Object.keys(Filters).filter(
      (key) =>
        key !== 'limit_count' && key !== 'page_number' && key !== 'order_by'
    )

    const filters = getFilters(Object.values(Filters), url, true)
    const countFilters = getFilters(CountFilters, url, false)

    const { data, total } = await AnimeService.searchAnime({
      format,
      filters,
      countFilters,
    })

    if (!data || data.length === 0) {
      throw new Error('No se encontraron animes.')
    }

    return {
      total_items: total,
      data,
      current_page: page,
      last_page: Math.ceil(total / limit),
    }
  },

  /**
   * Handle get anime banner request
   */
  async handleGetAnimeBanner(url: URL) {
    const animeId = Number.parseInt(url.searchParams.get('anime_id') ?? '')
    const limitCount = Number.parseInt(
      url.searchParams.get('limit_count') ?? '8'
    )

    if (!animeId || Number.isNaN(animeId)) {
      throw new Error('anime_id is required')
    }

    return await AnimeService.getAnimeBanner(animeId, limitCount)
  },

  /**
   * Handle get anime by ID request
   */
  async handleGetAnimeById(url: URL) {
    const id = url.searchParams.get('id')
    const parentalControlParam = url.searchParams.get('parentalControl')
    const parentalControl = parentalControlParam !== 'false'

    const animeId = this.validateNumericId(id)

    const result = await AnimeService.getById(animeId, parentalControl)

    // Anime bloqueado por control parental
    if (result.blocked) {
      return {
        blocked: true,
        message: result.message,
      }
    }

    // Anime no encontrado
    if (!result.anime) {
      return {
        notFound: true,
      }
    }

    return { data: result.anime }
  },

  /**
   * Handle get anime relations request
   */
  async handleGetAnimeRelations(url: URL) {
    const animeId = this.validateAnimeId(url)
    return await AnimeService.getAnimeRelations(animeId)
  },

  /**
   * Handle get animes full request
   */
  async handleGetAnimesFull(url: URL) {
    const filters = getFilters(Object.values(Filters), url)
    return await AnimeService.getAnimesFull(filters)
  },

  /**
   * Handle get anime metadata request
   */
  async handleGetAnimeMetadata(url: URL) {
    const id = url.searchParams.get('id')

    if (!id) {
      throw new Error('Anime ID not provided')
    }

    const animeId = Number(id)
    if (Number.isNaN(animeId)) {
      throw new TypeError('Invalid anime ID')
    }

    return await MetadataService.getAnimeMetadata(animeId)
  },
}
