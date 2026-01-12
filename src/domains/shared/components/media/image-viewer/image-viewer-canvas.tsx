import { Picture } from '@shared/components/media/picture'
import type { ImageType } from '@shared/types'
import type { CSSProperties } from 'react'

interface ImageViewerCanvasProps {
  image: ImageType
  imageRef: React.RefObject<HTMLImageElement | null>
  containerRef: React.RefObject<HTMLDivElement | null>
  zoom: number
  rotation: number
  positionX: number
  positionY: number
  isDragging: boolean
  onMouseDown: (e: React.MouseEvent) => void
  onTouchStart: (e: React.TouchEvent) => void
  onTouchMove: (e: React.TouchEvent) => void
  onTouchEnd: (e: React.TouchEvent) => void
}

/**
 * Presentational component for image viewer canvas
 */
export const ImageViewerCanvas = ({
  image,
  imageRef,
  containerRef,
  zoom,
  rotation,
  positionX,
  positionY,
  isDragging,
  onMouseDown,
  onTouchStart,
  onTouchMove,
  onTouchEnd,
}: ImageViewerCanvasProps) => {
  const imageStyle: CSSProperties = {
    transform: `translate(${positionX}px, ${positionY}px) scale(${zoom}) rotate(${rotation}deg)`,
    cursor: zoom > 1 ? (isDragging ? 'grabbing' : 'grab') : 'default',
    transition: isDragging ? 'none' : 'transform 0.2s ease',
    maxWidth: image.maxWidth,
    maxHeight: '80vh',
    userSelect: 'none',
    touchAction: 'none',
  }

  return (
    <div
      ref={containerRef}
      className="relative flex touch-none items-center justify-center"
      onClick={(e) => e.stopPropagation()}
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
    >
      <Picture
        imageRef={imageRef}
        image={image.src}
        placeholder={image.src}
        alt={image.alt}
        imageStyle={imageStyle}
        onMouseDown={onMouseDown}
        draggable={false}
      />
    </div>
  )
}
