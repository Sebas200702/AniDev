import { NextIcon } from '@icons/next-icon'
import { PreviousIcon } from '@icons/previous-icon'
import { useMusicPlayerStore } from '@store/music-player-store'

interface Props {
  direction: 'Next' | 'Prev'
}

export const NextPrevButton = ({ direction }: Props) => {
  const { currentSongIndex, setCurrentSong, list, setSavedTime } =
    useMusicPlayerStore()

  const hasNext = currentSongIndex + 1 < list.length
  const hasPrev = currentSongIndex > 0

  const handleClick = (direction: 'Next' | 'Prev') => {
    const changeAmount = 1
    const changeDirection = direction === 'Next' ? +changeAmount : -changeAmount
    if (
      (direction === 'Prev' && !hasPrev) ||
      (direction === 'Next' && !hasNext)
    ) {
      return
    }
    const newCurrentSong = list[currentSongIndex + changeDirection]
    setSavedTime(0)
    setCurrentSong(newCurrentSong)
  }
  return (
    <button
      className="hover:text-enfasisColor text-Primary-50-400 rounded-lg p-2 transition-all duration-300 ease-in-out hover:bg-zinc-700 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 vds-button"
      title={direction}
      aria-label={`${direction} Song`}
      disabled={!(direction === 'Next' ? hasNext : hasPrev)}
      onClick={() => handleClick(direction)}
    >
      {direction === 'Prev' ? (
        <PreviousIcon className="vds-icon " />
      ) : (
        <NextIcon className="vds-icon" />
      )}
    </button>
  )
}
