import { create } from 'zustand'

interface IndexStore {
  animeBanners: number[]
  setAnimeBanners: (animeBanners: number[]) => void
}

export const useIndexStore = create<IndexStore>((set) => ({
  animeBanners: [],
  setAnimeBanners: (animeBanners) => set({ animeBanners }),
}))
