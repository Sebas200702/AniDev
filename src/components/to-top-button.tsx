import { useEffect, useState } from 'react'

export const ToTopButton = () => {
  const [isVisible, setIsVisible] = useState(false)
  const handleClick = () => {
    const app = document.getElementById('app')
    if (!app) return
    app.scrollTo({
      top: 0,
      behavior: 'smooth',
    })
  }
  const showButton = () => {
    const app = document.getElementById('app')
    if (!app) return
    if (app.scrollTop === 0) {
      setIsVisible(false)
      return
    }
    setIsVisible(true)
  }

  useEffect(() => {
    const app = document.getElementById('app')

    if (!app) return
    app.addEventListener('scroll', showButton)
  }, [isVisible])

  return (
    <button
      id="TopButton"
      className={`bg-enfasisColor absolute right-2 bottom-0 z-50 md:right-10 ${isVisible ? 'opacity-100' : 'pointer-events-none opacity-0'} cursor-pointer rounded-t-xl p-4 transition-all duration-300 hover:pb-6`}
      onClick={handleClick}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        className="h-5 w-5"
      >
        <path stroke="none" d="M0 0h24v24H0z" />
        <path d="m7 11 5-5 5 5M7 17l5-5 5 5" />
      </svg>
    </button>
  )
}
