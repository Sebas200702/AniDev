import { AnimeRepository } from '@anime/repositories'
import type { Anime, Formats } from '@anime/types'
import { createContextLogger } from '@libs/pino'
import { AppError, isAppError } from '@shared/errors'

const logger = createContextLogger('AnimeService')

export interface AnimeResult {
  anime?: Anime
  blocked?: boolean
  message?: string
}

export const AnimeService = {
  async getRandomAnime(
    parentalControl: boolean | null,
    userId?: string | null
  ) {
    try {
      const result = await AnimeRepository.getRandom(parentalControl, userId)

      if (!result) {
        return null
      }

      return result
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
  }: {
    format: Formats
    filters: Record<string, any>
    countFilters: Record<string, any>
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
          total: 0,
        }
      }

      return result
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
        anime: result,
      }
    } catch (error: unknown) {

      if (isAppError(error) && error.type === 'permission') {
        logger.info('Anime blocked by parental control', {
          animeId,
          error: error.message,
        })
        return {
          anime: undefined,
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
  async getStudios() {
    try {
      return await AnimeRepository.getUniqueStudios()
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
  async getAnimeBanner(animeId: number, limitCount: number = 8) {
    try {
      return await AnimeRepository.getAnimeBanner(animeId, limitCount)
    } catch (error : unknown) {
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
  async getAnimesForSitemap(offset: number, limit: number = 5000) {
    try {
      return await AnimeRepository.getAnimesForSitemap(offset, limit)
    } catch (error : unknown) {
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
  async getAnimeRelations(animeId: string) {
    try {
      return await AnimeRepository.getAnimeRelations(animeId)
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
  async getAnimesFull(filters: Record<string, any>) {
    try {
      return await AnimeRepository.getAnimesFull(filters)
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
