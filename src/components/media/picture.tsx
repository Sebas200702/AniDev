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
 * @returns {JSX.Element} The rendered picture element with background image and children
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
  children,
}: {
  styles?: string
  image: string
  children: React.ReactNode
}) => {
  return (
    <picture className={`${styles} overflow-hidden`}>
      <img
        className="absolute inset-0 h-full w-full bg-cover bg-center blur-lg filter"
        src={image}
        alt="placeholder"
      />
      {children}
    </picture>
  )
}
