import { CarouselItem } from '@anime/components/anime-carousel/carousel-item'
import { LoadingCarousel } from '@anime/components/anime-carousel/carousel-loader'
import { Indicator } from '@anime/components/anime-carousel/indicator'
import { NexPrevBtnCarousel } from '@anime/components/anime-carousel/nex-prev-btn-carousel'
import { useCarouselScroll } from '@anime/hooks/anime-carousel/useCarouselScroll'
import { useCarouselStore } from '@anime/stores/carousel-store'
import type { AnimeBannerInfo } from '@anime/types'
import { Overlay } from '@shared/components/layout/overlay'
import { useFetch } from '@shared/hooks/useFetch'
import { createDynamicUrl } from '@utils/create-dynamic-url'
import { useCallback, useEffect, useMemo } from 'react'

/**
 * Carousel component displays a rotating banner of featured anime content.
 *
 * @description This component manages the loading state, fetches banner data, and provides interactive
 * navigation controls. It uses session storage to cache the fetched data for faster access on subsequent
 * visits. The component implements touch gestures, keyboard navigation, and automatic rotation for an
 * engaging user experience.
 *
 * The component maintains state through the useCarouselStore for banners data, loading status, current
 * index, and animation effects. It implements an efficient image preloading mechanism to ensure smooth
 * transitions between carousel items. When no cached data is available, it dynamically generates a URL
 * and fetches a new set of banner images.
 *
 * Now includes intelligent retry system that registers failed URL combinations through API calls.
 *
 * The UI features a responsive layout that adapts to different screen sizes, with full-width banner
 * images, navigation indicators, and next/previous buttons. During loading, a skeleton loader is
 * displayed to improve user experience.
 *
 * @returns {JSX.Element} The rendered carousel with banner items, indicators, and navigation controls
 *
 * @example
 * <Carousel />
 */
export const Carousel = () => {
  const {
    banners,
    setBanners,
    currentIndex,
    setCurrentIndex,
    fadeIn,
    setFadeIn,
  } = useCarouselStore()
  const {
    bannerContainerRef,
    intervalRef,
    handleTouchStart,
    handleTouchMove,
    handleTouchEnd,
    handlePrev,
    handleNext,
    handleScroll,
    resetInterval,
    handleKeyDown,
  } = useCarouselScroll(banners, currentIndex, setCurrentIndex)
  const { url } = useMemo(() => createDynamicUrl(6), [])

  const { data, loading, error } = useFetch<AnimeBannerInfo[]>({
    url: `${url}&banners_filter=true&format=anime-banner`,
  })

  useEffect(() => {
    if (data) {
      setBanners(data)
    }
  }, [data, setBanners])

  const handleIndicatorClick = useCallback(
    (index: number) => {
      setCurrentIndex(index)
      handleScroll(index)
      resetInterval()
    },
    [setCurrentIndex, handleScroll, resetInterval]
  )

  useEffect(() => {
    resetInterval()
  }, [resetInterval])

  useEffect(() => {
    if (!banners || banners.length === 0) return
    setFadeIn(true)
    window.addEventListener('keydown', handleKeyDown)

    return () => {
      clearInterval(intervalRef.current!)
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [banners, handleKeyDown, resetInterval])

  if (error) {
    return (
      <div className="flex h-[70vh] items-center justify-center">
        <p className="text-red-500">
          Failed to load carousel content. Please try again later.
        </p>
      </div>
    )
  }

  if (loading || !banners || banners.length === 0) return <LoadingCarousel />
  return (
    <section
      className={`fade-out relative right-0 left-0 h-[70vh] md:h-[650px] xl:h-[90vh] ${fadeIn ? 'opacity-100 transition-all duration-200' : 'opacity-0'} `}
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
