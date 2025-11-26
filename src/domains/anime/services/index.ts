import { AnimeRepository } from '@anime/repositories'
import type { Anime, Formats, RandomAnime } from '@anime/types'
import { createContextLogger } from '@libs/pino'
import { AppError, isAppError } from '@shared/errors'
import type { ApiResponse } from '@shared/types/api-response'

const logger = createContextLogger('AnimeService')

export interface AnimeResult {
  data?: Anime
  blocked?: boolean
  message?: string
}

export const AnimeService = {
  async getRandomAnime(
    parentalControl: boolean | null,
    userId?: string | null
  ): Promise<ApiResponse<RandomAnime | null>> {
    try {
      const result = await AnimeRepository.getRandom(parentalControl, userId)

      if (!result) {
        return { data: null }
      }

      return { data: result }
    } catch (error) {
      logger.error('[AnimeService.getRandomAnime] Error:', { error })
      // Re-throw AppError as-is, wrap unknown errors
      if (isAppError(error)) {
        throw error
      }
      throw AppError.database('Failed to fetch random anime', {
        originalError: error,
      })
    }
  },

  async searchAnime({
    format,
    filters,
    countFilters,
    page = 1,
    limit = 10,
  }: {
    format: Formats
    filters: Record<string, any>
    countFilters: Record<string, any>
    page?: number
    limit?: number
  }) {
    try {
      const result = await AnimeRepository.searchAnime({
        format,
        filters,
        countFilters,
      })

      if (!result.data || result.data.length === 0) {
        return {
          data: [],
          meta: {
            total_items: 0,
            current_page: page,
            last_page: 0,
          },
        }
      }

      return {
        data: result.data,
        meta: {
          total_items: result.total,
          current_page: page,
          last_page: Math.ceil(result.total / limit),
        },
      }
    } catch (error) {
      logger.error('[AnimeService.searchAnime] Error:', { error, format })
      if (isAppError(error)) {
        throw error
      }
      throw AppError.database('Failed to search anime', {
        originalError: error,
      })
    }
  },

  async getById(
    animeId: number,
    parentalControl: boolean = true
  ): Promise<AnimeResult> {
    try {
      const result = await AnimeRepository.getById(animeId, parentalControl)
      return {
        data: result,
        blocked: false,
        message: undefined,
      }
    } catch (error: unknown) {
      if (isAppError(error) && error.type === 'permission') {
        logger.info('Anime blocked by parental control', {
          animeId,
          error: error.message,
        })
        return {
          data: undefined,
          blocked: true,
          message: error.message,
        }
      }

      logger.error('[AnimeService.getById] Unexpected error:', {
        animeId,
        error,
      })
      throw error
    }
  },

  /**
   * Get unique anime studios
   */
  async getStudios(): Promise<ApiResponse<string[]>> {
    try {
      const data = await AnimeRepository.getUniqueStudios()
      return { data }
    } catch (error: unknown) {
      logger.error('[AnimeService.getStudios] Error:', { error })
      if (isAppError(error)) {
        throw error
      }
      throw AppError.database('Failed to fetch studios', {
        originalError: error,
      })
    }
  },

  /**
   * Get anime banner images
   */
  async getAnimeBanner(
    animeId: number,
    limitCount: number = 8
  ): Promise<ApiResponse<any[]>> {
    try {
      const data = await AnimeRepository.getAnimeBanner(animeId, limitCount)
      return { data }
    } catch (error: unknown) {
      logger.error('[AnimeService.getAnimeBanner] Error:', { error, animeId })
      if (isAppError(error)) {
        throw error
      }
      throw AppError.database('Failed to fetch anime banner', {
        originalError: error,
      })
    }
  },

  /**
   * Gets animes for sitemap generation
   *
   * @param offset - Starting position for pagination
   * @param limit - Number of items to fetch (default 5000)
   * @returns List of animes with slug, updated_at, and score
   */
  async getAnimesForSitemap(
    offset: number,
    limit: number = 5000
  ): Promise<ApiResponse<any[]>> {
    try {
      const data = await AnimeRepository.getAnimesForSitemap(offset, limit)
      return { data }
    } catch (error: unknown) {
      logger.error('[AnimeService.getAnimesForSitemap] Error:', {
        error,
        offset,
        limit,
      })
      if (isAppError(error)) {
        throw error
      }
      throw AppError.database('Failed to fetch animes for sitemap', {
        originalError: error,
      })
    }
  },

  /**
   * Get related anime by anime ID
   *
   * @param animeId - The anime MAL ID
   * @returns List of related animes
   */
  async getAnimeRelations(animeId: string): Promise<ApiResponse<any[]>> {
    try {
      const data = await AnimeRepository.getAnimeRelations(animeId)
      return { data }
    } catch (error) {
      logger.error('[AnimeService.getAnimeRelations] Error:', {
        error,
        animeId,
      })
      if (isAppError(error)) {
        throw error
      }
      throw AppError.database('Failed to fetch anime relations', {
        originalError: error,
      })
    }
  },

  /**
   * Get full anime data with filters
   *
   * @param filters - Search filters to apply
   * @returns Full anime data
   */
  async getAnimesFull(
    filters: Record<string, any>
  ): Promise<ApiResponse<any[]>> {
    try {
      const data = await AnimeRepository.getAnimesFull(filters)
      return { data }
    } catch (error) {
      logger.error('[AnimeService.getAnimesFull] Error:', { error, filters })
      if (isAppError(error)) {
        throw error
      }
      throw AppError.database('Failed to fetch animes', {
        originalError: error,
      })
    }
  },
}
