import type { Anime } from 'types'
import { AnimeTag } from '@components/anime-tag'
import { Overlay } from '@components/overlay'
import { Picture } from '@components/picture'
import { SeasonIcon } from '@icons/season-icon'
import { StarIcon } from '@components/icons/star-icon'
import { capitalize } from '@utils/capitalize'
import { formatScore } from '@utils/format-score'

/**
 * AnimeTopItem component displays a single item in the top anime list.
 *
 * @param {Object} props - The props for the component.
 * @param {Anime} props.anime - The anime object containing details to display.
 * @param {number} props.index - The index of the anime in the list.
 */
interface AnimeTopItemProps {
  /**
   * The anime object containing details to display.
   */
  anime: Anime
  /**
   * The index of the anime in the list.
   */
  index: number
}

export const AnimeTopItem = ({ anime, index }: AnimeTopItemProps) => {
  return (
    <li
      className="group relative flex h-full w-full flex-row gap-2 transition-all duration-200 ease-in-out md:gap-6"
      title={anime.title}
      key={anime.mal_id}
    >
      <span className="text-lx flex w-12 flex-row items-center gap-2 font-bold md:w-18">
        <strong className="text-enfasisColor">#</strong>
        {index + 1}
      </span>
      <a
        href={`/${anime.title}_${anime.mal_id}`}
        className={`bg-Complementary flex w-full flex-row items-center rounded-lg`}
        aria-label={`View details for ${anime.title}`}
      >
        <Picture
          image={anime.image_small_webp}
          styles="aspect-[225/330] w-full md:max-w-32   overflow-hidden rounded-lg relative max-w-20"
        >
          <img
            src={anime.image_large_webp}
            alt={anime.title}
            className="aspect-[225/330] h-full w-full rounded-lg object-cover object-center transition-all ease-in-out group-hover:scale-105"
            loading="lazy"
          />
          <Overlay className="to-Primary-950/80 h-1/3 w-full bg-gradient-to-b md:group-hover:h-full" />
        </Picture>

        <article className="flex h-full w-full flex-row gap-4 p-4 md:p-6">
          <div className="text-s flex h-full w-full flex-col justify-between">
            <header className="flex flex-row items-center justify-between gap-4">
              <h5 className="text-l line-clamp-1">{anime.title}</h5>
              <span className="hidden md:flex">{anime.type} Series </span>
            </header>
            <div className="flex w-full flex-row items-center justify-between gap-4">
              <ul className="flex flex-row items-center gap-2">
                <span className="flex flex-row items-center justify-center gap-2">
                  <StarIcon className="w-4 h-4 text-enfasisColor" />
                  {formatScore(anime.score)}
                </span>
                <span className="flex flex-row items-center justify-center gap-2">
                  <SeasonIcon season={anime.season ?? 'spring'} className="h-4 w-4" />
                  {capitalize(anime.season ?? '')}
                </span>
              </ul>
              <span className="hidden flex-row items-center justify-center gap-2 md:flex">
                {anime.episodes} Episodes
              </span>
            </div>

            <footer className="text-s flex w-full flex-row gap-3">
              {anime.genres.slice(0, 2).map((genre) => (
                <AnimeTag key={genre} tag={genre} style="w-auto" type={genre} />
              ))}
            </footer>
          </div>
        </article>
      </a>
    </li>
  )
}
