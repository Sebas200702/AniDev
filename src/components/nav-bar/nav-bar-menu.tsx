import { CalendarIcon } from '@components/icons/calendar-icon'
import { useState } from 'react'
import { CategoryMenu } from './category-menu'

/**
 * NavBarMenu component provides the main navigation menu for the application.
 *
 * @description This component renders a responsive navigation menu that adapts to different screen sizes.
 * On mobile devices, it displays a hamburger menu that can be toggled to show/hide the navigation items.
 * On desktop, it shows a horizontal menu with direct access to key features.
 *
 * The component includes navigation links to important sections like the Schedule and Categories.
 * It integrates with the CategoryMenu component to provide genre-based navigation. The menu features
 * smooth transitions and animations for opening/closing on mobile devices, with proper handling of
 * pointer events to ensure optimal user interaction.
 *
 * The mobile version includes a hamburger menu icon that transforms into a close icon when the menu
 * is open, providing clear visual feedback to users. The desktop version maintains a consistent
 * horizontal layout with proper spacing and alignment of navigation items.
 *
 * @returns {JSX.Element} The rendered navigation menu with responsive behavior
 *
 * @example
 * <NavBarMenu />
 */
export const NavBarMenu = () => {
  const [isOpen, setIsOpen] = useState(false)
  const toggleMenu = () => {
    setIsOpen(!isOpen)
  }
  return (
    <div className="flex items-center justify-center mx-auto bg-Complementary/60  backdrop-blur-sm rounded-full z-50 px-2">
      <button className="cursor-pointer md:hidden  " onClick={toggleMenu}>
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
        className={`bg-Complementary/60 absolute inset-0 z-40 flex h-16 flex-row items-center gap-4 p-4 text-white transition-all duration-300 md:static md:bg-transparent ${isOpen ? 'opacity-100' : 'pointer-events-none opacity-0 md:pointer-events-auto md:opacity-100'}`}
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
