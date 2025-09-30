import { RelatedIcon } from '@shared/components/icons/anime/related-icon'
import { SynopsisIcon } from '@shared/components/icons/anime/synopsis-icon'
import { TrailerIcon } from '@shared/components/icons/anime/trailer-icon'
import { CharacterIcon } from '@shared/components/icons/character/character-icon'
import { MusicIcon } from '@shared/components/icons/music/music-icon'
import type { Section } from '@shared/types'
import { create } from 'zustand'

/**
 * AnimeListsStore provides state management for anime section navigation.
 *
 * @description This store manages the state of different anime information sections like Synopsis,
 * Trailer, and Characters. It maintains which section is currently selected and provides a method
 * to update the selection state. The store uses Zustand for efficient state management with minimal
 * re-renders.
 *
 * The store initializes with a default set of sections where Synopsis is selected by default.
 * Each section contains a label, an associated icon component, and a selected state flag.
 * The setAnimeList method allows components to update the entire list of sections, typically
 * used when changing which section is selected.
 *
 * Components can subscribe to this store to access the current navigation state and
 * respond to user interactions by updating the selected section.
 *
 * @interface AnimeListsStore
 * @property {Section[]} animeList - Array of section objects with label, icon, and selected state
 * @property {Function} setAnimeList - Method to update the anime sections list
 *
 * @example
 * const { animeList, setAnimeList } = useAnimeListsStore();
 * const updateSelection = (sectionLabel) => {
 *   const updatedList = animeList.map(section => ({
 *     ...section,
 *     selected: section.label === sectionLabel
 *   }));
 *   setAnimeList(updatedList);
 * };
 */
interface AnimeListsStore {
  animeList: Section[]
  setAnimeList: (animeList: Section[]) => void
}

export const useAnimeListsStore = create<AnimeListsStore>((set) => ({
  animeList: [
    {
      label: 'Synopsis',
      icon: SynopsisIcon,
      selected: true,
    },
    {
      label: 'Characters',
      icon: CharacterIcon,
      selected: false,
    },
    {
      label: 'Related',
      icon: RelatedIcon,
      selected: false,
    },
    {
      label: 'Music',
      icon: MusicIcon,
      selected: false,
    },

    {
      label: 'Trailer',
      icon: TrailerIcon,
      selected: false,
    },
  ],
  setAnimeList: (animeList) => {
    set({ animeList })
  },
}))
