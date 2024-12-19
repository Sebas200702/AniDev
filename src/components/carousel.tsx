import { Tag } from '@components/anime-result'
import { useFetch } from '@hooks/useFetch'
import {
  normalizeString,
  reduceSynopsis,
  baseUrl,
  createImageUrlProxy,
} from '@utils'
import { memo, useCallback, useEffect, useState } from 'react'
import type { Anime } from 'types'

const Indicator = memo(
  ({
    index,
    currentIndex,
    onClick,
  }: {
    index: number
    currentIndex: number
    onClick: (index: number) => void
  }) => {
    return (
      <button
        onClick={() => onClick(index)}
        className={`h-3 w-3 rounded-full transition-colors ${
          currentIndex === index ? 'bg-blue-500' : 'bg-white/50'
        }`}
        aria-current={currentIndex === index ? 'true' : 'false'}
        aria-label={`Slide ${index + 1}`}
      />
    )
  }
)

const LoadingCarousel = () => (
  <div className="relative -mx-[103px] h-[500px] animate-pulse bg-gray-200">
    <div className="relative flex h-full w-full flex-shrink-0 items-center gap-20 px-8">
      <div className="z-10 ml-12 flex h-[90%] w-1/4 animate-pulse items-center justify-center rounded-lg bg-gray-400"></div>
      <div className="z-10 mr-8 flex-1 p-6 text-white">
        <div className="mb-4 mt-4 h-8 w-[60%] animate-pulse rounded-lg bg-gray-400"></div>
        <div className="mb-6 h-20 w-full animate-pulse rounded-lg bg-gray-400"></div>
        <div className="h-8 w-[40%] animate-pulse rounded-lg bg-gray-400"></div>
      </div>
    </div>
    <div className="absolute bottom-6 left-1/2 z-30 flex h-6 w-[20%] -translate-x-1/2 animate-pulse rounded-lg bg-gray-400"></div>
  </div>
)

export const Carousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [fadeIn, setFadeIn] = useState(false)
  const { data: banners, loading } = useFetch<Anime[]>({
    url: '/api/animes?limit_count=10&type_filter=tv&status_filter=CurrentlyAiring',
  })

  const handlePrev = useCallback(() => {
    if (!banners) return
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? banners.length - 1 : prevIndex - 1
    )
  }, [banners])

  const handleNext = useCallback(() => {
    if (!banners) return
    setCurrentIndex((prevIndex) =>
      prevIndex === banners.length - 1 ? 0 : prevIndex + 1
    )
  }, [banners])

  const handleIndicatorClick = useCallback((index: number) => {
    setCurrentIndex(index)
  }, [])

  useEffect(() => {
    if (!banners || banners.length === 0) return
    setTimeout(() => setFadeIn(true), 100)
    const interval = setInterval(() => {
      handleNext()
    }, 4000)
    return () => clearInterval(interval)
  }, [banners, handleNext])

  if (loading || !banners || banners.length === 0) {
    return <LoadingCarousel />
  }

  return (
    <div
      className={`realtive left-0 right-0 -mx-[103px] h-[500px] ${fadeIn ? 'opacity-100 transition-all duration-500' : 'opacity-0'} overflow-x-hidden`}
      data-carousel="slide"
      style={{ position: 'sticky' }}
    >
      <div className="relative h-full overflow-hidden">
        <div
          className="flex h-full transition-transform duration-700 ease-in-out"
          style={{
            transform: `translateX(-${currentIndex * 100}%)`,
          }}
        >
          {banners.map((anime, index) => (
            <div
              key={anime.mal_id}
              className={`relative flex h-full w-full flex-shrink-0 items-center px-8 ${index % 2 === 0 ? 'flex-row' : 'flex-row-reverse'}`}
            >
              <div
                className="absolute inset-0 -z-10 h-full w-full bg-cover bg-center"
                style={{
                  backgroundImage: `url(${createImageUrlProxy( anime.banner_image ? anime.banner_image : anime.image_large_webp)})`,
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-b from-black/60 to-black/90" />
              <a
                href={`${normalizeString(anime.title)}_${anime.mal_id}`}
                className="z-10 flex h-full w-1/3 items-center justify-center"
              >
                <img
                  src={createImageUrlProxy( anime.image_large_webp)}
                  className="h-[90%] w-auto rounded-lg object-contain shadow-lg"
                  alt={anime.title}
                  loading="lazy"
                />
              </a>
              <div
                className={`flex-1 p-6 ${index % 2 === 0 ? 'ml-8' : 'mr-8'} z-10 text-white`}
              >
                <h2 className="mb-4 text-3xl font-bold text-white drop-shadow-md">
                  {anime.title}
                </h2>
                <p className="mb-4 text-base text-white drop-shadow">
                  {reduceSynopsis(anime.synopsis, 300)}
                </p>
                <footer className="mt-4 flex flex-row gap-2">
                  {anime.genres.map((tag: string) => (
                    <Tag key={tag} tag={tag} style="w-auto" />
                  ))}
                </footer>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="absolute bottom-6 left-1/2 z-30 flex -translate-x-1/2 space-x-3">
        {banners.map((anime, index) => (
          <Indicator
            key={anime.mal_id}
            index={index}
            currentIndex={currentIndex}
            onClick={handleIndicatorClick}
          />
        ))}
      </div>

      {/* Controls */}
      <button
        type="button"
        className="group absolute start-0 top-0 z-30 flex h-full cursor-pointer items-center justify-center px-4 focus:outline-none"
        onClick={handlePrev}
      >
        <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-black/30 group-hover:bg-black/50 group-focus:ring-2 group-focus:ring-white">
          <svg
            className="h-3 w-3 text-white"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 6 10"
          >
            <path
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M5 1 1 5l4 4"
            />
          </svg>
          <span className="sr-only">Previous</span>
        </span>
      </button>

      <button
        type="button"
        className="group absolute end-0 top-0 z-30 flex h-full cursor-pointer items-center justify-center px-4 focus:outline-none"
        onClick={handleNext}
      >
        <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-black/30 group-hover:bg-black/50 group-focus:ring-2 group-focus:ring-white">
          <svg
            className="h-3 w-3 text-white"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 6 10"
          >
            <path
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="m1 9 4-4-4-4"
            />
          </svg>
          <span className="sr-only">Next</span>
        </span>
      </button>
    </div>
  )
}
