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

  validateEpisodeRequest(url: URL): { slug: string; episodeNumber: string } {
    const slug = url.searchParams.get('slug')
    const ep = url.searchParams.get('ep')

    if (!slug) {
      throw AppError.validation('Missing slug parameter')
    }

    if (!ep) {
      throw AppError.validation('Missing episode number')
    }

    if (!slug.includes('_')) {
      throw AppError.validation('Invalid slug format')
    }

    return { slug, episodeNumber: ep }
  },

  async handleGetEpisode(url: URL): Promise<ApiResponse<AnimeEpisode>> {
    const { slug, episodeNumber } = this.validateEpisodeRequest(url)
    const episode = await EpisodeService.getEpisodeById(slug, episodeNumber)
    return {
      data: episode,
    }
  },
}
