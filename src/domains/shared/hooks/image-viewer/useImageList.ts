import type { ImageType } from '@shared/types'
import { useCallback, useState } from 'react'

interface UseImageListReturn {
  currentIndex: number
  currentImage: ImageType
  hasMultipleImages: boolean
  goToNext: () => void
  goToPrevious: () => void
  resetIndex: () => void
}

/**
 * Custom hook for managing image list navigation
 * @param imageList - Array of images to display
 * @param initialIndex - Starting image index
 * @returns Object with navigation methods and current image info
 */
export const useImageList = (
  imageList: ImageType[],
  initialIndex: number = 0
): UseImageListReturn => {
  const [currentIndex, setCurrentIndex] = useState(initialIndex)
  const hasMultipleImages = imageList.length > 1

  const goToNext = useCallback(() => {
    if (hasMultipleImages) {
      setCurrentIndex((prev) => (prev === imageList.length - 1 ? 0 : prev + 1))
    }
  }, [hasMultipleImages, imageList.length])

  const goToPrevious = useCallback(() => {
    if (hasMultipleImages) {
      setCurrentIndex((prev) => (prev === 0 ? imageList.length - 1 : prev - 1))
    }
  }, [hasMultipleImages, imageList.length])

  const resetIndex = useCallback(() => {
    setCurrentIndex(initialIndex)
  }, [initialIndex])

  return {
    currentIndex,
    currentImage: imageList[currentIndex],
    hasMultipleImages,
    goToNext,
    goToPrevious,
    resetIndex,
  }
}
