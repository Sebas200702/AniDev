import { useEffect, useState } from 'react'
import { AnimeCard } from '@components/anime-card'
import { useWindowWidth } from '@store/window-width'
import { useFetch } from '@hooks/useFetch'
import type { Anime } from 'types'
import '@styles/no-scrolbar.css'

interface Props {
  query: string
  title: string
}

export const AnimeSlider = ({ query, title }: Props) => {
  const [cachedAnimes, setCachedAnimes] = useState<Anime[] | null>(null)
  const { width: windowWidth, setWidth: setWindowWidth } = useWindowWidth()

  const storageKey = `animes_${query}`

  const { data: animes, loading } = useFetch<Anime[]>({
    url: `/api/animes?limit_count=24&${query}&banners_filter=false`,
    skip: !!cachedAnimes,
  })

  useEffect(() => {
    const storedAnimes = sessionStorage.getItem(storageKey)
    if (storedAnimes) {
      setCachedAnimes(JSON.parse(storedAnimes))
    }
  }, [storageKey])

  useEffect(() => {
    if (animes && !cachedAnimes) {
      sessionStorage.setItem(storageKey, JSON.stringify(animes))
      setCachedAnimes(animes)
    }
  }, [animes, cachedAnimes, storageKey])

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth)
    setWindowWidth(window.innerWidth)
    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [setWindowWidth])

  useEffect(() => {
    const sliders = document.querySelectorAll('.anime-slider')

    sliders.forEach((slider) => {
      const sliderList = slider.querySelector('.anime-list') as HTMLUListElement
      const prevButton = slider.querySelector(
        '.prev-button'
      ) as HTMLButtonElement
      const nextButton = slider.querySelector(
        '.next-button'
      ) as HTMLButtonElement

      const updateButtonsVisibility = () => {
        if (!sliderList) return
        const { scrollLeft, scrollWidth, clientWidth } = sliderList
        prevButton.style.display = scrollLeft <= 0 ? 'none' : 'flex'
        nextButton.style.display =
          scrollLeft + clientWidth >= scrollWidth ? 'none' : 'flex'
      }

      const handleScroll = (direction: 'next' | 'prev') => {
        if (!sliderList || windowWidth === null) return

        const scrollAmount =
          windowWidth >= 1280
            ? 6 * ((windowWidth - 8) / 6.4) + 1
            : 4 * ((windowWidth - 8) / 4.4) + 1

        const scrollDistance =
          direction === 'next' ? scrollAmount : -scrollAmount

        sliderList.scrollBy({
          left: scrollDistance,
          behavior: 'smooth',
        })
      }

      sliderList.addEventListener('scroll', updateButtonsVisibility)
      prevButton.addEventListener('click', () => handleScroll('prev'))
      nextButton.addEventListener('click', () => handleScroll('next'))

      updateButtonsVisibility()

      return () => {
        sliderList.removeEventListener('scroll', updateButtonsVisibility)
        prevButton.removeEventListener('click', () => handleScroll('prev'))
        nextButton.removeEventListener('click', () => handleScroll('next'))
      }
    })
  }, [cachedAnimes, windowWidth, loading])

  const displayAnimes = cachedAnimes || animes

  if (loading && !cachedAnimes)
    return (
      <div className="relative mx-auto mb-6 mt-6 w-[calc(100dvw-8px)]">
        <span className="ml-[calc(((100dvw-8px)/6.4)*0.2)] inline-flex h-8 w-32 animate-pulse items-center justify-center rounded-lg bg-zinc-700"></span>
        <div className="relative overflow-hidden">
          <div className="anime-list mt-4 flex w-full flex-row overflow-x-auto md:px-[calc(((100dvw-8px)/4.4)*0.2)] xl:px-[calc(((100dvw-8px)/6.4)*0.2)]">
            {Array(24)
              .fill(0)
              .map((_, i) => (
                <div
                  key={i + 1}
                  className="flex h-auto w-full min-w-[calc((100dvw-8px)/2.4)] flex-col items-center gap-1 p-3 duration-200 md:min-w-[calc((100dvw-8px)/4.4)] xl:min-w-[calc((100dvw-8px)/6.4)]"
                >
                  <div className="aspect-[225/330] h-auto w-full animate-pulse rounded-lg bg-zinc-700 md:aspect-[225/330]"></div>
                </div>
              ))}
          </div>
        </div>
      </div>
    )

  if (windowWidth !== null && windowWidth < 768) {
    return (
      <section className="relative mx-auto mt-6 w-[calc(100dvw-8px)]">
        <h2 className="px-[calc(((100dvw-8px)/6.4)*0.2)] text-2xl font-bold text-white">
          {title}
        </h2>
        <ul className="anime-list mx-auto mt-4 flex w-full flex-row overflow-x-auto scroll-smooth py-2">
          {displayAnimes?.map((anime: Anime) => (
            <AnimeCard key={anime.mal_id} anime={anime} context={title} />
          ))}
        </ul>
      </section>
    )
  }

  return (
    <section className="anime-slider relative mx-auto mb-6 mt-6 w-[calc(100dvw-8px)]">
      <header className="flex items-center space-x-4 px-[calc(((100dvw-8px)/6.4)*0.2)] text-white">
        <h2 className="text-3xl font-bold">{title}</h2>
        <div className="mt-2 flex-1 border-t border-white/50"></div>
      </header>

      <div className="relative overflow-hidden">
        <button className="prev-button group absolute inset-0 z-10 my-auto hidden h-16 w-10 rounded-lg bg-blue-500 transition-all duration-300 ease-in-out focus:outline-none">
          <svg
            className="mx-auto my-auto h-6 w-6 rotate-180"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="#fff"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
          >
            <path d="M7 7l5 5-5 5M13 7l5 5-5 5"></path>
          </svg>
        </button>

        <ul className="anime-list mx-auto mt-4 flex w-full flex-row overflow-x-auto scroll-smooth py-2 md:px-[calc(((100dvw-8px)/4.4)*0.2)] xl:px-[calc(((100dvw-8px)/6.4)*0.2)]">
          {displayAnimes?.map((anime: Anime) => (
            <AnimeCard key={anime.mal_id} anime={anime} context={title} />
          ))}
        </ul>

        <button className="next-button group absolute bottom-0 right-0 top-0 z-10 my-auto hidden max-h-16 w-10 items-center justify-center rounded-lg bg-blue-500 transition-all duration-300 ease-in-out focus:outline-none">
          <svg
            className="mx-auto my-auto h-6 w-6"
            xmlns="http://www.w3.org/2000/svg"
            width="32"
            height="32"
            fill="none"
            stroke="#fff"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
          >
            <path d="M7 7l5 5-5 5M13 7l5 5-5 5"></path>
          </svg>
        </button>
      </div>
    </section>
  )
}
