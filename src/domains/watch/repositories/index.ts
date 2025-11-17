import { supabase } from '@libs/supabase'

export const EpisodeRepository = {
  /**
   * Get episodes for an anime by mal_id with pagination
   */
  async getEpisodesByAnimeId(animeId: string, page: number = 1) {
    const ITEMS_PER_PAGE = 100
    const start = (page - 1) * ITEMS_PER_PAGE
    const end = page * ITEMS_PER_PAGE - 1

    const { data, error } = await supabase
      .from('anime_episodes')
      .select('*')
      .eq('anime_mal_id', animeId)
      .order('episode_id', { ascending: true })
      .range(start, end)

    if (error) {
      throw new Error(`Failed to fetch episodes: ${error.message}`)
    }

    return data ?? []
  },

  /**
   * Get total count of episodes for an anime
   */
  async getEpisodesCount(animeId: string) {
    const { count, error } = await supabase
      .from('anime_episodes')
      .select('*', { count: 'exact', head: true })
      .eq('anime_mal_id', animeId)

    if (error) {
      throw new Error(`Failed to fetch episodes count: ${error.message}`)
    }

    return count ?? 0
  },

  /**
   * Get a single episode by anime_id and episode_id
   */
  async getEpisodeById(animeId: string, episodeId: string) {
    const { data, error } = await supabase
      .from('anime_episodes')
      .select('*')
      .eq('anime_mal_id', animeId)
      .eq('episode_id', episodeId)
      .single()

    if (error) {
      throw new Error(`Failed to fetch episode: ${error.message}`)
    }

    return data
  },
}
