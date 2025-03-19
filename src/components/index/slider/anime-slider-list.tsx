import { useCallback, useEffect, useState } from 'react'

import type { Anime } from 'types'
import { AnimeCard } from '@components/anime-card'
import { AnimeSliderLoader } from '@components/index/slider/anime-slider-loader'
import { NexPrevBtnSlideList } from '@components/index/slider/next-prev-btn-slider-list'
import { SliderHeader } from '@components/index/slider/slider-header'
import { useFetch } from '@hooks/useFetch'
import { useWindowWidth } from '@store/window-width'

interface Props {
  query: string
  title: string
}

  /**
   * Component that renders a slider of animes with a title, buttons to navigate and a list of animes.
   * The animes are fetched from the API and cached in the session storage.
   * The component also handles the window resize event to update the buttons visibility.
   * @param {Object} props - The component props.
   * @param {string} props.query - The query to fetch the animes from the API.
   * @param {string} props.title - The title to display in the slider.
   * @returns {ReactElement} The rendered component.
   */
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

        const scrollAmount = windowWidth - 120

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
    return <AnimeSliderLoader />

  return (
    <section className="anime-slider fade-out relative mx-auto w-[100dvw]">
      <SliderHeader title={title} />

      <div className="relative overflow-hidden">
        <NexPrevBtnSlideList label="prev-button " styles="" />
        <NexPrevBtnSlideList label="next-button" styles="right-0 rotate-180" />

        <ul className="anime-list mx-auto flex w-full flex-row gap-5 overflow-x-auto overflow-y-hidden scroll-smooth px-4 py-4 md:gap-10 md:px-20">
          {displayAnimes.map((anime: Anime) => (
            <li key={anime.mal_id}>
              <AnimeCard anime={anime} context={title} />
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
