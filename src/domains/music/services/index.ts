import { createContextLogger } from '@libs/pino'
import { MusicRepository } from '@music/repositories'
import type { AnimeSong } from '@music/types'
import { AppError, isAppError } from '@shared/errors'

const logger = createContextLogger('MusicService')

interface SearchMusicParams {
  filters: Record<string, any>
  countFilters: Record<string, any>
  page: number
  limit: number
}

/**
 * Music Service
 *
 * @description
 * Service layer for music-related operations. Handles business logic
 * for music search, filtering, and pagination.
 *
 * @features
 * - Music list search with filters
 * - Pagination support
 * - Error handling and logging
 */
export const MusicService = {
  /**
   * Search music with filters and pagination
   */
  async searchMusic({
    filters,
    countFilters,
    page,
    limit,
  }: SearchMusicParams): Promise<{ data: AnimeSong[]; totalCount: number }> {
    try {
      const [data, totalCount] = await Promise.all([
        MusicRepository.getMusicList(filters),
        MusicRepository.getMusicCount(countFilters),
      ])

      return {
        data,
        totalCount,
      }
    } catch (error) {
      logger.error('[MusicService.searchMusic] Error:', error)
      if (isAppError(error)) {
        throw error
      }

      throw AppError.database('Failed to search music', {
        filters,
        countFilters,
        page,
        limit,
        originalError: error,
      })
    }
  },

  async getMusicById(themeId: number): Promise<AnimeSong> {
    try {
      const data = await MusicRepository.getMusicInfo(themeId)
      return data
    } catch (error) {
      logger.error('[MusicService.getMusicById] Error:', error)
      if (isAppError(error)) {
        throw error
      }

      throw AppError.database('Failed to get music by id', {
        themeId,
        originalError: error,
      })
    }
  },

  async getMusicByAnimeId(filters: Record<string, any>): Promise<AnimeSong[]> {
    try {
      const data = await MusicRepository.getMusicByAnimeId(filters)
      return data
    } catch (error) {
      logger.error('[MusicService.getMusicByAnimeId] Error:', error)
      if (isAppError(error)) {
        throw error
      }

      throw AppError.database('Failed to get music by anime id', {
        filters,
        originalError: error,
      })
    }
  },

  async getMusicForSitemap(offset: number, limit: number = 5000) {
    try {
      return await MusicRepository.getMusicForSitemap(offset, limit)
    } catch (error) {
      logger.error('[MusicService.getMusicForSitemap] Error:', error)
      if (isAppError(error)) {
        throw error
      }

      throw AppError.database('Failed to get music for sitemap', {
        offset,
        limit,
        originalError: error,
      })
    }
  },
}
