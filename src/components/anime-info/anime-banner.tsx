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
 * This component takes in props for the banner image, large webp image, and title,
 * and is used as a visual representation.
 *
 * @param {Props} props - The props for the component.
 */
export const AnimeBanner = ({
  banner_image,
  image_large_webp,
  title,
}: Props) => {
  return (
    <div className="relative aspect-[1080/600] h-[60dvh] w-full overflow-hidden">
      <Picture
        image={
          banner_image
            ? createImageUrlProxy(banner_image, '100', '0', 'webp')
            : createImageUrlProxy(image_large_webp, '100', '0', 'webp')
        }
        styles=" w-full object-cover object-center"
      >
        <img
          src={
            banner_image
              ? createImageUrlProxy(banner_image, '1920', '50', 'webp')
              : createImageUrlProxy(image_large_webp, '1920', '50', 'webp')
          }
          alt={`${title} banner`}
          loading="lazy"
          className="h-full w-full object-cover object-center"
          width={225}
          height={330}
        />
      </Picture>
      <Overlay className="to-Primary-950/100 h-full w-full bg-gradient-to-b" />
    </div>
  )
}
