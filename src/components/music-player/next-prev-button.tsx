import { NextIcon } from '@icons/next-icon'
import { PreviousIcon } from '@icons/previous-icon'
import { useMusicPlayerStore } from '@store/music-player-store'
import { normalizeString } from '@utils/normalize-string'

interface Props {
  direction: 'Next' | 'Prev'
}

export const NextPrevButton = ({ direction }: Props) => {
  const {
    currentSongIndex,
    setCurrentSong,
    list,
    setSavedTime,
    isMinimized,
    setCurrentTime,
  } = useMusicPlayerStore()

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
    setCurrentTime(0)

    setCurrentSong(newCurrentSong)
    if (!isMinimized) {
      const newUrl = `/music/${normalizeString(newCurrentSong.song_title)}_${newCurrentSong.theme_id}`
      import('@utils/sycronize-player-metadata').then((module) => {
        module.SyncronizePlayerMetadata({
          title: newCurrentSong.song_title,
          url: newUrl,
        })
      })
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
