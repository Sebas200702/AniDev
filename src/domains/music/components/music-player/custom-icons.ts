import {
  type DefaultLayoutIcons,
  defaultLayoutIcons,
} from '@vidstack/react/player/layouts/default'
import { FullScreenExitIcon } from 'domains/shared/components/icons/full-screen-exit-icon'
import { FullScreenIcon } from 'domains/shared/components/icons/full-screen-icon'
import { GoogleCastIcon } from 'domains/shared/components/icons/google-cast-icon'
import { MuteIcon } from 'domains/shared/components/icons/muted-icon'
import { PauseIcon } from 'domains/shared/components/icons/pause-icon'
import { PlayIcon } from 'domains/shared/components/icons/play-icon'
import { ReplayIcon } from 'domains/shared/components/icons/replay-icon'
import { SettingsIcon } from 'domains/shared/components/icons/settings-icon'
import { VolumeHighIcon } from 'domains/shared/components/icons/volumen-high-icon'
import { VolumeLowIcon } from 'domains/shared/components/icons/volumen-low-icon'

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
