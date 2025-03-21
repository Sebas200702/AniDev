import type { Anime } from 'types'
/**
 * CarouselStore manages state for the anime carousel component.
 *
 * @description This store manages the state for the carousel component that displays featured anime content.
 * It handles URL management, banner data, loading states, current index tracking, and animation effects.
 * The store provides a centralized way to manage carousel state across components, enabling smooth
 * transitions and interactions.
 *
 * The store maintains several key pieces of state:
 * - URL for data fetching
 * - Banners array containing anime data to display
 * - Loading state to track data fetching progress
 * - Current index to track which banner is being displayed
 * - Fade-in state for controlling animation effects
 *
 * Each state value has a corresponding setter function that allows components to update the state
 * in a controlled manner, ensuring consistency throughout the application.
 *
 * @example
 * const { banners, loading, currentIndex, setCurrentIndex } = useCarouselStore();
 */
import { create } from 'zustand'

interface CarouselStore {
  url: string
  setUrl: (url: string) => void
  banners: Anime[]
  setBanners: (banners: Anime[]) => void
  loading: boolean
  setLoading: (loading: boolean) => void
  currentIndex: number
  setCurrentIndex: (index: number) => void
  fadeIn: boolean
  setFadeIn: (fadeIn: boolean) => void
}

export const useCarouselStore = create<CarouselStore>((set) => ({
  url: '',
  setUrl: (url: string) => set({ url }),
  banners: [],
  setBanners: (banners: Anime[]) => set({ banners }),
  loading: false,
  setLoading: (loading: boolean) => set({ loading }),
  currentIndex: 0,
  setCurrentIndex: (index: number) => set({ currentIndex: index }),
  fadeIn: false,
  setFadeIn: (fadeIn: boolean) => set({ fadeIn }),
}))
