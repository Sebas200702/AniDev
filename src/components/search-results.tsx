import { AnimeResult } from '@components/anime-result'
import { useSearchStoreResults } from '@store/search-results-store'

export const SearchResults = () => {
  const { results: animes } = useSearchStoreResults()
  return (
    <ul className="grid grid-cols-3 gap-4  w-full">
      {animes?.length === 0 && (
        <div className="flex flex-col items-center justify-center mt-9 w-full h-full">
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
