import { useEffect, useState } from 'react'

import { CollectionItem } from '@components/collection/page-collection-item'
import { PageCollectionLoader } from '@components/collection/page-colletion-loader'
import type { Anime } from 'types'

/**
 * Props for the PageColectionList component.
 *
 * @typedef {Object} Props
 * @property {string} title - The title of the collection.
 * @property {string} id - The ID of the collection to fetch data for.
 */
interface Props {
  title: string
  id: string
}

/**
 * PageColectionList component fetches and displays a collection of anime based on the provided ID.
 *
 * @description This component manages the loading state, fetches anime data, and checks for unique collections.
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
 * @param {Props} props - The component props
 * @param {string} props.title - The title of the collection to display
 * @param {string} props.id - The unique identifier for the anime collection used for caching and retrieval
 * @returns {JSX.Element} The rendered anime collection with title, anime cards, and navigation
 *
 * @example
 * <PageColectionList title="Popular Anime" id="collection-1" />
 */
export const PageColectionList = ({ title, id }: Props) => {
  const [url, setUrl] = useState('')
  const [animes, setAnimes] = useState<Anime[]>()
  useEffect(() => {
    const collection = JSON.parse(
      sessionStorage.getItem(`animeCollection_${id}`) ?? ''
    )
    if (!collection) return

    setUrl(`/api/animes/full?${collection.query}&banners_filter=false`)

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
        <h2 className="mb-6 h-20 overflow-hidden text-xl font-bold text-white md:h-auto md:text-3xl">
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
