import { AnimeInfo } from '@anime/components/anime-info/anime-info'
import { AnimeLoader } from '@anime/components/anime-info/anime-info-loader'
import type { Anime } from '@anime/types'
import { DataWrapper } from '@shared/components/data-wrapper'
import { useFetch } from '@shared/hooks/useFetch'

interface Props {
  id: number
}

export const AnimeInfoContainer = ({ id }: Props) => {
  const {
    data: animeData,
    loading,
    error,
  } = useFetch<Anime>({
    url: `/animes/getAnime?id=${id}`,
    navigate404: true,
  })

  return (
    <DataWrapper
      data={animeData}
      loading={loading}
      error={error}
      loadingFallback={<AnimeLoader />}
      noDataFallback={
       <AnimeLoader />
      }
    >
      {(data) => <AnimeInfo animeData={data!} />}
    </DataWrapper>
  )
}
