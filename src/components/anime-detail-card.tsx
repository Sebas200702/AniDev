import { AddToListButton } from '@components/add-to-list-button'
import { ShareButton } from '@components/buttons/share-button'
import { CalendarIcon } from '@components/icons/calendar-icon'
import { EpisodeIcon } from '@components/icons/episode-icon'
import { PlayIcon } from '@components/icons/play-icon'
import { TypeIcon } from '@components/icons/type-icon'
import { Overlay } from '@components/overlay'
import { Picture } from '@components/picture'
import { useSearchStoreResults } from '@store/search-results-store'
import { baseUrl } from '@utils/base-url'
import { createImageUrlProxy } from '@utils/create-imageurl-proxy'
import { normalizeString } from '@utils/normalize-string'
import type { AnimeDetail } from 'types'

/**
 * AnimeDetailCard component displays a detailed view of an anime with a banner background and additional information.
 *
 * @description This component renders a detailed anime item with a horizontal layout featuring a banner background.
 * It displays the anime's banner image, poster, title, type, episodes, and year in a structured layout.
 * The component features a responsive design with hover effects and provides interactive elements
 * including watch, add to list, and share buttons.
 *
 * The banner image is displayed as a background with a gradient overlay for better text readability.
 * The poster image is shown on the left side, while the right section contains the anime's metadata
 * organized in a vertical layout. The component includes action buttons that appear on hover
 * for enhanced user interaction.
 *
 * @param {Object} props - The component props
 * @param {Anime} props.anime - The anime object containing details to display
 * @returns {JSX.Element} The rendered detailed anime card with banner and interactive elements
 *
 * @example
 * <AnimeDetailCard anime={animeData} />
 */

export const AnimeDetailCard = ({ anime }: { anime: AnimeDetail }) => {
  const { setSearchIsOpen } = useSearchStoreResults()
  const shareText = `Watch ${anime.title} on AniDev`
  return (
    <li
      key={anime.mal_id}
      className="group relative transition-all duration-300 ease-in-out md:hover:translate-x-2"
      onClick={() => setSearchIsOpen(false)}
    >
      <a
        href={`/anime/${normalizeString(anime.title)}_${anime.mal_id}`}
        className="bg-Complementary relative mx-auto flex aspect-[100/28] h-full w-full overflow-hidden rounded-lg"
        title={anime.title}
      >
        <div className="absolute h-full w-full">
          <Picture
            image={createImageUrlProxy(
              anime.banner_image ??
                anime.image_large_webp ??
                `${baseUrl}/placeholder.webp`,
              '0',
              '0',
              'webp'
            )}
            styles="w-full h-full object-cover object-center relative grayscale-100 md:group-hover:grayscale-40 transition-all ease-in-out duration-300"
          >
            <img
              src={createImageUrlProxy(
                anime.banner_image ??
                  anime.image_large_webp ??
                  `${baseUrl}/placeholder.webp`,
                '500',
                '60',
                'webp'
              )}
              alt={normalizeString(anime.title)}
              className="relative h-full w-full object-cover object-center"
              loading="lazy"
            />
            <Overlay className="to-Primary-950 via-Primary-950/40 h-full w-full bg-gradient-to-l via-0% to-70%" />
          </Picture>
        </div>
        <Picture
          image={anime.image_small_webp ?? `${baseUrl}/placeholder.webp`}
          styles="aspect-[225/330] h-full overflow-hidden rounded-l-lg relative"
        >
          <img
            src={anime.image_webp ?? `${baseUrl}/placeholder.webp`}
            alt={anime.title}
            className="relative aspect-[225/330] h-full w-full rounded-l-lg object-cover object-center"
            loading="lazy"
          />
        </Picture>
        <div className="z-20 flex h-full w-[80%] flex-col justify-between px-2 py-4 md:p-4 xl:p-6">
          <h3 className="text-l line-clamp-1">{anime.title}</h3>

          <footer className="text-sx flex w-20 gap-3">
            <span className="flex flex-row items-center justify-center gap-2">
              <TypeIcon className="h-4 w-4" type={anime.type ?? ''} />
              {anime.type === 'TV Special' ? 'Special' : anime.type}
            </span>
            <span className="flex flex-row items-center justify-center gap-2">
              <EpisodeIcon className="text-enfasisColor h-4 w-4" />
              {anime.episodes ?? '-'}
            </span>
            <span className="flex flex-row items-center justify-center gap-2">
              <CalendarIcon className="text-enfasisColor h-4 w-4" />
              {anime.year}
            </span>
          </footer>
        </div>
      </a>
      <div className="bg-Primary-950/60 border-Primary-50/30 absolute right-4 bottom-4 z-20 flex flex-row gap-1 rounded-md border-1 px-3 py-1.5 backdrop-blur-md transition-opacity duration-300 ease-in-out md:opacity-0 md:group-hover:opacity-100 xl:right-6 xl:bottom-6 xl:gap-2">
        <a
          href={`/watch/${normalizeString(anime.title)}_${anime.mal_id}`}
          title={`Watch ${anime.title}`}
        >
          <PlayIcon className="md:hover:text-enfasisColor h-4 w-4 transition-all duration-300 ease-in-out xl:h-5 xl:w-5" />
        </a>
        <AddToListButton
          animeId={anime.mal_id}
          styles="md:hover:text-enfasisColor h-4 w-4 disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none cursor-pointer transition-all duration-300 ease-in-out xl:h-5 xl:w-5"
        />

        <ShareButton
          className="md:hover:text-enfasisColor cursor-pointer transition-all duration-300 ease-in-out"
          url={`/anime/${normalizeString(anime.title)}_${anime.mal_id}`}
          title={anime.title}
          text={shareText}
        />
      </div>
    </li>
  )
}
