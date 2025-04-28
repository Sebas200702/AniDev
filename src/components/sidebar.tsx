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
          className="w-8 h-8 text-Primary-50"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M3.75 5.25h16.5m-16.5 6h16.5m-16.5 6h16.5"
          />
        </svg>
      </button>

      <aside
        className={`fixed top-0 left-0 h-screen z-40 w-64 transform transition-all duration-300
          bg-Primary-950 border-r border-Primary-800 shadow-xl
          ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'} md:hidden`}
      >
        <div className="flex items-center justify-between p-4 border-b border-Primary-800">
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
              className="w-8 h-8 text-Primary-50"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
        <nav className="space-y-2 h-full flex flex-col p-4">
          <CategoryMenu />
          <a href="/calendar" className="text-m ">
            Calendar
          </a>
        </nav>
      </aside>

      <nav className="hidden md:flex items-center gap-5">
        <CategoryMenu />
        <a href="/calendar" className="text-m w-min">
          Calendar
        </a>
      </nav>
    </div>
  )
}
