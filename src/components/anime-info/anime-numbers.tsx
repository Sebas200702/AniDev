import { CalendarIcon } from '@components/icons/calendar-icon'
import { ClockIcon } from '@components/icons/clock-icon'
import { StarIcon } from '@components/icons/star-icon'

interface Props {
  score: number
  year: string
  duration: string
}

export const AnimeNumbers = ({ score, year, duration }: Props) => {
  return (
    <ul className="bg-Primary-900/50 text-m row-start-1 flex h-min w-full max-w-80 flex-row items-center justify-between rounded-sm px-3 py-2 font-semibold backdrop-blur-md md:col-start-2 md:justify-self-end xl:col-start-3">
      <li className="flex flex-row items-center gap-2">
        <StarIcon style="xl:h-5 xl:w-5 h-3 w-3 text-enfasisColor" />
        {score?.toFixed(1) ?? '0'}
      </li>
      <li className="flex flex-row items-center gap-2">
        <ClockIcon class="text-enfasisColor h-3 w-3 xl:h-5 xl:w-5" />
        {duration.replace(/\s*per\s*ep/i, '')}
      </li>
      <li className="flex flex-row items-center gap-2">
        <CalendarIcon class="text-enfasisColor h-3 w-3 xl:h-5 xl:w-6" />
        {year}
      </li>
    </ul>
  )
}
