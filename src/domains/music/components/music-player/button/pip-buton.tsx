import { useMusicPlayerStore } from '@music/stores/music-player-store'
import { PipIconOff, PipIconOn } from '@shared/components/icons/watch/pip-icon'
import { PIPButton, useMediaState } from '@vidstack/react'

export const PIPButtonWrapper = () => {
  const { type } = useMusicPlayerStore()
  const isActive = useMediaState('pictureInPicture')
  if (type === 'audio') return null
  return (
    <PIPButton className="vds-button">
      {isActive ? (
        <PipIconOff className="vds-icon" />
      ) : (
        <PipIconOn className="vds-icon" />
      )}
    </PIPButton>
  )
}
