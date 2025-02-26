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

  if (loading || !cachedAnimes || !animes || !displayAnimes) return <AnimeSliderLoader />
    

  return (
    <section className="anime-slider relative mx-auto w-[100dvw]">
      <SliderHeader title={title} />

      <div className="relative overflow-hidden">
        <NexPrevBtnSlideList label="prev-button " styles="rotate-180" />
        <NexPrevBtnSlideList label="next-button" styles="right-0" />

        <ul className="anime-list mx-auto flex w-full flex-row gap-5 overflow-x-auto overflow-y-hidden scroll-smooth px-4 py-5 md:gap-10 md:px-20">
          {displayAnimes.map((anime: Anime) => (
            <AnimeCard key={anime.mal_id} anime={anime} context={title} />
          ))}
        </ul>
      </div>
    </section>
  )
}
