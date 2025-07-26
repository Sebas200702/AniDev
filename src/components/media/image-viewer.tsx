import { DownloadButton } from '@components/buttons/download-button'
import { CloseIcon } from '@components/icons/close-icon'
import { NextIcon } from '@components/icons/next-icon'
import { PreviousIcon } from '@components/icons/previous-icon'
import { ResetIcon } from '@components/icons/reset-icon'
import { RotateLeftIcon } from '@components/icons/rotate-left-icon'
import { RotateRightIcon } from '@components/icons/rotate-right-icon'
import { ZoomInIcon } from '@components/icons/zoom-in-icon'
import { ZoomOutIcon } from '@components/icons/zoom-out-icon'
import { useGlobalModal } from '@store/modal-store'
import { createImageUrlProxy } from '@utils/create-image-url-proxy'
import { useCallback, useEffect, useRef, useState } from 'react'
import type { ImageType } from 'types'

interface ImageViewerProps {
  onClose: () => void
  imageList: ImageType[]
  initialIndex?: number
}

interface TouchInfo {
  x: number
  y: number
  id: number
}

/**
 * Enhanced image viewer with mobile touch support.
 *
 * Features:
 * - Zoom in/out with buttons, mouse wheel, and pinch gesture
 * - Double-tap to zoom in/out
 * - Rotate left/right
 * - Pan/drag when zoomed (mouse and touch)
 * - Download image using API endpoint
 * - Reset all transformations
 * - Close with ESC key
 * - Mobile-responsive design
 */
