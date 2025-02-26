import { create } from 'zustand'

interface GlobalUserPreferences {
  enfasis: string
  setEnfasis: (color: string) => void
}

export const useGlobalUserPreferences = create<GlobalUserPreferences>(
  (set) => ({
    enfasis: '#0057E7',
    setEnfasis: (color: string) => set({ enfasis: color }),
  })
)
