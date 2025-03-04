import { Overlay } from '@components/overlay'
import { Picture } from '@components/picture'
import { createImageUrlProxy } from '@utils/craete-imageurl-proxy'

interface Props {
  banner_image: string
  image_large_webp: string
  title: string
}
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
