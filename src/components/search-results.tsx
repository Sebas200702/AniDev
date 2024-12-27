import { AnimeResult } from '@components/anime-result'
import { useSearchStoreResults } from '@store/search-results-store'
import { useEffect, useState } from 'react'

export const SearchResults = () => {
  const [fadeIn, setFadeIn] = useState(false)
  const {
    results: animes,
    query,
    loading,
    appliedFilters,
  } = useSearchStoreResults()

  useEffect(() => {
    if (!animes) return
    setTimeout(() => setFadeIn(true), 300)
  }, [animes, setFadeIn, query, appliedFilters, loading])

  if (!animes || loading) {
    return (
      <div className="mx-auto grid w-full max-w-7xl grid-cols-6 gap-4">
        {Array(30)
          .fill(0)
          .map((_, i) => (
            <div
              key={i + 1}
              className="flex h-auto w-full animate-pulse flex-col gap-2 rounded-lg bg-gray-200 p-2 duration-200"
            >
              <div className="aspect-[225/330] h-[89%] w-full animate-pulse rounded-lg bg-gray-400 p-2 duration-200"></div>
              <div className="flex h-6 w-full animate-pulse rounded-lg bg-gray-400 transition-all duration-200 ease-in-out"></div>
            </div>
          ))}
      </div>
    )
  }

  if (
    animes.length === 0 &&
    (query || Object.keys(appliedFilters).length > 0)
  ) {
    return (
      <div className="mt-9 flex h-full w-full flex-col items-center justify-center">
        <h1 className="text-2xl font-bold text-gray-900">No results found</h1>
      </div>
    )
  }

  return (
    <ul
      className={`mx-auto grid w-full max-w-7xl grid-cols-6 gap-4 transition-opacity duration-500 ${fadeIn ? 'opacity-100' : 'opacity-0'}`}
    >
      {animes.map(({ title, image_webp, mal_id, type }) => (
        <AnimeResult
          key={mal_id}
          mal_id={mal_id}
          title={title}
          image_webp={image_webp}
          type={type}
        />
      ))}
    </ul>
  )
}
