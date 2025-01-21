import { AnimeCollection } from '@components/anime-colection'
import { useWindowWidth } from '@store/window-width'
import { useEffect } from 'react'

interface Props {
  id: number
}

export const ColectionList = ({ id }: Props) => {
  const { width: windowWidth, setWidth: setWindowWidth } = useWindowWidth()

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth)
    setWindowWidth(window.innerWidth)
    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [setWindowWidth])

  let colectionLength
  if (windowWidth && windowWidth >= 1280) colectionLength = 4
  else if (windowWidth && windowWidth >= 768) colectionLength = 3
  else if (windowWidth && windowWidth >= 480) colectionLength = 2
  else colectionLength = 1

  return (
    <ul className="flex flex-row gap-8 p-4">
      {Array.from({ length: colectionLength }).map((_, index) => (
        <AnimeCollection key={index + 1} id={`${id}-${index + 1}`} />
      ))}
    </ul>
  )
}
