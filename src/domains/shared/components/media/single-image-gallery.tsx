import { GaleryImage } from '@shared/components/media/galery-image'
import { createSingleImageList } from '@utils/create-image-list'

interface SingleImageGalleryProps {
  children: React.ReactNode
  src: string | null | undefined
  alt: string
  maxWidth?: string
  optimize?: boolean
  optimizeOptions?: {
    width?: string
    quality?: string
    format?: 'webp' | 'jpg' | 'png'
  }
  disabled?: boolean
  overlayClassName?: string
  iconClassName?: string
  ariaLabel?: string
}

/**
 * Simplified wrapper for GaleryImage when working with a single image.
 * Automatically creates the imageList from a single src/alt pair.
 */
export const SingleImageGallery = ({
  children,
  src,
  alt,
  maxWidth = '90vw',
  optimize = false,
  optimizeOptions,
  disabled = false,
  overlayClassName,
  iconClassName,
  ariaLabel,
}: SingleImageGalleryProps) => {
  const imageList = createSingleImageList({
    src,
    alt,
    maxWidth,
    optimize,
    optimizeOptions,
  })

  return (
    <GaleryImage
      imageList={imageList}
      disabled={disabled}
      overlayClassName={overlayClassName}
      iconClassName={iconClassName}
      ariaLabel={ariaLabel}
    >
      {children}
    </GaleryImage>
  )
}

export default SingleImageGallery
