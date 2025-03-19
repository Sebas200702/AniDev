import { useEffect, useState } from 'react'

import { AnimeCard } from '@components/anime-card'
import { NotResultsFound } from '@components/search/results/not-results-found'
import { SearchResultsLoader } from '@components/search/results/serch-results-loader'
import { useSearchStoreResults } from '@store/search-results-store'

export const SearchResults = () => {
  const [fadeIn, setFadeIn] = useState(false)
  const [completedSearch, setCompletedSearch] = useState(false)
  const {
    results: animes,
    query,
    loading,
    appliedFilters,
  } = useSearchStoreResults()

  useEffect(() => {
    if (!animes) return
    setTimeout(() => {
      setFadeIn(true)
      setCompletedSearch(true)
    }, 600)
  }, [animes, setFadeIn, query, appliedFilters, loading, setCompletedSearch])

  if (
    (loading && (query || appliedFilters)) ||
    (!completedSearch && (query || appliedFilters))
  ) {
    return <SearchResultsLoader />
  }

  if (
    animes?.length === 0 &&
    (query || Object.keys(appliedFilters).length > 0) &&
    completedSearch
  ) {
    return <NotResultsFound />
  }

  return (
    <ul
      className={`mx-auto grid  w-full max-w-7xl grid-cols-2  p-4 transition-opacity duration-500 md:grid-cols-4 xl:grid-cols-6 xl:gap-10 ${fadeIn ? 'opacity-100' : 'opacity-0'}`}
    >
      {animes?.map((anime) => (
        <AnimeCard context="search" key={anime.mal_id} anime={anime} />
      ))}
    </ul>
  )
}
