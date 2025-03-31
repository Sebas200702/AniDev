import { create } from 'zustand'

interface UploadImageStore {
  image: string | null
  setImage: (image: string) => void
}

export const useUploadImageStore = create<UploadImageStore>((set) => ({
  image: null,
  setImage: (image) => set({ image }),
}))
