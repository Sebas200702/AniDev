import { AnimeCollection } from '@components/anime-colection'
import { useWindowWidth } from '@store/window-width'
import { useEffect } from 'react'

export const ColectionList = () => {
  const { width: windowWidth, setWidth: setWindowWidth } = useWindowWidth()

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth)
    setWindowWidth(window.innerWidth)
    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [setWindowWidth])

  const colectionLength = windowWidth && windowWidth / 390

  return (
    <ul className="flex flex-row gap-8 p-4">
      {Array.from({ length: colectionLength ?? 1 }).map((_, index) => (
        <AnimeCollection key={index + 1} />
      ))}
    </ul>
  )
}
