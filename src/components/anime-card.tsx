import type { Anime } from 'types'
import { AnimeTag } from '@components/anime-tag'
import { Overlay } from '@components/overlay'
import { Picture } from '@components/picture'
import { StatusPoint } from '@components/status-point'
import { genreToColor } from '@utils/genre-to-color'
import { normalizeString } from '@utils/normalize-string'
import { statusColors } from '@utils/status-colors'
import { useWindowWidth } from '@store/window-width'

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
  anime: Anime
  /**
   * Optional context for the component.
   */
  context?: string
}

export const AnimeCard = ({ anime, context }: Props) => {
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
  const isMobile = windowWidth && windowWidth < 768

  return (
    <article
      className="group relative transition-all duration-200 ease-in-out md:hover:scale-[1.02]"
      title={title}
    >
      <a
        href={`/anime/${slug}_${mal_id}`}
        className={`flex h-auto flex-col items-center rounded-lg ${context === 'search' ? '' : 'w-[calc((100dvw-32px)/2.4)] md:w-[calc((100dvw-280px)/4)] xl:w-[calc((100dvw-360px)/6)]'}`}
        aria-label={`View details for ${title}`}
      >
        <Picture
          image={image_small_webp}
          styles="relative h-full w-full rounded-lg"
        >
          <img
            src={isMobile ? image_webp : image_large_webp}
            alt={title}
            className="aspect-[225/330] w-full rounded-lg object-cover object-center transition-all ease-in-out"
            loading="lazy"
            width={225}
            height={330}
          />
          <Overlay className="to-Primary-950/80 h-1/3 w-full bg-gradient-to-b md:group-hover:h-full" />
        </Picture>

        <footer className="absolute bottom-1 left-0 z-10 flex w-full max-w-[90%] flex-row items-center justify-center gap-2 p-2 md:left-3">
          <StatusPoint
            class={`h-6 w-6 ${statusColors(status)}`}
            status={status}
          />
          <h5
            className={`w-full ${genreToColor(genres[0])} text-s truncate font-semibold text-white transition-opacity duration-200 ease-in-out md:text-sm`}
            aria-hidden="true"
          >
            {title}
          </h5>
        </footer>
      </a>
      <div className="absolute top-2 -right-2">
        <AnimeTag tag={year} type={year} />
      </div>
    </article>
  )
}
