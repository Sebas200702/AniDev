import { EpisodeService } from '@watch/services'

/**
 * Episode Controller
 *
 * @description
 * Controller layer for episode endpoints. Handles request parsing,
 * validation, and response formatting.
 */
export const EpisodeController = {
  /**
   * Validate and parse episode request parameters
   */
  validateRequest(url: URL) {
    const id = url.searchParams.get('id')
    const pageParam = url.searchParams.get('page')
    const page = pageParam ? Number.parseInt(pageParam, 10) : 1

    if (!id) {
      throw new Error('Anime ID is required')
    }

    if (page < 1) {
      throw new Error('Page number must be greater than 0')
    }

    return { id, page }
  },

  /**
   * Handle get episodes request
   */
  async handleGetEpisodes(url: URL) {
    const { id, page } = this.validateRequest(url)

    return await EpisodeService.getEpisodes({
      animeId: id,
      page,
    })
  },

  /**
   * Validate and parse episode detail request
   */
  validateEpisodeRequest(url: URL): { slug: string; episodeNumber: string } {
    const slug = url.searchParams.get('slug')
    const ep = url.searchParams.get('ep')

    if (!slug) {
      throw new Error('Missing slug parameter')
    }

    if (!ep) {
      throw new Error('Missing episode number')
    }

    // Validate slug format (should contain underscore)
    if (!slug.includes('_')) {
      throw new Error('Invalid slug format')
    }

    return { slug, episodeNumber: ep }
  },

  /**
   * Handle get episode detail request
   */
  async handleGetEpisode(url: URL) {
    const { slug, episodeNumber } = this.validateEpisodeRequest(url)
    return await EpisodeService.getEpisodeById(slug, episodeNumber)
  },
}
