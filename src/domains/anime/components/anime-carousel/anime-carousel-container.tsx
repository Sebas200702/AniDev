import { useCallback, useEffect, useMemo } from 'react'

import { AnimeCarousel } from '@anime/components/anime-carousel/anime-carousel'
import { LoadingCarousel } from '@anime/components/anime-carousel/anime-carousel-loader'
import { useCarouselScroll } from '@anime/hooks/useCarouselScroll'
import { useCarouselStore } from '@anime/stores/carousel-store'
import type { AnimeBannerInfo } from '@anime/types'
import { createDynamicUrl } from '@anime/utils/create-dynamic-url'
import { DataWrapper } from '@shared/components/data-wrapper'
import { useFetchWithCache } from '@shared/hooks/useFetchWithCache'

export const AnimeCarouselContainer = () => {
  const { banners, setBanners, currentIndex, setCurrentIndex } =
    useCarouselStore()
  const { url } = useMemo(() => createDynamicUrl(6), [])

  const { data, loading, error, refetch, retryCount, maxRetries } =
    useFetchWithCache<AnimeBannerInfo[]>({
      url: `${url}&banners_filter=true&format=anime-banner`,
      sectionId: 'carousel',
      limit: 6,
    })

  useEffect(() => {
    if (data) setBanners(data)
  }, [data, setBanners])

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

    globalThis.addEventListener('keydown', handleKeyDown)
    return () => {
      clearInterval(intervalRef.current!)
      globalThis.removeEventListener('keydown', handleKeyDown)
    }
  }, [banners, handleKeyDown, resetInterval])

  return (
    <DataWrapper
      loading={loading}
      error={error}
      data={banners && banners.length > 0 ? banners : null}
      loadingFallback={<LoadingCarousel />}
      noDataFallback={<LoadingCarousel />}
      onRetry={refetch}
      retryCount={maxRetries - retryCount}
    >
      {() => (
        <AnimeCarousel
          banners={banners!}
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
