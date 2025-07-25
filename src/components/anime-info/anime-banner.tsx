import { ExpandIconV2 } from '@components/icons/expand-icon'
import { ImageViewer } from '@components/image-viewer'
import { Picture } from '@components/picture'
import { useModal } from '@hooks/useModal'
import { baseUrl } from '@utils/base-url'
import { createSingleImageList } from '@utils/create-image-list'
import { createImageUrlProxy } from '@utils/create-image-url-proxy'

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
}: Props) => {
  const { openModal, closeModal } = useModal()

  const imageList = createSingleImageList({
    src: banner_image ?? image_large_webp,
    alt: `${title} banner`,
    maxWidth: '100vw',
    optimize: true,
    optimizeOptions: {
      width: '1920',
      quality: '50',
      format: 'webp',
    },
  })

  const handleOpenImageViewer = () => {
    openModal(ImageViewer, {
      imageList,
      initialIndex: 0,
      onClose: closeModal,
    })
  }

  return (
    <div className="group">
      <div className="fixed aspect-[1080/600] h-[40vh] w-full overflow-hidden md:h-[60vh]">
        <Picture
          image={
            banner_image
              ? createImageUrlProxy(banner_image, '100', '0', 'webp')
              : createImageUrlProxy(
                  image_large_webp ?? `${baseUrl}/placeholder.webp`,
                  '100',
                  '0',
                  'webp'
                )
          }
          styles="h-full object-cover object-center relative"
        >
          <img
            src={
              banner_image
                ? createImageUrlProxy(banner_image, '1920', '50', 'webp')
                : createImageUrlProxy(
                    image_large_webp ?? `${baseUrl}/placeholder.webp`,
                    '1920',
                    '50',
                    'webp'
                  )
            }
            alt={`${title} banner`}
            loading="lazy"
            className="relative h-full w-full object-cover object-center"
          />
        </Picture>
      </div>

      {/* Small button to open image viewer */}
      <button
        onClick={handleOpenImageViewer}
        className="absolute top-[32dvh] right-4 z-50 transition-opacity duration-300 md:top-[45dvh] md:right-20 md:opacity-0 md:group-hover:opacity-100"
        aria-label="Open banner image in advanced viewer"
      >
        <ExpandIconV2 className="text-Primary-200 h-6 w-6" />
      </button>
    </div>
  )
}
