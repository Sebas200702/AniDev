import { Logo } from '@components/logo'
import { useEffect, useState } from 'react'
import { CategoryMenu } from './nav-bar/category-menu'

export const Navigation = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  useEffect(() => {
    window.addEventListener('click', (e) => {
      const target = e.target as HTMLElement
      if (isMobileMenuOpen && !target.closest('.sidebar')) {
        setIsMobileMenuOpen(false)
      }
    })
    return () => {
      window.removeEventListener('click', (e) => {
        const target = e.target as HTMLElement
        if (isMobileMenuOpen && !target.closest('.sidebar')) {
          setIsMobileMenuOpen(false)
        }
      })
    }
  }, [isMobileMenuOpen])

  return (
    <div className="sidebar">
      <button
        className="p-4 md:hidden"
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        aria-label="Toggle Menu"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="text-Primary-50 h-8 w-8"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M3.75 5.25h16.5m-16.5 6h16.5m-16.5 6h16.5"
          />
        </svg>
      </button>

      <aside
        className={`bg-Primary-950 border-Primary-800 fixed top-0 left-0 z-40 h-screen w-64 transform border-r shadow-xl transition-all duration-300 ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'} md:hidden`}
      >
        <div className="border-Primary-800 flex items-center justify-between border-b p-4">
          <Logo />
          <button
            className=""
            onClick={() => setIsMobileMenuOpen(false)}
            aria-label="Close Menu"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="text-Primary-50 h-8 w-8"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
        <nav className="flex h-full flex-col space-y-2 p-4">
          <CategoryMenu />
          <a href="/calendar" className="text-m">
            Calendar
          </a>
        </nav>
      </aside>
    </div>
  )
}
