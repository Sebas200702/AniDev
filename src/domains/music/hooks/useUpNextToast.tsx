import type { AnimeSong } from '@music/types'
import { toast } from '@pheralb/toast'
import { Picture } from '@shared/components/media/picture'
import { ToastType } from '@shared/types'
import { useEffect, useState } from 'react'
type Params = {
  list: AnimeSong[]
  currentSongIndex: number
  currentTime: number
  duration: number
  isPlaying: boolean
  currentSong?: AnimeSong | null
}

export const useUpNextToast = ({
  list,
  currentSongIndex,
  currentTime,
  duration,
  isPlaying,
  currentSong,
}: Params) => {
  const [toastShown, setToastShown] = useState(false)

  useEffect(() => {
    const nextSong = list[currentSongIndex + 1]
    const timeRemaining = duration - currentTime

    if (
      timeRemaining <= 8 &&
      timeRemaining > 0 &&
      nextSong &&
      !toastShown &&
      isPlaying
    ) {
      const text = () => {
        if (nextSong.artist_name) {
          return `${nextSong.song_title} By ${nextSong.artist_name}`
        }
        return nextSong.song_title
      }
      toast[ToastType.Info]({
        text: `${text()}`,
        description: 'Up Next',
        delayDuration: 7000,
        icon: (
          <Picture
            image={nextSong.anime?.image ?? ''}
            placeholder={nextSong.anime?.image ?? ''}
            alt={nextSong.song_title ?? 'Up Next Song'}
            styles="relative mr-2 aspect-[225/330] w-10 rounded-sm md:w-12"
          />
        ),
      })

      setToastShown(true)
    }
  }, [list, currentSongIndex, currentTime, duration, isPlaying, toastShown])

  useEffect(() => {
    const timeout = setTimeout(() => {
      setToastShown(false)
    }, 8000)
    return () => clearTimeout(timeout)
  }, [currentSong?.theme_id])
}
