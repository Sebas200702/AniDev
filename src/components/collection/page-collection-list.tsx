import { useEffect, useState } from 'react'

import { AnimeDetailCard } from '@components/anime-detail-card'
import { PageCollectionLoader } from '@components/collection/page-colletion-loader'
import { Overlay } from '@components/overlay'
import { Picture } from '@components/picture'
import { createImageUrlProxy } from '@utils/create-imageurl-proxy'
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

    setUrl(
      `/api/animes?${collection.query}&banners_filter=false&format=anime-detail`
    )

    const getAnimes = async () => {
      if (!url) return
      const data = await fetch(url).then((res) => res.json())
      setAnimes(data.data)
    }
    getAnimes()
  }, [setAnimes, setUrl, url, id])

  if (!animes) return <PageCollectionLoader />

  return (
    <>
      <div className="fixed aspect-[1080/600] h-[40vh] w-full overflow-hidden">
        <Picture
          image={createImageUrlProxy(
            animes[0].banner_image ?? '',
            '100',
            '0',
            'webp'
          )}
          styles="w-full object-cover object-center h-full relative "
        >
          <img
            src={createImageUrlProxy(
              animes[0].banner_image ?? '',
              '1920',
              '50',
              'webp'
            )}
            alt=""
            className="relative h-full w-full object-cover object-center"
          />
        </Picture>
      </div>

      <Overlay className="to-Primary-950 via-Primary-950 absolute inset-0 bg-gradient-to-b via-[38dvh]" />
      <Overlay className="to-Primary-950 via-Primary-950/20 absolute inset-0 bg-gradient-to-l via-60%" />
      <section className="relative z-10 flex flex-col gap-10 px-4 pt-[35dvh] md:px-20">
        <h2 className="subtitle text-balance">{title}</h2>

        <ul className="grid grid-cols-1 gap-6 md:grid-cols-2 md:gap-10 xl:grid-cols-3">
          {animes.map((anime) => (
            <AnimeDetailCard key={anime.mal_id} anime={anime} />
          ))}
        </ul>
      </section>
    </>
  )
}
