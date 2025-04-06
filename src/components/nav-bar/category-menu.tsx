import { useEffect, useRef, useState } from 'react'
import { AnimeGenres } from 'types'

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
    <div className=" text-m" ref={menuRef}>
      <button
        className="flex items-center gap-4 text-white rounded-md p-2 duration-200"
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
        className={`absolute  w-48 max-h-72 overflow-y-auto top-16 flex flex-col gap-2 bg-Primary-950/60  custom-scrollbar rounded-b-md shadow-lg backdrop-blur-sm transition-all duration-200 ease-in-out ${
          isOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
        }`}
        role="menu"
        aria-orientation="vertical"
      >
        {Object.values(AnimeGenres).map((genre) => (
          <li key={genre} className="hover:bg-Complementary/20">
            <a
              href={`/search?genre_filter=${genre.toLowerCase()}`}
              className="block px-6 py-2  text-white hover:bg-Complementary/20 hover:text-enfasisColor transition-colors duration-200 focus:outline-none focus:bg-Complementary/30"
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
