import { fetchAnimeCount, fetchByFormat } from '@anime/utils/fetch-by-format'

import { getRandomAnime } from '@anime/utils/get-random-anime'
import { supabase } from '@libs/supabase'

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

  async getById(animeId: number, parentalControl: boolean = true) {
    const { data, error } = await supabase.rpc('get_anime_by_id', {
      p_mal_id: animeId,
      p_parental_control: parentalControl,
    })

    if (error) {
      throw new Error(`Failed to fetch anime: ${error.message}`)
    }

    // Si no hay datos con control parental, verificar si existe sin control
    if (!data?.[0] && parentalControl) {
      const { data: unrestricted } = await supabase.rpc('get_anime_by_id', {
        p_mal_id: animeId,
        p_parental_control: false,
      })

      if (unrestricted?.[0]) {
        return {
          blocked: true,
          message: 'This content is blocked by parental controls',
        }
      }
    }

    if (!data?.[0]) {
      return null
    }

    return data[0]
  },

  async getMetadata(animeId: number) {
    const anime = await this.getById(animeId, false)

    if (!anime || 'blocked' in anime) {
      throw new Error('Anime not found')
    }

    return {
      title: anime.title,
      description: anime.synopsis || anime.background,
      image: anime.main_picture,
    }
  },
}
