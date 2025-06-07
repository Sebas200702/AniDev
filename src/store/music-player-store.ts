import type { AnimeSong } from 'types'
import { create } from 'zustand'

interface AnimeSongWithImage extends AnimeSong {
  image: string
  placeholder: string
  anime_title: string
}
interface MusicPlayerStore {
  list: AnimeSongWithImage[]
  duration: number
  volume: number
  setDuration: (duration: number) => void
  setVolume: (volume: number) => void
  setList: (list: AnimeSongWithImage[]) => void
  isPlaying: boolean
  setIsPlaying: (isPlaying: boolean) => void
  currentTime: number
  setCurrentTime: (currentTime: number) => void
  currentSong: AnimeSongWithImage | null
  setCurrentSong: (currentSong: AnimeSongWithImage) => void
  type: 'video' | 'audio'
  setType: (type: 'video' | 'audio') => void
  isLoading: boolean
  setIsLoading: (isLoading: boolean) => void
  repeat: boolean
  setRepeat: (repeat: boolean) => void
  shuffle: boolean
  setShuffle: (shuffle: boolean) => void
  isMinimized: boolean
  setIsMinimized: (isMinimized: boolean) => void
  isDragging: boolean
  setIsDragging: (isDragging: boolean) => void
  error: string | null
  setError: (error: string | null) => void
}

export const useMusicPlayerStore = create<MusicPlayerStore>((set) => ({
  list: [],
  duration: 0,
  volume: 1,
  setDuration: (duration: number) => set({ duration }),
  setVolume: (volume: number) => set({ volume }),
  type: 'audio',
  setType: (type: 'video' | 'audio') => set({ type }),
  setList: (list: AnimeSongWithImage[]) => set({ list }),
  isPlaying: false,
  setIsPlaying: (isPlaying: boolean) => set({ isPlaying }),
  currentTime: 0,
  setCurrentTime: (currentTime: number) => set({ currentTime }),
  currentSong: null,
  setCurrentSong: (currentSong: AnimeSongWithImage) => set({ currentSong }),
  isLoading: false,
  setIsLoading: (isLoading: boolean) => set({ isLoading }),
  repeat: false,
  setRepeat: (repeat: boolean) => set({ repeat }),
  shuffle: false,
  setShuffle: (shuffle: boolean) => set({ shuffle }),
  isMinimized: false,
  setIsMinimized: (isMinimized: boolean) => set({ isMinimized }),
  isDragging: false,
  setIsDragging: (isDragging: boolean) => set({ isDragging }),
  error: null,
  setError: (error: string | null) => set({ error }),
}))
