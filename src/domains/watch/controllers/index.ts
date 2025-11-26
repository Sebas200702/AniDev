import { AppError } from '@shared/errors'
import { EpisodeService } from '@watch/services'

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

  async handleGetEpisodes(url: URL) {
    const { id, page } = this.validateRequest(url)

    return await EpisodeService.getEpisodes({
      animeId: id,
      page,
    })
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

  async handleGetEpisode(url: URL) {
    const { slug, episodeNumber } = this.validateEpisodeRequest(url)
    return await EpisodeService.getEpisodeById(slug, episodeNumber)
  },
}
