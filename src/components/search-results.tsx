import { AnimeResult } from '@components/anime-result'
import { useSearchStoreResults } from '@store/search-results-store'

export const SearchResults = () => {
  const { results: animes } = useSearchStoreResults()
  return (
    <ul className="grid w-full grid-cols-3 gap-4">
      {animes?.length === 0 && (
        <div className="mt-9 flex h-full w-full flex-col items-center justify-center">
          <h1 className="text-2xl font-bold text-gray-900">No results found</h1>
        </div>
      )}
      {animes?.map(({ title, image_webp, mal_id, type }) => (
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
