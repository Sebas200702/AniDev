import { create } from 'zustand'
import type { Collection } from 'types'
interface IndexStore {
  animeBanners: number[]
  collections: Collection[]
  setAnimeBanners: (animeBanners: number[]) => void
  setCollections: (collections: Collection[]) => void
}

export const useIndexStore = create<IndexStore>((set) => ({
  animeBanners: [],
  collections: [],
  setAnimeBanners: (animeBanners) => set({ animeBanners }),
  setCollections: (collections) => set({ collections }),
}))
