import type { AnimeSong } from '@music/types'
import { DataWrapper } from '@shared/components/error/data-wrapper'
import { useFetch } from '@shared/hooks/useFetch'
import { AnimeMusic } from './anime-music'
import { AnimeMusicLoader } from './anime-music-loader'

interface Props {
  animeId: number
}
export const AnimeMusicContainer = ({ animeId }: Props) => {
  const { data, error, loading } = useFetch<AnimeSong[]>({
    url: `/music/getAnimeMusic?anime_id=${animeId}`,
  })

  return (
    <DataWrapper
      data={data!}
      error={error}
      loading={loading}
      noDataFallback={<AnimeMusicLoader />}
      loadingFallback={<AnimeMusicLoader />}
    >
      {(songs) => <AnimeMusic songs={songs} />}
    </DataWrapper>
  )
}
