import type { ImageType } from '@shared/types'
import { baseUrl } from '@shared/utils/base-url'

export const createImage = ({
  src,
  alt,
  maxWidth = '90vw',
  fallback = `${baseUrl}/placeholder.webp`,
}: {
  src: string | null | undefined
  alt: string
  maxWidth?: string
  fallback?: string
}): ImageType => ({
  src: src ?? fallback,
  alt,
  maxWidth,
})


export const createAnimeImageList = ({
  title,
  posterImage,
  bannerImage,
  posterMaxWidth = '90vw',
  bannerMaxWidth = '100vw',
}: {
  title: string
  posterImage: string | null | undefined
  bannerImage?: string | null
  posterMaxWidth?: string
  bannerMaxWidth?: string
}): ImageType[] => {
  const images: ImageType[] = [
    createImage({
      src: posterImage,
      alt: `Poster of ${title}`,
      maxWidth: posterMaxWidth,
    }),
  ]

  if (bannerImage) {
    images.push(
      createImage({
        src: bannerImage,
        alt: `Banner of ${title}`,
        maxWidth: bannerMaxWidth,
      })
    )
  }

  return images
}


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
      createImage({
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
