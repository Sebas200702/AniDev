import { CarouselItem } from '@components/index/carousel/carousel-item'
import { LoadingCarousel } from '@components/index/carousel/carousel-loader'
import { Indicator } from '@components/index/carousel/indicator'
import { NexPrevBtnCarousel } from '@components/index/carousel/nex-prev-btn-carousel'
import { Overlay } from '@components/overlay'
import { useCarouselScroll } from '@hooks/useCarouselScroll'
import { useFetch } from '@hooks/useFetch'
import { useCarouselStore } from '@store/carousel-store'
import { useGlobalUserPreferences } from '@store/global-user'
import { useWindowWidth } from '@store/window-width'
import { baseUrl } from '@utils/base-url'
import { createDynamicUrl } from '@utils/create-dynamic-url'
import { createImageUrlProxy } from '@utils/create-imageurl-proxy'
import { useCallback, useEffect, useState } from 'react'
import type { AnimeBannerInfo } from 'types'

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
    url,
    setUrl,
    banners,
    setBanners,
    loading,
    setLoading,
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
  const { parentalControl } = useGlobalUserPreferences()
  const { width: windowWidth } = useWindowWidth()
  const isMobile = windowWidth && windowWidth < 768

  const [imagesLoaded, setImagesLoaded] = useState<Set<number>>(new Set())

  const fetchBannerData = useCallback(async () => {
    if (typeof window === 'undefined') return
    const url = sessionStorage.getItem('banners-url') ?? ''
    const banners = JSON.parse(sessionStorage.getItem('banners') ?? '[]')
    setUrl(url)
    setBanners(banners)
    if (url || banners.length > 0) return

    const newUrl = createDynamicUrl(6, parentalControl)
    setUrl(`/api/animes?${newUrl.url}&banners_filter=true&format=anime-banner`)
    sessionStorage.setItem(
      'banners-url',
      `/api/animes?${newUrl.url}&banners_filter=true&format=anime-banner`
    )
    setLoading(true)
    setBanners([])
  }, [setUrl, setBanners, setLoading])

  const preloadImages = useCallback(async () => {
    if (!banners || banners.length === 0) return

    const loadPromises = banners.map((anime, index) => {
      return new Promise<void>((resolve) => {
        const img = new Image()
        img.onload = () => {
          setImagesLoaded((prev) => new Set([...prev, index]))
          resolve()
        }
        img.onerror = () => {
          setImagesLoaded((prev) => new Set([...prev, index]))
          resolve()
        }

        if (isMobile) {
          img.src = createImageUrlProxy(
            anime.banner_image ?? `${baseUrl}/placeholder.webp`,
            '720',
            '50',
            'webp'
          )
        } else {
          img.src = createImageUrlProxy(
            anime.banner_image ?? `${baseUrl}/placeholder.webp`,
            '1920',
            '50',
            'webp'
          )
        }
      })
    })

    await Promise.all(loadPromises)
  }, [banners, isMobile])

  const handleIndicatorClick = useCallback(
    (index: number) => {
      setCurrentIndex(index)
      handleScroll(index)
      resetInterval()
    },
    [setCurrentIndex, handleScroll, resetInterval]
  )

  useEffect(() => {
    fetchBannerData()
  }, [fetchBannerData])

  const { data: bannersData, loading: bannersLoading } = useFetch<
    AnimeBannerInfo[]
  >({
    url: url,
  })

  useEffect(() => {
    if (!bannersData || bannersLoading) return
    setBanners(bannersData)
    sessionStorage.setItem('banners', JSON.stringify(bannersData))
    setLoading(false)
    setImagesLoaded(new Set())
    preloadImages()
  }, [bannersData, bannersLoading, preloadImages, fetchBannerData])

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
  }, [banners, handleNext, handlePrev, resetInterval])

  if (loading || !banners || banners.length === 0 || !imagesLoaded.has(0))
    return <LoadingCarousel />

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
      <Overlay className="to-Primary-950 via-Primary-950/20 absolute inset-0 bg-gradient-to-l via-60%" />
    </section>
  )
}
