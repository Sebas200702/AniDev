import { useCallback, useEffect, useRef, useState } from 'react'

import { AnimeCard } from '@components/anime-card'
import { AnimeSliderLoader } from '@components/index/slider/anime-slider-loader'
import { NexPrevBtnSlideList } from '@components/index/slider/next-prev-btn-slider-list'
import { SliderHeader } from '@components/index/slider/slider-header'
import { useFetch } from '@hooks/useFetch'
import { useWindowWidth } from '@store/window-width'
import type { AnimeCardInfo } from 'types'

interface Props {
  url: string
  title: string
}

/**
 * AnimeSlider component displays a horizontally scrollable list of anime cards with navigation controls.
 *
 * @description This component manages the loading state, fetches anime data, and provides horizontal scrolling functionality.
 * It uses session storage to cache the fetched data for faster access. The component implements responsive
 * behavior by adjusting the navigation controls and scroll behavior based on the window width.
 *
 * The component maintains an internal state for anime data, loading status, and window dimensions.
 * It implements an efficient caching mechanism using sessionStorage to improve performance on
 * subsequent visits. When no cached data is available, it dynamically fetches anime based on the
 * provided query parameter.
 *
 * The UI displays a title header, left and right navigation buttons, and a horizontally scrollable
 * list of anime cards. During loading, a skeleton loader is displayed to improve user experience.
 * The navigation buttons automatically hide when scrolling reaches the beginning or end of the list.
 *
 * @param {Props} props - The component props
 * @param {string} props.url - The full API url to fetch anime data from
 * @param {string} props.title - The title displayed at the top of the slider
 * @returns {JSX.Element} The rendered anime slider with title, navigation buttons, and scrollable anime cards
 *
 * @example
 * <AnimeSlider url="/api/animes?limit_count=24&genre_filter=action&banners_filter=false" title="Action Anime" />
 */
export const AnimeSlider = ({ url, title }: Props) => {
  const [cachedAnimes, setCachedAnimes] = useState<AnimeCardInfo[]>([])
  const { width: windowWidth, setWidth: setWindowWidth } = useWindowWidth()
  const listRef = useRef<HTMLUListElement>(null)

  const storageKey = `animes_${url}`

  const getCachedAnimes = useCallback(() => {
    const storedAnimes = sessionStorage.getItem(storageKey)
    if (storedAnimes) {
      const parsedAnimes = JSON.parse(storedAnimes)
      setCachedAnimes(parsedAnimes)
      return parsedAnimes
    }
    return null
  }, [storageKey])

  const { data: animes, loading } = useFetch<AnimeCardInfo[]>({
    url,
    skip: cachedAnimes.length > 0,
  })

  const displayAnimes = cachedAnimes.length > 0 ? cachedAnimes : (animes ?? [])

  const createGroups = (animes: AnimeCardInfo[]) => {
    let itemsPerGroup = 2

    if (windowWidth && windowWidth > 1280) {
      itemsPerGroup = 6
    } else if (windowWidth && windowWidth > 768) {
      itemsPerGroup = 4
    }

    return Array.from({ length: Math.ceil(animes.length / itemsPerGroup) }).map(
      (_, groupIndex) => {
        return animes.slice(
          groupIndex * itemsPerGroup,
          (groupIndex + 1) * itemsPerGroup
        )
      }
    )
  }

  const groups = createGroups(displayAnimes)
  const totalGroups = groups.length


  const getPaddingAndGap = () => {
    if (windowWidth && windowWidth < 768) {
      return { padding: 'px-4', gap: 'gap-4' }
    }
    return { padding: 'px-20', gap: 'gap-10' }
  }

  const { padding, gap } = getPaddingAndGap()

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
    const ul = listRef.current
    if (!ul) return

    const prevBtn = ul.parentElement?.querySelector(
      '.prev-button'
    ) as HTMLButtonElement
    const nextBtn = ul.parentElement?.querySelector(
      '.next-button'
    ) as HTMLButtonElement

    if (!prevBtn || !nextBtn) return

    const clientWidth = ul.clientWidth

    const scrollPadding = windowWidth && windowWidth < 768 ? 32 : 120
    const groupWidth = clientWidth - scrollPadding

    const handleClick = (direction: 'next' | 'prev') => {
      if (!ul) return
      const scrollAmount = direction === 'next' ? groupWidth : -groupWidth
      ul.scrollBy({
        left: scrollAmount,
        behavior: 'smooth',
      })
    }

    const updateButtonsVisibility = () => {
      if (windowWidth && windowWidth < 768) {
        prevBtn.style.display = 'none'
        nextBtn.style.display = 'none'
        return
      }

      const { scrollLeft, scrollWidth, clientWidth } = ul
      prevBtn.style.display = scrollLeft <= 0 ? 'none' : 'flex'

      nextBtn.style.display =
        scrollLeft >= scrollWidth - clientWidth - 10 ? 'none' : 'flex'
    }

    prevBtn.addEventListener('click', () => handleClick('prev'))
    nextBtn.addEventListener('click', () => handleClick('next'))
    ul.addEventListener('scroll', updateButtonsVisibility)

    updateButtonsVisibility()

    return () => {
      prevBtn.removeEventListener('click', () => handleClick('prev'))
      nextBtn.removeEventListener('click', () => handleClick('next'))
      ul.removeEventListener('scroll', updateButtonsVisibility)
    }
  }, [windowWidth, totalGroups, displayAnimes])

  if (loading || !displayAnimes.length) {
    return <AnimeSliderLoader />
  }

  return (
    <section className="anime-slider fade-out relative mx-auto w-full">
      <SliderHeader title={title} />

      <div className="relative overflow-hidden">
        <NexPrevBtnSlideList
          label="prev-button"
          styles="absolute left-0 top-1/2 transform -translate-y-1/2 z-10"
        />
        <NexPrevBtnSlideList
          label="next-button"
          styles="absolute right-0 top-1/2 transform -translate-y-1/2 rotate-180 z-10"
        />

        <ul
          ref={listRef}
          className={`anime-list flex overflow-x-scroll scroll-smooth  py-4 md:px-20 px-4 md:gap-10 gap-6 no-scrollbar snap-x snap-mandatory`}
        >
          {groups.map((group, groupIndex) => (
            <section
              key={groupIndex}
              className={`
                grid flex-none md:gap-10 gap-6
                ${
                  windowWidth && windowWidth > 1280
                    ? 'grid-cols-6 w-full'
                    : windowWidth && windowWidth > 768
                      ? 'grid-cols-4 w-full'
                      : 'grid-cols-2 w-[90%]'
                }
              `}
            >
              {group.map((anime: AnimeCardInfo) => (
                <li key={anime.mal_id}>
                  <AnimeCard anime={anime} context={'index'} />
                </li>
              ))}
            </section>
          ))}
        </ul>
      </div>
    </section>
  )
}
