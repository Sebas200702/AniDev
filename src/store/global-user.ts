import { create } from 'zustand'

interface GlobalUserPreferences {
  enfasis: string
  setEnfasis: (color: string) => void
}

export const useGlobalUserPreferences = create<GlobalUserPreferences>(
  (set) => ({
    enfasis: '#3b82f6',
    setEnfasis: (color: string) => set({ enfasis: color }),
  })
)
