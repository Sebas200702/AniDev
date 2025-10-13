import type { IconProps } from '@shared/types'

/**
 * UserIcon component renders an icon representing a user or profile.
 *
 * @description This component displays a stylized user silhouette icon that visually represents
 * a user profile or account. The SVG icon features a recognizable human figure with a head and
 * body outline, making it intuitive for users to identify user-related functionality or profile
 * sections within the interface.
 *
 * The icon inherits the current text color through the "currentColor" setting, allowing it
 * to adapt to various UI color schemes seamlessly. The SVG paths are structured to create
 * a clear visual representation that works well at different sizes while maintaining visual clarity.
 *
 * This icon is typically used in navigation menus, user profile sections, account management
 * interfaces, or anywhere that user-related functionality needs to be represented visually.
 *
 * @param {IconProps} props - The component props
 * @param {string} [props.style] - Optional class name for custom styling of the SVG element
 * @returns {JSX.Element} The rendered user icon SVG
 *
 * @example
 * <UserIcon className="w-6 h-6 text-gray-500" />
 */
export const UserIcon = ({ className }: IconProps) => (
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
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
)
