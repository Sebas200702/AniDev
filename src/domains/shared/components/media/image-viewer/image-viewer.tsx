import { ImageViewerCanvas } from '@shared/components/media/image-viewer/image-viewer-canvas'
import { ImageViewerControls } from '@shared/components/media/image-viewer/image-viewer-controls'
import { ZOOM_CONFIG } from '@shared/constants/image-viewer'
import type { ImageType } from '@shared/types'
const { MIN_ZOOM, MAX_ZOOM } = ZOOM_CONFIG
interface ImageViewerProps {
  currentImage: ImageType
  imageRef: React.RefObject<HTMLImageElement | null>
  containerRef: React.RefObject<HTMLDivElement | null>
  zoom: number
  rotation: number
  position: { x: number; y: number }
  isDragging: boolean
  onMouseDown: (e: React.MouseEvent) => void
  onTouchStartWrapped: (e: React.TouchEvent) => void
  onTouchMove: (e: React.TouchEvent) => void
  onTouchEnd: (e: React.TouchEvent) => void
  onClose: () => void
  imageList: ImageType[]
  currentIndex: number
  hasMultipleImages: boolean
  goToNext: () => void
  goToPrevious: () => void
  zoomIn: () => void
  zoomOut: () => void
  rotateLeft: () => void
  rotateRight: () => void
  handleReset: () => void
}

/**
 * Image Viewer component with mobile touch support.
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
 *
 * @param onClose - Callback when viewer is closed
 * @param imageList - Array of images to display
 * @param initialIndex - Starting image index
 */
export const ImageViewer = ({
  currentImage,
  imageRef,
  containerRef,
  zoom,
  rotation,
  position,
  isDragging,
  onMouseDown: handleMouseDown,
  onTouchStartWrapped,
  onTouchMove,
  onTouchEnd,
  onClose,
  imageList,
  currentIndex,
  hasMultipleImages,
  goToNext,
  goToPrevious,
  zoomIn,
  zoomOut,
  rotateLeft,
  rotateRight,
  handleReset,
}: ImageViewerProps) => {
  return (
    <>
      <ImageViewerCanvas
        image={currentImage}
        imageRef={imageRef}
        containerRef={containerRef}
        zoom={zoom}
        rotation={rotation}
        positionX={position.x}
        positionY={position.y}
        isDragging={isDragging}
        onMouseDown={handleMouseDown}
        onTouchStart={onTouchStartWrapped}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
      />

      <ImageViewerControls
        currentImage={currentImage}
        zoom={zoom}
        hasMultipleImages={hasMultipleImages}
        currentIndex={currentIndex}
        totalImages={imageList.length}
        onZoomIn={zoomIn}
        onZoomOut={zoomOut}
        onRotateLeft={rotateLeft}
        onRotateRight={rotateRight}
        onReset={handleReset}
        onClose={onClose}
        onPrevious={goToPrevious}
        onNext={goToNext}
        minZoom={MIN_ZOOM}
        maxZoom={MAX_ZOOM}
      />
    </>
  )
}
