import { useEffect, useState, useCallback } from 'react'
import { AnimeCard } from '@components/anime-card'
import { useWindowWidth } from '@store/window-width'
import { useFetch } from '@hooks/useFetch'
import type { Anime } from 'types'
import '@styles/no-scrollbar.css'

interface Props {
  query: string
  title: string
}

export const AnimeSlider = ({ query, title }: Props) => {
  const [cachedAnimes, setCachedAnimes] = useState<Anime[]>([])
  const { width: windowWidth, setWidth: setWindowWidth } = useWindowWidth()

  const storageKey = `animes_${query}`

  const getCachedAnimes = useCallback(() => {
    const storedAnimes = sessionStorage.getItem(storageKey)
    if (storedAnimes) {
      const parsedAnimes = JSON.parse(storedAnimes)
      setCachedAnimes(parsedAnimes)
      return parsedAnimes
    }
    return null
  }, [storageKey])

  const { data: animes, loading } = useFetch<Anime[]>({
    url: `/api/animes?limit_count=24&${query}&banners_filter=false`,
    skip: cachedAnimes.length > 0,
  })

  useEffect(() => {
    const storedAnimes = getCachedAnimes()
    if (!storedAnimes && animes) {
      sessionStorage.setItem(storageKey, JSON.stringify(animes))
      setCachedAnimes(animes)
    }
  }, [animes, storageKey, getCachedAnimes])

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
        if (windowWidth && windowWidth < 768) {
          prevButton.style.display = 'none'
          nextButton.style.display = 'none'
          return
        }
        const { scrollLeft, scrollWidth, clientWidth } = sliderList
        prevButton.style.display = scrollLeft <= 0 ? 'none' : 'flex'
        nextButton.style.display =
          scrollLeft + clientWidth >= scrollWidth ? 'none' : 'flex'
      }

      const handleScroll = (direction: 'next' | 'prev') => {
        if (!sliderList || windowWidth === null) return

        const scrollAmount =
          windowWidth >= 1280
            ? 6 * (windowWidth / 6.4)
            : 4 * (windowWidth / 4.4)

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
  }, [cachedAnimes, windowWidth, loading, setWindowWidth])

  const displayAnimes = cachedAnimes.length > 0 ? cachedAnimes : (animes ?? [])

  if (loading || !cachedAnimes || !animes || !displayAnimes)
    return (
      <div className="relative mx-auto w-[100dvw]">
        <div className="flex space-x4 py-4 items-center justify-center">
          <span className="ml-[calc(((100dvw)/6.4)*0.2)] inline-flex md:h-8 h-6 md:w-32 w-24 animate-pulse rounded-lg bg-zinc-800"></span>
      <div className="mt-2 flex-1 border-t border-white/20"></div>
        </div>
        <div className="relative overflow-hidden">
          <div className="anime-list flex w-full flex-row overflow-x-auto md:px-[calc(((100dvw)/4.4)*0.2)] xl:px-[calc(((100dvw)/6.4)*0.2)]">
            {Array(24)
              .fill(0)
              .map((_, i) => (
                <div
                  key={i + 1}
                  className="flex h-auto w-full min-w-[calc((100dvw)/2.4)] flex-col items-center gap-1 p-4 duration-200 md:min-w-[calc((100dvw)/4.4)] xl:min-w-[calc((100dvw)/6.4)]"
                >
                  <div className="aspect-[225/330] h-auto w-full animate-pulse rounded-lg bg-zinc-800 md:aspect-[225/330]"></div>
                </div>
              ))}
          </div>
        </div>
      </div>
    )

  return (
    <section className="anime-slider relative mx-auto w-[100dvw]">
      <header className="flex items-center space-x-4 px-[calc(((100dvw)/6.4)*0.2)] py-4 text-white">
        <h2 className="md:text-3xl text-xl font-bold">{title}</h2>
        <div className="mt-2 flex-1 border-t border-white/20"></div>
      </header>

      <div className="relative overflow-hidden">
        <button className="prev-button group absolute inset-0 z-10 my-auto hidden h-16 w-10 rounded-lg bg-enfasisColor transition-all duration-300 ease-in-out focus:outline-none">
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

        <ul className="anime-list mx-auto flex w-full flex-row overflow-x-auto overflow-y-hidden scroll-smooth md:px-[calc(((100dvw)/4.4)*0.2)] xl:px-[calc(((100dvw)/6.4)*0.2)]">
          {displayAnimes.map((anime: Anime) => (
            <AnimeCard key={anime.mal_id} anime={anime} context={title} />
          ))}
        </ul>

        <button className="next-button group absolute bottom-0 right-0 top-0 z-10 my-auto hidden max-h-16 w-10 items-center justify-center rounded-lg bg-enfasisColor transition-all duration-300 ease-in-out focus:outline-none">
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
