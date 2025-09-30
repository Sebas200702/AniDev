import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'

export interface IndexSection {
  id: number
  title: string
  url: string
  type: 'slider' | 'banner' | 'collection'
}

interface IndexStore {
  sections: IndexSection[]
  setSections: (s: IndexSection[]) => void
  fetchSections: () => Promise<void>
}

export const useHomeStore = create<IndexStore>()(
  persist(
    (set) => ({
      sections: [],
      setSections: (s) => set({ sections: s }),
      fetchSections: async () => {
        try {
          const res = await fetch('/api/home-sections')
          const data = await res.json()
          set({ sections: data })
        } catch (err) {
          console.error('Error fetching sections', err)
        }
      },
    }),
    {
      name: 'home-sections',
      storage: createJSONStorage(() => sessionStorage),
    }
  )
)
