import { AnimeService } from '@anime/services'
import type { Formats } from '@anime/types'
import { CacheService } from '@cache/services'
import { getCachedOrFetch } from '@cache/utils'
import { AppError } from '@shared/errors'
import { MetadataService } from '@shared/services/metadata-service'
import { Filters } from '@shared/types'
import { getFilters } from '@utils/get-filters-of-search-params'

export const AnimeController = {
  validateAnimeId(url: URL): string {
    const animeId = url.searchParams.get('animeId')

    if (!animeId) {
      throw AppError.validation('Anime ID is required')
    }

    return animeId
  },

  validateNumericId(id: string | null): number {
    if (!id) {
      throw AppError.validation('ID is required')
    }

    const idResult = Number.parseInt(id)

    if (Number.isNaN(idResult) || idResult <= 0) {
      throw AppError.validation('Invalid anime ID', { providedId: id })
    }

    return idResult
  },

  async handleGetRandomAnime(url: URL) {
    const parentalControl = url.searchParams.get('parental_control') !== 'false'
    const userId = url.searchParams.get('user_id')

    return await AnimeService.getRandomAnime(parentalControl, userId)
  },

  async handleSearchAnime(url: URL) {
    const format = (url.searchParams.get('format') ?? 'anime-card') as Formats
    const limit = Number.parseInt(url.searchParams.get('limit_count') ?? '10')
    const page = Number.parseInt(url.searchParams.get('page_number') ?? '1')

    const cacheKey = CacheService.generateKey(
      'anime-search',
      url.searchParams.toString()
    )

    const CountFilters = Object.keys(Filters).filter(
      (key) =>
        key !== 'limit_count' && key !== 'page_number' && key !== 'order_by'
    )

    const filters = getFilters(Object.values(Filters), url, true)
    const countFilters = getFilters(CountFilters, url, false)

    const { data, total } = await getCachedOrFetch(cacheKey, () =>
      AnimeService.searchAnime({
        format,
        filters,
        countFilters,
      })
    )

    return {
      total_items: total,
      data,
      current_page: page,
      last_page: Math.ceil(total / limit),
    }
  },

  async handleGetAnimeBanner(url: URL) {
    const animeId = Number.parseInt(url.searchParams.get('anime_id') ?? '')
    const limitCount = Number.parseInt(
      url.searchParams.get('limit_count') ?? '8'
    )
    const cacheKey = CacheService.generateKey(
      'anime-banner',
      url.searchParams.toString()
    )

    return await getCachedOrFetch(cacheKey, () =>
      AnimeService.getAnimeBanner(animeId, limitCount)
    )
  },

  async handleGetAnimeById(url: URL) {
    const id = url.searchParams.get('id')
    const parentalControlParam = url.searchParams.get('parentalControl')
    const parentalControl = parentalControlParam !== 'false'

    const animeId = this.validateNumericId(id)
    const cacheKey = CacheService.generateKey(
      'anime-by-id',
      url.searchParams.toString()
    )

    return await getCachedOrFetch(cacheKey, () =>
      AnimeService.getById(animeId, parentalControl)
    )
  },

  async handleGetAnimeRelations(url: URL) {
    const cacheKey = CacheService.generateKey(
      'anime-relations',
      url.searchParams.toString()
    )
    const animeId = this.validateAnimeId(url)
    return await getCachedOrFetch(cacheKey, () =>
      AnimeService.getAnimeRelations(animeId)
    )
  },

  async handleGetAnimesFull(url: URL) {
    const filters = getFilters(Object.values(Filters), url)
    const cacheKey = CacheService.generateKey(
      'animes-full',
      url.searchParams.toString()
    )

    return await getCachedOrFetch(cacheKey, () =>
      AnimeService.getAnimesFull(filters)
    )
  },

  async handleGetAnimeMetadata(url: URL) {
    const id = url.searchParams.get('id')

    if (!id) {
      throw AppError.validation('Anime ID not provided')
    }

    const animeId = Number(id)
    if (Number.isNaN(animeId)) {
      throw AppError.validation('Invalid anime ID', { providedId: id })
    }

    const cacheKey = CacheService.generateKey(
      'anime-metadata',
      url.searchParams.toString()
    )

    return await getCachedOrFetch(cacheKey, () =>
      MetadataService.getAnimeMetadata(animeId)
    )
  },
}
