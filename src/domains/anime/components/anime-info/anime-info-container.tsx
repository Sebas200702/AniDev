import { AnimeInfo } from '@anime/components/anime-info/anime-info'
import { AnimeLoader } from '@anime/components/anime-info/anime-info-loader'
import { DataWrapper } from '@shared/components/data-wrapper'
import { useBlockedContent } from '@shared/hooks/useBlockedContent'
import { getAnimeData } from '@utils/get-anime-data'

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
      data={!isBlocked ? animeData : null}
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
