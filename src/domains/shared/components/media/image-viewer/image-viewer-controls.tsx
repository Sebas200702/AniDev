import { DownloadButton } from '@shared/components/buttons/download-button'
import { CloseIcon } from '@shared/components/icons/common/close-icon'
import { RotateLeftIcon } from '@shared/components/icons/media/rotate-left-icon'
import { RotateRightIcon } from '@shared/components/icons/media/rotate-right-icon'
import { ZoomInIcon } from '@shared/components/icons/media/zoom-in-icon'
import { ZoomOutIcon } from '@shared/components/icons/media/zoom-out-icon'
import { NextIcon } from '@shared/components/icons/watch/next-icon'
import { PreviousIcon } from '@shared/components/icons/watch/previous-icon'
import { ResetIcon } from '@shared/components/icons/watch/reset-icon'
import type { ImageType } from '@shared/types'

interface ImageViewerControlsProps {
  currentImage: ImageType
  zoom: number
  hasMultipleImages: boolean
  currentIndex: number
  totalImages: number
  onZoomIn: () => void
  onZoomOut: () => void
  onRotateLeft: () => void
  onRotateRight: () => void
  onReset: () => void
  onClose: () => void
  onPrevious: () => void
  onNext: () => void
  minZoom: number
  maxZoom: number
}

/**
 * Presentational component for image viewer controls
 */
export const ImageViewerControls = ({
  currentImage,
  zoom,
  hasMultipleImages,
  currentIndex,
  totalImages,
  onZoomIn,
  onZoomOut,
  onRotateLeft,
  onRotateRight,
  onReset,
  onClose,
  onPrevious,
  onNext,
  minZoom,
  maxZoom,
}: ImageViewerControlsProps) => {
  return (
    <>
      {/* Top toolbar */}
      <div
        className="absolute top-16 left-1/2 z-10 flex -translate-x-1/2 items-center gap-1 rounded-lg bg-black/80 p-1 backdrop-blur-sm sm:gap-2 md:top-2"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onZoomOut}
          disabled={zoom <= minZoom}
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
          onClick={onZoomIn}
          disabled={zoom >= maxZoom}
          className="cursor-pointer touch-manipulation rounded p-2 transition-colors hover:bg-white/20 disabled:cursor-not-allowed disabled:opacity-50 sm:p-2"
          title="Zoom In"
          aria-label="Zoom in"
        >
          <ZoomInIcon className="h-4 w-4 xl:h-5 xl:w-5" />
        </button>

        <div className="h-5 w-px bg-white/30 sm:h-6"></div>

        <button
          onClick={onRotateLeft}
          className="hover:bg-Primary-950 cursor-pointer rounded p-2 transition-colors"
          title="Rotate Left"
          aria-label="Rotate left"
        >
          <RotateLeftIcon className="h-4 w-4 xl:h-5 xl:w-5" />
        </button>

        <button
          onClick={onRotateRight}
          className="hover:bg-Primary-950 cursor-pointer rounded p-2 transition-colors"
          title="Rotate Right"
          aria-label="Rotate right"
        >
          <RotateRightIcon className="h-4 w-4 xl:h-5 xl:w-5" />
        </button>

        <div className="bg-Primary-600 h-6 w-px"></div>

        <button
          onClick={onReset}
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

      {/* Close button */}
      <button
        onClick={onClose}
        className="bg-Primary-Complementary/90 hover:bg-Primary-950 absolute top-4 right-4 z-10 cursor-pointer rounded-full p-2 backdrop-blur-sm transition-colors"
        title="Close (ESC)"
        aria-label="Close image viewer"
      >
        <CloseIcon className="h-5 w-5" />
      </button>

      {/* Navigation buttons */}
      {hasMultipleImages && (
        <>
          <button
            onClick={(e) => {
              e.stopPropagation()
              onPrevious()
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
              onNext()
            }}
            className="bg-Complementary/60 hover:bg-Primary-950 absolute top-1/2 right-4 z-10 -translate-y-1/2 cursor-pointer rounded-full p-3 backdrop-blur-sm transition-colors duration-300"
            title="Next image (→)"
            aria-label="Next image"
          >
            <NextIcon className="h-6 w-6" />
          </button>
        </>
      )}

      {/* Image counter */}
      {hasMultipleImages && (
        <div className="bg-Primary-900/80 text-Primary-200 absolute top-4 left-4 z-10 rounded px-3 py-1 text-sm backdrop-blur-sm">
          {currentIndex + 1} / {totalImages}
        </div>
      )}

      {/* Help text */}
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
