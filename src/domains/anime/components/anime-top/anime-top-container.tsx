import { AnimeTop } from '@anime/components/anime-top/anime-top'
import { AnimeTopLoader } from '@anime/components/anime-top/anime-top-loader'
import type { AnimeTopInfo } from '@anime/types'
import { DataWrapper } from '@shared/components/error/data-wrapper'
import { useFetch } from '@shared/hooks/useFetch'

export const AnimeTopContainer = () => {
  const { data, loading, error, refetch } = useFetch<AnimeTopInfo[]>({
    url: '/animes?order_by=score&limit_count=10&type_filter=tv&banner_filter=false&format=top-anime',
  })

  return (
    <DataWrapper
      data={data}
      loading={loading}
      error={error}
      onRetry={refetch}
      loadingFallback={<AnimeTopLoader />}
      noDataFallback={<AnimeTopLoader />}
    >
      {(data) => <AnimeTop animes={data!} />}
    </DataWrapper>
  )
}
