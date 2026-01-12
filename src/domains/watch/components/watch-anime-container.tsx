import { useFetch } from '@shared/hooks/useFetch'
import { WatchAnime } from '@watch/components/watch-anime'
import type { Anime } from '@anime/types'
import type { AnimeEpisode } from '@watch/types'
import { DataWrapper } from '@shared/components/error/data-wrapper'
import { useGlobalUserPreferences } from '@user/stores/user-store'
import { useEpisodesPagination } from '@watch/hooks/useEpisodesPagination'
import { useEpisodeData } from '@watch/hooks/useEpisodeData'
import { useEpisodeScroll } from '@watch/hooks/useEpisodeScroll'
import { normalizeString } from '@utils/normalize-string'
import { WatchAnimeLoader } from './watch-anime-loader'

interface WatchAnimeContainerProps {
  mal_id: number
  currentEpisode: number
}

/**
 * Watch Anime Container Component
 * 
 * Manages all the logic and state for the watch page:
 * - Fetches anime data
 * - Fetches episode data  
 * - Manages episodes pagination with auto-scroll
 * - Passes all data to the presentational component
 */
export const WatchAnimeContainer = ({
  mal_id,
  currentEpisode,
}: WatchAnimeContainerProps) => {
  const { parentalControl } = useGlobalUserPreferences()

  // Fetch anime data
  const {
    data: animeData,
    loading: animeLoading,
    error: animeError,
  } = useFetch<Anime>({
    url: `/animes/getAnime?id=${mal_id}&parental_control=${parentalControl}`,
    navigate404: true,
    skip: parentalControl === null,
  })

  // Fetch current episode data
  const { data: episodeData, loading: episodeLoading } = useFetch<AnimeEpisode>({
    url: `/episodes/getEpisode?mal_id=${mal_id}&episode=${currentEpisode}`,
  })

  // Episodes pagination logic with current episode awareness
  const { currentPage, totalPages, handlePageChange } = useEpisodesPagination(
    animeData?.episodes ?? 0,
    currentEpisode
  )

  // Fetch episodes for current page
  const { episodes, loading: episodesLoading } = useEpisodeData(
    mal_id,
    currentPage
  )

  // Auto-scroll to current episode when episodes load
  useEpisodeScroll(episodes, currentEpisode)

  // Generate slug from title
  const slug = animeData ? normalizeString(animeData.title) : ''

  return (
    <DataWrapper
      data={animeData!}
      loading={animeLoading || episodesLoading || episodeLoading}
      error={animeError}
      loadingFallback={<WatchAnimeLoader />}
      noDataFallback={<WatchAnimeLoader />}
    >
      {(data) => (
        <WatchAnime
          animeData={data}
          episodeData={episodeData}
          currentEpisode={currentEpisode}
          slug={slug}
          episodes={episodes}
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      )}
    </DataWrapper>
  )
}
