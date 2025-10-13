import type { IconProps } from '@shared/types'
/**
 * CollectionIcon component renders an icon representing a collection or folder.
 *
 * @description This component displays a folder icon that visually represents a collection
 * of items. The SVG icon features a recognizable folder shape with a tab, making it intuitive
 * for users to identify collection-related functionality. The component is designed to be
 * lightweight and adaptable to different UI contexts through customizable styling.
 *
 * The icon inherits the current text color through the "currentColor" setting, allowing it
 * to adapt to various UI color schemes seamlessly. The SVG paths are structured to create
 * a clear visual representation of a folder that works well at different sizes while
 * maintaining visual clarity.
 *
 * This icon is typically used in navigation menus, content organization interfaces, or
 * anywhere that collections or groupings of content need to be represented visually.
 *
 * @param {IconProps} props - The component props
 * @param {string} [props.className] - Optional class name for custom styling of the SVG element
 * @returns {JSX.Element} The rendered folder icon SVG
 *
 * @example
 * <CollectionIcon className="w-6 h-6 text-gray-500" />
 */
export const CollectionIcon = ({ className }: IconProps) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
      <path d="M5 4h4l3 3h7a2 2 0 0 1 2 2v8a2 2 0 0 1 -2 2h-14a2 2 0 0 1 -2 -2v-11a2 2 0 0 1 2 -2" />
    </svg>
  )
}
