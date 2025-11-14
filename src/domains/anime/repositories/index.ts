import { fetchAnimeCount, fetchByFormat } from '@anime/utils/fetch-by-format'

import { getRandomAnime } from '@anime/utils/get-random-anime'

export const AnimeRepository = {
  async getRandom(userId: string | null, parentalControl: boolean | null) {
    return await getRandomAnime(userId, parentalControl)
  },

  async searchAnime({
    format,
    filters,
    countFilters,
  }: {
    format: string
    filters: Record<string, any>
    countFilters: Record<string, any>
  }) {
    const data = await fetchByFormat(format, filters)
    const total = await fetchAnimeCount(countFilters)

    return { data, total }
  },
}
