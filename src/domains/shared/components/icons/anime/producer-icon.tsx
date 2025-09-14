import type { IconProps } from '@shared/types'

/**
 * ProducerIcon component renders an icon representing a producer or production company.
 *
 * @description This component displays an SVG icon that visually represents a film or media producer.
 * The icon features a simplified film clapperboard design with horizontal bars and diagonal lines,
 * making it recognizable as a production-related symbol. The component is designed to be lightweight
 * and adaptable to different UI contexts through customizable styling.
 *
 * The icon inherits the current text color through the "currentColor" setting, allowing it
 * to adapt to various UI color schemes seamlessly. The SVG paths are structured to create
 * a clear visual representation that works well at different sizes while maintaining visual clarity.
 *
 * This icon is typically used in anime details pages, credits sections, or anywhere that production
 * companies or producers need to be represented visually in the interface.
 *
 * @param {IconProps} props - The component props
 * @param {string} [props.className] - Optional class name for custom styling of the SVG element
 * @returns {JSX.Element} The rendered producer icon SVG
 *
 * @example
 * <ProducerIcon className="w-6 h-6 text-gray-500" />
 */
export const ProducerIcon = ({ className }: IconProps) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
      <path d="M6 21l12 -9" />
      <path d="M6 12l12 9" />
      <path d="M5 12h14" />
      <path d="M6 3v9" />
      <path d="M18 3v9" />
      <path d="M6 8h12" />
      <path d="M6 5h12" />
    </svg>
  )
}
