import { reduceString } from '@utils/reduce-string'
import { useEffect, useState } from 'react'
import { useFetch } from '@hooks/useFetch'
import type { AnimeEpisode } from 'types'
import '@styles/custom-scrollbar.css'
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
  const [page, setPage] = useState<number>(1)
  const {
    data: episodes,
    error,
    loading,
  } = useFetch<AnimeEpisode[]>({
    url: `/api/episodes?id=${mal_id}&page=${page}`,
  })
  const totalPages = Math.ceil(totalEpisodes / 100)

  useEffect(() => {
    if (!currentEpisode) return
    const searchParams = new URLSearchParams(window.location.search)
    const currentPage = searchParams.get('page')
    const calcPage = (totalPages: number, currentEpisode: number) => {
      let page = 1
      for (let i = 0; i <= totalPages; i++) {
        if (currentEpisode > (i + 1) * 100) {
          page++
        }
      }
      return page
    }
    setPage(
      parseInt(currentPage ?? calcPage(totalPages, currentEpisode).toString())
    )
  }, [setPage, page, currentEpisode])

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
  }
  const handleClick = (page: number) => {
    setPage(page)
    const searchParams = new URLSearchParams(window.location.search)
    searchParams.set('page', page.toString())
    window.history.pushState(
      { path: window.location.pathname },
      '',
      `${window.location.pathname}?${searchParams.toString()}`
    )
  }

  useEffect(
    () => scrollToEpisode(),
    [currentEpisode, episodes, loading, error, page, setPage]
  )
  if (loading || !episodes)
    return (
      <div className="z-10 w-full p-2 xl:mt-0">
        <div
          className={`flex max-h-[10%] w-full flex-row items-center gap-2 ${totalPages > 1 ? '' : 'hidden'}`}
        >
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i + 1}
              className={`min-h-8 min-w-8 rounded-full bg-gray-200 transition-all duration-300 ease-in-out ${
                page === i + 1 ? 'bg-blue-500' : 'bg-gray-200'
              }`}
              onClick={() => setPage(i + 1)}
            >
              {i + 1}
            </button>
          ))}
        </div>
        <div className="anime-list custom-scrollbar relative grid max-h-[500px] w-full grid-cols-1 gap-4 overflow-y-auto p-2 md:max-h-96 md:grid-cols-3 md:overflow-y-auto xl:mt-0 xl:max-h-[95%] xl:grid-cols-1 xl:overflow-y-auto">
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
      </div>
    )
  return (
    <section className="z-10 w-full p-2">
      <div
        className={`flex max-h-[10%] w-full flex-row items-center gap-2 ${totalPages > 1 ? '' : 'hidden'}`}
      >
        {Array.from({ length: totalPages }, (_, i) => (
          <button
            key={i + 1}
            className={`min-h-8 min-w-8 rounded-full transition-all duration-300 ease-in-out ${
              page === i + 1 ? 'bg-blue-400 text-white' : 'bg-gray-200'
            }`}
            onClick={() => handleClick(i + 1)}
          >
            {i + 1}
          </button>
        ))}
      </div>
      <ul className="anime-list custom-scrollbar relative grid max-h-[500px] w-full grid-cols-1 gap-4 overflow-y-auto p-2 md:grid-cols-3 md:overflow-y-auto xl:mt-0 xl:max-h-[95%] xl:grid-cols-1 xl:overflow-y-auto">
        {episodes.map(({ episode_id, title, image_url, anime_mal_id }) => (
          <a
            href={`/watch/${slug}_${anime_mal_id}?ep=${episode_id}`}
            className={`group relative flex h-auto w-full flex-col gap-4 rounded-lg p-2 transition-all duration-300 ease-in-out md:max-w-[400px] md:hover:scale-[1.01] ${currentEpisode === episode_id ? 'bg-blue-500 hover:bg-blue-400' : 'md:hover:bg-zinc-500'}`}
            key={episode_id}
          >
            <img
              src={image_url ?? image_webp}
              alt={title ?? `Episodio ${episode_id}`}
              loading="lazy"
              className="aspect-[16/9] h-full w-full rounded-md object-cover"
            />
            <h3 className="text-pretty text-xl font-bold text-white transition-all duration-300 ease-in-out">
              {title ?? `${slug} Episodio ${episode_id}`}
            </h3>
            <span className="absolute right-3 top-3 flex h-10 w-10 items-center justify-center rounded-full bg-black/30 text-lg font-bold text-white">
              {episode_id}
            </span>
          </a>
        ))}
      </ul>
    </section>
  )
}
