import { CalendarIcon } from '@components/icons/calendar-icon'
import { useState } from 'react'
import { CategoryMenu } from './category-menu'
export const NavBarMenu = () => {
  const [isOpen, setIsOpen] = useState(false)
  const toggleMenu = () => {
    setIsOpen(!isOpen)
  }
  return (
    <div className="flex  items-center justify-between ">
      <button className="md:hidden cursor-pointer" onClick={toggleMenu}>
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
          <path d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>
      <ul
        className={`flex items-center  flex-row gap-4 inset-0 p-4 transition-all duration-300 bg-Complementary md:bg-transparent z-40  h-16 absolute md:static text-white ${isOpen ? 'opacity-100' : 'opacity-0 md:opacity-100 pointer-events-none md:pointer-events-auto'}`}
      >
        <button className="md:hidden cursor-pointer" onClick={toggleMenu}>
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
          className="text-m flex flex-row gap-2 items-center justify-center"
        >
          <CalendarIcon className="h-5 w-5" />
          Schedule
        </a>
        <CategoryMenu />
      </ul>
    </div>
  )
}
