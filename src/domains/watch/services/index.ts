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
    mal_id: string,
    episodeId: string
  ): Promise<AnimeEpisode> {
    try {
    
      const data = await EpisodeRepository.getEpisodeById(mal_id, episodeId)
      return data
    } catch (error) {
      console.error('[EpisodeService.getEpisodeById] Error:', error)
      if (isAppError(error)) {
        throw error
      }

      throw AppError.database('Failed to get episode by id', {
        mal_id,
        episodeId,
        originalError: error,
      })
    }
  },
}
