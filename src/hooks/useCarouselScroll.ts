import { useRef, useCallback } from 'react'
import type { Anime } from 'types'

export const useCarouselScroll = (
  banners: Anime[] | null,
  currentIndex: number,
  setCurrentIndex: (index: number) => void
) => {
  const bannerContainerRef = useRef<HTMLDivElement | null>(null)
  const intervalRef = useRef<number | null>(null)
  const touchStartX = useRef<number | null>(null)
  const touchEndX = useRef<number | null>(null)

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX
  }, [])

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    touchEndX.current = e.touches[0].clientX
  }, [])

  const handleScroll = useCallback(
    (index: number) => {
      if (!banners || banners.length === 0) return
      const bannerContainer = bannerContainerRef.current
      if (!bannerContainer) return
      const scrollAmount = bannerContainer.clientWidth * index
      bannerContainer.scrollTo({
        left: scrollAmount,
        behavior: 'smooth',
      })
    },
    [banners]
  )

  const handlePrev = useCallback(() => {
    if (!banners || banners.length === 0) return
    const prevIndex = currentIndex === 0 ? banners.length - 1 : currentIndex - 1
    setCurrentIndex(prevIndex)
    handleScroll(prevIndex)
    resetInterval()
  }, [banners, currentIndex, setCurrentIndex, handleScroll])

  const handleNext = useCallback(() => {
    if (!banners || banners.length === 0) return
    const nextIndex = currentIndex === banners.length - 1 ? 0 : currentIndex + 1
    setCurrentIndex(nextIndex)
    handleScroll(nextIndex)
    resetInterval()
  }, [banners, currentIndex, setCurrentIndex, handleScroll])
  const handleTouchEnd = useCallback(() => {
    if (!touchStartX.current || !touchEndX.current) return
    const deltaX = touchStartX.current - touchEndX.current
    if (deltaX > 30) {
      handleNext()
    } else if (deltaX < -30) {
      handlePrev()
    }
    touchStartX.current = null
    touchEndX.current = null
  }, [handleNext, handlePrev])

  const resetInterval = useCallback(() => {
    if (intervalRef.current !== null) {
      clearInterval(intervalRef.current)
    }
    intervalRef.current = window.setInterval(() => {
      handleNext()
    }, 4000)
  }, [handleNext])
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') {
        handleNext()
      } else if (e.key === 'ArrowLeft') {
        handlePrev()
      }
    },
    [handleNext, handlePrev]
  )

  return {
    bannerContainerRef,
    handleTouchStart,
    handleTouchMove,
    handleTouchEnd,
    handlePrev,
    handleNext,
    resetInterval,
    intervalRef,
    handleScroll,
    handleKeyDown,
  }
}
