import { ArtistRepository } from '@artist/repositories'
import { createContextLogger } from '@libs/pino'
import { AppError, isAppError } from '@shared/errors'

const logger = createContextLogger('ArtistService')

/**
 * Artist Service
 *
 * @description
 * Service layer for artist-related operations. Handles business logic
 * for artist information retrieval.
 *
 * @features
 * - Artist info retrieval
 * - Error handling and logging
 */
export const ArtistService = {
  /**
   * Get artist information by name
   */
  async getArtistByName(artistName: string) {
    try {
      if (!artistName || artistName.trim() === '') {
        throw AppError.validation('Artist name is required')
      }

      return await ArtistRepository.getArtistInfo(artistName)
    } catch (error) {
      logger.error('[ArtistService.getArtistByName] Error:', { error })

      if (isAppError(error)) {
        throw error
      }

      throw AppError.database('Unexpected error fetching artist', {
        originalError: error,
      })
    }
  },
}
