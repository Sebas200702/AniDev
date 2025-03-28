import { useEffect, useState } from 'react'

import { AnimeCard } from '@components/anime-card'
import { LoadingCard } from './loading-card'
import { SearchResultsLoader } from '@components/search/results/serch-results-loader'
import { ToastType } from 'types'
import { toast } from '@pheralb/toast'
import { useSearchStoreResults } from '@store/search-results-store'

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
  const [toastShown, setToastShown] = useState(false)
  const [completedSearch, setCompletedSearch] = useState(false)
  const {
    results: animes,
    query,
    loading,
    appliedFilters,
    isLoadingMore,
  } = useSearchStoreResults()

  useEffect(() => {
    if (!animes || loading || !query) return
    setTimeout(() => {
      setFadeIn(true)
      setToastShown(false)
      setCompletedSearch(true)
    }, 1000)
  }, [animes, setFadeIn, query, appliedFilters, loading])

  if (
    (loading && (query || appliedFilters)) ||
    (!completedSearch && (query || appliedFilters))
  ) {
    return <SearchResultsLoader />
  }
  if (
    !animes ||
    (animes?.length === 0 &&
      (query || Object.keys(appliedFilters).length > 0) &&
      completedSearch)
  ) {
    return (
      <div className="flex h-full items-center justify-center text-center text-3xl font-bold">
        Results not found
      </div>
    )
  }

  const renderLoadingCards = () => {
    if (!isLoadingMore) return null
    return Array(10)
      .fill(0)
      .map((_, index) => <LoadingCard key={`loading-card-${index + 1}`} />)
  }

  return (
    <ul
      className={`mx-auto grid w-full max-w-7xl grid-cols-2 gap-6 p-4 transition-opacity duration-500 md:grid-cols-4 xl:grid-cols-6 xl:gap-10 ${fadeIn ? 'opacity-100' : 'opacity-0'}`}
    >
      {animes.map((anime) => (
        <AnimeCard context="search" key={anime.mal_id} anime={anime} />
      ))}
      {isLoadingMore && renderLoadingCards()}
    </ul>
  )
}
