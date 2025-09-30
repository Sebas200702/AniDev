import { baseUrl } from '@utils/base-url'
import { createImageUrlProxy } from '@utils/create-image-url-proxy'
import { buildProxiedImageSrc } from '@utils/proxy-image'
import { useEffect, useState } from 'react'
/**
 * Picture component displays an image with a background placeholder for progressive loading.
 *
 * @description This component creates an optimized image display with a low-resolution background
 * image that serves as a placeholder while the main image loads. It leverages the HTML picture
 * element to provide a container with background styling based on the provided image URL.
 *
 * The component applies the background image as a blurred placeholder that is immediately visible
 * to users while the higher resolution image (provided as children) loads. This technique improves
 * perceived performance and creates a smoother loading experience. The component accepts custom
 * styling through the styles prop to allow for flexible integration in different contexts.
 *
 * The background image uses CSS properties to ensure proper scaling and positioning across
 * different container sizes. The component is commonly used throughout the application for
 * anime cards, banners, and collection items to provide consistent image loading behavior.
 *
 * @param {Object} props - The component props
 * @param {string} [props.styles] - Optional additional CSS class names for styling the picture container
 * @param {string} props.image - The URL of the low-resolution image to use as background placeholder
 * @param {React.ReactNode} props.children - The content to render inside the picture element, typically the high-resolution image
 * @returns The rendered picture element with background image and children
 *
 * @example
 * <Picture
 *   image="https://example.com/low-res-image.jpg"
 *   styles="w-full rounded-lg overflow-hidden"
 * >
 *   <img src="https://example.com/high-res-image.jpg" alt="Description" />
 * </Picture>
 */
export const Picture = ({
  styles,
  image,
  placeholder,
  alt,
  isBanner,
}: {
  styles?: string
  image?: string
  placeholder?: string
  alt: string
  isBanner?: boolean
}) => {
  const [resolvedPlaceholder, setResolvedPlaceholder] = useState<string>()
  const [resolvedImage, setResolvedImage] = useState<string>()

  useEffect(() => {
    let active = true
    const resolve = async () => {
      const placeholderSrc = placeholder || `${baseUrl}/placeholder.webp`
      const imageSrc = image || `${baseUrl}/placeholder.webp`
      const widthMain = isBanner ? '1920' : '0'

      const [ph, im] = await Promise.all([
        buildProxiedImageSrc(placeholderSrc, '100', '0', 'webp').catch(
          () => ''
        ),
        buildProxiedImageSrc(imageSrc, widthMain, '75', 'webp').catch(() => ''),
      ])

      if (!active) return
      setResolvedPlaceholder(ph || undefined)
      setResolvedImage(im || undefined)
    }
    resolve()
    return () => {
      active = false
    }
  }, [placeholder, image, isBanner])

  return (
    <figure className={`${styles} overflow-hidden`}>
      <img
        className="absolute inset-0 h-full w-full object-cover object-center blur-lg filter"
        src={
          resolvedPlaceholder ||
          createImageUrlProxy(
            placeholder || `${baseUrl}/placeholder.webp`,
            '100',
            '0',
            'webp'
          )
        }
        alt={alt}
        decoding="async"
        fetchPriority="high"
        loading="eager"
      />
      <img
        className={`relative h-full w-full object-cover object-center`}
        src={
          resolvedImage ||
          createImageUrlProxy(
            image || `${baseUrl}/placeholder.webp`,
            `${isBanner ? '1920' : '0'}`,
            '75',
            'webp'
          )
        }
        alt={alt}
        loading="lazy"
      />
    </figure>
  )
}
