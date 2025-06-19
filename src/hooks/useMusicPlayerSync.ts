import { useMusicPlayerStore } from '@store/music-player-store'
import type { MediaPlayerInstance } from '@vidstack/react'
import { useEffect } from 'react'

export const useMusicPlayerSync = (
  currentTime: number,
  playing: boolean,
  player: React.RefObject<MediaPlayerInstance | null>,
  canPlay: boolean
) => {
  const {
    currentSong,
    setSavedTime,
    type,
    setSrc,
    setIsPlaying,
    setPlayerRef,
    setCanPlay,
  } = useMusicPlayerStore()

  useEffect(() => {
    if (!currentSong) return
    if (type === 'audio') {
      setSrc(currentSong.audio_url)
    }
    if (type === 'video') {
      setSrc(currentSong.video_url)
    }
  }, [currentSong, type, setSrc, setSavedTime])
  useEffect(() => {
    if (player) setPlayerRef(player)
  }, [player, setPlayerRef])
  useEffect(() => {
    setCanPlay(canPlay)
  }, [canPlay, setCanPlay])

  useEffect(() => {
    if (currentTime) {
      setSavedTime(currentTime)
    }
  }, [currentTime, setSavedTime])

  useEffect(() => {
    setIsPlaying(playing)
    console.log(playing)
  }, [playing, setIsPlaying])
}
