import { useEffect, useState } from 'react'
import { useFetch } from '@hooks/useFetch'
import type { AnimeEpisode } from 'types'
import '@styles/custom-scrollbar.css'
import { createImageUrlProxy } from '@utils/craete-imageurl-proxy'
import Pagination from '@components/pagination'

interface Props {
  mal_id: number
  slug: string
  image_webp?: string
  totalEpisodes: number
  currentEpisode?: number
}

export const AnimeEpisodes = ({
  slug,
  mal_id,
  image_webp,
  totalEpisodes,
  currentEpisode,
}: Props) => {
  const [page, setPage] = useState<number | null>(null)
  const [shouldScroll, setShouldScroll] = useState(false)
  const totalPages = Math.ceil(totalEpisodes / 100)
  const { data: episodes, loading } = useFetch<AnimeEpisode[]>({
    url: page ? `/api/episodes?id=${mal_id}&page=${page}` : '',
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
        top: offsetTop - episodesList.clientHeight / 2,
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

  if (loading || !episodes || page === null)
    return (
      <div className="z-10 h-full w-full p-2">
        <div className="anime-list custom-scrollbar relative grid max-h-[500px] w-full grid-cols-1 gap-4 overflow-y-auto p-2 md:grid-cols-3 md:overflow-y-auto xl:mt-0 xl:max-h-[90%] xl:grid-cols-1 xl:overflow-y-auto">
          {Array(100)
            .fill(0)
            .map((_, i) => (
              <div
                className="flex h-full w-full animate-pulse flex-col gap-4 rounded-lg bg-zinc-600 p-2 transition-all duration-300 ease-in-out md:max-w-[400px]"
                key={i + 1}
              >
                <div className="aspect-[16/9] h-full w-full animate-pulse rounded-md bg-zinc-800 object-cover transition-all duration-200 ease-in-out"></div>
                <div className="h-8 w-full animate-pulse rounded-md bg-zinc-800 transition-all duration-200 ease-in-out"></div>
              </div>
            ))}
        </div>
        <div className={`w-full ${totalPages > 1 ? '' : 'hidden'}`}>
          <Pagination
            totalPages={totalPages}
            initialPage={page ?? 1}
            onPageChange={handlePageChange}
          />
        </div>
      </div>
    )

  return (
    <section className="z-10 w-full p-2">
      <ul className="anime-list custom-scrollbar relative grid max-h-[500px] w-full grid-cols-1 gap-4 overflow-y-auto p-2 md:grid-cols-3 md:overflow-y-auto xl:mt-0 xl:max-h-[90%] xl:grid-cols-1 xl:overflow-y-auto">
        {episodes.map(({ episode_id, title, image_url, anime_mal_id }) => (
          <a
            href={`/watch/${slug}_${anime_mal_id}?ep=${episode_id}`}
            className={`group relative flex h-auto w-full flex-col gap-4 rounded-lg p-2 transition-all duration-300 ease-in-out hover:saturate-[.7] md:max-w-[400px] md:hover:scale-[1.01] ${
              currentEpisode === episode_id
                ? 'bg-enfasisColor'
                : 'md:hover:bg-zinc-500'
            }`}
            key={episode_id}
          >
            <picture
              className="aspect-[16/9] h-full w-full rounded-md"
              style={{
                backgroundImage: `url(${createImageUrlProxy(
                  image_url ?? image_webp,
                  '100',
                  '0',
                  'webp'
                )})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
              }}
            >
              <img
                src={createImageUrlProxy(
                  image_url ?? image_webp,
                  '1080',
                  '80',
                  'webp'
                )}
                alt={title ?? `Episodio ${episode_id}`}
                loading="lazy"
                className="aspect-[16/9] h-full w-full rounded-md object-cover"
              />
            </picture>
            <h3 className="text-pretty text-xl font-bold text-white transition-all duration-300 ease-in-out">
              {title ?? `${slug} Episodio ${episode_id}`}
            </h3>
            <span className="absolute right-3 top-3 flex h-10 w-10 items-center justify-center rounded-full bg-black/30 text-lg font-bold text-white">
              {episode_id}
            </span>
          </a>
        ))}
      </ul>
      <div className={`w-full ${totalPages > 1 ? '' : 'hidden'}`}>
        <Pagination
          totalPages={totalPages}
          initialPage={page || 1}
          onPageChange={handlePageChange}
        />
      </div>
    </section>
  )
}
