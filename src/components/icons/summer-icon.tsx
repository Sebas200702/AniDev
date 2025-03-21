import type { IconProps } from 'types'

/**
 * SummerIcon component renders a sun icon with radiating beams.
 *
 * @description This component displays a stylized sun icon that represents summer or sunny weather.
 * The SVG icon features a central circle representing the sun with radiating beams extending outward
 * in cardinal and diagonal directions. The icon is designed to be lightweight and adaptable to
 * different UI contexts through customizable styling.
 *
 * The icon inherits the current text color through the "currentColor" setting, allowing it
 * to adapt to various UI color schemes seamlessly. The SVG paths are structured to create
 * a clear visual representation of a sun that works well at different sizes while
 * maintaining visual clarity.
 *
 * This icon is typically used in weather applications, seasonal displays, or anywhere that
 * summer or sunny conditions need to be represented visually.
 *
 * @param {IconProps} props - The component props
 * @param {string} [props.className] - Optional class name for custom styling of the SVG element
 * @returns {JSX.Element} The rendered sun icon SVG
 *
 * @example
 * <SummerIcon className="w-6 h-6 text-yellow-500" />
 */
export const SummerIcon = ({ className }: IconProps) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      className={className}
    >
      <path stroke="none" d="M0 0h24v24H0z" />
      <path d="M8 12a4 4 0 1 0 8 0 4 4 0 1 0-8 0M3 12h1m8-9v1m8 8h1m-9 8v1M5.6 5.6l.7.7m12.1-.7-.7.7m0 11.4.7.7m-12.1-.7-.7.7" />
    </svg>
  )
}
