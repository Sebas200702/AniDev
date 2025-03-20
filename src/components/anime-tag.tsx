import { getFilterOfTag } from '@utils/get-filter-of-tag'
import { getTagColor } from '@utils/get-tag-color'

/**
 * Props for the AnimeTag component.
 */
interface Props {
  /**
   * The tag to display.
   */
  tag: string
  /**
   * Optional type of the tag.
   */
  type?: string
  /**
   * Optional additional styles for the tag.
   */
  style?: string
}

/**
 * AnimeTag component displays a tag for an anime.
 *
 * This component takes in props for the tag to display, its type, and additional styles.
 * It links to a search query based on the tag and displays the tag with a color based on its type.
 *
 * @param {Object} props - The props for the component.
 * @param {string} props.tag - The tag to display.
 * @param {string} [props.type] - Optional type of the tag.
 * @param {string} [props.style] - Optional additional styles for the tag.
 */
export const AnimeTag = ({ tag, type, style }: Props) => {
  const tagColor = getTagColor(tag ?? '')
  const filter = getFilterOfTag(tag)

  return (
    <a
      href={`/search?${filter}=${type?.toLowerCase()}`}
      className={`${style ?? 'w-min'} text-sx h-min rounded-sm px-2 py-1 font-medium transition-all duration-200 ease-in-out ${tagColor}`}
      aria-label={`Tag: ${tag}`}
    >
      {tag}
    </a>
  )
}
