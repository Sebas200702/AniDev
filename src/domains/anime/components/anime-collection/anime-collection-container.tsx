import { AnimeCollection } from '@anime/components/anime-collection/anime-collection'
import type { AnimeCollectionInfo } from '@anime/types'
import { useFetch } from '@shared/hooks/useFetch'
import { createDynamicUrl } from '@utils/create-dynamic-url'
import { useMemo } from 'react'

interface Props {
  id: number
}

export const AnimeCollectionContainer = ({ id }: Props) => {
  const { url, title } = useMemo(() => createDynamicUrl(3), [])

  const {
    data: animes,
    loading,
    error,
  } = useFetch<AnimeCollectionInfo[]>({
    url: `${url}&format=anime-collection`,
  })

  if (error) return null

  if (!animes || !animes.length || loading)
    return (
      <li className="flex h-54 w-full animate-pulse items-center justify-center rounded-lg bg-zinc-800"></li>
    )

  return <AnimeCollection animes={animes ?? []} title={title} id={`${id}`} />
}
