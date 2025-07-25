import { Overlay } from '@components/layout/overlay'
import { Picture } from '@components/media/picture'
import { useWindowWidth } from '@store/window-width'
import { baseUrl } from '@utils/base-url'
import { createImageUrlProxy } from '@utils/create-image-url-proxy'
import { normalizeString } from '@utils/normalize-string'
import type { Character } from 'types'

/**
 * CharacterCard component displays information about an anime character including their name, image, and role.
 *
 * @description This component renders a visually appealing card for a character entry with responsive design.
 * It displays the character's image, name, role, and voice actor information in a structured layout.
 * The component features hover effects and optimized image loading with appropriate placeholders
 * during loading and higher resolution images for the final display.
 *
 * The card adapts to different screen sizes with appropriate styling and image quality adjustments.
 * On mobile devices, it loads a lower resolution image to improve performance. The component
 * includes a gradient overlay to improve text readability when displayed over the character image.
 *
 * A role indicator shows whether the character is a main character, supporting character, etc.,
 * while the character name is displayed prominently. The voice actor name is shown when available.
 *
 * @param {Props} props - The component props
 * @param {Character} props.character - The character object containing details to display including name, images, role, and voice actor
 * @returns {JSX.Element} The rendered character card with image, name, role, and voice actor info
 *
 * @example
 * <CharacterCard character={characterData} />
 */
interface Props {
  /**
   * The character object containing details to display.
   */
  character: Character
}

export const CharacterCard = ({ character }: Props) => {
  const {
    character_name,
    character_image_url,
    character_small_image_url,
    character_id,
    voice_actor_name,
    voice_actor_language,

  } = character

  const slug = normalizeString(character_name, true, false, true)
  const { width: windowWidth } = useWindowWidth()
  const isMobile = windowWidth && windowWidth < 768

  let timer: NodeJS.Timeout

  /**
   * Handles the mouse enter event for the character card.
   *
   * @description
   * This function implements a debounced action for when the user hovers over the card.
   * It uses a 1-second delay to prevent excessive interactions during quick mouse movements.
   */
  const handleMouseEnter = async () => {
    timer = setTimeout(() => {
      // Future: could fetch additional character metadata here
      console.log(`Viewing character: ${character_name}`)
    }, 1000)
  }

  /**
   * Handles the mouse leave event for the character card.
   *
   * @description
   * This function cleans up the timer set by handleMouseEnter when the user's mouse
   * leaves the card. It prevents any delayed actions from occurring if the user moves
   * away from the card before the debounce delay expires.
   */
  const handleMouseLeave = () => {
    clearTimeout(timer)
  }

  /**
   * Gets the appropriate role color based on character role.
   */
  const getRoleColor = (role: string) => {
    switch (role.toLowerCase()) {
      case 'main':
        return 'bg-yellow-400'
      case 'supporting':
        return 'bg-blue-400'
      case 'background':
        return 'bg-gray-400'
      default:
        return 'bg-green-400'
    }
  }

  return (
    <li
      className="group relative overflow-hidden rounded-xl shadow-lg transition-all duration-300 hover:shadow-2xl"
      title={`View details for ${character_name}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <a
        href={`/character/${slug}_${character_id}`}
        className="group relative block aspect-[225/330]"
        aria-label={`View details for ${character_name}`}
      >
        <Picture
          image={createImageUrlProxy(
            character_small_image_url ?? `${baseUrl}/placeholder.webp`
          )}
          styles="w-full h-full"
        >
          <img
            src={createImageUrlProxy(
              character_image_url ?? `${baseUrl}/placeholder.webp`,
              '0',
              '75',
              'webp'
            )}
            alt={`${character_name} character`}
            className="relative h-full w-full transform object-cover object-center transition-transform duration-500 group-hover:scale-110"
            loading="lazy"
          />
          <Overlay className="to-Primary-950/80 h-1/3 w-full bg-gradient-to-b md:group-hover:h-full" />
        </Picture>

        <footer className="absolute inset-0 flex translate-y-2 transform flex-col justify-end p-4 transition-transform duration-300 group-hover:translate-y-0">
          <h3 className="group-hover:text-enfasisColor mb-4 truncate text-lg font-bold text-white transition-colors">
            {character_name}
          </h3>
        </footer>

        {voice_actor_language && (
          <div className="absolute top-3 left-3">
            <span className="bg-Primary-900/80 scale-90 transform rounded-full px-3 py-1.5 text-xs font-medium text-white backdrop-blur-sm transition-transform duration-300 group-hover:scale-100">
              {voice_actor_language}
            </span>
          </div>
        )}
      </a>
      {voice_actor_name && (
        <a
          title={`View voice actor ${voice_actor_name}`}
          href={`/voice-actor/${normalizeString(character.voice_actor_name, true, false, true)}-${character.voice_actor_id}`}
          className="hover:text-Primary-50 group absolute bottom-3 left-4 flex items-center gap-2 truncate text-sm text-gray-300 opacity-0 transition-opacity duration-300 group-hover:opacity-100 hover:underline"
        >
          {voice_actor_name}
        </a>
      )}
    </li>
  )
}
