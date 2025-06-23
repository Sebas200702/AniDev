import { navigate } from 'astro:transitions/client'
import { NextIcon } from '@icons/next-icon'
import { PreviousIcon } from '@icons/previous-icon'
import { useMusicPlayerStore } from '@store/music-player-store'

interface Props {
  direction: 'Next' | 'Prev'
}

export const NextPrevButton = ({ direction }: Props) => {
  const { currentSongIndex, setCurrentSong, list, setSavedTime, isMinimized } =
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
    if (!isMinimized) {
      navigate(`/music/${newCurrentSong.song_title}_${newCurrentSong.theme_id}`)
    }
  }
  return (
    <button
      className="vds-play-button vds-button next-prev !bg-transparent disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50"
      title={direction}
      aria-label={`${direction} Song`}
      disabled={!(direction === 'Next' ? hasNext : hasPrev)}
      onClick={() => handleClick(direction)}
    >
      {direction === 'Prev' ? (
        <PreviousIcon className="vds-icon" />
      ) : (
        <NextIcon className="vds-icon" />
      )}
    </button>
  )
}
