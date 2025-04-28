import { AnimeTag } from '@components/anime-tag'
import { EpisodeIcon } from '@components/icons/episode-icon'
import { StarIcon } from '@components/icons/star-icon'
import { Overlay } from '@components/overlay'
import { Picture } from '@components/picture'
import { SeasonIcon } from '@icons/season-icon'
import { capitalize } from '@utils/capitalize'
import { formatScore } from '@utils/format-score'
import { normalizeString } from '@utils/normalize-string'
import type { AnimeTopInfo } from 'types'

/**
 * AnimeTopItem component displays a single item in the top anime list.
 *
 * @description This component renders an individual anime entry in the top anime ranking list.
 * It displays the anime's rank number, poster image, title, type, score, season, episode count,
 * and genres. The component implements a responsive layout that adapts to different screen sizes
 * with appropriate styling and information visibility.
 *
 * The component features an interactive poster image with hover effects and gradient overlays
 * to enhance visual appeal. It organizes anime metadata in a structured format with clear visual
 * hierarchy, using icons to represent score and season information. The component also includes
 * navigation links to the detailed anime page.
 *
 * Accessibility features include appropriate aria labels and semantic HTML structure to ensure
 * the content is navigable for all users. The component optimizes image loading with the Picture
 * component for progressive enhancement.
 *
 * @param {AnimeTopItemProps} props - The component props
 * @param {Anime} props.anime - The anime object containing details to display including title, image, score, and genres
 * @param {number} props.index - The index of the anime in the list, used to display the rank number
 * @returns {JSX.Element} The rendered anime list item with rank, image, and metadata
 *
 * @example
 * <AnimeTopItem anime={animeData} index={0} />
 */
interface AnimeTopItemProps {
  /**
   * The anime object containing details to display.
   */
  anime: AnimeTopInfo
  /**
   * The index of the anime in the list.
   */
  index: number
}

export const AnimeTopItem = ({ anime, index }: AnimeTopItemProps) => {
  return (
    <li
      className="relative flex h-full w-full flex-row gap-2 transition-all duration-200 ease-in-out md:gap-6"
      title={anime.title}
      key={anime.mal_id}
    >
      <span className="text-lx flex w-12 flex-row items-center gap-2 font-bold md:w-18">
        <strong className="text-enfasisColor">#</strong>
        {index + 1}
      </span>
      <div className="bg-Complementary flex w-full flex-row items-center rounded-lg">
        <a
          href={`/anime/${normalizeString(anime.title)}_${anime.mal_id}`}
          className={`group relative aspect-[225/330] w-full max-w-20 overflow-hidden rounded-lg md:max-w-32`}
          aria-label={`View details for ${anime.title}`}
          title={anime.title}
        >
          <Picture
            image={anime.image_small_webp}
            styles="aspect-[225/330] w-full md:max-w-32   overflow-hidden rounded-lg relative max-w-20"
          >
            <img
              src={anime.image_webp}
              alt={anime.title}
              className="relative aspect-[225/330] h-full w-full rounded-lg object-cover object-center transition-all ease-in-out group-hover:scale-105"
              loading="lazy"
            />
            <Overlay className="to-Primary-950/80 h-1/3 w-full bg-gradient-to-b md:group-hover:h-full" />
          </Picture>
        </a>
        <article className="flex h-full w-full flex-row gap-4 p-4 md:p-6">
          <div className="text-s flex h-full w-full flex-col justify-between">
            <header className="flex flex-row items-center justify-between gap-4">
              <a
                href={`/anime/${normalizeString(anime.title)}_${anime.mal_id}`}
                className="text-l line-clamp-1"
              >
                {anime.title}
              </a>
            </header>
            <div className="flex w-full flex-row items-center justify-between gap-4">
              <ul className="flex flex-row items-center gap-2">
                <span
                  className="flex flex-row items-center justify-center gap-2"
                  title={`Score: ${anime.score ?? 'N/A'}`}
                >
                  <StarIcon className="text-enfasisColor h-4 w-4" />
                  {formatScore(anime.score)}
                </span>
                <span
                  className="flex flex-row items-center justify-center gap-2"
                  title={`Type: ${anime.type ?? 'N/A'}`}
                >
                  <SeasonIcon
                    season={anime.season ?? 'spring'}
                    className="h-4 w-4"
                  />
                  {capitalize(anime.season ?? '')}
                </span>
                <span
                  className="flex flex-row items-center justify-center gap-2"
                  title={`Episodes: ${anime.episodes ?? 'N/A'}`}
                >
                  <EpisodeIcon className="text-enfasisColor h-4 w-4" />
                  {anime.episodes ?? 'N/A'}
                </span>
              </ul>
            </div>

            <footer className="text-s flex w-full flex-row gap-3">
              {anime.genres.slice(0, 2).map((genre) => (
                <AnimeTag key={genre} tag={genre} style="w-auto" type={genre} />
              ))}
            </footer>
          </div>
        </article>
      </div>
    </li>
  )
}
