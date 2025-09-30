import { Picture } from '@shared/components/media/picture'
import { useUpdateProfile } from '@user/stores/update-profile'
import { Overlay } from 'domains/shared/components/layout/overlay'

import type { CharacterImages } from '@character/types'
interface Props {
  character: CharacterImages
}
export const CharacterImage = ({ character }: Props) => {
  const { setAvatar, avatar } = useUpdateProfile()
  const isSelected = character.character_image_url === avatar
  const handleClick = () => {
    setAvatar(character.character_image_url)
  }
  return (
    <button
      key={character.character_id}
      className={`relative aspect-square h-full w-full rounded-full border-3 ${isSelected ? 'border-enfasisColor' : 'border-enfasisColor/0'} group aspect-square cursor-pointer overflow-hidden transition-colors duration-300 ease-in-out`}
      onClick={handleClick}
    >
      <Picture
        styles="relative object-cover object-center w-full h-full aspect-square "
        placeholder={character.character_small_image_url}
        image={character.character_image_url}
        alt={character.character_name}
      />

      <Overlay className="bg-enfasisColor/40 h-full w-full opacity-0 transition-opacity duration-200 group-hover:opacity-100" />
    </button>
  )
}
