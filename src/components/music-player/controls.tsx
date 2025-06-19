import { navigate } from 'astro:transitions/client'
import { ExpandIcon } from '@icons/expand-icon'
import { MuteIcon } from '@icons/muted-icon'
import { NextIcon } from '@icons/next-icon'
import { PauseIcon } from '@icons/pause-icon'
import { PlayIcon } from '@icons/play-icon'
import { PreviousIcon } from '@icons/previous-icon'
import { VolumeHighIcon } from '@icons/volumen-high-icon'
import { VolumeLowIcon } from '@icons/volumen-low-icon'
import { useMusicPlayerStore } from '@store/music-player-store'
import { normalizeString } from '@utils/normalize-string'
import {
  Controls,
  MuteButton,
  PlayButton,
  Time,
  TimeSlider,
  VolumeSlider,
} from '@vidstack/react'

interface Props {
  muted: boolean
  volume: number
}

export const CustomControls = ({ muted, volume }: Props) => {
  const { isPlaying, currentSong } = useMusicPlayerStore()
  if (!currentSong) return
  return (
    <Controls.Root className="mt-4 w-full flex-col gap-2 p-4 md:flex hidden">
      <Controls.Group className="flex items-center justify-center gap-4">
        <button
          className="hover:text-enfasisColor text-Primary-50-400 rounded-lg p-2 transition-all duration-300 ease-in-out hover:bg-zinc-700 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50"
          title="Prev"
          aria-label="Canción anterior"
        >
          <PreviousIcon className="h-5 w-5" />
        </button>
        <PlayButton className="bg-enfasisColor cursor-pointer rounded-full p-3">
          {!isPlaying ? (
            <PlayIcon className="h-5 w-5" />
          ) : (
            <PauseIcon className="h-5 w-5" />
          )}
        </PlayButton>
        <button
          className="hover:text-enfasisColor text-Primary-50 rounded-lg p-2 transition-all duration-300 ease-in-out hover:bg-zinc-700 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50"
          title="Next"
          aria-label="Siguiente canción"
        >
          <NextIcon className="h-5 w-5" />
        </button>
      </Controls.Group>
      <Controls.Group className="flex w-full flex-row items-center justify-between gap-4">
        <Time type="current" className="text-s text-Primary-200" />
        <TimeSlider.Root className="group relative mx-[7.5px] inline-flex h-10 w-full cursor-pointer touch-none items-center outline-none select-none aria-hidden:hidden">
          <TimeSlider.Track className="relative z-0 h-[5px] w-full rounded-sm bg-white/30 group-data-[focus]:ring-[3px]">
            <TimeSlider.TrackFill className="bg-enfasisColor absolute z-10 h-full w-[var(--slider-fill)] rounded-sm will-change-[width]" />
            <TimeSlider.Progress className="absolute h-full w-[var(--slider-progress)] rounded-sm bg-white/50 will-change-[width]" />
          </TimeSlider.Track>
          <TimeSlider.Thumb className="absolute top-1/2 left-[var(--slider-fill)] z-20 h-[15px] w-[15px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#cacaca] bg-white opacity-0 ring-white/40 transition-opacity will-change-[left] group-data-[active]:opacity-100 group-data-[dragging]:ring-4" />
        </TimeSlider.Root>
        <Time type="duration" className="text-s text-Primary-200" />
      </Controls.Group>
      <Controls.Group className="flex flex-row justify-between">
        <div className="flex w-full max-w-32 flex-row">
          <MuteButton className="cursor-pointer p-2">
            {muted || volume === 0 ? (
              <MuteIcon className="h-6 w-6" />
            ) : volume < 0.5 ? (
              <VolumeLowIcon className="text-enfasisColor h-6 w-6" />
            ) : (
              <VolumeHighIcon className="text-enfasisColor h-6 w-6" />
            )}
          </MuteButton>
          <VolumeSlider.Root className="group relative mx-[7.5px] inline-flex h-10 w-full max-w-[80px] cursor-pointer touch-none items-center outline-none select-none aria-hidden:hidden">
            <VolumeSlider.Track className="relative z-0 h-[5px] w-full rounded-sm bg-white/30 group-data-[focus]:ring-[3px]">
              <VolumeSlider.Preview className="text-sx bg-Primary-800 rounded-md px-2 py-1 opacity-0 transition-opacity group-data-[hover]:opacity-100">
                <VolumeSlider.Value />
              </VolumeSlider.Preview>
              <VolumeSlider.TrackFill className="bg-enfasisColor absolute h-full w-[var(--slider-fill)] rounded-sm will-change-[width]" />
            </VolumeSlider.Track>
            <VolumeSlider.Thumb className="absolute top-1/2 left-[var(--slider-fill)] z-20 h-[15px] w-[15px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#cacaca] bg-white opacity-0 ring-white/40 transition-opacity will-change-[left] group-data-[active]:opacity-100 group-data-[dragging]:ring-4" />
          </VolumeSlider.Root>
        </div>
        <button
          onClick={() =>
            navigate(
              `/music/${normalizeString(currentSong.song_title)}_${currentSong.theme_id}`
            )
          }
          className="cursor-pointer p-2"
        >
          <ExpandIcon className="h-5 w-5" />
        </button>
      </Controls.Group>
    </Controls.Root>
  )
}
