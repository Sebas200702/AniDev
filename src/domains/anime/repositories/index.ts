import {
  type Anime,
  type AnimeBannerInfo,
  type AnimeDetail,
  Formats,
} from '@anime/types'
import { fetchAnimeCount, fetchByFormat } from '@anime/utils/fetch-by-format'
import { getRandomAnime } from '@anime/utils/get-random-anime'
import { createContextLogger } from '@libs/pino'
import { supabase } from '@libs/supabase'
import { AppError } from '@shared/errors'

const logger = createContextLogger('AnimeRepository')

export const AnimeRepository = {
  async getRandom(parentalControl: boolean | null, userId?: string | null) {
    return await getRandomAnime(parentalControl, 3, userId)
  },

  async searchAnime({
    format,
    filters,
    countFilters,
  }: {
    format: Formats
    filters: Record<string, any>
    countFilters: Record<string, any>
  }) {
    const data = await fetchByFormat(format, filters)
    const total = await fetchAnimeCount(countFilters)

    return { data, total }
  },

  async getById(animeId: number , parentalControl: boolean = false) {
    const { data, error } = await supabase
      .rpc('get_anime_by_id', {
        p_mal_id: animeId,
        p_parental_control: parentalControl,
      })


    if (error) {
      logger.error(`[AnimeRepository.getById] Failed to fetch anime ${animeId}: ${error.message}`)
      throw AppError.database(`Failed to fetch anime ${animeId}`, { ...error })
    }
    if ((!data || data.length === 0) && parentalControl) {
      const { data: unrestricted } = await supabase.rpc('get_anime_by_id', {
        p_mal_id: animeId,
        p_parental_control: false,
      })

      if (unrestricted) {
        throw AppError.permission('Anime is restricted due to parental control settings')
      }
    }

    if (!data || data.length === 0) {
      logger.error(`[AnimeRepository.getById] Anime not found: ${animeId}`)
      throw AppError.notFound(`Anime with ID ${animeId} not found`)
    }

    return data[0] as Anime
  },

  async getMetadata(animeId: number) {
    const anime = await this.getById(animeId)

    if (!anime || 'blocked' in anime) {
      throw AppError.notFound(`Anime metadata with ID ${animeId} not found`)
    }

    return {
      title: anime.title,
      description: anime.synopsis || anime.background,
      image: anime.image_large_webp || anime.image_url,
    }
  },

  async getUniqueStudios() {
    const { data, error } = await supabase.rpc('get_unique_studios')

    if (error) {
      throw AppError.database(`Failed to fetch studios: ${error.message}`, {
        ...error,
      })
    }

    if (!data || data.length === 0) {
      throw AppError.notFound('No studios found')
    }

    return data as string[]
  },

  async getAnimeBanner(animeId: number, limitCount: number = 8) {
    const { data, error } = await supabase.rpc('get_anime_banner', {
      p_anime_id: animeId,
      p_limit_count: limitCount,
    })

    if (error) {
      throw AppError.database(
        `Failed to fetch anime banner: ${error.message}`,
        { ...error }
      )
    }

    if (!data || data.length === 0) {
      throw AppError.notFound(`Anime banner data with ID ${animeId} not found`)
    }

    return data as AnimeBannerInfo[]
  },

  async getAnimesForSitemap(offset: number, limit: number = 5000) {
    const BATCH_SIZE = 1000
    const batches = Math.ceil(limit / BATCH_SIZE)
    const allData: { mal_id: number; title: string; score: number }[] = []

    for (let i = 0; i < batches; i++) {
      const batchOffset = offset + i * BATCH_SIZE
      const batchLimit = Math.min(BATCH_SIZE, limit - i * BATCH_SIZE)

      const { data, error } = await supabase
        .from('anime')
        .select('mal_id, title, score')
        .order('score', { ascending: false })
        .range(batchOffset, batchOffset + batchLimit - 1)

      if (error) {
        throw AppError.database(
          `Failed to fetch animes for sitemap: ${error.message}`,
          { ...error }
        )
      }

      if (data) {
        allData.push(...data)
      }

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
      logger.error(
        '[AnimeRepository.getAnimeRelations] Error fetching related anime',
        error
      )
      throw AppError.database(
        `Failed to fetch anime relations: ${error.message}`,
        { ...error }
      )
    }

    return (data ?? []) as AnimeDetail[]
  },

  async getAnimesFull(filters: Record<string, any>) {
    const { data, error } = await supabase.rpc('get_animes_full', filters)

    if (error) {
      throw AppError.database(`Failed to fetch animes: ${error.message}`, {
        ...error,
      })
    }

    return (data ?? []) as Anime[]
  },
}
