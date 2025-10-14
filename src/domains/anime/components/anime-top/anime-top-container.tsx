import { AnimeTop } from '@anime/components/anime-top/anime-top'
import type { AnimeTopInfo } from '@anime/types'
import { AnimeTopLoader } from '@anime/components/anime-top/anime-top-loader'
import { DataWrapper } from '@shared/components/data-wrapper'
import { useFetch } from '@shared/hooks/useFetch'

export const AnimeTopContainer = () => {
  const { data, loading, error } = useFetch<AnimeTopInfo[]>({
    url: '/api/animes?order_by=score&limit_count=10&type_filter=tv&banner_filter=false&format=top-anime',
  })

  return (
    <DataWrapper
      data={data}
      loading={loading}
      error={error}
      loadingFallback={<AnimeTopLoader />}
      noDataFallback={<AnimeTopLoader />}
    >
      {(data) => <AnimeTop animes={data!} />}
    </DataWrapper>
  )
}
