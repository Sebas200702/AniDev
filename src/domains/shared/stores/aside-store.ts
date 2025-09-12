import { HomeIcon } from '@shared/components/icons/common/home-icon'
import { CalendarIcon } from '@shared/components/icons/schedule/calendar-icon'
import { UserIcon } from '@shared/components/icons/user/user-icon'

import { MusicIcon } from '@shared/components/icons/music/music-icon'
import { create } from 'zustand'

interface AsideStore {
  isOpen: boolean
  setIsOpen: (isOpen: boolean) => void
  items: { id: string; icon: any; label: string; href: string }[]
  setActiveItem: (activeItem: string) => void
  activeItem: string
}
export const useAsideStore = create<AsideStore>((set) => ({
  isOpen: false,
  setIsOpen: (isOpen) => set({ isOpen }),
  items: [
    { id: 'home', icon: HomeIcon, label: 'Home', href: '/' },
    {
      id: 'schedule',
      icon: CalendarIcon,
      label: 'Schedule',
      href: '/schedule',
    },
    {
      id: 'music',
      icon: MusicIcon,
      label: 'Music',
      href: '/music',
    },
    {
      id: 'profile',
      icon: UserIcon,
      label: 'Profile',
      href: '/profile',
    },
  ],
  setActiveItem: (activeItem) => set({ activeItem }),
  activeItem: 'home',
}))
