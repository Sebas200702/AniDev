import type { AnimeSong } from 'types'
import { create } from 'zustand'

interface AnimeSongWithImage extends AnimeSong {
  image: string
  placeholder: string
  anime_title: string
}
interface MusicPlayerStore {
  list: AnimeSongWithImage[]
  setList: (list: AnimeSongWithImage[]) => void
  isPlaying: boolean
  setIsPlaying: (isPlaying: boolean) => void
  currentTime: number
  setCurrentTime: (currentTime: number) => void
  currentSong: AnimeSongWithImage | null
  setCurrentSong: (currentSong: AnimeSongWithImage) => void
  type: 'video' | 'audio'
  setType: (type: 'video' | 'audio') => void
}

export const useMusicPlayerStore = create<MusicPlayerStore>((set) => ({
  list: [],
  type: 'audio',
  setType: (type: 'video' | 'audio') => set({ type }),
  setList: (list: AnimeSongWithImage[]) => set({ list }),
  isPlaying: false,
  setIsPlaying: (isPlaying: boolean) => set({ isPlaying }),
  currentTime: 0,
  setCurrentTime: (currentTime: number) => set({ currentTime }),
  currentSong: null,
  setCurrentSong: (currentSong: AnimeSongWithImage) => set({ currentSong }),
}))
