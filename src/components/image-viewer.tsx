import { DownloadButton } from '@components/dowload-button'
import { CloseIcon } from '@components/icons/close-icon'
import { DownloadIcon } from '@components/icons/download-icon'
import { ResetIcon } from '@components/icons/reset-icon'
import { RotateLeftIcon } from '@components/icons/rotate-left-icon'
import { RotateRightIcon } from '@components/icons/rotate-right-icon'
import { ZoomInIcon } from '@components/icons/zoom-in-icon'
import { ZoomOutIcon } from '@components/icons/zoom-out-icon'
import { useCallback, useEffect, useRef, useState } from 'react'

interface ImageViewerProps {
  src: string
  alt: string
  onClose: () => void
  maxWidth?: string
}

/**
 * Simplified image viewer with essential features.
 *
 * Features:
 * - Zoom in/out with buttons
 * - Rotate left/right
 * - Pan/drag when zoomed
 * - Download image using API endpoint
 * - Reset all transformations
 * - Close with ESC key
 */
export const ImageViewer = ({
  src,
  alt,
  onClose,
  maxWidth = '90vw',
}: ImageViewerProps) => {
  const [zoom, setZoom] = useState(1)
  const [rotation, setRotation] = useState(0)
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [isDragging, setIsDragging] = useState(false)
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 })

  const imageRef = useRef<HTMLImageElement>(null)

  const MIN_ZOOM = 0.5
  const MAX_ZOOM = 3
  const ZOOM_STEP = 0.3

  const handleReset = useCallback(() => {
    setZoom(1)
    setRotation(0)
    setPosition({ x: 0, y: 0 })
  }, [])

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
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose()
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [onClose])

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
    transition: isDragging ? 'none' : 'transform 0.2s ease',
    maxWidth: maxWidth,
    maxHeight: '80vh',
    userSelect: 'none' as const,
  }

  return (
    <>
      <div
        className="bg-Primary-Complementary/90 absolute top-4 left-1/2 z-10 flex -translate-x-1/2 items-center gap-2 rounded-lg p-2 backdrop-blur-sm"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={handleZoomOut}
          disabled={zoom <= MIN_ZOOM}
          className="hover:bg-Primary-950 rounded p-2 transition-colors disabled:cursor-not-allowed disabled:opacity-50"
          title="Zoom Out"
          aria-label="Zoom out"
        >
          <ZoomOutIcon className="h-4 w-4 xl:h-5 xl:w-5" />
        </button>

        <span className="text-Primary-200 min-w-[40px] text-center text-xs">
          {Math.round(zoom * 100)}%
        </span>

        <button
          onClick={handleZoomIn}
          disabled={zoom >= MAX_ZOOM}
          className="hover:bg-Primary-950 rounded p-2 transition-colors disabled:cursor-not-allowed disabled:opacity-50"
          title="Zoom In"
          aria-label="Zoom in"
        >
          <ZoomInIcon className="h-4 w-4 xl:h-5 xl:w-5" />
        </button>

        <div className="bg-Primary-600 h-6 w-px"></div>

        <button
          onClick={handleRotateLeft}
          className="hover:bg-Primary-950 rounded p-2 transition-colors"
          title="Rotate Left"
          aria-label="Rotate left"
        >
          <RotateLeftIcon className="h-4 w-4 xl:h-5 xl:w-5" />
        </button>

        <button
          onClick={handleRotateRight}
          className="hover:bg-Primary-950 rounded p-2 transition-colors"
          title="Rotate Right"
          aria-label="Rotate right"
        >
          <RotateRightIcon className="h-4 w-4 xl:h-5 xl:w-5" />
        </button>

        <div className="bg-Primary-600 h-6 w-px"></div>

        <button
          onClick={handleReset}
          className="hover:bg-Primary-950 rounded p-2 transition-colors"
          title="Reset"
          aria-label="Reset transformations"
        >
          <ResetIcon className="h-4 w-4 xl:h-5 xl:w-5" />
        </button>

        <DownloadButton
          url={src}
          title={alt}
          styles="hover:bg-Primary-950 rounded p-2 transition-colors"
          showLabel={false}
        />
      </div>

      <button
        onClick={onClose}
        className="bg-Primary-Complementary/90 hover:bg-Primary-950 absolute top-4 right-4 z-10 rounded-full p-2 backdrop-blur-sm transition-colors"
        title="Close (ESC)"
        aria-label="Close image viewer"
      >
        <CloseIcon className="h-5 w-5" />
      </button>

      <div
        className="relative flex items-center justify-center"
        onClick={(e) => e.stopPropagation()}
      >
        <img
          ref={imageRef}
          src={src}
          alt={alt}
          style={imageStyle}
          onMouseDown={handleMouseDown}
          className="object-contain"
          draggable={false}
        />
      </div>

      <div className="text-Primary-300 bg-Primary-900/50 absolute bottom-4 left-1/2 -translate-x-1/2 rounded px-3 py-1 text-center text-xs backdrop-blur-sm">
        Scroll to zoom • Drag to pan when zoomed • ESC to close
      </div>
    </>
  )
}
