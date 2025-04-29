import { useEffect, useRef, useState } from 'react'
import { AnimeGenres } from 'types'

/**
 * CategoryMenu component provides a dropdown menu for anime genre filtering.
 *
 * @description This component renders a button that toggles a dropdown menu containing
 * all available anime genres. When clicked, it displays a scrollable list of genres
 * that users can select to filter anime content. The menu includes smooth animations
 * for opening and closing, and handles clicks outside the menu to close it automatically.
 *
 * The component uses a backdrop blur effect for the dropdown menu to create a modern,
 * semi-transparent appearance that matches the application's design system. Each genre
 * in the list is clickable and navigates to the search page with the selected genre
 * as a filter parameter.
 *
 * The menu is fully responsive and includes proper ARIA attributes for accessibility.
 * It also features a rotating arrow icon that indicates the menu's open/closed state.
 *
 * @returns {JSX.Element} The rendered category menu with dropdown functionality
 *
 * @example
 * <CategoryMenu />
 */
export const CategoryMenu = () => {
  const [isOpen, setIsOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  const handleCloseMenu = () => {
    setIsOpen(false)
  }

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        handleCloseMenu()
      }
    }
    window.addEventListener('click', handleClickOutside)
    return () => {
      window.removeEventListener('click', handleClickOutside)
    }
  }, [])

  return (
    <div className="text-m" ref={menuRef}>
      <button
        className="flex items-center gap-4 rounded-md text-white duration-200"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        Categories
        <svg
          fill="none"
          className={`h-4 w-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
          strokeWidth="2"
          stroke="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      <ul
        className={`bg-Primary-950/60 custom-scrollbar top-16 flex max-h-72 flex-col gap-2 overflow-y-auto rounded-b-md shadow-lg backdrop-blur-md transition-all duration-300 ease-in-out md:absolute ${
          isOpen ? 'visible h-72 opacity-100' : 'invisible h-0 opacity-0'
        }`}
        role="menu"
        aria-orientation="vertical"
      >
        {Object.values(AnimeGenres).map((genre) => (
          <li key={genre} className="hover:bg-Complementary/20">
            <a
              href={`/search?genre_filter=${genre.toLowerCase()}`}
              className="hover:bg-Complementary/20 hover:text-enfasisColor focus:bg-Complementary/30 block px-6 py-2 text-white transition-colors duration-200 focus:outline-none"
              role="menuitem"
            >
              {genre}
            </a>
          </li>
        ))}
      </ul>
    </div>
  )
}
