import { Picture } from '@shared/components/media/picture'
import { useFetch } from '@shared/hooks/useFetch'
import type { AnimeEpisode } from '@watch/types'
import { AnimeEpisodesLoader } from 'domains/watch/components/episodes/anime-episodes-loader'
import Pagination from 'domains/watch/components/episodes/pagination'
import { useEffect, useState } from 'react'

interface Props {
  mal_id: number
  slug: string
  image_webp?: string
  totalEpisodes: number
  currentEpisode?: number
  duration: string
}

/**
 * AnimeEpisodes component displays a list of episodes for a specific anime.
 *
 * @description This component manages the loading state, fetches episode data, and provides
 * pagination functionality. It automatically scrolls to the current episode when loaded and
 * maintains the page state in the URL for better navigation. The component displays episodes
 * in a responsive grid layout with episode thumbnails, titles, and duration information.
 *
 * The component maintains internal state for the current page, scroll behavior, and fetched
 * episode data. It calculates the total number of pages based on the total episodes count
 * and implements pagination controls when necessary. When loading or when data isn't available,
 * it displays a skeleton loader to improve user experience.
 *
 * Each episode is rendered as a clickable card with the episode thumbnail, title, duration,
 * and episode number. The current episode is highlighted with a different background color
 * for easy identification.
 *
 * @param {Props} props - The component props
 * @param {string} props.slug - The slug of the anime for URL construction
 * @param {number} props.mal_id - The MyAnimeList ID used for API requests
 * @param {string} [props.image_webp] - Optional WebP image URL used as fallback for episode thumbnails
 * @param {number} props.totalEpisodes - The total number of episodes for the anime
 * @param {number} [props.currentEpisode] - Optional current episode number for auto-scrolling and highlighting
 * @param {string} props.duration - The duration of episodes
 * @returns {JSX.Element} The rendered episode list with pagination controls
 *
 * @example
 * <AnimeEpisodes
 *   slug="attack-on-titan_1234"
 *   mal_id={1234}
 *   totalEpisodes={25}
 *   currentEpisode={5}
 *   duration="24 min per ep"
 * />
 */
export const AnimeEpisodes = ({
  slug,
  mal_id,
  image_webp,
  totalEpisodes,
  currentEpisode,
  duration,
}: Props) => {
  const [page, setPage] = useState<number | null>(1)
  const [shouldScroll, setShouldScroll] = useState(false)
  const totalPages = Math.ceil(totalEpisodes / 100)
  const { data: episodes, loading } = useFetch<AnimeEpisode[]>({
    url: `/episodes?id=${mal_id}&page=${page}`,
  })

  useEffect(() => {
    if (!currentEpisode) return
    const initialPage = Math.ceil(currentEpisode / 100)
    setPage(initialPage)
    setShouldScroll(true)
  }, [currentEpisode])

  useEffect(() => {
    if (!shouldScroll || loading || !episodes) return

    const scrollToEpisode = () => {
      const episodesList = document.querySelector('.anime-list')
      const targetEpisode = document.querySelector(
        `.anime-list a[href*="ep=${currentEpisode}"]`
      ) as HTMLAnchorElement

      if (!episodesList || !targetEpisode) return
      const offsetTop = targetEpisode.offsetTop
      episodesList.scrollTo({
        top: offsetTop,
        behavior: 'smooth',
      })
      setShouldScroll(false)
    }

    scrollToEpisode()
  }, [episodes, currentEpisode, shouldScroll, loading])

  const handlePageChange = (newPage: number) => {
    setPage(newPage)
    const searchParams = new URLSearchParams(window.location.search)
    searchParams.set('page', newPage.toString())
    window.history.pushState(
      { path: window.location.pathname },
      '',
      `${window.location.pathname}?${searchParams.toString()}`
    )
    setShouldScroll(false)
  }

  if (loading || !episodes || !page || !totalEpisodes || !mal_id) {
    return (
      <AnimeEpisodesLoader
        totalPages={totalPages}
        page={page}
        handlePageChange={handlePageChange}
      />
    )
  }

  return (
    <section className="z-10 w-full p-2">
      <ul className="anime-list custom-scrollbar relative grid max-h-[500px] w-full grid-cols-1 gap-4 overflow-y-auto p-2 md:grid-cols-3 md:overflow-y-auto xl:mt-0 xl:max-h-[90%] xl:grid-cols-1 xl:overflow-y-auto">
        {episodes.map(({ episode_id, title, image_url, anime_mal_id }) => (
          <a
            href={`/watch/${slug}_${anime_mal_id}?ep=${episode_id}`}
            className={`group relative flex h-auto w-full flex-col gap-4 rounded-lg p-2 transition-all duration-300 ease-in-out hover:saturate-[.7] md:max-w-[400px] md:hover:scale-[1.01] ${
              currentEpisode === episode_id
                ? 'bg-enfasisColor'
                : 'md:hover:bg-zinc-600'
            }`}
            key={episode_id}
          >
            <Picture
              styles="relative aspect-video h-full w-full object-cover object-center rounded-md overflow-hidden"
              image={image_url || image_webp}
              placeholder={image_url || image_webp}
              alt={title ?? `Episodio ${episode_id}`}
            />

            <div className="bg-blur-sm absolute bottom-3 left-3 z-10 flex items-center justify-center rounded-sm bg-black/50 px-2.5 py-1.25 text-xs font-bold text-white transition-all duration-300 ease-in-out">
              <span className="text-sm text-white">
                {duration.replace(/\s*per\s*ep/i, '')}
              </span>
            </div>
            <h3 className="text-xl font-bold text-pretty text-white transition-all duration-300 ease-in-out">
              {title ?? `${slug} Episodio ${episode_id}`}
            </h3>
            <span className="absolute top-3 right-3 flex h-10 w-10 items-center justify-center rounded-full bg-black/50 text-lg font-bold text-white">
              {episode_id}
            </span>
          </a>
        ))}
      </ul>
      <footer className={`w-full ${totalPages > 1 ? '' : 'hidden'}`}>
        <Pagination
          totalPages={totalPages}
          initialPage={page ?? 1}
          onPageChange={handlePageChange}
        />
      </footer>
    </section>
  )
}
