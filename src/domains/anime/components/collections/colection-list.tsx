import { AnimeCollection } from 'domains/anime/components/collections/anime-colection'
import { useWindowWidth } from '@store/window-width'

interface Props {
  id: number
}

/**
 * CollectionList component displays a horizontally scrollable list of anime collections.
 *
 * @description This component renders multiple AnimeCollection components in a responsive
 * horizontal layout. The number of collections displayed adapts to the screen size, with
 * 4 collections on large screens (≥1280px), 2 on medium screens (≥768px), and 1 on small
 * screens. Each collection is assigned a unique identifier derived from the base ID.
 *
 * The component uses the useWindowWidth hook to determine the current viewport width and
 * dynamically adjust the number of collections shown. This responsive approach ensures
 * optimal content display across different devices while maintaining performance.
 *
 * The collections are arranged horizontally with consistent spacing and padding, creating
 * a visually balanced presentation. Each AnimeCollection component operates independently,
 * fetching and caching its own data based on its unique ID.
 *
 * @param {Props} props - The component props
 * @param {number} props.id - The base ID used to generate unique IDs for each collection
 * @returns {JSX.Element} The rendered horizontal list of anime collections
 *
 * @example
 * <ColectionList id={1} />
 */
export const ColectionList = ({ id }: Props) => {
  const { width: windowWidth } = useWindowWidth()
  let colectionLength

  if (windowWidth && windowWidth >= 1920) colectionLength = 4
  else if (windowWidth && windowWidth >= 1280) colectionLength = 3
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
