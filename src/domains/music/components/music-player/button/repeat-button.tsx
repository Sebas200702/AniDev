import { usePlaylist } from '@music/hooks/usePlaylist'
import {
  RepeatIconOff,
  RepeatIconOn,
} from '@shared/components/icons/watch/repeat-icon'
interface Props {
  iconClassName?: string
}
export const RepeatButton = ({ iconClassName }: Props) => {
  const { toggleRepeat, isRepeat } = usePlaylist()
  return (
    <button
      title={isRepeat ? 'Disable Repeat' : 'Enable Repeat'}
      className={`vds-play-button vds-button next-prev !bg-transparent disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 ${isRepeat ? '' : 'opacity-50'}`}
      onClick={toggleRepeat}
    >
      {isRepeat ? (
        <RepeatIconOn className={iconClassName || 'vds-icon'} />
      ) : (
        <RepeatIconOff className={iconClassName || 'vds-icon'} />
      )}
    </button>
  )
}
