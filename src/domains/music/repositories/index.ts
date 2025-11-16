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
}
