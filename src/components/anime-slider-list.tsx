import React, { useEffect, useRef, useState } from 'react'
import { AnimeCard } from '@components/anime-card'
import { useFetch } from '@hooks/useFetch'
import type { Anime } from 'types'
import '@styles/anime-slider.css'

interface Props {
  query: string
  title: string
}

export const AnimeSlider = ({ query, title }: Props) => {
  const { data: animes } = useFetch<Anime[]>({
    url: `/api/animes?limit_count=24&${query}`,
  })

  const sliderRef = useRef<HTMLUListElement | null>(null)
  const [isAtStart, setIsAtStart] = useState(true)
  const [isAtEnd, setIsAtEnd] = useState(false)
  const [windowWidth, setWindowWidth] = useState<number | null>(null)

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth)

    setWindowWidth(window.innerWidth) 
    window.addEventListener('resize', handleResize)

    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener('resize', handleResize)
      }
    }
  }, [])

  useEffect(() => {
    const updateButtonsVisibility = () => {
      if (!sliderRef.current) return
      const { scrollLeft, scrollWidth, clientWidth } = sliderRef.current
      setIsAtStart(scrollLeft <= 0)
      setIsAtEnd(scrollLeft + clientWidth >= scrollWidth)
    }

    const slider = sliderRef.current
    if (slider) {
      slider.addEventListener('scroll', updateButtonsVisibility)
      updateButtonsVisibility()
    }

    return () => {
      slider?.removeEventListener('scroll', updateButtonsVisibility)
    }
  }, [animes])

  const handleScroll = (direction: 'next' | 'prev') => {
    if (!sliderRef.current || windowWidth === null) return

    const scrollAmount =
      windowWidth >= 1280
        ? 6 * ((windowWidth - 8) / 6.4) + 1
        : 4 * ((windowWidth - 8) / 4.4) + 1

    const scrollDistance = direction === 'next' ? scrollAmount : -scrollAmount

    sliderRef.current.scrollBy({
      left: scrollDistance,
      behavior: 'smooth',
    })
  }

  if (windowWidth !== null && windowWidth < 768) {
    return (
      <section className="relative mx-auto mt-6 w-[calc(100dvw-8px)]">
        <h2 className="px-[calc(((100dvw-8px)/6.4)*0.2)] text-2xl font-bold text-gray-900">
          {title}
        </h2>
        <ul
          ref={sliderRef}
          className="anime-list mx-auto mt-4 flex w-full flex-row overflow-x-auto scroll-smooth"
        >
          {animes?.map((anime: Anime) => (
            <AnimeCard key={anime.mal_id} anime={anime} context={query} />
          ))}
        </ul>
      </section>
    )
  }

  return (
    <section className="relative mx-auto mt-6 w-[calc(100dvw-8px)]">
      <h2 className="px-[calc(((100dvw-8px)/6.4)*0.2)] text-2xl font-bold text-gray-900">
        {title}
      </h2>
      <div className="relative overflow-hidden">
        <button
          className={`prev-button group absolute bottom-0 left-0 z-10 my-auto flex h-full w-10 items-center justify-center rounded-lg bg-black/0 transition-all duration-300 ease-in-out hover:bg-gray-200/40 focus:outline-none ${
            isAtStart ? 'hidden' : ''
          }`}
          onClick={() => handleScroll('prev')}
        >
          <svg
            className="rotate-180 transform opacity-0 transition-opacity duration-300 ease-in-out group-hover:opacity-100"
            xmlns="http://www.w3.org/2000/svg"
            width="32"
            height="32"
            fill="none"
            stroke="#000"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
          >
            <path d="M7 7l5 5-5 5M13 7l5 5-5 5"></path>
          </svg>
        </button>

        <ul
          ref={sliderRef}
          className="anime-list mx-auto mt-4 flex w-full flex-row overflow-x-auto scroll-smooth md:px-[calc(((100dvw-8px)/4.4)*0.2)] xl:px-[calc(((100dvw-8px)/6.4)*0.2)]"
        >
          {animes?.map((anime: Anime) => (
            <AnimeCard key={anime.mal_id} anime={anime} context={query} />
          ))}
        </ul>

        <button
          className={`next-button group absolute bottom-0 right-0 z-10 my-auto flex h-full w-10 items-center justify-center rounded-lg bg-black/0 transition-all duration-300 ease-in-out hover:bg-gray-200/40 focus:outline-none ${
            isAtEnd ? 'hidden' : ''
          }`}
          onClick={() => handleScroll('next')}
        >
          <svg
            className="opacity-0 transition-opacity duration-300 ease-in-out group-hover:opacity-100"
            xmlns="http://www.w3.org/2000/svg"
            width="32"
            height="32"
            fill="none"
            stroke="#000"
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
