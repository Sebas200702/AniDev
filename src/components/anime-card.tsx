import { AddToListButton } from '@components/add-to-list-button'
import { AnimeTag } from '@components/anime-tag'
import { Overlay } from '@components/overlay'
import { Picture } from '@components/picture'
import { StatusPoint } from '@components/status-point'
import { useGlobalUserPreferences } from '@store/global-user'
import { useWindowWidth } from '@store/window-width'
import { baseUrl } from '@utils/base-url'
import { genreToColor } from '@utils/genre-to-color'
import { normalizeString } from '@utils/normalize-string'
import { statusColors } from '@utils/status-colors'
import { createImageUrlProxy } from '@utils/create-imageurl-proxy'
import type { AnimeCardInfo } from 'types'

/**
 * AnimeCard component displays information about an anime including its title, image, and status.
 *
 * @description This component renders a visually appealing card for an anime entry with responsive design.
 * It displays the anime's poster image, title, release year, and status in a structured layout.
 * The component features hover effects and optimized image loading with low-resolution placeholders
 * during loading and higher resolution images for the final display.
 *
 * The card adapts to different screen sizes with appropriate styling and image quality adjustments.
 * On mobile devices, it loads a lower resolution image to improve performance. The component
 * includes a gradient overlay to improve text readability when displayed over the anime image.
 *
 * A status indicator shows the current airing status of the anime using color-coded visual cues,
 * while the title is displayed with genre-specific coloring for enhanced visual categorization.
 * The year tag is positioned in the top-right corner for quick reference.
 *
 * @param {Props} props - The component props
 * @param {Anime} props.anime - The anime object containing details to display including title, images, status, and genres
 * @param {string} [props.context] - Optional context identifier that affects the card's display style
 * @returns {JSX.Element} The rendered anime card with image, title, status, and year tag
 *
 * @example
 * <AnimeCard anime={animeData} context="search" />
 */
interface Props {
  /**
   * The anime object containing details to display.
   */
  anime: AnimeCardInfo
  /**
   * Optional context for the component.
   */
}

export const AnimeCard = ({ anime }: Props) => {
  const {
    title,
    image_large_webp,
    mal_id,
    year,
    image_small_webp,
    image_webp,
    status,
    genres,
  } = anime

  const slug = normalizeString(title)
  const { width: windowWidth } = useWindowWidth()
  const { userInfo } = useGlobalUserPreferences()
  const isMobile = windowWidth && windowWidth < 768

  let timer: NodeJS.Timeout

  /**
   * Handles the mouse enter event for the anime card.
   *
   * @description
   * This function implements a debounced fetch request to load additional metadata
   * for the anime when the user hovers over the card. It uses a 1-second delay to
   * prevent excessive API calls during quick mouse movements.
   *
   * The function makes a request to the `/api/getAnimeMetadatas` endpoint with the
   * anime's MAL ID to fetch additional information that can be used for tooltips
   * or other hover interactions.
   */
  const handleMouseEnter = async () => {
    timer = setTimeout(() => {
      fetch(`/api/getAnimeMetadatas?id=${mal_id}`)
    }, 1000)
  }

  /**
   * Handles the mouse leave event for the anime card.
   *
   * @description
   * This function cleans up the timer set by handleMouseEnter when the user's mouse
   * leaves the card. It prevents the metadata fetch from occurring if the user moves
   * away from the card before the debounce delay expires.
   */
  const handleMouseLeave = () => {
    clearTimeout(timer)
  }

  return (
    <li
      className="group anime-card relative transition-all duration-200 ease-in-out md:hover:scale-[1.01]"
      title={title}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {userInfo?.name && (
        <div className="bg-Complementary/50 border-Primary-50/10 absolute top-3 left-3 z-10 flex items-center justify-center rounded-lg border-1 p-1 backdrop-blur-sm transition-all duration-200 ease-in-out md:opacity-0 md:group-hover:opacity-100">
          <AddToListButton
            animeId={mal_id}
            anime_title={title}
            styles="md:hover:text-enfasisColor h-4 w-4 disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none cursor-pointer transition-all duration-300 ease-in-out xl:h-5 xl:w-5"
          />
        </div>
      )}
      <a
        href={`/anime/${slug}_${mal_id}`}
        className={`flex h-auto flex-col items-center rounded-lg`}
        aria-label={`View details for ${title}`}
      >
        <Picture
          image={image_small_webp ?? `${baseUrl}/placeholder.webp`}
          styles="relative h-full w-full rounded-lg"
        >
          <img
            src={
              isMobile
                ? (createImageUrlProxy(image_webp ?? `${baseUrl}/placeholder.webp`))
                : (createImageUrlProxy(image_large_webp ?? `${baseUrl}/placeholder.webp` , '400' , '75'))
            }
            alt={`Cover of ${title}`}
            className="relative aspect-[225/330] w-full rounded-lg object-cover object-center transition-all ease-in-out"
            loading="lazy"
          />
          <Overlay className="to-Primary-950/80 h-1/3 w-full bg-gradient-to-b md:group-hover:h-full" />
        </Picture>

        <footer className="absolute bottom-0 left-0 z-10 flex w-full flex-row items-center gap-4 px-4 py-2">
          <StatusPoint
            class={`h-3 w-full max-w-3 rounded-full ${statusColors(status)} relative`}
            status={status}
          />
          <h3
            className={`${genreToColor(genres?.[0] ?? '')} text-s truncate font-semibold text-white transition-opacity duration-200 ease-in-out md:text-sm`}
          >
            {title}
          </h3>
        </footer>
      </a>
      <div className="absolute top-2 -right-3">
        <AnimeTag tag={year?.toString()} type={year?.toString()} />
      </div>
    </li>
  )
}
