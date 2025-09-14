import type { IconProps } from '@shared/types'

/**
 * IdIcon component renders an icon representing an ID.
 *
 * @description This component displays an identification icon using SVG paths to create a visually
 * recognizable symbol. The icon features a circular design with an ID badge representation inside,
 * making it suitable for user identification, profile sections, or any ID-related functionality
 * in the interface.
 *
 * The component uses standard SVG structure with appropriate viewBox and stroke settings to
 * ensure consistent rendering across different sizes. The icon inherits the current text color
 * through the "currentColor" setting, allowing it to adapt to various UI color schemes without
 * modification.
 *
 * The SVG paths create a circular border with internal elements that form a recognizable ID
 * representation, including a small circle and checkmark-like elements that suggest verification
 * or authentication.
 *
 * @param {IconProps} props - Component props
 * @param {string} [props.className] - Optional class name for styling the SVG element
 * @returns {JSX.Element} The rendered ID icon SVG
 *
 * @example
 * <IdIcon className="w-6 h-6 text-gray-500" />
 */
export const IdIcon = ({ className }: IconProps) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
      <path d="M14 10m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0" />
      <path d="M21 12a9 9 0 1 1 -18 0a9 9 0 0 1 18 0z" />
      <path d="M12.5 11.5l-4 4l1.5 1.5" />
      <path d="M12 15l-1.5 -1.5" />
    </svg>
  )
}
