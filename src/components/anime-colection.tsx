import { useIndexStore } from '@store/index-store'
import { useEffect, useState } from 'react'
import type { Anime } from 'types'
import { createDynamicUrl } from '@utils/create-dynamic-url'
import { normalizeString } from '@utils/normalize-string'

export const AnimeCollection = () => {
  const { collections, setCollections } = useIndexStore()
  const [loading, setLoading] = useState(true)
  const [animes, setAnimes] = useState<Anime[]>([])
  const [title, setTitle] = useState('')

  const isCollectionUnique = (newCollectionIds: number[]): boolean => {
    return collections.some(
      (collection) =>
        collection.animes_ids.join('-') === newCollectionIds.join('-')
    )
  }
  const fetchAnimes = async () => {
    const { url, title } = createDynamicUrl(20)
    const response = await fetch(
      `/api/animes?limit_count=3&${url}&banners_filter=false`
    ).then((res) => res.json())
    const fetchedAnimes: Anime[] = response.data ?? []
    const newAnimeIds = fetchedAnimes.map((anime) => anime.mal_id)
    if (isCollectionUnique(newAnimeIds) || fetchedAnimes.length !== 3) {
      return await fetchAnimes()
    }

    collections.push({
      title,
      query: url,
      animes_ids: newAnimeIds,
    })

    const newCollection = {
      title,
      query: url,
      animes_ids: newAnimeIds,
    }

    return {
      animes: fetchedAnimes,
      title,
      newCollection,
    }
  }

  useEffect(() => {
    const fetchData = async () => {
      const data = await fetchAnimes()
      if (data) {
        setAnimes(data.animes)
        setTitle(data.title)
        setCollections([...collections, data.newCollection])
      }
      setTimeout(() => {
        setLoading(false)
      }, 700)
    }

    fetchData()
  }, [])

  const style1 =
    'rotate-[-10deg] translate-x-8 translate-y-[35%]  md:hover:translate-y-[20%] transition-transform duration-200 ease-in-out'
  const style2 =
    'z-10 -translate-x-1 translate-y-[40%] md:hover:translate-y-[25%] transition-transform duration-200 ease-in-out'
  const style3 =
    'z-20 -translate-x-6 translate-y-1/2 rotate-[10deg] md:hover:translate-y-[35%] transition-transform duration-200 ease-in-out'

  if (loading || !animes)
    return (
      <div className="flex h-60 w-full animate-pulse items-center justify-center rounded-lg bg-zinc-800 p-4"></div>
    )
  return (
    <article className="mx-auto flex max-h-60 w-full flex-col overflow-hidden rounded-lg bg-secondary transition-all duration-200 ease-in-out md:p-4 md:hover:scale-[1.03]">
      <a href={`/collection/${normalizeString(title)}`}>
        <h2 className="mx-auto h-12 max-w-80 text-balance px-4 text-center text-xl font-bold text-white">
          {title}
        </h2>

        <ul className="mx-auto -mt-4 flex h-full w-full flex-row justify-center">
          {animes?.map((anime, i) => (
            <li key={anime.mal_id}>
              <img
                src={anime.image_webp}
                alt={anime.title}
                className={`aspect-[225/330] h-auto min-w-28 rounded-md object-cover object-center ${i === 0 ? style1 : i === 1 ? style2 : style3}`}
                fetchPriority="high"
              />
            </li>
          ))}
        </ul>
      </a>
    </article>
  )
}
