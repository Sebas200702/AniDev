import '@justinribeiro/lite-youtube'

import { Image } from 'astro:assets'

interface Props {
  trailer_url: string
  banner_image: string
  image_large_webp: string
  title: string
}

export const AnimeTrailer = ({
  trailer_url,
  banner_image,
  image_large_webp,
  title,
}: Props) => {
  const videoId = trailer_url?.split('v=')[1]?.split('&')[0]

  return (
    <>
      {trailer_url ? (
        <div className="relative  flex h-min w-full flex-col ">
          <lite-youtube
            videoid={videoId}
            params="modestbranding=1&rel=0"
            style={{ borderRadius: '8px' }}
          />
        </div>
      ) : (
        <div className="flex w-full flex-col rounded-md md:max-w-5xl">
          <picture className="aspect-video h-full w-full rounded-sm">
            <Image
              src={banner_image ?? image_large_webp}
              alt={title}
              class="aspect-video h-full w-full rounded-sm transition-all ease-in-out"
              loading="lazy"
              width={225}
              height={330}
              quality={10}
            />
          </picture>
        </div>
      )}
    </>
  )
}
