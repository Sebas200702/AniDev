import { useIndexStore } from '@store/index-store'
import { useEffect, useState } from 'react'
import type { Anime, Collection } from 'types'
import { createDynamicUrl } from '@utils/create-dynamic-url'
import { normalizeString } from '@utils/normalize-string'

interface Props {
  id: string
}

export const AnimeCollection = ({ id }: Props) => {
  const { collections, setCollections } = useIndexStore()
  const [loading, setLoading] = useState(true)
  const [animes, setAnimes] = useState<Anime[]>([])
  const [title, setTitle] = useState('')
  const [query, setQuery] = useState('')

  const isCollectionUnique = (newAnimeIds: number[]): boolean => {
    return collections.some(
      (collection) => collection.animes_ids.join('-') === newAnimeIds.join('-')
    )
  }

  useEffect(() => {
    const fetchData = async () => {
      const storedData = sessionStorage.getItem(`animeCollection_${id}`)
      if (storedData) {
        const parsedData = JSON.parse(storedData)
        setAnimes(parsedData.animes)
        setTitle(parsedData.title)
        setQuery(parsedData.query)
        setTimeout(() => {
          setLoading(false)
        }, 200)
        return
      }

      const { url, title: generatedTitle } = createDynamicUrl(20)
      setQuery(url)

      const data = await fetchAnimes(url, generatedTitle)
      if (!data || isCollectionUnique(data.animes_ids)) return
      setAnimes(data.animes)
      setTitle(data.title)

      const newCollection = {
        title: data.title,
        query: url,
        animes_ids: data.animes_ids,
      }
      collections.push(newCollection)
      console.log(collections)

      setCollections([...collections, newCollection])
      sessionStorage.setItem(
        `animeCollection_${id}`,
        JSON.stringify({ ...data, query: url })
      )

      setLoading(false)
    }

    fetchData()
  }, [id])

  useEffect(() => {
    let currentCollections: Collection[] = []
    Object.keys(sessionStorage).forEach((key) => {
      if (key.startsWith('animeCollection_')) {
        currentCollections.push(JSON.parse(sessionStorage.getItem(key)!))
      }
    })
    setCollections(currentCollections)
  }, [])

  const fetchAnimes = async (url: string, dynamicTitle: string) => {
    const response = await fetch(
      `/api/animes?limit_count=3&${url}&banners_filter=false`
    ).then((res) => res.json())

    const fetchedAnimes: Anime[] = response.data ?? []
    const newAnimeIds = fetchedAnimes.map((anime) => anime.mal_id)
    if (isCollectionUnique(newAnimeIds) || fetchedAnimes.length !== 3) {
      const { url: newUrl, title: generatedTitle } = createDynamicUrl(20)
      return await fetchAnimes(newUrl, generatedTitle)
    }

    return {
      animes: fetchedAnimes,
      title: dynamicTitle,
      query: url,
      animes_ids: newAnimeIds,
    }
  }

  const style1 =
    'rotate-[-10deg] translate-x-10 translate-y-[35%] md:hover:translate-y-[20%] transition-transform duration-300 ease-in-out'
  const style2 =
    'z-10  translate-y-[40%] md:hover:translate-y-[25%] transition-transform duration-300 ease-in-out'
  const style3 =
    'z-20 -translate-x-10 translate-y-1/2 rotate-[10deg] md:hover:translate-y-[35%] transition-transform duration-300 ease-in-out'

  if (loading || !animes.length)
    return (
      <div className="flex h-60 w-full animate-pulse items-center justify-center rounded-lg bg-zinc-800 px-4"></div>
    )

  return (
    <article className="mx-auto flex max-h-60 w-full flex-col overflow-hidden rounded-lg bg-secondary transition-all duration-300 ease-in-out md:p-4 md:hover:scale-[1.03]">
      <a href={`/collection/${normalizeString(title)}_${id}`}>
        <h2 className="mx-auto h-12 max-w-80 text-balance p-4 text-center text-xl font-bold text-white">
          {title || 'Sin Título'}
        </h2>

        <ul className="mx-auto -mt-4 flex h-full w-full flex-row justify-center">
          {animes.map((anime, i) => (
            <li key={anime.mal_id}>
              <div
                className={`aspect-[225/330] h-auto w-full max-w-44 rounded-md bg-secondary object-cover object-center ${
                  i === 0 ? style1 : i === 1 ? style2 : style3
                }`}
              >
                <img
                  src={anime.image_webp}
                  alt={anime.title}
                  fetchPriority="high"
                  className="p-1.5 w-full rounded-xl"
                />
              </div>
            </li>
          ))}
        </ul>
      </a>
    </article>
  )
}
