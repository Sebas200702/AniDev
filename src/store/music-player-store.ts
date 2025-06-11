import type { AnimeSong } from 'types'
import { create } from 'zustand'

interface AnimeSongWithImage extends AnimeSong {
  image: string
  placeholder: string
  banner_image: string
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
  variants: AnimeSongWithImage[]
  setVariants: (variants: AnimeSongWithImage[]) => void

  // Nuevos estados del componente
  savedTime: number
  setSavedTime: (savedTime: number) => void
  isChangingFormat: boolean
  setIsChangingFormat: (isChangingFormat: boolean) => void
  currentTimeLocal: number
  setCurrentTimeLocal: (currentTimeLocal: number) => void
  durationLocal: number
  setDurationLocal: (durationLocal: number) => void
  isDraggingPlayer: boolean
  setIsDraggingPlayer: (isDraggingPlayer: boolean) => void
  dragOffset: { x: number; y: number }
  setDragOffset: (dragOffset: { x: number; y: number }) => void
  position: { x: number; y: number }
  setPosition: (position: { x: number; y: number }) => void

  // Estados del Controls
  isVolumeDragging: boolean
  setIsVolumeDragging: (isVolumeDragging: boolean) => void
  dragPosition: number
  setDragPosition: (dragPosition: number) => void
}

export const useMusicPlayerStore = create<MusicPlayerStore>((set) => ({
  list: [],
  duration: 0,
  volume: 1,
  variants: [],
  setVariants: (variants: AnimeSongWithImage[]) => set({ variants }),
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

  // Nuevos estados
  savedTime: 0,
  setSavedTime: (savedTime: number) => set({ savedTime }),
  isChangingFormat: false,
  setIsChangingFormat: (isChangingFormat: boolean) => set({ isChangingFormat }),
  currentTimeLocal: 0,
  setCurrentTimeLocal: (currentTimeLocal: number) => set({ currentTimeLocal }),
  durationLocal: 0,
  setDurationLocal: (durationLocal: number) => set({ durationLocal }),
  isDraggingPlayer: false,
  setIsDraggingPlayer: (isDraggingPlayer: boolean) => set({ isDraggingPlayer }),
  dragOffset: { x: 0, y: 0 },
  setDragOffset: (dragOffset: { x: number; y: number }) => set({ dragOffset }),
  position: { x: 40, y: 160 },
  setPosition: (position: { x: number; y: number }) => set({ position }),

  // Estados del Controls
  isVolumeDragging: false,
  setIsVolumeDragging: (isVolumeDragging: boolean) => set({ isVolumeDragging }),
  dragPosition: 0,
  setDragPosition: (dragPosition: number) => set({ dragPosition }),
}))
