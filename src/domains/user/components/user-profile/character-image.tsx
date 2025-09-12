import { Picture } from '@shared/components/media/picture'
import { useUpdateProfile } from '@user/stores/update-profile'
import { Overlay } from 'domains/shared/components/layout/overlay'

import type { CharacterImages } from 'types'
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
      className={`relative h-full w-full aspect-square rounded-full border-3 ${isSelected ? ' border-enfasisColor' : 'border-enfasisColor/0'} transition-colors duration-300 ease-in-out  overflow-hidden aspect-square cursor-pointer group`}
      onClick={handleClick}
    >
      <Picture
        styles="relative object-cover object-center w-full h-full aspect-square "
        placeholder={character.character_small_image_url}
        image={character.character_image_url}
        alt={character.character_name}
      />

      <Overlay className="group-hover:opacity-100 opacity-0 h-full w-full bg-enfasisColor/40 transition-opacity duration-200" />
    </button>
  )
}
