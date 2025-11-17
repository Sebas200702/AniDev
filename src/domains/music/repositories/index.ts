import { supabase } from '@libs/supabase'

export const MusicRepository = {
  async getMusicInfo(themeId: number) {
    const { data, error } = await supabase.rpc('get_music_info', {
      p_theme_id: themeId,
    })

    if (error) {
      throw new Error(`Failed to fetch music info: ${error.message}`)
    }

    if (!data || data.length === 0) {
      throw new Error('Music theme not found')
    }

    return data
  },

  async getMusicList(filters: Record<string, any>) {
    const { data, error } = await supabase.rpc('get_music', filters)

    if (error) {
      throw new Error(`Failed to fetch music list: ${error.message}`)
    }

    return data ?? []
  },

  async getMusicCount(filters: Record<string, any>) {
    const { data, error } = await supabase.rpc('get_music_count', filters)

    if (error) {
      throw new Error(`Failed to fetch music count: ${error.message}`)
    }

    return data ?? 0
  },

  async getMetadata(themeId: number) {
    const musicData = await this.getMusicInfo(themeId)
    const track = musicData[0]

    if (!track) {
      throw new Error('Music track not found')
    }

    return {
      title: track.song_title,
      description: `${track.song_title} performed by ${track.artist_name}${
        track.anime_title ? ` for the anime ${track.anime_title}` : ''
      }. Listen now on AniDev!`,
      image: track.image,
      artistName: track.artist_name,
      animeTitle: track.anime_title,
    }
  },

  async getMusicByAnimeId(animeId: number) {
    const { data, error } = await supabase
      .from('music')
      .select('*')
      .eq('anime_id', animeId)

    if (error) {
      throw new Error(`Failed to fetch anime music: ${error.message}`)
    }

    return data ?? []
  },

  async getMusicForSitemap(offset: number, limit: number = 5000) {
    const { data, error } = await supabase
      .from('music')
      .select('theme_id, song_title')
      .order('theme_id', { ascending: true })
      .range(offset, offset + limit - 1)
      .limit(limit)

    if (error) {
      throw new Error(`Failed to fetch music for sitemap: ${error.message}`)
    }

    return data ?? []
  },
}
