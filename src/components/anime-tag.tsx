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
 * AnimeTag component displays a clickable tag for an anime with appropriate styling.
 *
 * @description This component renders a tag element that serves as a link to search results
 * filtered by the tag's value. It automatically determines the appropriate color for the tag
 * based on its content using the getTagColor utility. The component also generates the correct
 * filter query parameter using the getFilterOfTag utility to ensure proper search functionality.
 *
 * The tag is styled as a rounded button with appropriate padding and font styling for visual
 * appeal. It includes hover effects through CSS transitions for better user interaction feedback.
 * The component supports customization through an optional style prop that can override the
 * default width setting while maintaining consistent visual appearance.
 *
 * For accessibility, the component includes an appropriate aria-label describing the tag's purpose
 * and content, ensuring screen reader users can understand its function.
 *
 * @param {Props} props - The component props
 * @param {string} props.tag - The tag text to display
 * @param {string} [props.type] - Optional type of the tag used for filtering
 * @param {string} [props.style] - Optional additional styles for the tag
 * @returns {JSX.Element} The rendered tag component with appropriate styling and link behavior
 *
 * @example
 * <AnimeTag tag="Action" type="genre" />
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
