import type { IconProps } from 'types'
import { typeColors } from '@utils/type-colors'

interface TypeIconProps extends IconProps {
  type: string
}

/**
 * TypeIcon component renders an icon representing the anime type with appropriate color styling.
 *
 * @description This component displays an SVG icon that visually represents different anime types
 * such as TV, Movie, OVA, etc. The icon is styled with a color that corresponds to the specific
 * anime type, making it easy for users to quickly identify content categories through visual cues.
 *
 * The component uses the typeColors utility function to determine the appropriate color class
 * based on the provided type parameter. The SVG paths create a recognizable icon that resembles
 * a media or content type indicator, with details that suggest a video or broadcast format.
 *
 * The icon inherits the current text color through the "currentColor" setting and can be
 * further customized through the optional className prop. This allows the icon to integrate
 * seamlessly with various UI themes while maintaining the type-specific color accent.
 *
 * @param {TypeIconProps} props - The component props
 * @param {string} props.type - The anime type (TV, Movie, OVA, etc.) that determines the icon color
 * @param {string} [props.className] - Optional class name for additional styling of the SVG element
 * @returns {JSX.Element} The rendered type icon SVG with appropriate color styling
 *
 * @example
 * <TypeIcon type="TV" className="w-6 h-6" />
 */
export const TypeIcon = ({ className, type }: TypeIconProps) => {
  const color = typeColors(type)
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
      className={`${className} ${color}`}
    >
      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
      <path d="M3 7m0 2a2 2 0 0 1 2 -2h14a2 2 0 0 1 2 2v9a2 2 0 0 1 -2 2h-14a2 2 0 0 1 -2 -2z" />
      <path d="M16 3l-4 4l-4 -4" />
      <path d="M15 7v13" />
      <path d="M18 15v.01" />
      <path d="M18 12v.01" />
    </svg>
  )
}
