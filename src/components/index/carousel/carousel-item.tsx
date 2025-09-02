import { WatchAnimeButton } from '@components/buttons/watch-anime'
import { Overlay } from '@components/layout/overlay'
import { Picture } from '@components/media/picture'
import { useWindowWidth } from '@store/window-width'
import { baseUrl } from '@utils/base-url'
import { createImageUrlProxy } from '@utils/create-image-url-proxy'
import { normalizeString } from '@utils/normalize-string'
import type { AnimeBannerInfo } from 'types'

interface CarouselItemProps {
  anime: AnimeBannerInfo
  index: number
}

/**
 * CarouselItem component renders an individual item in the carousel.
 *
 * @description This component manages the visual presentation of each carousel item, displaying the anime's
 * banner image, title, and a brief description. It alternates the layout direction (left-to-right or
 * right-to-left) based on the item's index to create visual variety in the carousel.
 *
 * The component implements overlay gradients to ensure text readability against the background image.
 * It displays a prominent title, a brief synopsis that is visible on larger screens, and navigation
 * buttons that direct users to more detailed information or to watch the anime.
 *
 * The banner images are optimized with different resolutions for various loading stages to improve
 * performance and user experience. The component uses the Picture component for progressive image
 * loading and the Overlay component to create gradient effects over the images.
 *
 * The responsive layout adjusts based on screen size, with different text visibility and positioning
 * options for mobile and desktop viewports. Action buttons maintain consistent placement and styling
 * across all screen sizes.
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
  const { width: windowWidth } = useWindowWidth()
  const isMobile = windowWidth && windowWidth < 768
  return (
    <li
      key={anime.mal_id}
      className={`relative flex h-full w-full flex-shrink-0 flex-col items-center justify-center p-6 pt-36 md:justify-normal md:p-20 ${index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'}`}
    >
      <div className="absolute inset-0 h-[40vh] w-full overflow-hidden md:h-full">
        <Picture
          image={createImageUrlProxy(
            anime.banner_image ?? `${baseUrl}/placeholder.webp`,
            '100',
            '0',
            'webp'
          )}
          styles="w-full h-full object-cover object-center relative"
        >
          <img
            className="relative h-full w-full object-cover object-center"
            src={
              isMobile
                ? createImageUrlProxy(
                    anime.banner_image ?? '',
                    '720',
                    '50',
                    'webp'
                  )
                : createImageUrlProxy(
                    anime.banner_image ?? '',
                    '1920',
                    '50',
                    'webp'
                  )
            }
            alt={`${anime.title} banner`}
            fetchPriority="high"
            decoding="async"
          />
        </Picture>
      </div>

      <div
        className={`z-10 flex max-w-[800px] flex-col items-center gap-6 text-white md:items-start md:justify-start md:gap-4`}
      >
        <h2 className="title line-clamp-1 max-h-44 text-center drop-shadow-md md:mb-4">
          {anime.title}
        </h2>
        <p className="text-l text-Primary-200 mb-4 line-clamp-2 text-center drop-shadow md:text-left">
          {anime.synopsis ?? 'No description available'}
        </p>
        <div className="mx-auto flex w-full flex-row items-center gap-4 md:mx-0 md:w-96 md:justify-center">
          <a
            className="button-secondary text-m flex w-full items-center justify-center"
            href={`/anime/${normalizeString(anime.title)}_${anime.mal_id}`}
            title={`Discover ${anime.title}`}
          >
            Discover More
          </a>
          <WatchAnimeButton
            url={`/watch/${normalizeString(anime.title)}_${anime.mal_id}`}
            title={anime.title}
          />
        </div>
      </div>

      <Overlay className="to-Primary-950 via-Primary-950 md:via-Primary-950/10 h-full w-full bg-gradient-to-b" />
      <Overlay
        className={`md:to-Primary-950 md:via-Primary-950/80 h-full w-full ${index % 2 === 0 ? 'bg-gradient-to-l' : 'bg-gradient-to-r'}`}
      />
    </li>
  )
}
