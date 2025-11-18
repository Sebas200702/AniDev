import { fetchAnimeCount, fetchByFormat } from '@anime/utils/fetch-by-format'

import { getRandomAnime } from '@anime/utils/get-random-anime'
import { supabase } from '@libs/supabase'

export const AnimeRepository = {
  async getRandom(parentalControl: boolean | null, userId?: string | null) {
    return await getRandomAnime(parentalControl, 3, userId)
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

  async getUniqueStudios() {
    const { data, error } = await supabase.rpc('get_unique_studios')

    if (error) {
      throw new Error(`Failed to fetch studios: ${error.message}`)
    }

    if (!data || data.length === 0) {
      throw new Error('No studios found')
    }

    return data
  },

  async getAnimeBanner(animeId: number, limitCount: number = 8) {
    const { data, error } = await supabase.rpc('get_anime_banner', {
      p_anime_id: animeId,
      p_limit_count: limitCount,
    })

    if (error) {
      throw new Error(`Failed to fetch anime banner: ${error.message}`)
    }

    if (!data || data.length === 0) {
      throw new Error('Data not found')
    }

    return data
  },

  async getAnimesForSitemap(offset: number, limit: number = 5000) {
    // Supabase has a max limit per request, so we need to batch
    const BATCH_SIZE = 1000
    const batches = Math.ceil(limit / BATCH_SIZE)
    const allData: {mal_id: number; title: string; score: number}[] = []

    for (let i = 0; i < batches; i++) {
      const batchOffset = offset + i * BATCH_SIZE
      const batchLimit = Math.min(BATCH_SIZE, limit - i * BATCH_SIZE)

      const { data, error } = await supabase
        .from('anime')
        .select('mal_id, title, score')
        .order('score', { ascending: false })
        .range(batchOffset, batchOffset + batchLimit - 1)

      if (error) {
        throw new Error(`Failed to fetch animes for sitemap: ${error.message}`)
      }

      if (data) {
        allData.push(...data)
      }

      // Stop if we got less than expected (no more data)
      if (!data || data.length < batchLimit) {
        break
      }
    }

    return allData
  },

  async getAnimeRelations(animeId: string) {
    const { data, error } = await supabase.rpc('get_related_anime', {
      p_mal_id: animeId,
    })

    if (error) {
      console.error(error)
      return []
    }

    return data ?? []
  },

  async getAnimesFull(filters: Record<string, any>) {
    const { data, error } = await supabase.rpc('get_animes_full', filters)

    if (error) {
      throw new Error(`Failed to fetch animes full: ${error.message}`)
    }

    return data ?? []
  },
}
