import { Overlay } from '@components/layout/overlay'
import { Picture } from '@components/media/picture'
import { useUpdateProfile } from '@store/update-profile'
import { createImageUrlProxy } from '@utils/create-image-url-proxy'
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
      className={`w-full h-full rounded-full border-3 ${isSelected ? ' border-enfasisColor' : 'border-enfasisColor/0'} transition-colors duration-300 ease-in-out  overflow-hidden aspect-square cursor-pointer group`}
      onClick={handleClick}
    >
      <Picture
        styles="relative w-full h-full  "
        image={createImageUrlProxy(
          character.character_small_image_url,
          '0',
          '0',
          'webp'
        )}
      >
        <img
          src={createImageUrlProxy(
            character.character_image_url,
            '240',
            '75',
            'webp'
          )}
          alt={character.character_name}
          className="relative object-cover object-center w-full h-full "
        />
        <Overlay className="group-hover:opacity-100 opacity-0 h-full w-full bg-enfasisColor/40 transition-opacity duration-200" />
      </Picture>
    </button>
  )
}
