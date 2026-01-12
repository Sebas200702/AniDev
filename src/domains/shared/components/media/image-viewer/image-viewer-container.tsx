import { ImageViewer } from '@shared/components/media/image-viewer/image-viewer'
import { useImageGestures } from '@shared/hooks/image-viewer/useImageGestures'
import { useImageKeyboard } from '@shared/hooks/image-viewer/useImageKeyboard'
import { useImageList } from '@shared/hooks/image-viewer/useImageList'
import { useImagePan } from '@shared/hooks/image-viewer/useImagePan'
import { useImageRotation } from '@shared/hooks/image-viewer/useImageRotation'
import { useImageViewerRefs } from '@shared/hooks/image-viewer/useImageViewerRefs'
import { useImageZoom } from '@shared/hooks/image-viewer/useImageZoom'
import type { ImageType } from '@shared/types'
import { useEffect } from 'react'

interface ImageViewerContainerProps {
  onClose: () => void
  imageList: ImageType[]
  initialIndex?: number
}

/**
 * Container component that orchestrates all image viewer logic
 */
export const ImageViewerContainer = ({
  onClose,
  imageList,
  initialIndex = 0,
}: ImageViewerContainerProps) => {
  // Refs
  const { imageRef, containerRef } = useImageViewerRefs()

  // Image list navigation
  const {
    currentIndex,
    currentImage,
    hasMultipleImages,
    goToNext,
    goToPrevious,
  } = useImageList(imageList, initialIndex)

  // Transformations
  const { zoom, zoomIn, zoomOut, handleWheel, MIN_ZOOM, MAX_ZOOM } =
    useImageZoom()
  const {
    rotation,
    rotateLeft,
    rotateRight,
    reset: resetRotation,
  } = useImageRotation()
  const {
    position,
    isDragging,
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
    reset: resetPan,
    centerImage,
  } = useImagePan(zoom)

  // Gestures
  const {
    handleTouchStart: onTouchStart,
    handleTouchMove: onTouchMove,
    handleTouchEnd: onTouchEnd,
    isDoubleTapZoom,
    setIsDoubleTapZoom,
  } = useImageGestures()

  // Keyboard
  useImageKeyboard({
    onClose,
    onNext: goToNext,
    onPrevious: goToPrevious,
  })

  // Reset transformations when changing images
  useEffect(() => {
    resetRotation()
    resetPan()
  }, [currentIndex, resetRotation, resetPan])

  // Handle reset button
  const handleReset = () => {
    resetRotation()
    resetPan()
  }

  // Handle double tap zoom
  useEffect(() => {
    if (isDoubleTapZoom) {
      if (zoom === 1) {
        // Zoom in
        const newZoom = 2
        // We would need to update zoom state, but useImageZoom doesn't expose setZoom
        // This shows we might need a combined zoom hook or expose setZoom
      } else {
        handleReset()
      }
      setIsDoubleTapZoom(false)
    }
  }, [isDoubleTapZoom])

  // Center image when zoom changes
  useEffect(() => {
    if (imageRef.current) {
      centerImage(imageRef, zoom)
    }
  }, [zoom, centerImage])

  // Handle mouse events for dragging
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

  // Handle mouse wheel zoom
  useEffect(() => {
    const imageElement = imageRef.current
    if (imageElement) {
      imageElement.addEventListener('wheel', handleWheel, { passive: false })
      return () => imageElement.removeEventListener('wheel', handleWheel)
    }
  }, [handleWheel])

  // Prevent touch scroll
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

  // Wrap touch handlers to pass additional props
  const handleTouchStartWrapped = (e: React.TouchEvent) => {
    onTouchStart(e, zoom, hasMultipleImages)
  }

  return (
    <ImageViewer
      currentImage={currentImage}
      imageRef={imageRef}
      containerRef={containerRef}
      zoom={zoom}
      rotation={rotation}
      position={position}
      isDragging={isDragging}
      onMouseDown={handleMouseDown}
      onTouchStartWrapped={handleTouchStartWrapped}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
      onClose={onClose}
      imageList={imageList}
      currentIndex={currentIndex}
      hasMultipleImages={hasMultipleImages}
      goToNext={goToNext}
      goToPrevious={goToPrevious}
      zoomIn={zoomIn}
      zoomOut={zoomOut}
      rotateLeft={rotateLeft}
      rotateRight={rotateRight}
      handleReset={handleReset}
    />
  )
}
