import { useCallback, useEffect, useMemo } from 'react'

import type { AnimeBannerInfo } from '@anime/types'
import { AnimeCarousel } from '@anime/components/anime-carousel/anime-carousel'
import { DataWrapper } from '@shared/components/data-wrapper'
import { LoadingCarousel } from './anime-carousel-loader'
import { createDynamicUrl } from '@utils/create-dynamic-url'
import { useCarouselScroll } from '@anime/hooks/useCarouselScroll'
import { useCarouselStore } from '@anime/stores/carousel-store'
import { useFetch } from '@shared/hooks/useFetch'

export const AnimeCarouselContainer = () => {
  const {
    banners,
    setBanners,
    currentIndex,
    setCurrentIndex,
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
    window.addEventListener('keydown', handleKeyDown)

    return () => {
      clearInterval(intervalRef.current!)
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [banners, handleKeyDown, resetInterval])

  return (
    <DataWrapper
      loading={loading}
      error={error}
      data={banners}
      loadingFallback={<LoadingCarousel />}
      noDataFallback={<p>No data available</p>}
    >
      {() => (
        <AnimeCarousel
          banners={banners}
          currentIndex={currentIndex}
          bannerContainerRef={bannerContainerRef}
          handleTouchStart={handleTouchStart}
          handleTouchMove={handleTouchMove}
          handleTouchEnd={handleTouchEnd}
          handlePrev={handlePrev}
          handleNext={handleNext}
          handleIndicatorClick={handleIndicatorClick}
        />
      )}
    </DataWrapper>
  )
}
