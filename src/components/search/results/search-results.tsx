import { useEffect } from 'react'

import { AnimeCard } from '@components/anime-card'
import { LoadingCard } from '@components/search/results/loading-card'
import { SearchResultsLoader } from '@components/search/results/serch-results-loader'
import { toast } from '@pheralb/toast'
import { useSearchStoreResults } from '@store/search-results-store'
import { ToastType } from 'types'
import { NotResultsFound } from './not-results-found'

/**
 * SearchResults component displays search results for anime based on user queries and filters.
 *
 * @description
 * This component manages the display state of search results, including loading animations and transitions.
 * It shows appropriate UI elements based on the current search state - loading indicators while fetching,
 * "not found" messages when no results match, and a responsive grid of anime cards when results are available.
 *
 * The component implements a fade-in animation to smoothly transition results into view once they're loaded.
 * It tracks completion state to ensure loading indicators remain visible until the search process is fully
 * complete, providing a better user experience during search operations.
 *
 * The UI adapts to different screen sizes with a responsive grid layout that displays more columns on
 * larger screens. During search operations, a skeleton loader is shown to maintain UI consistency and
 * indicate activity to the user.
 *
 * @returns {JSX.Element} The rendered search results component showing either loading state, no results message, or anime cards
 *
 * @example
 * <SearchResults />
 */
export const SearchResults = () => {
  const {
    results: animes,
    isLoadingMore,
    loading,
    query,
    appliedFilters,
  } = useSearchStoreResults()

  const renderLoadingCards = () => {
    if (!isLoadingMore) return null
    return Array(10)
      .fill(0)
      .map((_, index) => <LoadingCard key={`loading-card-${index + 1}`} />)
  }

  useEffect(() => {
    if (animes?.length === 0 && (query || appliedFilters) && !loading) {
      toast[ToastType.Warning]({
        text: `No results found for "${query}" with the selected filters.`,
      })
    }
  }, [animes, query, appliedFilters, loading])

  useEffect(() => {
    if (animes?.length || (!animes?.length && !loading)) {
      const $animeCards = document.querySelectorAll('.anime-card')
      $animeCards.forEach((card) => {
        card.animate([{ opacity: 0 }, { opacity: 1 }], {
          duration: 500,
          easing: 'ease-in-out',
          fill: 'forwards',
        })

        setTimeout(() => {
          card.classList.remove('anime-card')
        }, 700)
      })
    }
  }, [animes, loading])

  if ((!animes && loading) || loading) {
    return <SearchResultsLoader />
  }

  if (animes?.length === 0 && (query || appliedFilters) && !loading)
    return <NotResultsFound />

  return (
    <ul
      className={`grid w-full grid-cols-2 gap-6 p-4 transition-opacity duration-500 md:grid-cols-6 md:px-20 xl:grid-cols-8`}
    >
      {animes?.map((anime) => (
        <AnimeCard context="search" key={anime.mal_id} anime={anime} />
      ))}
      {isLoadingMore && renderLoadingCards()}
    </ul>
  )
}
