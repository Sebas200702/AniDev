import { supabase } from '@libs/supabase'
import type { AnimeSong } from '@music/types'
import { AppError } from '@shared/errors'

export const MusicRepository = {
  async getMusicInfo(themeId: number): Promise<AnimeSong> {
    const { data, error } = await supabase.rpc('get_music_info', {
      p_theme_id: themeId,
    })

    if (error) {
      throw AppError.database('Failed to fetch music info', {
        themeId,
        ...error,
      })
    }

    if (!data || data.length === 0) {
      throw AppError.notFound('Music theme not found', { themeId })
    }

    return data
  },

  async getMusicList(filters: Record<string, any>): Promise<AnimeSong[]> {
    const { data, error } = await supabase.rpc('get_music', filters)

    if (error) {
      throw AppError.database('Failed to fetch music list', {
        filters,
        ...error,
      })
    }

    return data ?? []
  },

  async getMusicCount(filters: Record<string, any>) {
    const { data, error } = await supabase.rpc('get_music_count', filters)

    if (error) {
      throw AppError.database('Failed to fetch music count', {
        filters,
        ...error,
      })
    }

    return data ?? 0
  },

  async getMetadata(themeId: number) {
    const musicData = await this.getMusicInfo(themeId)
    const track = musicData

    if (!track) {
      throw AppError.notFound('Music track not found', { themeId })
    }

    return {
      title: track.song_title,
      description: `${track.song_title} performed by ${track.artist_name}${
        track?.anime?.title ? ` for the anime ${track.anime.title}` : ''
      }. Listen now on AniDev!`,
      image: track?.anime?.image,
      artistName: track.artist_name,
      animeTitle: track?.anime?.title,
    }
  },

  async getMusicByAnimeId(filters: Record<string, any>): Promise<AnimeSong[]> {
    const { data, error } = await supabase.rpc('get_music', filters)

    if (error) {
      throw AppError.database('Failed to fetch anime music', {
        filters,
        ...error,
      })
    }

    return data ?? []
  },

  async getMusicForSitemap(
    offset: number,
    limit: number = 5000
  ): Promise<{ theme_id: number; song_title: string }[]> {
    // Supabase has a max limit per request, so we need to batch
    const BATCH_SIZE = 1000
    const batches = Math.ceil(limit / BATCH_SIZE)
    const allData: { theme_id: number; song_title: string }[] = []

    for (let i = 0; i < batches; i++) {
      const batchOffset = offset + i * BATCH_SIZE
      const batchLimit = Math.min(BATCH_SIZE, limit - i * BATCH_SIZE)

      const { data, error } = await supabase
        .from('music')
        .select('theme_id, song_title')
        .order('theme_id', { ascending: true })
        .range(batchOffset, batchOffset + batchLimit - 1)

      if (error) {
        throw AppError.database('Failed to fetch music for sitemap', {
          offset: batchOffset,
          limit: batchLimit,
          ...error,
        })
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
}
