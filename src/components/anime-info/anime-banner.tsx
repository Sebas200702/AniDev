import { Overlay } from '@components/overlay'
import { Picture } from '@components/picture'
import { createImageUrlProxy } from '@utils/craete-imageurl-proxy'

/**
 * Props for the AnimeBanner component.
 *
 * @typedef {Object} Props
 * @property {string} banner_image - The banner image URL.
 * @property {string} image_large_webp - The large webp image URL.
 * @property {string} title - The title of the anime.
 */
interface Props {
  banner_image: string
  image_large_webp: string
  title: string
}

/**
 * AnimeBanner component renders a banner for an anime.
 *
 * @description This component creates a visually appealing banner display for anime content.
 * It handles different image sources by prioritizing the banner image when available, falling
 * back to the large webp image when necessary. The component applies proper image optimization
 * techniques by using low-resolution placeholders during loading and higher resolution images
 * for the final display.
 *
 * The component implements a responsive design with a fixed aspect ratio and viewport-based height
 * to ensure consistent presentation across different screen sizes. It also includes a gradient
 * overlay to improve text readability when content is placed over the banner image.
 *
 * The Picture component is used to provide progressive image loading, improving the perceived
 * performance and user experience when navigating between different anime pages.
 *
 * @param {Props} props - The component props
 * @param {string} props.banner_image - The URL of the anime banner image
 * @param {string} props.image_large_webp - The URL of the large anime image in WebP format (fallback)
 * @param {string} props.title - The title of the anime used for the image alt text
 * @returns {JSX.Element} The rendered anime banner with optimized images and overlay
 *
 * @example
 * <AnimeBanner
 *   banner_image="https://example.com/banner.jpg"
 *   image_large_webp="https://example.com/large.webp"
 *   title="Anime Title"
 * />
 */
export const AnimeBanner = ({
  banner_image,
  image_large_webp,
  title,
}: Props): JSX.Element => {
  return (
    <div className="relative aspect-[1080/600] h-[60vh] w-full overflow-hidden">
      <Picture
        image={
          banner_image
            ? createImageUrlProxy(banner_image, '100', '0', 'avif')
            : createImageUrlProxy(image_large_webp, '100', '0', 'avif')
        }
        styles=" w-full object-cover object-center"
      >
        <img
          src={
            banner_image
              ? createImageUrlProxy(banner_image, '1920', '50', 'avif')
              : createImageUrlProxy(image_large_webp, '1920', '50', 'avif')
          }
          alt={`${title} banner`}
          loading="lazy"
          className="relative h-full w-full object-cover object-center"
          width={225}
          height={330}
        />
      </Picture>
      <Overlay className="to-Primary-950/100 h-full w-full bg-gradient-to-b" />
    </div>
  )
}
