import { AppError, isAppError } from '@shared/errors'
import { EpisodeRepository } from '@watch/repositories'
import type { AnimeEpisode } from '@watch/types'

interface GetEpisodesParams {
  animeId: string
  page: number
}

export const EpisodeService = {
  /**
   * Get episodes for an anime with pagination
   */
  async getEpisodes({
    animeId,
    page,
  }: GetEpisodesParams): Promise<AnimeEpisode[]> {
    try {
      const data = await EpisodeRepository.getEpisodesByAnimeId(animeId, page)

      if (!data || data.length === 0) {
        throw AppError.notFound('No episodes found', { animeId, page })
      }

      return data
    } catch (error) {
      console.error('[EpisodeService.getEpisodes] Error:', error)

      if (isAppError(error)) {
        throw error
      }

      throw AppError.database('Failed to get episodes', {
        animeId,
        page,
        originalError: error,
      })
    }
  },

  /**
   * Get episode by anime_id and episode_id
   */
  async getEpisodeById(
    slugOrAnimeId: string,
    episodeId?: string
  ): Promise<AnimeEpisode> {
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
          throw AppError.validation('Invalid slug format', {
            slug: slugOrAnimeId,
          })
        }
        // Use .at(-1) to get the last element (preferred over parts[parts.length - 1])
        const lastPart = parts.at(-1)
        if (!lastPart) {
          throw AppError.validation('Invalid slug format', {
            slug: slugOrAnimeId,
          })
        }
        animeId = lastPart // Last part is the ID
        epId = slugOrAnimeId // This shouldn't happen, but keep for compatibility
      }

      const data = await EpisodeRepository.getEpisodeById(animeId, epId)
      return data
    } catch (error) {
      console.error('[EpisodeService.getEpisodeById] Error:', error)
      if (isAppError(error)) {
        throw error
      }

      throw AppError.database('Failed to get episode by id', {
        slugOrAnimeId,
        episodeId,
        originalError: error,
      })
    }
  },
}
