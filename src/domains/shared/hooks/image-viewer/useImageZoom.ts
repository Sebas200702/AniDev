import { ZOOM_CONFIG } from '@shared/constants/image-viewer'
import { useCallback, useState } from 'react'

const { MIN_ZOOM, MAX_ZOOM, ZOOM_STEP } = ZOOM_CONFIG

interface UseImageZoomReturn {
  zoom: number
  zoomIn: () => void
  zoomOut: () => void
  handleWheel: (e: WheelEvent) => void
  MIN_ZOOM: number
  MAX_ZOOM: number
}

/**
 * Custom hook for managing image zoom functionality
 * @returns Object with zoom state and handlers
 */
export const useImageZoom = (): UseImageZoomReturn => {
  const [zoom, setZoom] = useState(1)

  const zoomIn = useCallback(() => {
    setZoom((prev) => Math.min(prev + ZOOM_STEP, MAX_ZOOM))
  }, [])

  const zoomOut = useCallback(() => {
    setZoom((prev) => Math.max(prev - ZOOM_STEP, MIN_ZOOM))
  }, [])

  const handleWheel = useCallback((e: WheelEvent) => {
    e.preventDefault()
    const delta = e.deltaY > 0 ? -ZOOM_STEP : ZOOM_STEP
    setZoom((prev) => Math.max(MIN_ZOOM, Math.min(MAX_ZOOM, prev + delta)))
  }, [])

  return {
    zoom,
    zoomIn,
    zoomOut,
    handleWheel,
    MIN_ZOOM,
    MAX_ZOOM,
  }
}
