import { createAnimeImageList } from '@shared/utils/create-image-list'

import { GaleryImage } from '@shared/components/media/galery-image'
import { Picture } from '@shared/components/media/picture'
import type { ReactNode } from 'react'

interface Props {
  title: string
  posterImage: string
  smallImage: string
  bannerImage?: string
  children?: ReactNode
}

export const Aside = ({
  title,
  posterImage,
  smallImage,
  children,
  bannerImage,
}: Props) => {
  const imageList = createAnimeImageList({
    title: `${title} Image`,
    posterImage: posterImage,
    bannerImage,
  })

  return (
    <aside className="anime-aside top-28 z-50 flex h-min w-full flex-col gap-8 px-20 md:row-span-2 md:items-start md:px-0 xl:sticky">
      <GaleryImage
        imageList={imageList}
        className="aspect-[225/330] w-full overflow-hidden rounded-lg"
      >
        <Picture
          image={posterImage}
          placeholder={smallImage}
          styles="aspect-[225/330] w-full rounded-lg object-cover object-center transition-all ease-in-out overflow-hidden"
          alt={title}
        />
      </GaleryImage>
      {children && (
        <div className="flex h-full w-full flex-row justify-end gap-2">
          {children}
        </div>
      )}
    </aside>
  )
}
