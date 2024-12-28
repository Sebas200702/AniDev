import { create } from 'zustand'
import type { Anime } from 'types'

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
