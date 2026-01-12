import { AppError } from '@shared/errors'
import type { ApiResponse } from '@shared/types/api-response'
import { EpisodeService } from '@watch/services'
import type { AnimeEpisode } from '@watch/types'

export const EpisodeController = {
  validateRequest(url: URL) {
    const id = url.searchParams.get('id')
    const pageParam = url.searchParams.get('page')
    const page = pageParam ? Number.parseInt(pageParam, 10) : 1

    if (!id) {
      throw AppError.validation('Anime ID is required')
    }

    if (page < 1) {
      throw AppError.validation('Page number must be greater than 0')
    }

    return { id, page }
  },

  async handleGetEpisodes(url: URL): Promise<ApiResponse<AnimeEpisode[]>> {
    const { id, page } = this.validateRequest(url)

    const data = await EpisodeService.getEpisodes({
      animeId: id,
      page,
    })
    return {
      data,
    }
  },

  validateEpisodeRequest(url: URL): { mal_id: string; episodeNumber: string } {
    const mal_id = url.searchParams.get('mal_id')
    const ep = url.searchParams.get('ep')

    if (!mal_id) {
      throw AppError.validation('Missing mal_id parameter')
    }

    if (!ep) {
      throw AppError.validation('Missing episode number')
    }

   

    return { mal_id, episodeNumber: ep }
  },

  async handleGetEpisode(url: URL): Promise<ApiResponse<AnimeEpisode>> {
    const { mal_id, episodeNumber } = this.validateEpisodeRequest(url)
    const episode = await EpisodeService.getEpisodeById(mal_id, episodeNumber)
    return {
      data: episode,
    }
  },
}
