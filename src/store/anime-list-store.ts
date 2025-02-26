import { CharacterIcon } from '@components/icons/character-icon'
import type { Section } from 'types'
import { SynopsisIcon } from '@components/icons/synopsis-icon'
import { TrailerIcon } from '@components/icons/trailer-icon'
import { create } from 'zustand'

interface AnimeListsStore {
  animeList: Section[]
  setAnimeList: (animeList: Section[]) => void
}

export const useAnimeListsStore = create<AnimeListsStore>((set) => ({
  animeList: [
    {
      label: 'synopsis',
      icon: SynopsisIcon,
      selected: true,
    },

    {
      label: 'Trailer',
      icon: TrailerIcon,
      selected: false,
    },
    {
      label: 'Characters',
      icon: CharacterIcon,
      selected: false,
    },
  ],
  setAnimeList: (animeList) => {
    set({ animeList })
  },
}))
