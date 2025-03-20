import { FallIcon } from '@icons/fall-icon'
import { SpringIcon } from '@icons/spring-icon'
import { SummerIcon } from '@icons/summer-icon'
import { UnknownIcon } from '@icons/unknown-icon'
import { WinterIcon } from '@icons/winter-icon'

/**
 * SeasonIcon component renders an icon representing the season of an anime.
 *
 * This component takes two props: `className` and `season`. The `className` prop
 * is optional and is used to apply additional CSS classes to the icon. The `season`
 * prop is required and determines which icon to render.
 *
 * @param {Object} props
 * @param {string} [props.className] - Additional CSS classes to apply to the icon
 * @param {string} props.season - The season of the anime (spring, summer, winter, fall)
 * @returns {JSX.Element} The rendered icon
 */
export const SeasonIcon = ({
  className,
  season,
}: {
  className?: string
  season: string
}) => {
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
