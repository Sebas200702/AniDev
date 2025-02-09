import { create } from 'zustand'

import { CollectionIcon } from '@components/icons/collection-icon'
import { CompletedIcon } from '@components/icons/completed-icon'
import { ToWatchIcon } from '@components/icons/to-watch-icon'
import { WatchingIcon } from '@components/icons/watch-icon'

import type { Section } from 'types'
interface UserListsStore {
  userList: Section[]
  setUserList: (userList: Section[]) => void
}

export const useUserListsStore = create<UserListsStore>((set) => ({
  userList: [
    {
      label: 'Collection',
      icon: CollectionIcon,
      selected: true,
    },
    {
      label: 'Completed',
      icon: CompletedIcon,
      selected: false,
    },
    {
      label: 'To Watch',
      icon: ToWatchIcon,
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
}))
