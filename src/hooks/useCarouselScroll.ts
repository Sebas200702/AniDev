import { useCallback, useRef } from 'react'

import type { AnimeBannerInfo } from 'types'

/**
 * useCarouselScroll is a custom hook that manages the scrolling behavior of a carousel.
 *
 * @description This hook provides functionality for navigating through a carousel of anime banners.
 * It manages touch events for mobile swiping, keyboard navigation with arrow keys, and automatic
 * scrolling with a timer. The hook maintains references to the container element, touch positions,
 * and interval timer to ensure smooth transitions between banner items.
 *
 * The hook implements touch navigation by tracking touch start and end positions to determine
 * swipe direction. It handles automatic scrolling with a configurable interval that resets
 * whenever the user manually navigates. The scroll behavior is synchronized with the current
 * index state, ensuring the visual display matches the logical state.
 *
 * For accessibility, the hook provides keyboard navigation support through arrow keys,
 * allowing users to navigate the carousel without using touch or mouse interactions.
 *
 * @param {AnimeBannerInfo[] | null} banners - The array of anime banners to display in the carousel
 * @param {number} currentIndex - The current index of the displayed banner
 * @param {function} setCurrentIndex - Function to update the current index
 * @returns {Object} Object containing refs and handler functions for carousel navigation
 *
 * @example
 * const { bannerContainerRef, handleNext, handlePrev, handleTouchStart } = useCarouselScroll(
 *   animeList,
 *   currentBannerIndex,
 *   setCurrentBannerIndex
 * );
 */
export const useCarouselScroll = (
  banners: AnimeBannerInfo[] | null,
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
    }, 5000)
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
