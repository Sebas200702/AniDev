import { AnimeCollectionLoader } from '@anime/components/anime-collection/anime-coletion-loader'
import { AnimeCollection } from '@anime/components/anime-collection/anime-collection'
import type { AnimeCollectionInfo } from '@anime/types'
import { DataWrapper } from '@shared/components/data-wrapper'
import { useFetch } from '@shared/hooks/useFetch'
import { createDynamicUrl } from '@utils/create-dynamic-url'
import { useMemo } from 'react'

interface Props {
  id: number
}

export const AnimeCollectionContainer = ({ id }: Props) => {
  const { url, title } = useMemo(() => createDynamicUrl(3), [])

  const { data, loading, error } = useFetch<AnimeCollectionInfo[]>({
    url: `${url}&format=anime-collection`,
  })

  return (
    <DataWrapper
      data={data}
      loading={loading}
      error={error}
      loadingFallback={<AnimeCollectionLoader />}
      noDataFallback={null}
    >
      {(data) => <AnimeCollection animes={data!} title={title} id={id} />}
    </DataWrapper>
  )
}
