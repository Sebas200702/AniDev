import { AnimeCollectionLoader } from '@anime/components/anime-collection/anime-coletion-loader'
import { AnimeCollection } from '@anime/components/anime-collection/anime-collection'
import type { AnimeCollectionInfo } from '@anime/types'
import { createDynamicUrl } from '@anime/utils/create-dynamic-url'
import { useFetchWithCache } from '@cache/hooks/useFetchWithCache'
import { DataWrapper } from '@shared/components/data-wrapper'
import { useMemo } from 'react'

interface Props {
  id: number
  url?: string
  title?: string
}

export const AnimeCollectionContainer = ({
  id,
  url: customUrl,
  title: customTitle,
}: Props) => {
  const { url: fallbackUrl, title: fallbackTitle } = useMemo(
    () => createDynamicUrl(3),
    []
  )

  const { data, loading, error, retryCount, maxRetries } = useFetchWithCache<
    AnimeCollectionInfo[]
  >({
    url: `${customUrl || fallbackUrl}&format=anime-collection`,
    sectionId: `collection-${id}`,
    limit: 3,
  })

  return (
    <DataWrapper
      data={data}
      loading={loading}
      error={error}
      retryCount={maxRetries - retryCount}
      loadingFallback={<AnimeCollectionLoader />}
      noDataFallback={<AnimeCollectionLoader />}
    >
      {(data) => (
        <AnimeCollection
          animes={data!}
          title={customTitle || fallbackTitle}
          id={id}
        />
      )}
    </DataWrapper>
  )
}
