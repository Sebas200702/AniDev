import { createImageUrlProxy } from '@shared/utils/create-image-url-proxy'

/**
 * Picture component displays an image with a background placeholder for progressive loading.
 *
 * @description This component creates an optimized image display with a low-resolution background
 * image that serves as a placeholder while the main image loads.
 *
 * @param {Object} props - The component props
 * @param {string} [props.styles] - Optional CSS class names for styling
 * @param {string} props.image - The URL of the image
 * @param {string} props.placeholder - The URL of the placeholder image
 * @param {string} props.alt - Alt text for the image
 * @param {boolean} [props.isBanner] - Whether this is a banner image
 * @returns The rendered picture element with placeholder and image
 */

interface PictureProps {
  styles?: string
  image: string
  placeholder: string
  alt: string
  isBanner?: boolean
  imageRef?: React.RefObject<HTMLImageElement | null>
  onMouseDown?: (e: React.MouseEvent) => void
  draggable?: boolean
  imageStyle?: React.CSSProperties
}
export const Picture = ({
  styles,
  image,
  placeholder,
  alt,
  isBanner,
  imageRef,
  onMouseDown,
  draggable = false,
  imageStyle,
}: PictureProps) => {
  const placeholderUrl = createImageUrlProxy(
    placeholder || '/placeholder.webp',
    '100',
    '0',
    'webp'
  )
  const imageUrl = createImageUrlProxy(
    image || '/placeholder.webp',
    isBanner ? '1920' : '0',
    '75',
    'webp'
  )

  return (
    <figure className={`${styles} overflow-hidden`} style={imageStyle}>
      <img
        className="absolute inset-0 h-full w-full object-cover object-center blur-lg filter"
        src={placeholderUrl}
        alt=""
        aria-hidden="true"
        decoding="async"
        fetchPriority="low"
        loading="eager"
      />
      <img
        className="relative h-full w-full object-cover object-center"
        src={imageUrl}
        alt={alt}
        width={isBanner ? 1920 : undefined}
        height={isBanner ? 1080 : undefined}
        loading={isBanner ? 'eager' : 'lazy'}
        fetchPriority={isBanner ? 'high' : 'low'}
        decoding="async"
        ref={imageRef}
        onMouseDown={onMouseDown}
        draggable={draggable}
      />
    </figure>
  )
}
