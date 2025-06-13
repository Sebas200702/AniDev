import { useGlobalUserPreferences } from '@store/global-user'
import { useEffect, useState } from 'react'
import type { AnimeCollectionInfo, Collection } from 'types'

import { Picture } from '@components/picture'
import { useIndexStore } from '@store/index-store'
import { baseUrl } from '@utils/base-url'
import { createDynamicUrl } from '@utils/create-dynamic-url'
import { normalizeString } from '@utils/normalize-string'

interface Props {
  /**
   * Unique identifier for the anime collection used for caching and retrieval.
   */
  id: string
}

/**
 * AnimeCollection component fetches and displays a collection of anime based on the provided ID.
 *
 * @summary
 * A component that displays a visually appealing collection of anime cards with a title and navigation.
 *
 * @description
 * This component manages the loading state, fetches anime data, and checks for unique collections.
 * It uses session storage to cache the fetched data for faster access. The component ensures that
 * each collection contains unique anime entries by validating IDs before displaying. If a collection
 * is not unique, it will fetch a new set of animes. The component also handles responsive layout
 * and provides a link to view the full collection.
 *
 * The component maintains an internal state for anime data, loading status, collection title,
 * and query parameters. It implements an efficient caching mechanism using sessionStorage to
 * improve performance on subsequent visits. When no cached data is available, it dynamically
 * generates a URL and fetches a new collection of anime.
 *
 * The UI displays a title, anime cards in a grid layout, and a "View All" link that navigates
 * to the complete collection. During loading, a skeleton loader is displayed to improve
 * user experience.
 *
 * @features
 * - Caching: Uses sessionStorage to cache fetched collections for faster loading
 * - Uniqueness validation: Ensures each collection contains unique anime entries
 * - Responsive design: Adapts to different screen sizes with appropriate styling
 * - Visual effects: Implements card rotation and hover animations for interactive feel
 * - Error handling: Gracefully handles loading states and empty collections
 *
 * @param {Props} props - The component props
 * @param {string} props.id - The unique identifier for the anime collection used for caching and retrieval
 * @returns {JSX.Element} The rendered anime collection with title, anime cards, and navigation
 *
 * @example
 * <AnimeCollection id="collection-1" />
 */
export const AnimeCollection = ({ id }: Props) => {
  const { parentalControl } = useGlobalUserPreferences()
  const { collections, setCollections } = useIndexStore()
  const [loading, setLoading] = useState(true)
  const [animes, setAnimes] = useState<AnimeCollectionInfo[]>([])
  const [title, setTitle] = useState('')
  const [_query, setQuery] = useState('')

  /**
   * Checks if a collection is unique by comparing the IDs of the anime entries.
   *
   * @param {number[]} newAnimeIds - The IDs of the anime entries in the new collection.
   * @returns {boolean} True if the collection is unique, false otherwise.
   */
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

      const { url, title: generatedTitle } = createDynamicUrl(30)
      setQuery(url)

      const data = await fetchAnimes(url, generatedTitle)

      setAnimes(data.animes)
      setTitle(data.title)

      const newCollection = {
        title: data.title,
        query: url,
        animes_ids: data.animes_ids,
      }

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
    setLoading(true)
    let currentCollections: Collection[] = []
    Object.keys(sessionStorage).forEach((key) => {
      if (key.startsWith('animeCollection_')) {
        currentCollections.push(JSON.parse(sessionStorage.getItem(key)!))
      }
    })
    setCollections(currentCollections)
    setTimeout(() => {
      setLoading(false)
    }, 200)
  }, [])

  /**
   * Fetches a new collection of anime based on the provided URL and title.
   *
   * @param {string} url - The URL to fetch the anime data from.
   * @param {string} dynamicTitle - The title of the collection.
   * @returns {Promise<{ animes: Anime[], title: string, query: string, animes_ids: number[] }>} The fetched anime data.
   */
  const fetchAnimes = async (url: string, dynamicTitle: string) => {
    const response = await fetch(
      `/api/animes?${url.replace('limit_count=30', 'limit_count=3')}&banners_filter=false&format=anime-collection`
    ).then((res) => res.json())

    const fetchedAnimes: AnimeCollectionInfo[] = response.data ?? []
    const newAnimeIds = fetchedAnimes.map((anime) => anime.mal_id)
    if (isCollectionUnique(newAnimeIds) || fetchedAnimes.length !== 3) {
      const { url: newUrl, title: generatedTitle } = createDynamicUrl(
        30,
        parentalControl
      )
      return await fetchAnimes(newUrl, generatedTitle)
    }

    const newCollection = {
      animes: fetchedAnimes,
      title: dynamicTitle,
      query: url,
      animes_ids: newAnimeIds,
    }
    collections.push(newCollection)
    return newCollection
  }

  const style1 =
    'rotate-[-10deg] translate-x-10 translate-y-[35%] md:hover:translate-y-[20%] transition-transform duration-300 ease-in-out'
  const style2 =
    'z-10  translate-y-[40%] md:hover:translate-y-[25%] transition-transform duration-300 ease-in-out'
  const style3 =
    'z-20 -translate-x-10 translate-y-1/2 rotate-[10deg] md:hover:translate-y-[35%] transition-transform duration-300 ease-in-out'

  if (loading || !animes.length)
    return (
      <li className="flex h-54 w-full animate-pulse items-center justify-center rounded-lg bg-zinc-800"></li>
    )

  /**
   * Returns the CSS style for the anime card based on its position.
   *
   * @param {number} i - The position of the anime card.
   * @returns {string} The CSS style for the anime card.
   */
  const getPosition = (i: number) => {
    if (i === 0) return style1
    if (i === 1) return style2
    return style3
  }

  return (
    <li className="bg-Complementary mx-auto flex h-54 w-full flex-col overflow-hidden rounded-lg transition-all duration-300 ease-in-out md:p-4 md:hover:scale-[1.03]">
      <a href={`/collection/${normalizeString(title)}_${id}`}>
        <h4 className="text-l mx-auto h-12 max-w-80 p-4 text-center font-bold text-balance text-white">
          {title || 'Sin Título'}
        </h4>

        <ul className="mx-auto -mt-4 flex h-full w-full flex-row justify-center">
          {animes.map((anime, i) => (
            <Picture
              key={anime.mal_id}
              image={anime.image_small_webp ?? `${baseUrl}/placeholder.webp`}
              styles={`${getPosition(i)} w-full max-w-44 rounded-md relative`}
            >
              <img
                src={anime.image_webp ?? `${baseUrl}/placeholder.webp`}
                alt={anime.title}
                fetchPriority="high"
                loading="lazy"
                className="relative aspect-[225/330] h-auto w-full max-w-44 rounded-md object-cover object-center"
              />
            </Picture>
          ))}
        </ul>
      </a>
    </li>
  )
}
