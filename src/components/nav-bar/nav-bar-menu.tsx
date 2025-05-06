import { CalendarIcon } from '@components/icons/calendar-icon'
import { useState } from 'react'
import { CategoryMenu } from './category-menu'
export const NavBarMenu = () => {
  const [isOpen, setIsOpen] = useState(false)
  const toggleMenu = () => {
    setIsOpen(!isOpen)
  }
  return (
    <div className="flex items-center justify-between">
      <button className="cursor-pointer md:hidden" onClick={toggleMenu}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          className="h-6 w-6"
        >
          <path stroke="none" d="M0 0h24v24H0z" />
          <path d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>
      <ul
        className={`bg-Complementary absolute inset-0 z-40 flex h-16 flex-row items-center gap-4 p-4 text-white transition-all duration-300 md:static md:bg-transparent ${isOpen ? 'opacity-100' : 'pointer-events-none opacity-0 md:pointer-events-auto md:opacity-100'}`}
      >
        <button className="cursor-pointer md:hidden" onClick={toggleMenu}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
          >
            <path stroke="none" d="M0 0h24v24H0z" />
            <path d="M18 6 6 18M6 6l12 12" />
          </svg>
        </button>
        <a
          href="/schedule"
          className="text-m flex flex-row items-center justify-center gap-2"
        >
          <CalendarIcon className="h-5 w-5" />
          Schedule
        </a>
        <CategoryMenu />
      </ul>
    </div>
  )
}
