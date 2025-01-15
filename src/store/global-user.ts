import { create } from 'zustand'

interface GlobalUserPreferences {
  enfasisColor: string
  setEnfasisColor: (color: string) => void
}

export const useGlobalUserPreferences = create<GlobalUserPreferences>(
  (set) => ({
    enfasisColor: '#3b82f6',
    setEnfasisColor: (color: string) => set({ enfasisColor: color }),
  })
)
