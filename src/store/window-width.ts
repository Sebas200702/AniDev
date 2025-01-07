import { create } from 'zustand'

interface WindowWidth {
  width: number | null
  setWidth: (width: number | null) => void
}

export const useWindowWidth = create<WindowWidth>((set) => ({
  width: null,
  setWidth: (width) => set({ width }),
}))
