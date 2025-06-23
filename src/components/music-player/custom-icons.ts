import { FullScreenExitIcon } from '@components/icons/full-screen-exit-icon'
import { FullScreenIcon } from '@components/icons/full-screen-icon'
import { GoogleCastIcon } from '@components/icons/google-cast-icon'
import { MuteIcon } from '@components/icons/muted-icon'
import { PauseIcon } from '@components/icons/pause-icon'
import { PlayIcon } from '@components/icons/play-icon'
import { ReplayIcon } from '@components/icons/replay-icon'
import { SettingsIcon } from '@components/icons/settings-icon'
import { VolumeHighIcon } from '@components/icons/volumen-high-icon'
import { VolumeLowIcon } from '@components/icons/volumen-low-icon'
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
