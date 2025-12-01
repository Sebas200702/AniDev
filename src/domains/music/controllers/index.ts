import { MusicService } from '@music/services'
import { type AnimeSong, MusicFilters } from '@music/types'
import { AppError } from '@shared/errors'
import type { ApiResponse } from '@shared/types/api-response'
import { getFilters } from '@utils/get-filters-of-search-params'

export const MusicController = {
  parseSearchParams(url: URL) {
    const limit = Number.parseInt(url.searchParams.get('limit_count') ?? '10')
    const page = Number.parseInt(url.searchParams.get('page_number') ?? '1')

    const filters = getFilters(Object.values(MusicFilters), url, true)

    const CountFilters = Object.keys(MusicFilters).filter(
      (key) =>
        key !== 'limit_count' && key !== 'page_number' && key !== 'order_by'
    )
    const countFilters = getFilters(CountFilters, url, false)

    return { filters, countFilters, page, limit }
  },

  async handleSearch(url: URL): Promise<ApiResponse<AnimeSong[]>> {
    const { filters, countFilters, page, limit } = this.parseSearchParams(url)

    const { data, totalCount } = await MusicService.searchMusic({
      filters,
      countFilters,
      page,
      limit,
    })

    return {
      data,
      meta: {
        total_items: totalCount,
        current_page: page,
        last_page: Math.ceil(totalCount / limit),
      },
    }
  },

  validateThemeId(url: URL): number {
    const themeId = Number.parseInt(url.searchParams.get('theme_id') ?? '')

    if (!themeId || Number.isNaN(themeId)) {
      throw AppError.validation('Theme ID is required')
    }

    return themeId
  },

  async handleGetMusicInfo(url: URL): Promise<ApiResponse<AnimeSong>> {
    const themeId = this.validateThemeId(url)
    const data = await MusicService.getMusicById(themeId)
    return {
      data,
    }
  },

  validateAnimeId(url: URL): number {
    const animeId = Number.parseInt(url.searchParams.get('animeId') ?? '')

    if (!animeId || Number.isNaN(animeId)) {
      throw AppError.validation('Anime ID is required')
    }

    return animeId
  },

  async handleGetAnimeMusic(url: URL): Promise<ApiResponse<AnimeSong[]>> {
   
    const { filters } = this.parseSearchParams(url)

    const data = await MusicService.getMusicByAnimeId(filters)
    return {
      data,
    }
  },
}
