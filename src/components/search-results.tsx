import { useEffect, useState } from 'react'

import { AnimeCard } from '@components/anime-card'
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
    }, 500)
  }, [animes, setFadeIn, query, appliedFilters, loading, setCompletedSearch])

  if (
    (loading && (query || appliedFilters)) ||
    (!completedSearch && (query || appliedFilters))
  ) {
    return (
      <div className="mx-auto grid h-full w-full max-w-7xl grid-cols-2 md:grid-cols-4 xl:grid-cols-6">
        {Array(30)
          .fill(0)
          .map((_, i) => (
            <div
              key={i + 1}
              className="flex h-auto w-full animate-pulse flex-col rounded-lg p-4 duration-200"
            >
              <div className="aspect-[225/330] h-full w-full animate-pulse rounded-lg bg-zinc-700 p-2 duration-200"></div>
            </div>
          ))}
      </div>
    )
  }

  if (
    animes?.length === 0 &&
    (query || Object.keys(appliedFilters).length > 0) &&
    completedSearch
  ) {
    return (
      <div className="mx-auto flex h-full w-full max-w-7xl flex-col items-center justify-center gap-4 text-center">
        <h1 className="text-2xl font-bold text-gray-100">No results found</h1>
      </div>
    )
  }

  return (
    <ul
      className={`mx-auto grid h-min w-full max-w-7xl grid-cols-2 transition-opacity duration-500 md:grid-cols-4 xl:grid-cols-6 ${fadeIn ? 'opacity-100' : 'opacity-0'}`}
    >
      {animes?.map((anime) => (
        <AnimeCard context="search" key={anime.mal_id} anime={anime} />
      ))}
    </ul>
  )
}
