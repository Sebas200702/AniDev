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
      className="relative group md:hover:translate-x-2 transition-all duration-300 ease-in-out"
    >
      <a
        href={`/anime/${normalizeString(anime.title)}_${anime.mal_id}`}
        className="bg-Complementary mx-auto flex aspect-[100/28]  overflow-hidden rounded-lg  relative "
        title={anime.title}
      >
        <div className="absolute w-full h-full">
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
              className=" w-full h-full object-cover object-center relative"
              loading="lazy"
            />
            <Overlay className="to-Primary-950 to-70% h-full w-full bg-gradient-to-l  via-0% via-Primary-950/40" />
          </Picture>
        </div>
        <Picture
          image={anime.image_small_webp}
          styles="aspect-[225/330] h-full  overflow-hidden rounded-l-lg relative"
        >
          <img
            src={anime.image_webp}
            alt={anime.title}
            className="relative aspect-[225/330] h-full w-full rounded-l-lg object-cover object-center "
            loading="lazy"
          />
        </Picture>
        <div className="xl:p-6 p-4 w-[80%] flex flex-col h-full justify-between z-20">
          <h3 className="line-clamp-1 text-l">{anime.title}</h3>

          <footer className="flex text-sx w-20  gap-3">
            <span className="flex flex-row gap-2 items-center justify-center">
              <TypeIcon className="h-4 w-4" type={anime.type} />
              {anime.type}
            </span>
            <span className="flex flex-row gap-2 items-center justify-center">
              <EpisodeIcon className="w-4 h-4 text-enfasisColor" />
              {anime.episodes ?? '-'}
            </span>
            <span className="flex flex-row gap-2 items-center justify-center">
              <CalendarIcon className="w-4 h-4 text-enfasisColor" />
              {anime.year}
            </span>
          </footer>
        </div>
      </a>
      <div className="flex flex-row  xl:gap-2 gap-1 absolute xl:bottom-6 bottom-4 right-4 xl:right-6 z-10 md:opacity-0 md:group-hover:opacity-100  ease-in-out transition-opacity duration-300">
        <a href={`/watch/${normalizeString(anime.title)}_${anime.mal_id}`}>
          <PlayIcon className="xl:w-5 w-4 h-4 xl:h-5 md:hover:text-enfasisColor transition-all ease-in-out duration-300" />
        </a>
        <span>
          <AddToListIcon className="xl:w-5 w-4 h-4 xl:h-5 md:hover:text-enfasisColor transition-all ease-in-out duration-300 cursor-pointer" />
        </span>
        <ShareButton
          className="cursor-pointer md:hover:text-enfasisColor transition-all ease-in-out duration-300"
          url={`/anime/${normalizeString(anime.title)}_${anime.mal_id}`}
          title={anime.title}
          text={shareText}
        />
      </div>
    </li>
  )
}
