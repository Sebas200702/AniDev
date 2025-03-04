import { useCallback, useEffect } from 'react'

import type { Anime } from 'types'
import { CarouselItem } from '@components/index/carousel/carousel-item'
import { Indicator } from '@components/index/carousel/indicator'
import { LoadingCarousel } from '@components/index/carousel/carousel-loader'
import { NexPrevBtnCarousel } from '@components/index/carousel/nex-prev-btn-carousel'
import { createDynamicUrl } from '@utils/create-dynamic-url'
import { createImageUrlProxy } from '@utils/craete-imageurl-proxy'
import { useCarouselScroll } from '@hooks/useCarouselScroll'
import { useCarouselStore } from '@store/carousel-store'
import { useFetch } from '@hooks/useFetch'

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

  const fetchBannerData = useCallback(async () => {
    if (typeof window === 'undefined') return
    const url = sessionStorage.getItem('banners-url') ?? ''
    const banners = JSON.parse(sessionStorage.getItem('banners') ?? '[]')
    setUrl(url)
    setBanners(banners)
    if (url || banners.length > 0) return

    const newUrl = createDynamicUrl()
    setUrl(`/api/animes?${newUrl.url}&banners_filter=true`)
    sessionStorage.setItem(
      'banners-url',
      `/api/animes?${newUrl.url}&banners_filter=true`
    )
    setLoading(true)
    setBanners([])
  }, [setUrl, setBanners, setLoading])

  const preloadImages = useCallback(() => {
    if (!banners || banners.length === 0) return
    banners.forEach((anime) => {
      const image = new Image()
      image.src = anime.image_large_webp
      image.src = createImageUrlProxy(anime.banner_image, '1920', '50', 'webp')
      image.src = createImageUrlProxy(anime.banner_image, '100', '0', 'webp')
    })
  }, [banners])

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

  const { data: bannersData, loading: bannersLoading } = useFetch<Anime[]>({
    url: url,
  })

  useEffect(() => {
    if (!bannersData || bannersLoading) return
    setBanners(bannersData)
    sessionStorage.setItem('banners', JSON.stringify(bannersData))
    setLoading(false)
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

  if (loading || !banners || banners.length === 0) return <LoadingCarousel />

  return (
    <section
      className={`fade-out relative right-0 left-0 mb-4 h-[65vh] md:h-[90vh] ${fadeIn ? 'opacity-100 transition-all duration-200' : 'opacity-0'} `}
      data-carousel="slide"
      style={{ position: 'sticky' }}
      aria-label="Carousel of Animes"
    >
      <div
        className="anime-list relative h-full overflow-x-auto"
        ref={bannerContainerRef}
        id="banner-container"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <ul className="flex h-full transition-transform duration-700 ease-in-out">
          {banners.map((anime, index) => (
            <CarouselItem key={anime.mal_id} anime={anime} index={index} />
          ))}
        </ul>
      </div>
      <nav className="absolute bottom-20 left-1/2 z-30 flex -translate-x-1/2 space-x-3 md:bottom-[8%]">
        {banners.map((anime, index) => (
          <Indicator
            key={anime.mal_id}
            index={index}
            currentIndex={currentIndex}
            onClick={handleIndicatorClick}
          />
        ))}
      </nav>
      <div className="absolute bottom-12 z-50 flex w-full flex-row justify-between p-4 md:end-20 md:top-30 md:w-auto md:justify-items-center md:gap-5 md:p-0">
        <NexPrevBtnCarousel action={handlePrev} label="Previous" />
        <NexPrevBtnCarousel action={handleNext} label="Next" />
      </div>
    </section>
  )
}
