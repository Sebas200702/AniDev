import { AnimeDetailCard } from '@anime/components/anime-card/anime-detail-card'
import { AnimeCharacterCard } from '@character/components/character-card/detail-character-card'
import { AnimeMusicItem } from '@music/components/music-card/music-detail-card'
import { useSearchStoreResults } from '@search/stores/search-results-store'
import { SearchType } from '@search/types'
import {
  isAnimeData,
  isCharacterData,
  isMusicData,
} from '@search/utils/search-bar'
import { baseUrl } from '@utils/base-url'
import { useMemo } from 'react'

// Componente para el skeleton de carga
const LoadingSkeleton = () => (
  <>
    {Array.from({ length: 7 }, (_, i) => (
      <div
        key={i + 1}
        className="bg-Complementary mx-auto flex aspect-[100/30] h-full max-h-36 w-full animate-pulse flex-row rounded-lg"
      >
        <div className="aspect-[225/330] h-full animate-pulse rounded-l-lg bg-zinc-800 object-cover object-center transition-all ease-in-out" />
      </div>
    ))}
  </>
)

// Componente para estado vacío
const EmptyState = () => (
  <div className="flex h-96 w-full items-center justify-center gap-4 p-2">
    No results found
  </div>
)

// Componente para errores
const ErrorState = ({ error }: { error: string | null }) => (
  <p className="text-lg text-red-500">
    Error fetching data: {error || 'Unknown error'}
  </p>
)

// Componente para el botón "Ver todos"
const SeeAllButton = ({ query }: { query?: string }) => (
  <a
    href={`/search?q=${encodeURIComponent(query ?? '')}`}
    className="button-primary flex items-center justify-center"
  >
    <h3 className="text-lg font-semibold">See all results</h3>
  </a>
)

const ResultsList = ({ type, data }: { type: SearchType; data: any }) => {
  const limitedData = data.slice(0, 7)

  if (type === SearchType.ANIMES && isAnimeData(limitedData)) {
    return limitedData.map((result: any) => (
      <AnimeDetailCard key={result.mal_id} anime={result} />
    ))
  }

  if (type === SearchType.MUSIC && isMusicData(limitedData)) {
    return limitedData.map((result: any) => (
      <AnimeMusicItem
        key={result.song_id}
        song={result}
        image={result.image}
        placeholder={result.placeholder}
        banner_image={
          result.banner_image ?? result.image ?? `${baseUrl}/placeholder.webp`
        }
        anime_title={result.anime_title}
      />
    ))
  }

  if (type === SearchType.CHARACTERS && isCharacterData(limitedData)) {
    return limitedData.map((result: any) => (
      <AnimeCharacterCard
        key={`${result.character_id}_${result.voice_actor_id}`}
        character={result}
      />
    ))
  }

  return null
}

const useSearchContent = () => {
  const {
    loading,
    error,
    results: data,
    currentType,
    query,
  } = useSearchStoreResults()
  return useMemo(() => {
    if (loading) {
      return { component: <LoadingSkeleton />, showSeeAll: false }
    }

    if (error) {
      return { component: <ErrorState error={error} />, showSeeAll: false }
    }

    if (!data || data.length === 0) {
      return { component: <EmptyState />, showSeeAll: false }
    }

    return {
      loading,
      data,
      query,
      component: <ResultsList type={currentType} data={data} />,
      showSeeAll: data.length > 7 && query,
    }
  }, [loading, error, data, currentType, query])
}

export const SearchResultsContainer = ({}) => {
  const { component, showSeeAll, loading, data, query } = useSearchContent()

  const isVisible = (loading || data) && query

  return (
    <div
      className={`no-scrollbar bg-Primary-950 relative max-h-96 w-full max-w-xl overflow-x-hidden overflow-y-scroll rounded-md p-4 shadow-lg transition-all duration-300 ${
        isVisible ? 'h-full opacity-100' : 'h-0 opacity-0'
      } mt-4`}
    >
      <ul className="flex w-full flex-col gap-4">
        {component}
        {showSeeAll && <SeeAllButton query={query} />}
      </ul>
    </div>
  )
}
