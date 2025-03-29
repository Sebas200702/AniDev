import { useEffect, useState } from 'react'

import { AnimeCard } from '@components/anime-card'
import { SearchResultsLoader } from '@components/search/results/serch-results-loader'
import { toast } from '@pheralb/toast'
import { useSearchStoreResults } from '@store/search-results-store'
import { ToastType } from 'types'
import { LoadingCard } from './loading-card'

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
  const [fadeIn, setFadeIn] = useState(false)
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
    if (animes?.length ) {
      setFadeIn(true)
    }
  }, [animes])

  if (!animes || loading) {
    return <SearchResultsLoader />
  }

  if (animes?.length === 0 && (query || appliedFilters) && !loading) {
    toast[ToastType.Warning]({
      text: `No results found for "${query}" with the selected filters.`,
    })
    return (
      <div className="mx-auto flex h-full w-full max-w-7xl items-center justify-center p-4">
        <p className="text-center text-lg font-semibold text-gray-300">
          No results found. Please try a different search.
        </p>
      </div>
    )
  }
  return (
    <ul
      className={`mx-auto grid w-full max-w-7xl grid-cols-2 gap-6 p-4 transition-opacity duration-500 md:grid-cols-4 xl:grid-cols-6 xl:gap-10 ${fadeIn ? 'opacity-100' : 'opacity-0'}`}
    >
      {animes?.map((anime) => (
        <AnimeCard context="search" key={anime.mal_id} anime={anime} />
      ))}
      {isLoadingMore && renderLoadingCards()}
    </ul>
  )
}
