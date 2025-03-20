import { WatchAnimeButton } from '@components/buttons/watch-anime'
import { useEffect } from 'react'
import { useWindowWidth } from '@store/window-width'
interface BannerInfoProps {
  title: string
  synopsis: string
  mal_id: number
  slug: string
}

/**
 * BannerInfo component displays information about an anime in a banner format.
 *
 * @description This component renders a responsive information panel for anime banners.
 * It displays the anime title, a brief synopsis, and a watch button. The component
 * adapts its layout and positioning based on the screen size, providing different
 * styles for mobile and desktop views.
 *
 * The component uses the window width to determine the device type and adjusts its
 * appearance accordingly. On mobile devices, it covers the entire banner area, while
 * on desktop it appears as a panel on the right side with rounded corners.
 *
 * The UI includes a clickable title that links to the anime details page, a truncated
 * synopsis that shows only the first two lines, and a watch button that directs users
 * to the anime viewing page.
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
  const { width, setWidth } = useWindowWidth()
  const isMobile = width && width < 768

  useEffect(() => {
    window.addEventListener('resize', () => setWidth(window.innerWidth))
    return () =>
      window.removeEventListener('resize', () => setWidth(window.innerWidth))
  }, [])

  return (
    <div
      className={`bg-Primary-950/50 absolute z-10 flex h-full w-full ${isMobile ? 'inset-0' : ''} flex-col items-center justify-between p-3 md:right-0 md:bottom-10 md:max-h-44 md:max-w-96 md:rounded-l-2xl md:p-4 md:pr-10 xl:max-h-60`}
    >
      <a
        href={`/${slug}_${mal_id}`}
        className="transition-all duration-200 ease-in-out md:hover:opacity-95"
      >
        <h3 className="text-lx line-clamp-2 max-h-44 w-full overflow-hidden text-center font-bold text-white">
          {title}
        </h3>
      </a>

      <p className="text-s line-clamp-2 max-h-32 w-full overflow-hidden text-center text-white">
        {synopsis}
      </p>
      <WatchAnimeButton url={`/watch/${slug}_${mal_id}`} />
    </div>
  )
}
