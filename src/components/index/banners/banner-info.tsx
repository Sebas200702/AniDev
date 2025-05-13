import { WatchAnimeButton } from '@components/buttons/watch-anime'
import { useWindowWidth } from '@store/window-width'
import { useEffect } from 'react'
interface BannerInfoProps {
  title: string
  synopsis: string
  mal_id: number
  slug: string
}

/**
 * BannerInfo component displays information about an anime in a banner format.
 *
 * @description This component manages the responsive display of anime information within banners.
 * It adapts its layout based on screen size, using the window width to determine device type.
 * On mobile devices, it covers the entire banner area with a semi-transparent background,
 * while on desktop it appears as a panel on the right side with rounded corners.
 *
 * The component displays three main elements: a clickable title that links to the anime details page,
 * a truncated synopsis limited to two lines for concise presentation, and a watch button that
 * directs users to the anime viewing page. The layout is optimized for both mobile and desktop
 * viewing experiences with appropriate spacing and sizing.
 *
 * The component implements responsive design principles with different styles for varying screen
 * sizes. It uses CSS utilities for text truncation, overflow handling, and smooth transitions
 * when interacting with clickable elements. The semi-transparent background ensures text
 * readability against any banner image.
 *
 * @param {BannerInfoProps} props - The component props
 * @param {string} props.title - The title of the anime to display
 * @param {string} props.synopsis - The synopsis or description of the anime
 * @param {number} props.mal_id - The MyAnimeList ID of the anime
 * @param {string} props.slug - The URL-friendly slug of the anime title
 * @returns {JSX.Element} The rendered banner information panel
 *
 * @example
 * <BannerInfo
 *   title="My Hero Academia"
 *   synopsis="A superhero anime series"
 *   mal_id={31964}
 *   slug="my-hero-academia"
 * />
 */

export const BannerInfo = ({
  title,
  synopsis,
  mal_id,
  slug,
}: BannerInfoProps): JSX.Element => {
  return (
    <div
      className={`bg-Primary-950/50 absolute bottom-0 z-10 flex h-full w-full flex-col items-center justify-between p-4 md:right-0 md:rounded-l-2xl md:p-6 xl:bottom-10 xl:max-h-60 xl:max-w-120 xl:pr-10`}
    >
      <a
        href={`/anime/${slug}_${mal_id}`}
        className="transition-all duration-200 ease-in-out md:hover:opacity-95"
      >
        <h3 className="text-lx line-clamp-1 max-h-44 w-full overflow-hidden text-center font-bold text-white">
          {title}
        </h3>
      </a>

      <p className="text-s line-clamp-2 max-h-32 w-full overflow-hidden text-center text-white">
        {synopsis}
      </p>
      <WatchAnimeButton url={`/watch/${slug}_${mal_id}`} title={title} />
    </div>
  )
}
