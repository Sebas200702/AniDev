import { CalendarIcon } from '@components/icons/calendar-icon'
import { EpisodeIcon } from '@components/icons/episode-icon'

import { ShareButton } from '@components/buttons/share-button'
import { AddToListIcon } from '@components/icons/add-to-list-icon'
import { PlayIcon } from '@components/icons/play-icon'
import { TypeIcon } from '@components/icons/type-icon'
import { Overlay } from '@components/overlay'
import { Picture } from '@components/picture'
import { createImageUrlProxy } from '@utils/craete-imageurl-proxy'
import { normalizeString } from '@utils/normalize-string'
import type { Anime } from 'types'

/**
 * CollectionItem component displays a collection item in a list, including its image, title, genres, synopsis, and score.
 *
 * @description This component renders an individual anime item within a collection list.
 * It displays the anime's poster image, title, genres, synopsis, and score in a structured layout.
 * The component features a responsive design with hover effects on the image and provides
 * interactive elements for user engagement including watch, add to list, and share buttons.
 *
 * The anime poster image is displayed on the left side with a hover scale effect for visual feedback.
 * The right section contains the anime's metadata organized in a vertical layout with appropriate
 * spacing and text truncation for longer content. The component handles missing data gracefully
 * by displaying fallback text for synopsis when unavailable.
 *
 * The footer section contains action buttons that allow users to watch the anime, add it to their list,
 * or share it with others, enhancing the overall user experience and engagement with the content.
 *
 * @param {Object} props - The component props
 * @param {Anime} props.anime - The anime object containing details to display including title, image, genres, synopsis, and score
 * @returns {JSX.Element} The rendered collection item with anime details and interactive elements
 *
 * @example
 * <CollectionItem anime={animeData} />
 */
export const CollectionItem = ({ anime }: { anime: Anime }) => {
  const shareText = `Watch ${anime.title} on AniDev`
  return (
    <li
      key={anime.mal_id}
      className="group relative transition-all duration-300 ease-in-out md:hover:translate-x-2"
    >
      <a
        href={`/anime/${normalizeString(anime.title)}_${anime.mal_id}`}
        className="bg-Complementary relative mx-auto flex aspect-[100/28] overflow-hidden rounded-lg"
        title={anime.title}
      >
        <div className="absolute h-full w-full">
          <Picture
            image={createImageUrlProxy(
              anime.banner_image ?? anime.image_large_webp,
              '0',
              '0',
              'webp'
            )}
            styles=" w-full h-full object-cover object-center relative grayscale-100 md:group-hover:grayscale-40 transition-all ease-in-out duration-300"
          >
            <img
              src={createImageUrlProxy(
                anime.banner_image ?? anime.image_large_webp,
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
          image={anime.image_small_webp}
          styles="aspect-[225/330] h-full  overflow-hidden rounded-l-lg relative"
        >
          <img
            src={anime.image_webp}
            alt={anime.title}
            className="relative aspect-[225/330] h-full w-full rounded-l-lg object-cover object-center"
            loading="lazy"
          />
        </Picture>
        <div className="z-20 flex h-full w-[80%] flex-col justify-between p-4 xl:p-6">
          <h3 className="text-l line-clamp-1">{anime.title}</h3>

          <footer className="text-sx flex w-20 gap-3">
            <span className="flex flex-row items-center justify-center gap-2">
              <TypeIcon className="h-4 w-4" type={anime.type} />
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
      <div className="absolute right-4 bottom-4 z-20 flex flex-row gap-1 transition-opacity duration-300 ease-in-out md:opacity-0 md:group-hover:opacity-100 xl:right-6 xl:bottom-6 xl:gap-2">
        <a href={`/watch/${normalizeString(anime.title)}_${anime.mal_id}`}>
          <PlayIcon className="md:hover:text-enfasisColor h-4 w-4 transition-all duration-300 ease-in-out xl:h-5 xl:w-5" />
        </a>
        <span>
          <AddToListIcon className="md:hover:text-enfasisColor h-4 w-4 cursor-pointer transition-all duration-300 ease-in-out xl:h-5 xl:w-5" />
        </span>
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
