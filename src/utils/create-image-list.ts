import { baseUrl } from '@utils/base-url'
import { createImageUrlProxy } from '@utils/create-imageurl-proxy'
import type { ImageType } from 'types'



/**
 * Creates a single ImageType object with proper fallbacks
 */
export const createImage = ({
  src,
  alt,
  maxWidth = '90vw',
  fallback = `${baseUrl}/placeholder.webp`,
  placeholder = `${baseUrl}/placeholder.webp`,
}: {
  src: string | null | undefined
  alt: string
  maxWidth?: string
  fallback?: string
  placeholder?: string
}): ImageType => ({
  src: src ?? fallback,
  alt,
  maxWidth,
  placeholder,
})

/**
 * Creates an optimized image with proxy URL
 */
export const createOptimizedImage = ({
  src,
  alt,
  width = '1920',
  quality = '50',
  format = 'webp' as const,
  maxWidth = '90vw',
  fallback = `${baseUrl}/placeholder.webp`,
  placeholder = `${baseUrl}/placeholder.webp`,
}: {
  src: string | null | undefined
  alt: string
  width?: string
  quality?: string
  format?: 'webp' | 'jpg' | 'png'
  maxWidth?: string
  fallback?: string
  placeholder?: string
}): ImageType => ({
  src: createImageUrlProxy(src ?? fallback, width, quality, format),
  alt,
  maxWidth,
  placeholder,
})

/**
 * Creates a standard anime image list with poster and banner
 */
export const createAnimeImageList = ({
  title,
  posterImage,
  bannerImage,
  posterMaxWidth = '90vw',
  bannerMaxWidth = '100vw',
  posterPlaceholder,
  bannerPlaceholder,

}: {
  title: string
  posterImage: string | null | undefined
  bannerImage?: string | null | undefined
  posterMaxWidth?: string
  bannerMaxWidth?: string
  posterPlaceholder?: string
  bannerPlaceholder?: string
}): ImageType[] => {
  const images: ImageType[] = [
    createImage({
      src: posterImage,
      alt: `Poster of ${title}`,
      maxWidth: posterMaxWidth,
      placeholder: posterPlaceholder,

    }),
  ]

  if (bannerImage) {
    images.push(
      createOptimizedImage({
        src: bannerImage,
        alt: `Banner of ${title}`,
        maxWidth: bannerMaxWidth,
        placeholder: bannerPlaceholder,

      })
    )
  }

  return images
}

/**
 * Creates a single image list (useful when you only have one image)
 */
export const createSingleImageList = ({
  src,
  alt,
  maxWidth = '90vw',
  optimize = false,
  optimizeOptions,
}: {
  src: string | null | undefined
  alt: string
  maxWidth?: string
  optimize?: boolean
  optimizeOptions?: {
    width?: string
    quality?: string
    format?: 'webp' | 'jpg' | 'png'
  }
}): ImageType[] => {
  if (optimize && optimizeOptions) {
    return [
      createOptimizedImage({
        src,
        alt,
        maxWidth,
        ...optimizeOptions,
      }),
    ]
  }

  return [
    createImage({
      src,
      alt,
      maxWidth,
    }),
  ]
}
