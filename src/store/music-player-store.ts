import { type MediaPlayerInstance } from '@vidstack/react'
import type { AnimeSongWithImage } from 'types'
import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'

interface MusicPlayerStore {
  list: AnimeSongWithImage[]
  currentSongIndex: number
  duration: number
  volume: number
  isControlsVisible: boolean
  src: string
  canPlay: boolean
  setCanPlay: (canPlay: boolean) => void
  setIsControlsVisible: (isVisible: boolean) => void
  setDuration: (duration: number) => void
  setVolume: (volume: number) => void
  setList: (list: AnimeSongWithImage[]) => void
  isPlaying: boolean
  setIsPlaying: (isPlaying: boolean) => void
  currentTime: number
  playerRef: React.RefObject<MediaPlayerInstance | null>
  setCurrentTime: (currentTime: number) => void
  currentSong: AnimeSongWithImage | null
  setCurrentSong: (currentSong: AnimeSongWithImage | null) => void
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
  setSrc: (src: string) => void
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
  isHidden: boolean
  setIsHidden: (isHidden: boolean) => void
  isVolumeDragging: boolean
  setIsVolumeDragging: (isVolumeDragging: boolean) => void
  dragPosition: number
  setDragPosition: (dragPosition: number) => void
  setPlayerRef: (playerRef: React.RefObject<MediaPlayerInstance | null>) => void
  setCurrentSongIndex: (currentSongIndex: number) => void
}

export const useMusicPlayerStore = create<MusicPlayerStore>()(
  persist(
    (set) => ({
      list: [],
      duration: 0,
      currentSongIndex: 0,
      setCurrentSongIndex: (currentSongIndex: number) => {
        set({ currentSongIndex })
      },
      volume: 1,
      variants: [],
      canPlay: false,
      setCanPlay(canPlay) {
        set({ canPlay })
      },
      src: '',
      playerRef: {
        current: null,
      } as React.RefObject<MediaPlayerInstance | null>,
      isControlsVisible: true,
      setIsControlsVisible: (isVisible: boolean) =>
        set({ isControlsVisible: isVisible }),
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
      setCurrentSong: (currentSong: AnimeSongWithImage | null) =>
        set({ currentSong }),
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
      setSrc(src: string) {
        set({ src })
      },
      savedTime: 0,
      setSavedTime: (savedTime: number) => set({ savedTime }),
      isChangingFormat: false,
      setIsChangingFormat: (isChangingFormat: boolean) =>
        set({ isChangingFormat }),
      currentTimeLocal: 0,
      setCurrentTimeLocal: (currentTimeLocal: number) =>
        set({ currentTimeLocal }),
      durationLocal: 0,
      setDurationLocal: (durationLocal: number) => set({ durationLocal }),
      isDraggingPlayer: false,
      setIsDraggingPlayer: (isDraggingPlayer: boolean) =>
        set({ isDraggingPlayer }),
      dragOffset: { x: 0, y: 0 },
      setDragOffset: (dragOffset: { x: number; y: number }) =>
        set({ dragOffset }),
      position: { x: 40, y: 160 },
      setPosition: (position: { x: number; y: number }) => set({ position }),
      isHidden: false,
      setIsHidden: (isHidden: boolean) => set({ isHidden }),
      isVolumeDragging: false,
      setIsVolumeDragging: (isVolumeDragging: boolean) =>
        set({ isVolumeDragging }),
      dragPosition: 0,
      setDragPosition: (dragPosition: number) => set({ dragPosition }),
      setPlayerRef(playerRef) {
        set({ playerRef })
      },
    }),
    {
      name: 'music-player-session',
      storage: createJSONStorage(() => sessionStorage),

      partialize: (state) => ({
        volume: state.volume,
        repeat: state.repeat,
        shuffle: state.shuffle,
        type: state.type,
        position: state.position,
        isMinimized: state.isMinimized,
        currentSong: state.currentSong,
        list: state.list,
        savedTime: state.savedTime,
      }),
    }
  )
)
