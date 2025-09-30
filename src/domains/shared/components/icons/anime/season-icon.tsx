import { FallIcon } from '@shared/components/icons/anime/fall-icon'
import { SpringIcon } from '@shared/components/icons/anime/spring-icon'
import { SummerIcon } from '@shared/components/icons/anime/summer-icon'
import { WinterIcon } from '@shared/components/icons/anime/winter-icon'
import { UnknownIcon } from '@shared/components/icons/common/unknown-icon'
import type { IconProps } from '@shared/types'
interface SeasonIconProps extends IconProps {
  season: string
}

/**
 * SeasonIcon component renders an icon representing the season of an anime.
 *
 * @description This component dynamically selects and renders the appropriate seasonal icon based on
 * the provided season parameter. Each season is represented by a distinct icon with season-specific
 * coloring: spring (green), summer (yellow), winter (blue), and fall (orange). If an unrecognized
 * season is provided, a neutral gray unknown icon is displayed as a fallback.
 *
 * The component applies consistent styling across all seasonal representations while allowing for
 * additional customization through the optional className prop. Each icon inherits the base styling
 * while adding season-specific color treatment to provide visual differentiation and intuitive
 * recognition of the anime's seasonal categorization.
 *
 * This icon component is typically used in anime detail pages, seasonal anime listings, or filtering
 * interfaces where visual identification of an anime's associated season enhances user experience
 * and provides contextual information.
 *
 * @param {SeasonIconProps} props - The component props
 * @param {string} [props.className] - Optional class name for additional styling of the icon
 * @param {string} props.season - The season to display (spring, summer, winter, fall)
 * @returns {JSX.Element} The rendered seasonal icon with appropriate styling
 *
 * @example
 * <SeasonIcon season="winter" className="w-6 h-6" />
 */
export const SeasonIcon = ({ className, season }: SeasonIconProps) => {
  if (season === 'spring')
    return <SpringIcon className={`${className} text-green-500`} />
  if (season === 'summer')
    return <SummerIcon className={`${className} text-yellow-500`} />
  if (season === 'winter')
    return <WinterIcon className={`${className} text-blue-500`} />
  if (season === 'fall')
    return <FallIcon className={`${className} text-orange-500`} />
  return <UnknownIcon className={`${className} text-gray-400`} />
}
