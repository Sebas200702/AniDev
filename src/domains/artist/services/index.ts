import { ArtistRepository } from '@artist/repositories'

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
        throw new Error('Artist name is required')
      }

      return await ArtistRepository.getArtistInfo(artistName)
    } catch (error) {
      console.error('[ArtistService.getArtistByName] Error:', error)
      throw error
    }
  },
}
