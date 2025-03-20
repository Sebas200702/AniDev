import type { Anime } from 'types'
import { Overlay } from '@components/overlay'
import { Picture } from '@components/picture'
import { WatchAnimeButton } from '@components/buttons/watch-anime'
import { createImageUrlProxy } from '@utils/craete-imageurl-proxy'
import { normalizeString } from '@utils/normalize-string'

interface CarouselItemProps {
  anime: Anime
  index: number
}

/**
 * CarouselItem component renders an individual item in the carousel.
 *
 * @description This component displays the anime's banner image, title, and a brief description.
 * It also includes a "Learn More" button and a "Watch Anime" button.
 *
 * The component manages the visual presentation of each carousel item, including responsive layout
 * adjustments based on screen size. It alternates the layout direction (left-to-right or right-to-left)
 * based on the item's index to create visual variety in the carousel.
 *
 * The component implements overlay gradients to ensure text readability against the background image.
 * It displays a prominent title, a brief synopsis that is visible on larger screens, and navigation
 * buttons that direct users to more detailed information or to watch the anime.
 *
 * The banner images are optimized with different resolutions for various loading stages to improve
 * performance and user experience. The component uses the Picture component for progressive image
 * loading and the Overlay component to create gradient effects over the images.
 *
 * @param {CarouselItemProps} props - The component props
 * @param {Anime} props.anime - The anime object containing details to display including title, synopsis, and images
 * @param {number} props.index - The index of the item in the carousel, used to determine layout direction
 * @returns {JSX.Element} The rendered carousel item with image, overlays, title, description, and action buttons
 *
 * @example
 * <CarouselItem anime={animeData} index={0} />
 */
export const CarouselItem = ({ anime, index }: CarouselItemProps) => {
  return (
    <li
      key={anime.mal_id}
      className={`relative flex h-full w-full flex-shrink-0 flex-col items-center justify-center p-6 md:justify-normal md:p-20 ${index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'}`}
    >
      <Picture
        image={createImageUrlProxy(anime.banner_image, '100', '0', 'webp')}
        styles="absolute inset-0  w-full"
      >
        <img
          className="absolute inset-0 h-full w-full object-cover object-center"
          src={createImageUrlProxy(anime.banner_image, '1920', '50', 'webp')}
          alt="Anime Banner"
          loading="lazy"
        />
      </Picture>

      <Overlay className="to-Primary-950/100 h-full w-full bg-gradient-to-b" />
      <Overlay
        className={`to-Primary-950/70 h-full w-full ${index % 2 === 0 ? 'bg-gradient-to-l' : 'bg-gradient-to-r'} `}
      />
      <div
        className={`z-10 mb-20 flex max-w-[800px] flex-col items-center gap-8 text-white md:items-start md:justify-start md:gap-4`}
      >
        <h2 className="title line-clamp-1 max-h-44 text-center drop-shadow-md md:mb-4">
          {anime.title}
        </h2>
        <p className="text-l mb-4 line-clamp-2 h-0 w-0 drop-shadow md:h-auto md:w-auto">
          {anime.synopsis ?? 'No description available'}
        </p>
        <div className="mx-auto flex w-[300px] flex-row items-center gap-4 md:mx-0 md:w-96 md:justify-center">
          <a
            href={`/${normalizeString(anime.title)}_${anime.mal_id}`}
            className="button-secondary text-s flex w-full"
          >
            Learn More
          </a>
          <WatchAnimeButton
            url={`/watch/${normalizeString(anime.title)}_${anime.mal_id}`}
          />
        </div>
      </div>
    </li>
  )
}
