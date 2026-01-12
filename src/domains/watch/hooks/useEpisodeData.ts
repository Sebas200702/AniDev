import { useFetch } from '@shared/hooks/useFetch'
import type { AnimeEpisode } from '@watch/types'

interface UseEpisodeDataReturn {
  episodes: AnimeEpisode[]
  loading: boolean
  error: Error | null
}

/**
 * Custom hook for fetching episodes data
 */
export const useEpisodeData = (
  mal_id: number,
  currentPage: number
): UseEpisodeDataReturn => {
  const { data, loading, error } = useFetch<{ episodes: AnimeEpisode[] }>({
    url: `/episodes/getEpisodes?mal_id=${mal_id}&page=${currentPage}`,
  })

  return {
    episodes: data?.episodes ?? [],
    loading,
    error,
  }
}
