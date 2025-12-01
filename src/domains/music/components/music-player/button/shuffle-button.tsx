import { usePlaylist } from '@music/hooks/usePlaylist'
import { RandomIcon } from '@shared/components/icons/anime/random-icon'

interface Props {
  iconClassName?: string
}
export const ShuffleButton = ({ iconClassName }: Props) => {
  const { shuffleList, canShuffle } = usePlaylist()
  return (
    <button
      title="Shuffle"
      className="vds-play-button vds-button next-prev !bg-transparent disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50"
      onClick={shuffleList}
      disabled={!canShuffle}
    >
      <RandomIcon className={iconClassName || 'vds-icon'} />
    </button>
  )
}
