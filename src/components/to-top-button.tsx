import { useEffect } from 'react'

export const ToTopButton = () => {
  const handleClick = () => {
    const app = document.getElementById('app')
    if (!app) return
    app.scrollTo({
      top: 0,
      behavior: 'smooth',
    })
  }
  const showButton = () => {
    const TopButton = document.getElementById('TopButton')
    const app = document.getElementById('app')
    if (!app) return
    console.log(app.scrollTop)
    if (app.scrollTop !== 0) {
      TopButton?.classList.replace('hidden', 'flex')
    }
    if (app.scrollTop === 0) {
      TopButton?.classList.replace('flex', 'hidden')
    }
  }

  useEffect(() => {
    const app = document.getElementById('app')

    if (!app) return
    app.addEventListener('scroll', showButton)
  }, [])

  return (
    <button
      id="TopButton"
      className="bg-Complementary absolute right-10 bottom-0 hidden cursor-pointer rounded-t-xl p-4 transition-all duration-300 hover:pb-6"
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
