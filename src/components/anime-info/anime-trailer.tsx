import { useEffect, useState } from 'react'

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
  const [isLiteYouTubeLoaded, setIsLiteYouTubeLoaded] = useState(false)
  const videoId = trailer_url?.split('v=')[1]?.split('&')[0]

  useEffect(() => {
    if (typeof window !== 'undefined' && trailer_url) {
      import('@justinribeiro/lite-youtube').then((module) => {
        const LiteYouTube = (module as any).default

        if (!customElements.get('lite-youtube')) {
          customElements.define('lite-youtube', LiteYouTube)
        }
        setIsLiteYouTubeLoaded(true)
      })
    }
  }, [trailer_url])

  return (
    <>
      {trailer_url ? (
        <div className="relative flex h-min w-full flex-col">
          {isLiteYouTubeLoaded && videoId ? (
            <lite-youtube
              videoid={videoId}
              style={{ aspectRatio: '16/9' }}
              class="w-full rounded-lg "
            />
          ) : (
            <div className="aspect-video w-full animate-pulse rounded-sm bg-gray-700" />
          )}
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
