import { AnimeCollection } from '@components/index/collections/anime-colection'
import { useWindowWidth } from '@store/window-width'

interface Props {
  id: number
}

export const ColectionList = ({ id }: Props) => {
  const { width: windowWidth } = useWindowWidth()
  let colectionLength
  if (windowWidth && windowWidth >= 1280) colectionLength = 4
  else if (windowWidth && windowWidth >= 768) colectionLength = 2
  else colectionLength = 1

  return (
    <ul className="fade-out flex flex-row gap-8 p-4 md:px-20">
      {Array.from({ length: colectionLength }).map((_, index) => (
        <AnimeCollection key={index + 1} id={`${id}-${index + 1}`} />
      ))}
    </ul>
  )
}
