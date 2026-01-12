import { useRef } from 'react'

/**
 * Custom hook for managing image viewer refs
 * @returns Object containing refs for image and container elements
 */
export const useImageViewerRefs = () => {
  const imageRef = useRef<HTMLImageElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  return { imageRef, containerRef }
}