export const ImageViewer = ({
  onClose,

  imageList,
  initialIndex = 0,
}: ImageViewerProps) => {
  const [currentIndex, setCurrentIndex] = useState(initialIndex)
  const [zoom, setZoom] = useState(1)
  const [rotation, setRotation] = useState(0)
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [isDragging, setIsDragging] = useState(false)
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 })

  // Touch-specific state
  const [touches, setTouches] = useState<TouchInfo[]>([])
  const [initialDistance, setInitialDistance] = useState(0)
  const [initialZoom, setInitialZoom] = useState(1)
  const [lastTap, setLastTap] = useState(0)
  const [touchCenter, setTouchCenter] = useState({ x: 0, y: 0 })
  const [swipeStartX, setSwipeStartX] = useState(0)
  const [isSwipeGesture, setIsSwipeGesture] = useState(false)

  const imageRef = useRef<HTMLImageElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  const MIN_ZOOM = 0.1
  const MAX_ZOOM = 3
  const ZOOM_STEP = 0.1
  const DOUBLE_TAP_DELAY = 300

  // Current image
  const currentImage = imageList[currentIndex]
  const hasMultipleImages = imageList.length > 1

  const handleReset = useCallback(() => {
    setZoom(1)
    setRotation(0)
    setPosition({ x: 0, y: 0 })
  }, [])

  const handlePreviousImage = useCallback(() => {
    if (hasMultipleImages) {
      const newIndex =
        currentIndex === 0 ? imageList.length - 1 : currentIndex - 1
      setCurrentIndex(newIndex)
      handleReset()
    }
  }, [currentIndex, imageList.length, hasMultipleImages, handleReset])

  const handleNextImage = useCallback(() => {
    if (hasMultipleImages) {
      const newIndex =
        currentIndex === imageList.length - 1 ? 0 : currentIndex + 1
      setCurrentIndex(newIndex)
      handleReset()
    }
  }, [currentIndex, imageList.length, hasMultipleImages, handleReset])

  const handleZoomIn = useCallback(() => {
    setZoom((prev) => Math.min(prev + ZOOM_STEP, MAX_ZOOM))
  }, [])

  const handleZoomOut = useCallback(() => {
    setZoom((prev) => Math.max(prev - ZOOM_STEP, MIN_ZOOM))
  }, [])

  const handleRotateLeft = useCallback(() => {
    setRotation((prev) => prev - 90)
  }, [])

  const handleRotateRight = useCallback(() => {
    setRotation((prev) => prev + 90)
  }, [])

  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      if (zoom > 1) {
        setIsDragging(true)
        setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y })
      }
    },
    [zoom, position]
  )

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (isDragging && zoom > 1) {
        setPosition({
          x: e.clientX - dragStart.x,
          y: e.clientY - dragStart.y,
        })
      }
    },
    [isDragging, dragStart, zoom]
  )

  const handleMouseUp = useCallback(() => {
    setIsDragging(false)
  }, [])

  const handleWheel = useCallback((e: WheelEvent) => {
    e.preventDefault()
    const delta = e.deltaY > 0 ? -ZOOM_STEP : ZOOM_STEP
    setZoom((prev) => Math.max(MIN_ZOOM, Math.min(MAX_ZOOM, prev + delta)))
  }, [])

  // Touch utility functions
  const getDistance = useCallback(
    (touch1: TouchInfo, touch2: TouchInfo): number => {
      const dx = touch1.x - touch2.x
      const dy = touch1.y - touch2.y
      return Math.sqrt(dx * dx + dy * dy)
    },
    []
  )

  const getCenter = useCallback((touch1: TouchInfo, touch2: TouchInfo) => {
    return {
      x: (touch1.x + touch2.x) / 2,
      y: (touch1.y + touch2.y) / 2,
    }
  }, [])

  const getTouchInfo = useCallback((touch: React.Touch): TouchInfo => {
    return {
      x: touch.clientX,
      y: touch.clientY,
      id: touch.identifier,
    }
  }, [])

  // Touch event handlers
  const handleTouchStart = useCallback(
    (e: React.TouchEvent) => {
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
          if (zoom === 1) {
            setZoom(2)
          } else {
            handleReset()
          }
          setLastTap(0)
          return
        }
        setLastTap(now)

        // Set initial swipe position
        setSwipeStartX(touch.x)
        setIsSwipeGesture(zoom === 1 && hasMultipleImages)

        // Single touch pan (when zoomed)
        if (zoom > 1) {
          setIsDragging(true)
          setDragStart({ x: touch.x - position.x, y: touch.y - position.y })
        }
      } else if (newTouches.length === 2) {
        // Pinch to zoom setup
        setIsDragging(false)
        const distance = getDistance(newTouches[0], newTouches[1])
        const center = getCenter(newTouches[0], newTouches[1])

        setInitialDistance(distance)
        setInitialZoom(zoom)
        setTouchCenter(center)
      }
    },
    [zoom, position, lastTap, getTouchInfo, getDistance, getCenter, handleReset]
  )

  const handleTouchMove = useCallback(
    (e: React.TouchEvent) => {
      e.preventDefault()

      const newTouches = Array.from(e.touches).map((touch) =>
        getTouchInfo(touch)
      )
      setTouches(newTouches)

      if (newTouches.length === 1 && isDragging && zoom > 1) {
        // Single touch pan
        const touch = newTouches[0]
        setPosition({
          x: touch.x - dragStart.x,
          y: touch.y - dragStart.y,
        })
      } else if (newTouches.length === 2 && initialDistance > 0) {
        // Pinch to zoom
        const distance = getDistance(newTouches[0], newTouches[1])
        const scale = distance / initialDistance
        const newZoom = Math.max(
          MIN_ZOOM,
          Math.min(MAX_ZOOM, initialZoom * scale)
        )

        setZoom(newZoom)
      }
    },
    [
      isDragging,
      zoom,
      dragStart,
      initialDistance,
      initialZoom,
      getTouchInfo,
      getDistance,
    ]
  )

  const handleTouchEnd = useCallback(
    (e: React.TouchEvent) => {
      e.preventDefault()

      const remainingTouches = Array.from(e.touches).map((touch) =>
        getTouchInfo(touch)
      )
      setTouches(remainingTouches)

      // Handle swipe gesture for navigation
      if (remainingTouches.length === 0 && isSwipeGesture) {
        const changedTouches = Array.from(e.changedTouches)
        if (changedTouches.length > 0) {
          const endX = changedTouches[0].clientX
          const swipeDistance = endX - swipeStartX
          const minSwipeDistance = 50

          if (Math.abs(swipeDistance) > minSwipeDistance) {
            if (swipeDistance > 0) {
              handlePreviousImage()
            } else {
              handleNextImage()
            }
          }
        }
        setIsSwipeGesture(false)
      }

      if (remainingTouches.length === 0) {
        setIsDragging(false)
        setInitialDistance(0)
        setInitialZoom(1)
      } else if (remainingTouches.length === 1 && initialDistance > 0) {
        // Transition from pinch to pan
        setInitialDistance(0)
        setInitialZoom(1)

        if (zoom > 1) {
          setIsDragging(true)
          const touch = remainingTouches[0]
          setDragStart({ x: touch.x - position.x, y: touch.y - position.y })
        }
      }
    },
    [
      zoom,
      position,
      initialDistance,
      getTouchInfo,
      isSwipeGesture,
      swipeStartX,
      hasMultipleImages,
      handlePreviousImage,
      handleNextImage,
    ]
  )

  const centerImage = useCallback(() => {
    if (zoom <= 1) {
      setPosition({ x: 0, y: 0 })
      return
    }

    const imageElement = imageRef.current
    if (!imageElement) return

    const container = imageElement.parentElement
    if (!container) return

    const containerWidth = container.clientWidth
    const containerHeight = container.clientHeight
    const imageWidth = imageElement.naturalWidth || imageElement.width
    const imageHeight = imageElement.naturalHeight || imageElement.height

    const scaledWidth = imageWidth * zoom
    const scaledHeight = imageHeight * zoom

    setPosition((currentPosition) => {
      let newX = currentPosition.x
      let newY = currentPosition.y

      if (scaledWidth > containerWidth) {
        const maxX = (scaledWidth - containerWidth) / 2
        const minX = -maxX

        if (newX > maxX) newX = maxX
        if (newX < minX) newX = minX
      } else {
        newX = 0
      }

      if (scaledHeight > containerHeight) {
        const maxY = (scaledHeight - containerHeight) / 2
        const minY = -maxY

        if (newY > maxY) newY = maxY
        if (newY < minY) newY = minY
      } else {
        newY = 0
      }

      return newX !== currentPosition.x || newY !== currentPosition.y
        ? { x: newX, y: newY }
        : currentPosition
    })
  }, [zoom])

  useEffect(() => {
    const preventTouchScroll = (e: TouchEvent) => {
      if (e.target && containerRef.current?.contains(e.target as Node)) {
        e.preventDefault()
      }
    }

    document.addEventListener('touchstart', preventTouchScroll, {
      passive: false,
    })
    document.addEventListener('touchmove', preventTouchScroll, {
      passive: false,
    })

    return () => {
      document.removeEventListener('touchstart', preventTouchScroll)
      document.removeEventListener('touchmove', preventTouchScroll)
    }
  }, [])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose()
      } else if (e.key === 'ArrowLeft') {
        handlePreviousImage()
      } else if (e.key === 'ArrowRight') {
        handleNextImage()
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [onClose, handlePreviousImage, handleNextImage])

  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove)
      document.addEventListener('mouseup', handleMouseUp)

      return () => {
        document.removeEventListener('mousemove', handleMouseMove)
        document.removeEventListener('mouseup', handleMouseUp)
      }
    }
  }, [isDragging, handleMouseMove, handleMouseUp])

  useEffect(() => {
    const imageElement = imageRef.current
    if (imageElement) {
      imageElement.addEventListener('wheel', handleWheel, { passive: false })
      return () => imageElement.removeEventListener('wheel', handleWheel)
    }
  }, [handleWheel])

  useEffect(() => {
    centerImage()
  }, [zoom, centerImage])

  useEffect(() => {
    if (!isDragging) {
      centerImage()
    }
  }, [isDragging, centerImage])

  const imageStyle = {
    transform: `translate(${position.x}px, ${position.y}px) scale(${zoom}) rotate(${rotation}deg)`,
    cursor: zoom > 1 ? (isDragging ? 'grabbing' : 'grab') : 'default',
    transition:
      isDragging || touches.length > 0 ? 'none' : 'transform 0.2s ease',
    maxWidth: currentImage.maxWidth,
    maxHeight: '80vh',
    userSelect: 'none' as const,
    touchAction: 'none' as const,
  }

  return (
    <>
      <div
        className="absolute top-16 left-1/2 z-10 flex -translate-x-1/2 items-center gap-1 rounded-lg bg-black/80 p-1 backdrop-blur-sm sm:gap-2 md:top-2"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={handleZoomOut}
          disabled={zoom <= MIN_ZOOM}
          className="cursor-pointer touch-manipulation rounded p-2 transition-colors hover:bg-white/20 disabled:cursor-not-allowed disabled:opacity-50 sm:p-2"
          title="Zoom Out"
          aria-label="Zoom out"
        >
          <ZoomOutIcon className="h-5 w-5 text-white sm:h-4 sm:w-4 xl:h-5 xl:w-5" />
        </button>

        <span className="min-w-[35px] text-center text-xs text-white sm:min-w-[40px] sm:text-xs">
          {Math.round(zoom * 100)}%
        </span>

        <button
          onClick={handleZoomIn}
          disabled={zoom >= MAX_ZOOM}
          className="cursor-pointer touch-manipulation rounded p-2 transition-colors hover:bg-white/20 disabled:cursor-not-allowed disabled:opacity-50 sm:p-2"
          title="Zoom In"
          aria-label="Zoom in"
        >
          <ZoomInIcon className="h-4 w-4 xl:h-5 xl:w-5" />
        </button>

        <div className="h-5 w-px bg-white/30 sm:h-6"></div>

        <button
          onClick={handleRotateLeft}
          className="hover:bg-Primary-950 cursor-pointer rounded p-2 transition-colors"
          title="Rotate Left"
          aria-label="Rotate left"
        >
          <RotateLeftIcon className="h-4 w-4 xl:h-5 xl:w-5" />
        </button>

        <button
          onClick={handleRotateRight}
          className="hover:bg-Primary-950 cursor-pointer rounded p-2 transition-colors"
          title="Rotate Right"
          aria-label="Rotate right"
        >
          <RotateRightIcon className="h-4 w-4 xl:h-5 xl:w-5" />
        </button>

        <div className="bg-Primary-600 h-6 w-px"></div>

        <button
          onClick={handleReset}
          className="hover:bg-Primary-950 cursor-pointer rounded p-2 transition-colors"
          title="Reset"
          aria-label="Reset transformations"
        >
          <ResetIcon className="h-4 w-4 xl:h-5 xl:w-5" />
        </button>

        <DownloadButton
          url={currentImage.src}
          title={currentImage.alt}
          styles="hover:bg-Primary-950 rounded p-2 transition-colors cursor-pointer"
          showLabel={false}
        />
      </div>

      <button
        onClick={onClose}
        className="bg-Primary-Complementary/90 hover:bg-Primary-950 absolute top-4 right-4 z-10 cursor-pointer rounded-full p-2 backdrop-blur-sm transition-colors"
        title="Close (ESC)"
        aria-label="Close image viewer"
      >
        <CloseIcon className="h-5 w-5" />
      </button>

      {hasMultipleImages && (
        <>
          <button
            onClick={(e) => {
              e.stopPropagation()
              handlePreviousImage()
            }}
            className="bg-Complementary/60 hover:bg-Primary-950 absolute top-1/2 left-4 z-10 -translate-y-1/2 cursor-pointer rounded-full p-3 backdrop-blur-sm transition-colors duration-300"
            title="Previous image (←)"
            aria-label="Previous image"
          >
            <PreviousIcon className="h-6 w-6" />
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation()
              handleNextImage()
            }}
            className="bg-Complementary/60 hover:bg-Primary-950 absolute top-1/2 right-4 z-10 -translate-y-1/2 cursor-pointer rounded-full p-3 backdrop-blur-sm transition-colors duration-300"
            title="Next image (→)"
            aria-label="Next image"
          >
            <NextIcon className="h-6 w-6" />
          </button>
        </>
      )}

      {hasMultipleImages && (
        <div className="bg-Primary-900/80 text-Primary-200 absolute top-4 left-4 z-10 rounded px-3 py-1 text-sm backdrop-blur-sm">
          {currentIndex + 1} / {imageList.length}
        </div>
      )}

      <div
        className="relative flex touch-none items-center justify-center"
        onClick={(e) => e.stopPropagation()}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <img
          ref={imageRef}
          src={createImageUrlProxy(currentImage.src, '0', '70', 'webp')}
          alt={currentImage.alt}
          style={imageStyle}
          onMouseDown={handleMouseDown}
          draggable={false}
        />
      </div>

      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 rounded bg-black/70 px-2 py-1 text-center text-xs text-white backdrop-blur-sm sm:bottom-4 sm:px-3 sm:text-xs">
        <span className="block sm:hidden">
          Pinch to zoom • Double tap to zoom • Drag to pan
          {hasMultipleImages && ' • Swipe for navigation'}
        </span>
        <span className="hidden sm:block">
          Scroll to zoom • Drag to pan when zoomed • ESC to close
          {hasMultipleImages && ' • ← → to navigate'}
        </span>
      </div>
    </>
  )
}
