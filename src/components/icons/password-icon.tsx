import type { IconProps } from "types"

/**
 * PasswordIcon component renders an icon representing a password or security input.
 *
 * @description This component displays a lock icon with a keyhole design that visually represents
 * password fields or security-related functionality. The SVG icon features a recognizable padlock shape
 * with a circular keyhole, making it intuitive for users to identify password-related elements.
 *
 * The icon inherits the current text color through the "currentColor" setting, allowing it
 * to adapt to various UI color schemes seamlessly. The SVG paths are structured to create
 * a clear visual representation of a lock that works well at different sizes while
 * maintaining visual clarity.
 *
 * This icon is typically used in login forms, password reset interfaces, or anywhere that
 * password or security information needs to be visually represented. The component is fully
 * customizable through the className prop to match different design requirements.
 *
 * @param {IconProps} props - Component props
 * @param {string} [props.className] - Optional class name for custom styling of the SVG element
 * @returns {JSX.Element} The rendered lock icon SVG representing password functionality
 *
 * @example
 * <PasswordIcon className="w-6 h-6 text-gray-500" />
 */
export const PasswordIcon = ({ className }: IconProps) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      viewBox="0 0 24 24"
    >
      <path d="M0 0h24v24H0z" stroke="none"></path>
      <path d="M5 13a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-6z"></path>
      <path d="M11 16a1 1 0 1 0 2 0 1 1 0 0 0-2 0M8 11V7a4 4 0 1 1 8 0v4"></path>
    </svg>
  )
}
