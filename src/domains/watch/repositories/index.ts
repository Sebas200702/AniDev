import { supabase } from '@libs/supabase'
import { AppError } from '@shared/errors'
import type { AnimeEpisode } from '@watch/types'

export const EpisodeRepository = {
  /**
   * Get episodes for an anime by mal_id with pagination
   */
  async getEpisodesByAnimeId(animeId: string, page: number = 1): Promise<AnimeEpisode[]> {
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
      throw AppError.database('Failed to fetch episodes', {
        animeId,
        page,
        ...error,
      })
    }

    return data ?? []
  },

  /**
   * Get total count of episodes for an anime
   */
  async getEpisodesCount(animeId: string) : Promise<number> {
    const { count, error } = await supabase
      .from('anime_episodes')
      .select('*', { count: 'exact', head: true })
      .eq('anime_mal_id', animeId)

    if (error) {
      throw AppError.database('Failed to fetch episodes count', {
        animeId,
        ...error,
      })
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
      throw AppError.database('Failed to fetch episode', {
        animeId,
        episodeId,
        ...error,
      })
    }

    return data as AnimeEpisode
  },
}
