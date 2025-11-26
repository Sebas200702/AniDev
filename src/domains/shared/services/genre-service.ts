import { createContextLogger } from '@libs/pino'
import { GenreRepository } from '@shared/repositories/genre-repository'

const logger = createContextLogger('GenreService')

/**
 * Genre Service
 *
 * @description
 * Service layer for genre-related operations. Handles business logic
 * for fetching genres data.
 *
 * @features
 * - Get all genres for sitemap generation
 * - Error handling and logging
 */
export const GenreService = {
  /**
   * Get all genres for sitemap generation
   */
  async getAllGenresForSitemap() {
    try {
      return await GenreRepository.getAllGenres()
    } catch (error) {
      logger.error('[GenreService.getAllGenresForSitemap] Error:', error)
      throw error
    }
  },
}
