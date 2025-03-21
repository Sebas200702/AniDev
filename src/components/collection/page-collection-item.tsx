import { AddToListButton } from '@components/buttons/add-to list-button'
import type { Anime } from 'types'
import { AnimeTag } from '@components/anime-tag'
import { Picture } from '@components/picture'
import { ShareButton } from '@components/buttons/share-button'
import { StarIcon } from '@components/icons/star-icon'
import { WatchAnimeButton } from '@components/buttons/watch-anime'
import { normalizeString } from '@utils/normalize-string'

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
  return (
    <li
      key={anime.mal_id}
      className="bg-Complementary mx-auto flex aspect-[700/400] w-full overflow-hidden rounded-lg"
    >
      <Picture
        image={anime.image_small_webp}
        styles="aspect-[225/330] h-full w-auto overflow-hidden rounded-l-lg"
      >
        <a href={`/${normalizeString(anime.title)}_${anime.mal_id}`}>
          <img
            src={anime.image_large_webp}
            alt={anime.title}
            className="aspect-[225/330] h-full w-full rounded-lg object-cover object-center transition-all duration-300 ease-in-out md:hover:scale-110"
            loading="lazy"
          />
        </a>
      </Picture>
      <div className="flex h-full w-[75%] flex-col justify-between p-4">
        <h3
          title={anime.title}
          className="text-l line-clamp-1 w-full overflow-hidden font-bold text-pretty text-white xl:line-clamp-2"
        >
          {anime.title}
        </h3>

        <div className="text-s mt-1 flex flex-row gap-2 text-xs text-gray-500 xl:mt-2">
          {anime.genres.slice(0, 2).map((genre) => (
            <AnimeTag key={genre} tag={genre} type={genre} style="w-auto" />
          ))}
        </div>
        <p className="text-sx text-Primary-200 line-clamp-2">
          {anime.synopsis ?? 'No description available'}
        </p>
        <span className="text-sx flex items-center gap-2 text-gray-400">
          <StarIcon className="text-enfasisColor h-5 w-5" />
          {anime.score}/10
        </span>
        <footer className="flex h-min flex-row gap-2">
          <WatchAnimeButton
            url={`/watch/${normalizeString(anime.title)}_${anime.mal_id}`}
          />
          <AddToListButton />
          <ShareButton
            title={anime.title}
            url={`/${normalizeString(anime.title)}_${anime.mal_id}`}
            text={`Watch ${anime.title} on Animeflix`}
          />
        </footer>
      </div>
    </li>
  )
}
