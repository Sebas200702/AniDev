import { AnimeInfo } from '@anime/components/anime-info/anime-info'
import { AnimeLoader } from '@anime/components/anime-info/anime-info-loader'
import type { Anime } from '@anime/types'
import { DataWrapper } from '@shared/components/data-wrapper'
import { useFetch } from '@shared/hooks/useFetch'
import { useGlobalUserPreferences } from '@user/stores/user-store'

interface Props {
  id: number
}

export const AnimeInfoContainer = ({ id }: Props) => {
  const { parentalControl } = useGlobalUserPreferences()

  const {
    data: animeData,
    loading,
    error,
  } = useFetch<Anime>({
    url: `/animes/getAnime?id=${id}&parental_control=${parentalControl}`,
    navigate404: true,
    skip: parentalControl === null,
  })

  return (
    <DataWrapper
      data={animeData}
      loading={loading}
      error={error}
      loadingFallback={<AnimeLoader />}
      noDataFallback={<AnimeLoader />}
    >
      {(data) => <AnimeInfo animeData={data!} />}
    </DataWrapper>
  )
}
