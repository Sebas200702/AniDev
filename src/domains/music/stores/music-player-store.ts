import type {
  AnimeSong,
  AnimeSongResolution,
  AnimeSongVersion,
} from '@music/types'
import type { MediaPlayerInstance } from '@vidstack/react'
import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'

interface MusicPlayerStore {
  /* --- DATA --- */
  list: AnimeSong[]
  currentSong: AnimeSong | null
  currentSongIndex: number
  selectedResolutionId: number
  selectedVersion: number
  versions: AnimeSongVersion[]
  resolutions: AnimeSongResolution[]

  /* --- PLAYER STATE --- */
  isPlaying: boolean
  src: string | null
  isLoading: boolean
  canPlay: boolean
  volume: number
  currentTime: number

  duration: number
  repeat: boolean
  type: 'audio' | 'video'
  error: string | null

  /* --- UI --- */
  isControlsVisible: boolean
  isMinimized: boolean
  isHidden: boolean
  position: { x: number; y: number }
  isDragging: boolean
  dragOffset: { x: number; y: number }
  isVolumeDragging: boolean

  /* --- REFS --- */
  playerRef: React.RefObject<MediaPlayerInstance | null>

  /* --- ACTIONS --- */
  setList: (list: AnimeSong[]) => void
  setCurrentSong: (song: AnimeSong | null) => void
  setCurrentSongIndex: (index: number) => void
  setSelectedResolutionId: (id: number) => void
  setSelectedVersion: (version: number) => void
  setVersions: (versions: AnimeSongVersion[]) => void
  setResolutions: (resolutions: AnimeSongResolution[]) => void
  setIsPlaying: (v: boolean) => void
  setIsLoading: (v: boolean) => void
  setSrc: (v: string | null) => void
  setCanPlay: (v: boolean) => void
  setVolume: (v: number) => void
  setCurrentTime: (v: number) => void

  setDuration: (v: number) => void
  setRepeat: (v: boolean) => void

  setType: (v: 'audio' | 'video') => void
  setError: (v: string | null) => void
  setIsControlsVisible: (v: boolean) => void
  setIsMinimized: (v: boolean) => void
  setIsHidden: (v: boolean) => void
  setPosition: (pos: { x: number; y: number }) => void
  setIsDragging: (v: boolean) => void
  setDragOffset: (pos: { x: number; y: number }) => void
  setIsVolumeDragging: (v: boolean) => void
  setPlayerRef: (ref: React.RefObject<MediaPlayerInstance | null>) => void
}

export const useMusicPlayerStore = create<MusicPlayerStore>()(
  persist(
    (set) => ({
      /* --- Default values --- */
      list: [],
      currentSong: null,
      currentSongIndex: 0,
      selectedResolutionId: 0,
      selectedVersion: 1,
      versions: [],
      resolutions: [],

      isPlaying: false,
      src: null,
      isLoading: true,
      canPlay: false,
      volume: 1,
      currentTime: 0,
      savedTime: 0,
      duration: 0,
      repeat: false,
      type: 'audio',
      error: null,

      isControlsVisible: true,
      isHidden: false,
      isMinimized: false,
      position: { x: 40, y: 160 },
      isDragging: false,
      dragOffset: { x: 0, y: 0 },
      isVolumeDragging: false,

      playerRef: { current: null },

      /* --- Actions --- */
      setList: (list) => set({ list }),
      setCurrentSong: (song) => set({ currentSong: song }),
      setCurrentSongIndex: (index) => set({ currentSongIndex: index }),
      setSelectedResolutionId: (id) => set({ selectedResolutionId: id }),
      setSelectedVersion: (version) => set({ selectedVersion: version }),
      setVersions: (versions) => set({ versions }),
      setResolutions: (resolutions) => set({ resolutions }),

      setIsPlaying: (v) => set({ isPlaying: v }),
      setSrc: (v) => set({ src: v }),
      setIsLoading: (v) => set({ isLoading: v }),
      setCanPlay: (v) => set({ canPlay: v }),
      setVolume: (v) => set({ volume: v }),
      setCurrentTime: (v) => set({ currentTime: v }),

      setDuration: (v) => set({ duration: v }),
      setRepeat: (v) => set({ repeat: v }),

      setType: (v) => set({ type: v }),
      setError: (v) => set({ error: v }),
      setIsControlsVisible: (v) => set({ isControlsVisible: v }),
      setIsMinimized: (v) => set({ isMinimized: v }),
      setIsHidden: (v) => set({ isHidden: v }),
      setPosition: (pos) => set({ position: pos }),
      setIsDragging: (v) => set({ isDragging: v }),
      setDragOffset: (pos) => set({ dragOffset: pos }),
      setIsVolumeDragging: (v) => set({ isVolumeDragging: v }),
      setPlayerRef: (ref) => set({ playerRef: ref }),
    }),

    {
      name: 'music-player-session',
      storage: createJSONStorage(() => sessionStorage),
      partialize: (state) => ({
        /* Persist only what matters cross-session */
        volume: state.volume,
        repeat: state.repeat,

        type: state.type,
        position: state.position,
        isMinimized: state.isMinimized,
        isHidden: state.isHidden,
        currentSong: state.currentSong,
        currentSongIndex: state.currentSongIndex,
        selectedVersion: state.selectedVersion,
        selectedResolutionId: state.selectedResolutionId,
        isPlaying: state.isPlaying,
        list: state.list,
      }),
    }
  )
)
