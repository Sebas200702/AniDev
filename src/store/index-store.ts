import type { Collection } from 'types'
import { create } from 'zustand'

/**
 * IndexStore interface defines the global state for the index page.
 *
 * @description This store manages shared state across index page components including
 * anime banners and collections data. It provides methods to update these states
 * which are used by various components to maintain consistency across the application.
 *
 * The store tracks unique anime banner IDs to prevent duplicates when displaying
 * featured content. It also maintains collections data which can be accessed by
 * multiple components without requiring prop drilling or repeated API calls.
 *
 * The implementation uses Zustand for state management, providing a lightweight
 * and performant solution with a simple API for components to interact with.
 *
 * @property {number[]} animeBanners - Array of anime IDs used in banners to track uniqueness
 * @property {Collection[]} collections - Array of anime collections data
 * @property {Function} setAnimeBanners - Function to update the animeBanners state
 * @property {Function} setCollections - Function to update the collections state
 *
 * @example
 * const { collections, setCollections } = useIndexStore()
 * setCollections([newCollection])
 */
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
