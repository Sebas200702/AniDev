import { EpisodeRepository } from '@watch/repositories'

interface GetEpisodesParams {
  animeId: string
  page: number
}

/**
 * Episode Service
 *
 * @description
 * Service layer for episode-related operations. Handles business logic
 * for episode retrieval and pagination.
 *
 * @features
 * - Episode list retrieval with pagination
 * - Episode count tracking
 * - Error handling and logging
 */
export const EpisodeService = {
  /**
   * Get episodes for an anime with pagination
   */
  async getEpisodes({ animeId, page }: GetEpisodesParams) {
    try {
      const data = await EpisodeRepository.getEpisodesByAnimeId(animeId, page)

      if (!data || data.length === 0) {
        throw new Error('No episodes found')
      }

      return data
    } catch (error) {
      console.error('[EpisodeService.getEpisodes] Error:', error)
      throw error
    }
  },

  /**
   * Get episode by anime_id and episode_id
   */
  async getEpisodeById(slugOrAnimeId: string, episodeId?: string) {
    try {
      let animeId: string
      let epId: string

      // If episodeId is provided, slugOrAnimeId is already the anime ID
      if (episodeId) {
        animeId = slugOrAnimeId
        epId = episodeId
      } else {
        // Otherwise, we need to parse the slug
        // Slug format: "title_id"
        const parts = slugOrAnimeId.split('_')
        if (parts.length < 2) {
          throw new Error('Invalid slug format')
        }
        // Use .at(-1) to get the last element (preferred over parts[parts.length - 1])
        const lastPart = parts.at(-1)
        if (!lastPart) {
          throw new Error('Invalid slug format')
        }
        animeId = lastPart // Last part is the ID
        epId = slugOrAnimeId // This shouldn't happen, but keep for compatibility
      }

      return await EpisodeRepository.getEpisodeById(animeId, epId)
    } catch (error) {
      console.error('[EpisodeService.getEpisodeById] Error:', error)
      throw error
    }
  },
}
