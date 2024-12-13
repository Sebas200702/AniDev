import { useEffect, useState } from 'react'
import {  reduceSynopsis } from '@utils'
import { Tag } from './anime-result'
import { useIndexStore } from '@store/index-store'

export const Carousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0)
  const { banners } = useIndexStore()

  const handlePrev = () => {
    if (!banners) return
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? banners.length - 1 : prevIndex - 1
    )
  }

  const handleNext = () => {
    if (!banners) return
    setCurrentIndex((prevIndex) =>
      prevIndex === banners.length - 1 ? 0 : prevIndex + 1
    )
  }

  const handleIndicatorClick = (index: number) => {
    setCurrentIndex(index)
  }
  useEffect(() => {
    const interval = setInterval(() => {
      handleNext()
    }, 4000)
    return () => clearInterval(interval)
  }, [currentIndex])

  if (!banners || banners.length === 0) {
    return null
  }

  return (
    <div
      className="relative w-screen left-0 right-0 h-[500px]"
      data-carousel="slide"
      style={{ position: 'absolute' }}
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
              className={`relative flex-shrink-0 w-full h-full flex items-center px-8 ${
                index % 2 === 0 ? 'flex-row' : 'flex-row-reverse'
              }`}
            >
              <div
                className="absolute inset-0 w-full h-full -z-10 bg-cover bg-center"
                style={{
                  backgroundImage: `url(${anime.banner_image ? anime.banner_image : anime.image_large_webp})`,
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-b from-black/60 to-black/90" />
              <div className="w-1/3 h-full flex items-center justify-center z-10">
                <img
                  src={anime.image_large_webp}
                  className="h-[90%] w-auto rounded-lg object-contain shadow-lg"
                  alt={anime.title}
                />
              </div>
              <div
                className={`flex-1 p-6 ${index % 2 === 0 ? 'ml-8' : 'mr-8'} text-white z-10`}
              >
                <h2 className="text-3xl font-bold mb-4 text-white drop-shadow-md">
                  {anime.title}
                </h2>
                <p className="text-base mb-4 text-white drop-shadow">
                  {reduceSynopsis(anime.synopsis, 300)}
                </p>
                <footer className="flex flex-row gap-2 mt-4">
                  {anime.genres.map((tag: string) => (
                    <Tag tag={tag} style="w-auto" />
                  ))}
                </footer>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="absolute z-30 flex -translate-x-1/2 bottom-6 left-1/2 space-x-3">
        {banners.map((_, index) => (
          <button
            key={index}
            type="button"
            className={`w-3 h-3 rounded-full transition-colors ${
              currentIndex === index ? 'bg-blue-500' : 'bg-white/50'
            }`}
            aria-current={currentIndex === index ? 'true' : 'false'}
            aria-label={`Slide ${index + 1}`}
            onClick={() => handleIndicatorClick(index)}
          />
        ))}
      </div>

      {/* Controls */}
      <button
        type="button"
        className="absolute top-0 start-0 z-30 flex items-center justify-center h-full px-4 cursor-pointer group focus:outline-none"
        onClick={handlePrev}
      >
        <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-black/30 group-hover:bg-black/50 group-focus:ring-2 group-focus:ring-white">
          <svg
            className="w-3 h-3 text-white"
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
        className="absolute top-0 end-0 z-30 flex items-center justify-center h-full px-4 cursor-pointer group focus:outline-none"
        onClick={handleNext}
      >
        <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-black/30 group-hover:bg-black/50 group-focus:ring-2 group-focus:ring-white">
          <svg
            className="w-3 h-3 text-white"
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
