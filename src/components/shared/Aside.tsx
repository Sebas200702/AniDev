import { GaleryImage } from '@components/media/galery-image'
import { Picture } from '@components/media/picture'
import { baseUrl } from '@utils/base-url'
import { createAnimeImageList } from '@utils/create-image-list'
import { createImageUrlProxy } from '@utils/create-image-url-proxy'
import type { ReactNode } from 'react'

interface Props {
  title: string
  posterImage: string
  smallImage: string
  bannerImage ?: string
  children?: ReactNode
}

export const Aside = ({ title, posterImage, smallImage, children , bannerImage}: Props) => {
  const imageList = createAnimeImageList({
    title: `${title} Image`,
    posterImage: posterImage,
    bannerImage
  })

  return (
    <aside className="anime-aside top-28 z-50 flex h-min w-full flex-col gap-8 px-20 md:row-span-2 md:items-start md:px-0 xl:sticky">
      <GaleryImage imageList={imageList} className="aspect-[225/330] w-full rounded-lg overflow-hidden">
        <Picture
          image={createImageUrlProxy(
            smallImage ?? `${baseUrl}/placeholder.webp`,
            '0',
            '0',
            'webp'
          )}
          styles="aspect-[225/330] w-full rounded-lg object-cover object-center transition-all ease-in-out"
        >
          <img
            className="relative aspect-[225/330] w-full  object-cover object-center transition-all ease-in-out"
            src={createImageUrlProxy(
              posterImage ?? `${baseUrl}/placeholder.webp`,
              '500',
              '75',
              'webp'
            )}
            alt={title}
            loading="lazy"
            title={`Representative image of ${title}`}
          />
        </Picture>
      </GaleryImage>
      {children && (
        <div className="flex h-full w-full flex-row justify-end gap-2">
          {children}
        </div>
      )}
    </aside>
  )
}
