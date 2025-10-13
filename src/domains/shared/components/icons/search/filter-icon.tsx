import type { IconProps } from '@shared/types'

/**
 * FilterIcon component renders an icon representing a filter.
 *
 * @description This component displays a funnel-shaped filter icon that visually represents
 * filtering functionality. The SVG icon features a recognizable filter shape, making it intuitive
 * for users to identify filter-related functionality in the interface. The component is designed
 * to be lightweight and adaptable to different UI contexts through customizable styling.
 *
 * The icon inherits the current text color through the "currentColor" setting, allowing it
 * to adapt to various UI color schemes seamlessly. The SVG paths are structured to create
 * a clear visual representation of a filter that works well at different sizes while
 * maintaining visual clarity.
 *
 * This icon is typically used in search interfaces, data tables, or anywhere that content
 * filtering functionality needs to be represented visually.
 *
 * @param {IconProps} props - The component props
 * @param {string} [props.className] - Optional class name for custom styling of the SVG element
 * @returns {JSX.Element} The rendered filter icon SVG
 *
 * @example
 * <FilterIcon className="w-6 h-6 text-gray-500" />
 */
export const FilterIcon = ({ className }: IconProps) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      viewBox="0 0 24 24"
    >
      <path d="M0 0h24v24H0z" stroke="none" />
      <path d="M4 4h16v2.172a2 2 0 0 1-.586 1.414L15 12v7l-6 2v-8.5L4.52 7.572A2 2 0 0 1 4 6.227V4z" />
    </svg>
  )
}
