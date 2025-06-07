import { CalendarIcon } from '@icons/calendar-icon'
import { HomeIcon } from '@icons/home-icon'
import { UserIcon } from '@icons/user-icon'
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
      id: 'profile',
      icon: UserIcon,
      label: 'Profile',
      href: '/profile',
    },
  ],
  setActiveItem: (activeItem) => set({ activeItem }),
  activeItem: 'home',
}))
