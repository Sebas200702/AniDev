import { SettingsIcon } from '@shared/components/icons/common/settings-icon'
import { FullScreenExitIcon } from '@shared/components/icons/watch/full-screen-exit-icon'
import { FullScreenIcon } from '@shared/components/icons/watch/full-screen-icon'
import { GoogleCastIcon } from '@shared/components/icons/watch/google-cast-icon'
import { MuteIcon } from '@shared/components/icons/watch/muted-icon'
import { PauseIcon } from '@shared/components/icons/watch/pause-icon'
import { PlayIcon } from '@shared/components/icons/watch/play-icon'
import { ReplayIcon } from '@shared/components/icons/watch/replay-icon'
import { VolumeHighIcon } from '@shared/components/icons/watch/volumen-high-icon'
import { VolumeLowIcon } from '@shared/components/icons/watch/volumen-low-icon'
import {
  type DefaultLayoutIcons,
  defaultLayoutIcons,
} from '@vidstack/react/player/layouts/default'

const None = () => null

export const customIcons: DefaultLayoutIcons = {
  ...defaultLayoutIcons,

  AirPlayButton: {
    Default: None,
    Connecting: None,
    Connected: None,
  },
  GoogleCastButton: {
    Default: GoogleCastIcon,
    Connecting: GoogleCastIcon,
    Connected: GoogleCastIcon,
  },
  PlayButton: {
    Play: PlayIcon,
    Pause: PauseIcon,
    Replay: ReplayIcon,
  },
  MuteButton: {
    Mute: MuteIcon,
    VolumeLow: VolumeLowIcon,
    VolumeHigh: VolumeHighIcon,
  },
  Menu: {
    ...defaultLayoutIcons.Menu,
    Settings: SettingsIcon,
  },

  FullscreenButton: {
    Enter: FullScreenIcon,
    Exit: FullScreenExitIcon,
  },
}
