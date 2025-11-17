import { AnimeInfo } from '@anime/components/anime-info/anime-info'
import { AnimeLoader } from '@anime/components/anime-info/anime-info-loader'
import { DataWrapper } from '@shared/components/data-wrapper'
import { getAnimeData } from '@utils/get-anime-data'
import { useBlockedContent } from '@shared/hooks/useBlockedContent'

interface Props {
  id: number
}

export const AnimeInfoContainer = ({ id }: Props) => {
  const { animeData, isBlocked, isLoading, isMounted, error } =
    useBlockedContent({
      id,
      getAnimeData,
    })


  if (!isMounted) return null

  return (
    <DataWrapper
      data={isBlocked ? null : animeData}
      loading={isLoading}
      error={error}
      loadingFallback={<AnimeLoader />}
      noDataFallback={
        <div className="flex h-40 items-center justify-center text-gray-300">
          No anime data available.
        </div>
      }
    >
      {(data) => <AnimeInfo animeData={data!} />}
    </DataWrapper>
  )
}
