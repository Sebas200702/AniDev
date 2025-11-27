import { ArtistService } from '@artist/services'
import type { ArtistInfo } from '@artist/types'
import { AppError } from '@shared/errors'
import type { ApiResponse } from '@shared/types/api-response'
import { normalizeString } from '@utils/normalize-string'

/**
 * Artist Controller
 *
 * @description
 * Controller layer for artist endpoints. Handles request parsing
 * and validation.
 */
export const ArtistController = {
  /**
   * Validate and normalize artist name from URL
   */
  validateArtistName(url: URL): string {
    const artistName = url.searchParams.get('artistName')

    if (!artistName) {
      throw AppError.validation('Artist name is required')
    }

    return normalizeString(artistName, false, true, true)
  },

  /**
   * Handle get artist info request
   */
  async handleGetArtistInfo(url: URL): Promise<ApiResponse<ArtistInfo>> {
    const artistName = this.validateArtistName(url)
    const data = await ArtistService.getArtistByName(artistName)
    return {
      data,
    }
  },
}
