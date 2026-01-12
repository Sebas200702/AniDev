import { useCallback, useState } from 'react'

interface TouchInfo {
  x: number
  y: number
  id: number
}

interface UseImageGesturesReturn {
  touches: TouchInfo[]
  handleTouchStart: (
    e: React.TouchEvent,
    zoom: number,
    hasMultipleImages: boolean
  ) => void
  handleTouchMove: (e: React.TouchEvent) => void
  handleTouchEnd: (e: React.TouchEvent) => void
  isDoubleTapZoom: boolean
  setIsDoubleTapZoom: (value: boolean) => void
  isSwipeGesture: boolean
  setIsSwipeGesture: (value: boolean) => void
  swipeDistance: number
}

const DOUBLE_TAP_DELAY = 300
const MIN_SWIPE_DISTANCE = 50

/**
 * Custom hook for managing touch and mouse gestures
 * @returns Object with gesture handlers and state
 */
export const useImageGestures = (): UseImageGesturesReturn => {
  const [touches, setTouches] = useState<TouchInfo[]>([])
  const [isDoubleTapZoom, setIsDoubleTapZoom] = useState(false)
  const [isSwipeGesture, setIsSwipeGesture] = useState(false)
  const [swipeDistance, setSwipeDistance] = useState(0)
  const [lastTap, setLastTap] = useState(0)
  const [swipeStartX, setSwipeStartX] = useState(0)
  const [initialDistance, setInitialDistance] = useState(0)

  const getTouchInfo = useCallback((touch: React.Touch): TouchInfo => {
    return {
      x: touch.clientX,
      y: touch.clientY,
      id: touch.identifier,
    }
  }, [])

  const getDistance = useCallback(
    (touch1: TouchInfo, touch2: TouchInfo): number => {
      const dx = touch1.x - touch2.x
      const dy = touch1.y - touch2.y
      return Math.sqrt(dx * dx + dy * dy)
    },
    []
  )

  const handleTouchStart = useCallback(
    (e: React.TouchEvent, zoom: number, hasMultipleImages: boolean) => {
      e.preventDefault()

      const newTouches = Array.from(e.touches).map((touch) =>
        getTouchInfo(touch)
      )
      setTouches(newTouches)

      if (newTouches.length === 1) {
        const now = Date.now()
        const touch = newTouches[0]

        // Double tap detection
        if (now - lastTap < DOUBLE_TAP_DELAY) {
          setIsDoubleTapZoom(true)
          setLastTap(0)
          return
        }
        setLastTap(now)

        // Set initial swipe position
        setSwipeStartX(touch.x)
        setIsSwipeGesture(zoom === 1 && hasMultipleImages)
      } else if (newTouches.length === 2) {
        const distance = getDistance(newTouches[0], newTouches[1])
        setInitialDistance(distance)
      }
    },
    [getTouchInfo, getDistance, lastTap]
  )

  const handleTouchMove = useCallback(
    (e: React.TouchEvent) => {
      e.preventDefault()

      const newTouches = Array.from(e.touches).map((touch) =>
        getTouchInfo(touch)
      )
      setTouches(newTouches)

      if (newTouches.length === 2 && initialDistance > 0) {
        const distance = getDistance(newTouches[0], newTouches[1])
        setSwipeDistance(distance / initialDistance)
      }
    },
    [getTouchInfo, getDistance, initialDistance]
  )

  const handleTouchEnd = useCallback(
    (e: React.TouchEvent) => {
      e.preventDefault()

      const remainingTouches = Array.from(e.touches).map((touch) =>
        getTouchInfo(touch)
      )
      setTouches(remainingTouches)

      if (remainingTouches.length === 0) {
        setInitialDistance(0)
        setSwipeDistance(0)
      }
    },
    [getTouchInfo]
  )

  return {
    touches,
    handleTouchStart,
    handleTouchMove,
    handleTouchEnd,
    isDoubleTapZoom,
    setIsDoubleTapZoom,
    isSwipeGesture,
    setIsSwipeGesture,
    swipeDistance,
  }
}
