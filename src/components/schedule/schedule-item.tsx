import { Picture } from '@components/picture'
import { useDynamicBorder } from '@hooks/useDynamicBorder'
import { useGlobalUserPreferences } from '@store/global-user'
import { colorToRGB } from '@utils/color-to-rgb'
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
export const CalendarItem = ({ anime, isLeft }: CalendarItemProps) => {
  const { enfasis } = useGlobalUserPreferences()
  const { elementRef, handleMouseMove, handleMouseLeave, handleMouseEnter } =
    useDynamicBorder<HTMLAnchorElement>({
      borderWidth: 2,
    })

  return (
    <article
      className={`relative flex items-center ${isLeft ? 'flex-row mr-auto pr-8' : 'flex-row-reverse ml-auto pl-8'}
      `}
    >
      <a
        ref={elementRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        onMouseEnter={handleMouseEnter}
        href={`/anime/${normalizeString(anime.title)}_${anime.mal_id}`}
        className={`group relative flex items-center
          gap-8 rounded-lg bg-Complementary/90
          transition-all duration-500 ease-out
          hover:bg-Complementary  dynamic-border -translate-y-2
           overflow-hidden w-[calc(50%-1rem)] aspect-[120/40] h-full `}
        style={
          {
            '--border-color-normal': `rgba(${colorToRGB(enfasis)}, 0.2)`,
            '--border-color-hover': `rgba(${colorToRGB(enfasis)}, 0.8)`,
          } as React.CSSProperties
        }
        aria-label={`View details for ${anime.title}`}
      >
        <Picture
          image={anime.image_webp}
          styles="relative overflow-hidden h-full w-full max-w-32 h-full transition-all duration-500 transform rounded-l-lg"
        >
          <img
            src={anime.image_webp}
            alt={anime.title}
            className="relative aspect-[225/330] w-full max-w-32 h-full object-cover object-center
                transition-all duration-500 group-hover:scale-105 group-hover:brightness-105
                group-hover:contrast-110 transform will-change-transform"
          />
        </Picture>

        <div className="flex flex-col gap-4 py-2 relative z-10">
          <header>
            <h3
              className="text-2xl font-bold line-clamp-1 max-w-96 text-Primary group-hover:text-Primary
              transition-colors duration-300 tracking-tight leading-tight
              drop-shadow-sm group-hover:drop-shadow-md"
            >
              {anime.title}
            </h3>
          </header>

          <footer className="flex items-center gap-3">
            <span
              role="status"
              className="text-sm font-medium text-Primary-200 bg-Primary/5 rounded-full py-1.5 px-4"
            >
              {anime.status}
            </span>
          </footer>
        </div>
      </a>
    </article>
  )
}
