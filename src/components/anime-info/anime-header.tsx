
import { AnimeTag } from '@components/anime-tag'
import { getAnimeType } from '@utils/getanime-type'
import { normalizeRating } from '@utils/normalize-rating'
import type { Anime } from 'types'

/**
 * AnimeHeader component displays the title and header information of an anime.
 *
 * @description This component renders the title, genres, type, and rating of an anime in a structured header format.
 * It organizes anime metadata into a visually appealing layout with proper spacing and alignment. The component
 * displays the anime title prominently at the top, followed by a list of tags representing the anime's genres,
 * type, and age rating.
 *
 * The component creates an accessible and responsive header that adapts to different screen sizes. On mobile
 * devices, elements are centered for better viewing, while on larger screens, they align to the left and
 * expand appropriately. The genre tags are interactive elements that link to related anime searches.
 *
 * The header also includes a navigation bar component that provides additional user interface options for
 * interacting with the anime content. All elements maintain consistent styling and spacing to create a
 * cohesive visual hierarchy.
 *
 * @param {Props} props - The component props
 * @param {Anime} props.animeData - The anime object containing details to display including title, type, genres, and rating
 * @returns {JSX.Element} The rendered header containing the anime title, tags, and navigation
 *
 * @example
 * <AnimeHeader animeData={animeData} />
 */
interface Props {
  /**
   * The anime object containing details to display.
   */
  animeData: Anime
}

export const AnimeHeader = ({ animeData }: Props) => {
  return (
    <header className="anime-header flex w-auto flex-col justify-center md:gap-8 gap-6 md:col-span-2 xl:col-span-4 xl:mt-0">
      <h2 className="title max-w-[30ch] text-center text-pretty md:text-left mx-auto md:mx-0 md:text-wrap">
        {animeData.title}
      </h2>
      <ul
        className="flex flex-row flex-wrap items-center justify-center gap-3 md:justify-start"
        aria-label="Categorías y géneros"
      >
        <AnimeTag tag={getAnimeType(animeData.type)} type={animeData.type} />
        {animeData.genres.map((genre) => (
          <AnimeTag key={genre} tag={genre} type={genre} style="w-auto" />
        ))}
        {animeData.rating && (
          <AnimeTag
            tag={normalizeRating(animeData.rating)}
            type={animeData.rating}
          />
        )}
      </ul>


    </header>
  )
}
