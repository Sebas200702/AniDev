import { FallIcon } from '@icons/fall-icon'
import { SpringIcon } from '@icons/spring-icon'
import { SummerIcon } from '@icons/summer-icon'
import { UnknownIcon } from '@icons/unknown-icon'
import { WinterIcon } from '@icons/winter-icon'

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
