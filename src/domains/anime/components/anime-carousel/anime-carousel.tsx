import { NexPrevBtnCarousel } from '@anime/components/anime-carousel/anime-carousel-buttons'
import { CarouselItem } from '@anime/components/anime-carousel/anime-carousel-item'
import { Indicator } from '@anime/components/anime-carousel/indicator'
import type { AnimeBannerInfo } from '@anime/types'
import { Overlay } from '@shared/components/layout/overlay'
import type { TouchEventHandler } from 'react'

interface AnimeCarouselProps {
  banners: AnimeBannerInfo[]
  bannerContainerRef: React.RefObject<HTMLDivElement | null>
  handleTouchStart: TouchEventHandler<HTMLDivElement>
  handleTouchMove: TouchEventHandler<HTMLDivElement>
  handleTouchEnd: TouchEventHandler<HTMLDivElement>
  handlePrev: () => void
  handleNext: () => void
  handleIndicatorClick: (index: number) => void
  currentIndex: number
}
export const AnimeCarousel = ({
  banners,
  bannerContainerRef,
  handleTouchStart,
  handleTouchMove,
  handleTouchEnd,
  handlePrev,
  handleNext,
  handleIndicatorClick,
  currentIndex,
}: AnimeCarouselProps) => {
  return (
    <section
      className={`fade-out relative right-0 left-0 h-[70vh] md:h-[650px] xl:h-[90vh]`}
      data-carousel="slide"
      style={{ position: 'sticky' }}
      aria-label="Carousel of Animes"
    >
      <div
        className="anime-list relative h-full w-full overflow-x-hidden"
        ref={bannerContainerRef}
        id="banner-container"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <ul className="flex h-full w-full transition-transform duration-700 ease-in-out">
          {banners.map((anime, index) => (
            <CarouselItem key={anime.mal_id} anime={anime} index={index} />
          ))}
        </ul>
      </div>
      <nav className="absolute bottom-21 left-1/2 z-50 flex -translate-x-1/2 space-x-3 md:bottom-16">
        {banners.map((anime, index) => (
          <Indicator
            key={anime.mal_id}
            index={index}
            currentIndex={currentIndex}
            onClick={handleIndicatorClick}
          />
        ))}
      </nav>
      <div className="absolute bottom-12 z-40 hidden w-full flex-row justify-between p-4 md:end-20 md:top-30 md:flex md:w-auto md:justify-items-center md:gap-5 md:p-0">
        <NexPrevBtnCarousel action={handlePrev} label="Previous" />
        <NexPrevBtnCarousel action={handleNext} label="Next" />
      </div>
      <Overlay className="md:to-Primary-950 absolute top-0 left-0 h-full w-1/6 bg-gradient-to-l" />
    </section>
  )
}
