import { AnimeCollection } from '@components/anime-colection'
import { useWindowWidth } from '@store/window-width'
import { useEffect } from 'react'
import type { Collection } from 'types'

interface Props {
  collections: Collection[]
}

export const ColectionList = ({ collections }: Props) => {
  const { width: windowWidth, setWidth: setWindowWidth } = useWindowWidth()

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth)
    setWindowWidth(window.innerWidth)
    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [setWindowWidth])



  const colectionLength = windowWidth && windowWidth < 768 ? 1 : windowWidth && windowWidth < 1280 ? 2 : 3

  return (
    <ul className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3 p-6">
      {collections.slice(0, colectionLength).map((collection: Collection) => (
        <AnimeCollection
          key={collection.title}
          title={collection.title}
          query={collection.query}
        />
      ))}
    </ul>
  )
}
