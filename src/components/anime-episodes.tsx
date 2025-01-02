import { reduceSynopsis } from '@utils/reduce-synopsis'
import { useEffect, useState } from 'react'
import { useFetch } from '@hooks/useFetch'
import type { AnimeEpisode } from 'types'
interface Props {
  mal_id: number
  slug: string
  image_webp?: string
  synopsis?: string
  context: string
  totalEpisodes: number
  currentEpisode?: number
}
export const AnimeEpisodes = ({
  slug,
  mal_id,
  image_webp,
  synopsis,
  context,
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
      <div
        className={`${context === 'anime-info' ? 'mt-10 w-full md:mx-20' : 'flex flex-col'} overflow-hidden p-2 xl:mt-0`}
      >
        {context === 'anime-info' && (
          <h2 className="mb-20 text-pretty text-2xl font-bold text-gray-900">
            Episodes
          </h2>
        )}
        <div className="flex max-h-[10%] w-full flex-row items-center gap-2">
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
        <div
          className={`anime-list relative grid w-auto grid-cols-1 flex-col overflow-y-auto scroll-smooth p-2 ${context === 'anime-info' ? 'max-h-96 w-full gap-6 xl:grid-cols-2' : 'max-h-64 gap-4 md:grid-cols-2 xl:max-h-[90%] xl:grid-cols-1'} [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-gray-300 [&::-webkit-scrollbar-track]:rounded-full [&::-webkit-scrollbar-track]:bg-gray-100 [&::-webkit-scrollbar]:w-2`}
        >
          {Array(100)
            .fill(0)
            .map((_, i) => (
              <div
                className="flex h-full max-h-[109px] min-w-full max-w-full animate-pulse flex-row rounded-lg bg-gray-200 p-2 transition-all duration-300 ease-in-out md:min-w-[500px] md:max-w-[500px]"
                key={i + 1}
              >
                <div className="aspect-[16/9] h-full w-[33%] animate-pulse rounded-md bg-gray-400 object-cover transition-all duration-200 ease-in-out"></div>

                <div className="flex h-full w-full animate-pulse flex-col items-start gap-2 p-2 transition-all duration-200 ease-in-out">
                  <div className="h-8 w-[70%] animate-pulse rounded-md bg-gray-400 transition-all duration-200 ease-in-out"></div>
                  <div className="h-20 w-[90%] animate-pulse rounded-md bg-gray-400 transition-all duration-200 ease-in-out"></div>
                </div>
              </div>
            ))}
        </div>
      </div>
    )
  return (
    <section
      className={` ${context === 'anime-info' ? 'mt-10 w-full md:mx-20' : 'overflow-hidden'} p-2 xl:mt-0`}
    >
      {context === 'anime-info' && (
        <h2 className="mb-20 text-pretty text-2xl font-bold text-gray-900">
          Episodes
        </h2>
      )}
      <div className="flex max-h-[10%] w-full flex-row items-center gap-2">
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
      <ul
        className={`anime-list relative scroll-smooth [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-gray-300 [&::-webkit-scrollbar-track]:rounded-full [&::-webkit-scrollbar-track]:bg-gray-100 [&::-webkit-scrollbar]:w-2 ${
          context === 'anime-info'
            ? 'grid max-h-96 w-full grid-cols-1 gap-6 overflow-y-auto p-2 xl:grid-cols-2'
            : 'grid max-h-64 grid-cols-1 gap-4 overflow-y-auto p-2 md:max-h-64 md:grid-cols-2 md:overflow-y-auto xl:mt-0 xl:max-h-[90%] xl:grid-cols-1'
        }`}
      >
        {episodes.map(
          ({ episode_id, title, description, image_url, anime_mal_id }) => (
            <a
              href={`/watch/${slug}_${anime_mal_id}?ep=${episode_id}`}
              className={`group flex h-full max-h-[109px] w-full flex-row gap-4 rounded-lg p-2 transition-all duration-300 ease-in-out md:max-w-[500px] md:hover:scale-[1.01] ${currentEpisode === episode_id ? 'bg-blue-300 hover:bg-blue-400' : 'md:hover:bg-gray-300'}`}
              key={episode_id}
            >
              <img
                src={image_url ?? image_webp}
                alt={title ?? `Episodio ${episode_id}`}
                loading="lazy"
                className="aspect-[16/9] h-full w-[33%] rounded-md object-cover"
              />

              <div className="flex w-full flex-col gap-2">
                <h3 className="text-pretty text-xl font-bold text-gray-900 transition-all duration-300 ease-in-out md:group-hover:text-zinc-100">
                  {title ?? `Episodio ${episode_id}`}
                </h3>
                <p className="w-full text-sm text-gray-800">
                  {description ?? reduceSynopsis(synopsis, 50)}
                </p>
              </div>
            </a>
          )
        )}
      </ul>
    </section>
  )
}
