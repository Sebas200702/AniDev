import { Picture } from '@components/picture'
import { baseUrl } from '@utils/base-url'
import type { CharacterDetails } from 'types'

interface Props {
  character: CharacterDetails
}

export const CharacterAside = ({ character }: Props) => {
  return (
    <aside className="character-aside top-28 z-20 row-start-2 flex h-min w-full flex-col gap-8 md:row-span-2 md:items-start xl:sticky">
      <Picture
        image={
          character.character_small_image_url ?? `${baseUrl}/placeholder.webp`
        }
        styles="aspect-[225/330] w-full rounded-lg object-cover object-center transition-all ease-in-out relative "
      >
        <img
          className="relative aspect-[225/330] w-full rounded-lg object-cover object-center transition-all ease-in-out"
          src={character.character_image_url ?? `${baseUrl}/placeholder.webp`}
          alt={` Representation of ${character.character_name} `}
          loading="lazy"
        />
      </Picture>
    </aside>
  )
}
