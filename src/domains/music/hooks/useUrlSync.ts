import { useMusicPlayerStore } from '@music/stores/music-player-store'
import { baseTitle } from '@shared/utils/base-url'
import { normalizeString } from '@utils/normalize-string'
import { useEffect } from 'react'

export const useUrlSync = () => {
  const { currentSong, isMinimized } = useMusicPlayerStore()

  useEffect(() => {
    if (!currentSong || isMinimized) return
    const url = `/music/${normalizeString(currentSong.song_title ?? 'Unknown Song')}_${currentSong.theme_id}`

    globalThis.history.replaceState(null, '', url)
    globalThis.document.title = `${currentSong.song_title} - ${baseTitle}`
  }, [currentSong])
}
