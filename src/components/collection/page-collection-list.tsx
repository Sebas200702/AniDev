import { useEffect, useState } from 'react'

import type { Anime } from 'types'
import { CollectionItem } from '@components/collection/page-collection-item'
import { PageCollectionLoader } from '@components/collection/page-colletion-loader'

interface Props {
  title: string
  id: string
}

export const PageColectionList = ({ title, id }: Props) => {
  const [url, setUrl] = useState('')
  const [animes, setAnimes] = useState<Anime[]>()
  useEffect(() => {
    const collection = JSON.parse(
      sessionStorage.getItem(`animeCollection_${id}`) ?? ''
    )
    if (!collection) return

    setUrl(`/api/animes?${collection.query}&banners_filter=false`)

    const getAnimes = async () => {
      if (!url) return
      const data = await fetch(url).then((res) => res.json())
      setAnimes(data.data)
    }
    getAnimes()
  }, [setAnimes, setUrl, url, id])

  if (!animes) return <PageCollectionLoader />

  return (
    <div className="mx-auto flex flex-col gap-4">
      <header className="flex flex-row justify-between">
        <h2 className="mb-6 h-20 overflow-hidden text-xl font-bold text-white md:h-auto  md:text-3xl">
          {title}
        </h2>
      </header>
      <ul className="grid grid-cols-1 gap-x-4 gap-y-8 md:grid-cols-2 xl:grid-cols-3">
        {animes.map((anime) => (
          <CollectionItem key={anime.mal_id} anime={anime} />
        ))}
      </ul>
    </div>
  )
}
