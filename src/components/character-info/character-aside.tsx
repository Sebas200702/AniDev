import { GaleryImage } from '@components/media/galery-image'
import { Picture } from '@components/media/picture'
import { baseUrl } from '@utils/base-url'
import { createAnimeImageList } from '@utils/create-image-list'
import { createImageUrlProxy } from '@utils/create-image-url-proxy'
import type { CharacterDetails } from 'types'

interface Props {
  character: CharacterDetails
}

export const CharacterAside = ({ character }: Props) => {
  const imageList = createAnimeImageList({
    title: `${character.character_name} Image `,
    posterImage: character.character_image_url,
  })
  return (
    <aside className="top-28 z-20 md:px-0 px-20   flex  flex-col row-span-1  md:row-span-2 md:items-start xl:sticky">
      <GaleryImage imageList={imageList} className="aspect-[225/330] rounded-lg overflow-hidden w-full">
        <Picture
          image={createImageUrlProxy(
            character.character_small_image_url ??
              `${baseUrl}/placeholder.webp`,
            '0',
            '0',
            'webp'
          )}
          styles="aspect-[225/330] w-full  object-cover object-center transition-all ease-in-out "
        >
          <img
            className="relative aspect-[225/330] w-full rounded-lg object-cover object-center transition-all ease-in-out"
            src={createImageUrlProxy(
              character.character_image_url ?? `${baseUrl}/placeholder.webp`,
              '0',
              '70',
              'webp'
            )}
            alt={` Representation of ${character.character_name} `}
            loading="lazy"
          />
        </Picture>
      </GaleryImage>
    </aside>
  )
}
