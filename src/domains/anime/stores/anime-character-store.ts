import type { Character } from 'types'
import { create } from 'zustand'

interface CharacterStore {
  characters: Character[]
  currentLanguage: string
  isLoading: boolean
  setCharacters: (characters: Character[]) => void
  setCurrentLanguage: (language: string) => void
  setIsLoading: (isLoading: boolean) => void
}

export const useCharacterStore = create<CharacterStore>((set) => ({
  characters: [],
  currentLanguage: 'Japanese',
  isLoading: false,
  setCharacters: (characters) => set({ characters }),
  setCurrentLanguage: (language) => set({ currentLanguage: language }),
  setIsLoading: (isLoading) => set({ isLoading }),
}))
