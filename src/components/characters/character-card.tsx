import { AnimeTag } from '@components/anime-tag'
import { Overlay } from '@components/overlay'
import { Picture } from '@components/picture'
import { useWindowWidth } from '@store/window-width'
import { baseUrl } from '@utils/base-url'
import { createImageUrlProxy } from '@utils/create-imageurl-proxy'
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
    role,
    voice_actor_name,
    voice_actor_language,
    voice_actor_image_url,
  } = character

  const slug = normalizeString(character_name)
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
        return 'text-yellow-400'
      case 'supporting':
        return 'text-blue-400'
      case 'background':
        return 'text-gray-400'
      default:
        return 'text-green-400'
    }
  }

  return (
    <li
      className="group character-card relative transition-all  rounded-lg duration-200 ease-in-out md:hover:scale-[1.01]"
      title={character_name}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <a
        href={`/character/${slug}_${character_id}`}
        className={`  flex flex-col  items-center rounded-lg   aspect-[225/330]  relative group md:hover:z-10`}
        aria-label={`View details for ${character_name}`}
      >
        <Picture
          image={createImageUrlProxy(
            character_small_image_url ?? `${baseUrl}/placeholder.webp`
          )}
          styles=" absolute bottom-0 [clip-path:polygon(0%_100%,33%_100%,100%_33%,100%_100%)]left-0 w-full h-full object-cover   rounded-lg"
        >
          <img
            src={createImageUrlProxy(
              character_image_url ?? `${baseUrl}/placeholder.webp`,
              '0',
              '75',
              'webp'
            )}
            alt={`${character_name} character`}
            className="relative w-full h-full rounded-lg object-cover object-center transition-all ease-in-out"
            loading="lazy"
          />
          <Overlay className="to-Primary-950/80 h-1/3 w-full bg-gradient-to-b md:group-hover:h-full" />
        </Picture>

        <Picture
          image={createImageUrlProxy(
            character_small_image_url ?? `${baseUrl}/placeholder.webp`
          )}
          styles=" absolute bottom-0 [clip-path:polygon(0%_100%,0%_66%,100%_33%,100%_100%)] left-0 w-full h-full object-cover   rounded-lg"
        >
          <img
            src={createImageUrlProxy(
              character_image_url ?? `${baseUrl}/placeholder.webp`,
              '0',
              '75',
              'webp'
            )}
            alt={`${character_name} character`}
            className="relative w-full h-full rounded-lg object-cover object-center transition-all ease-in-out"
            loading="lazy"
          />
          <Overlay className="to-Primary-950/80 h-1/3 w-full bg-gradient-to-b md:group-hover:h-full" />
        </Picture>

        <footer className="absolute bottom-0 left-0 z-10 flex w-full flex-col gap-1 px-4 py-2">
          <div className="flex flex-row items-center gap-2">
            <div
              className={`h-2 w-2 rounded-full ${getRoleColor(role ?? '')} flex-shrink-0`}
            />
            <h3 className="text-s truncate font-semibold text-white transition-opacity duration-200 ease-in-out md:text-sm">
              {character_name}
            </h3>
          </div>

          {voice_actor_name && (
            <p className="text-xs text-gray-300 truncate">
              CV: {voice_actor_name}
            </p>
          )}
        </footer>
      </a>

      <div className="absolute top-2 -right-3">
        <AnimeTag tag={role ?? ''} type={role?.toLowerCase()} />
      </div>

      {voice_actor_language && (
        <div className="absolute top-2 left-2">
          <span className="bg-Primary-900/80 text-xs text-white px-2 py-1 rounded-md backdrop-blur-sm">
            {voice_actor_language}
          </span>
        </div>
      )}
    </li>
  )
}
