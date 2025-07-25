import { Picture } from '@components/media/picture'
import { useDynamicBorder } from '@hooks/useDynamicBorder'
import { useGlobalUserPreferences } from '@store/global-user'
import { baseUrl } from '@utils/base-url'
import { colorToRGB } from '@utils/color-to-rgb'
import { createImageUrlProxy } from '@utils/create-image-url-proxy'
import { normalizeString } from '@utils/normalize-string'
import type { AnimeCardInfo } from 'types'

/**
 * Props for the CalendarItem component.
 */
interface CalendarItemProps {
  /** The anime information to display */
  anime: AnimeCardInfo
  /** Whether the item should be positioned on the left side of the timeline */
  isLeft: boolean
  isMobile: boolean
}

/**
 * CalendarItem component displays an individual anime entry in the schedule timeline.
 *
 * @description
 * This component renders a card containing anime information within a timeline layout.
 * It features interactive hover effects, dynamic borders, and responsive design.
 * The component displays the anime's cover image, title, and status information.
 *
 * The card includes:
 * - A dynamic border effect that follows mouse movement
 * - Smooth hover transitions and scaling effects
 * - Responsive image handling with the Picture component
 * - Semantic HTML structure for accessibility
 * - Status indicators for airing information
 *
 * The component adapts its layout based on its position in the timeline (left or right)
 * and maintains consistent spacing and alignment with other timeline elements.
 *
 * @example
 * ```tsx
 * <CalendarItem
 *   anime={{
 *     title: "My Hero Academia",
 *     status: "Currently Airing",
 *     mal_id: 21,
 *     // ... other AnimeCardInfo properties
 *   }}
 *   isLeft={true}
 * />
 * ```
 *
 * @param {CalendarItemProps} props - The component props
 * @returns {JSX.Element} A timeline card displaying anime information
 */
export const CalendarItem = ({
  anime,
  isLeft,
  isMobile,
}: CalendarItemProps) => {
  const { enfasis } = useGlobalUserPreferences()
  const { elementRef, handleMouseMove, handleMouseLeave, handleMouseEnter } =
    useDynamicBorder<HTMLAnchorElement>({
      borderWidth: 2,
    })

  return (
    <article
      className={`relative flex items-center ${isMobile ? '' : isLeft ? 'md:mr-auto md:flex-row md:pr-8' : 'md:ml-auto md:flex-row-reverse md:pl-8'} `}
    >
      <a
        ref={elementRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        onMouseEnter={handleMouseEnter}
        href={`/anime/${normalizeString(anime.title)}_${anime.mal_id}`}
        className={`group bg-Complementary/90 hover:bg-Complementary dynamic-border relative flex aspect-[120/40] h-full w-full -translate-y-2 items-center gap-8 overflow-hidden rounded-lg transition-all duration-500 ease-out md:w-[calc(50%-1rem)]`}
        style={
          {
            '--border-color-normal': `rgba(${colorToRGB(enfasis)}, 0)`,
            '--border-color-hover': `rgba(${colorToRGB(enfasis)}, 0.5)`,
          } as React.CSSProperties
        }
        aria-label={`View details for ${anime.title}`}
      >
        <Picture
          image={createImageUrlProxy(
            anime.image_webp ?? `${baseUrl}/placeholder.webp`,
            '0',
            '0',
            'webp'
          )}
          styles="relative overflow-hidden h-full w-full max-w-32 h-full transition-all duration-500 transform rounded-l-lg"
        >
          <img
            src={createImageUrlProxy(
              anime.image_webp ?? `${baseUrl}/placeholder.webp`,
              '0',
              '70',
              'webp'
            )}
            alt={anime.title}
            className="relative aspect-[225/330] h-full w-full max-w-32 transform object-cover object-center transition-all duration-500 will-change-transform group-hover:scale-105 group-hover:brightness-105 group-hover:contrast-110"
          />
        </Picture>

        <div className="relative z-10 flex flex-col gap-4 py-2">
          <header>
            <h3 className="text-Primary group-hover:text-Primary line-clamp-1 max-w-96 text-2xl leading-tight font-bold tracking-tight drop-shadow-sm transition-colors duration-300 group-hover:drop-shadow-md">
              {anime.title}
            </h3>
          </header>

          <footer className="flex items-center gap-3">
            <span
              role="status"
              className="text-Primary-200 bg-Primary/5 rounded-full px-4 py-1.5 text-sm font-medium"
            >
              {anime.status}
            </span>
          </footer>
        </div>
      </a>
    </article>
  )
}
