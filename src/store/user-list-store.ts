import { CollectionIcon } from 'domains/shared/components/icons/collection-icon'
import { CompletedIcon } from 'domains/shared/components/icons/completed-icon'
import { ToWatchIcon } from 'domains/shared/components/icons/to-watch-icon'
import { WatchingIcon } from 'domains/shared/components/icons/watch-icon'
import type { Section } from 'types'
import { create } from 'zustand'

/**
 * UserListsStore provides state management for user anime list sections.
 *
 * @description This store manages the state of different user anime list sections like Collection,
 * Completed, To Watch, and Watching. It maintains which section is currently selected and provides
 * a method to update the selection state. The store uses Zustand for efficient state management
 * with minimal re-renders.
 *
 * The store initializes with a default set of sections where Collection is selected by default.
 * Each section contains a label, an associated icon component, and a selected state flag.
 * The setUserList method allows components to update the entire list of sections, typically
 * used when changing which section is selected.
 *
 * Components can subscribe to this store to access the current navigation state and
 * respond to user interactions by updating the selected section.
 *
 * @interface UserListsStore
 * @property {Section[]} userList - Array of section objects with label, icon, and selected state
 * @property {Function} setUserList - Method to update the user list sections
 *
 * @example
 * const { userList, setUserList } = useUserListsStore();
 * const updateSelection = (sectionLabel) => {
 *   const updatedList = userList.map(section => ({
 *     ...section,
 *     selected: section.label === sectionLabel
 *   }));
 *   setUserList(updatedList);
 * };
 */
interface UserListsStore {
  userList: Section[]
  isLoading: boolean
  isInWatchList: boolean
  setUserList: (userList: Section[]) => void
  setIsLoading: (isLoading: boolean) => void
  setIsInWatchList: (isInWatchList: boolean) => void
}

export const useUserListsStore = create<UserListsStore>((set) => ({
  isLoading: false,
  isInWatchList: false,
  userList: [
    {
      label: 'To Watch',
      icon: ToWatchIcon,
      selected: true,
    },
    {
      label: 'Collection',
      icon: CollectionIcon,
      selected: false,
    },
    {
      label: 'Completed',
      icon: CompletedIcon,
      selected: false,
    },
    {
      label: 'Watching',
      icon: WatchingIcon,
      selected: false,
    },
  ],
  setUserList: (userList) => {
    set({ userList })
  },
  setIsInWatchList: (isInWatchList) => {
    set({ isInWatchList })
  },
  setIsLoading: (isLoading) => {
    set({ isLoading })
  },
}))
