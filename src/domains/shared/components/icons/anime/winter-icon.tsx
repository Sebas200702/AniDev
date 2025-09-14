import type { IconProps } from '@shared/types'
/**
 * WinterIcon component renders an icon representing the winter season.
 *
 * @description This component displays a snowflake icon that visually represents the winter season
 * in anime seasonal categorization. The SVG icon features a detailed snowflake design with multiple
 * symmetrical arms, making it intuitive for users to identify winter-related content. The component
 * is designed to be lightweight and adaptable to different UI contexts through customizable styling.
 *
 * The icon inherits the current text color through the "currentColor" setting, allowing it
 * to adapt to various UI color schemes seamlessly. The SVG paths are structured to create
 * a clear visual representation of a snowflake that works well at different sizes while
 * maintaining visual clarity.
 *
 * This icon is typically used in seasonal anime navigation, filtering interfaces, or
 * anywhere that winter season content needs to be represented visually.
 *
 * @param {Object} props - The component props
 * @param {string} [props.className] - Optional class name for custom styling of the SVG element
 * @returns {JSX.Element} The rendered winter season icon SVG
 *
 * @example
 * <WinterIcon className="w-6 h-6 text-blue-300" />
 */
export const WinterIcon = ({ className }: IconProps) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      className={className}
    >
      <path stroke="none" d="M0 0h24v24H0z" />
      <path d="m10 4 2 1 2-1" />
      <path d="M12 2v6.5l3 1.72M17.928 6.268l.134 2.232 1.866 1.232" />
      <path d="m20.66 7-5.629 3.25.01 3.458M19.928 14.268 18.062 15.5l-.134 2.232" />
      <path d="m20.66 17-5.629-3.25-2.99 1.738M14 20l-2-1-2 1" />
      <path d="M12 22v-6.5l-3-1.72M6.072 17.732 5.938 15.5l-1.866-1.232" />
      <path d="m3.34 17 5.629-3.25-.01-3.458M4.072 9.732 5.938 8.5l.134-2.232" />
      <path d="m3.34 7 5.629 3.25 2.99-1.738" />
    </svg>
  )
}
