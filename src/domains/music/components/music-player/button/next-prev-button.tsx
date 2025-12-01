import { usePlaylist } from '@music/hooks/usePlaylist'
import { NextIcon } from '@shared/components/icons/watch/next-icon'
import { PreviousIcon } from '@shared/components/icons/watch/previous-icon'

interface Props {
  direction: 'Next' | 'Prev'
  iconClassName?: string
}

export const NextPrevButton = ({ direction, iconClassName }: Props) => {
  const { hasNext, hasPrev, handleNextSong, handlePrevSong } = usePlaylist()

  return (
    <button
      className="vds-play-button vds-button next-prev !bg-transparent disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50"
      title={direction}
      aria-label={`${direction} Song`}
      disabled={!(direction === 'Next' ? hasNext : hasPrev)}
      onClick={direction === 'Next' ? handleNextSong : handlePrevSong}
    >
      {direction === 'Prev' ? (
        <PreviousIcon className={iconClassName || 'vds-icon'} />
      ) : (
        <NextIcon className={iconClassName || 'vds-icon'} />
      )}
    </button>
  )
}
