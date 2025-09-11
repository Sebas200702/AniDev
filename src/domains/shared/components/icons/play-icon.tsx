import type { IconProps } from 'types'
/**
 * PlayIcon component renders an icon representing play functionality.
 *
 * @description This component displays a triangular play button icon commonly used in media players
 * and video interfaces. The SVG icon is designed with clean lines and a recognizable play symbol
 * that users intuitively associate with starting or resuming playback of audio or video content.
 *
 * The icon inherits the current text color through the "currentColor" setting, allowing it
 * to adapt to various UI color schemes seamlessly. The SVG paths are structured to create
 * a clear visual representation that works well at different sizes while maintaining visual clarity.
 *
 * The component accepts a className prop that allows for custom styling, positioning, and sizing
 * of the icon to fit various design requirements. This flexibility makes it suitable for use
 * in buttons, media controls, or as a standalone interactive element.
 *
 * @param {IconProps} props - The component props
 * @param {string} props.className - Class name for custom styling of the SVG element
 * @returns {JSX.Element} The rendered play icon SVG
 *
 * @example
 * <PlayIcon className="w-6 h-6 text-white" />
 */
export const PlayIcon = ({ className }: IconProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    className={className}
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    viewBox="0 0 24 24"
  >
    <path d="M0 0h24v24H0z" stroke="none" />
    <path d="M7 4v16l13-8z" />
  </svg>
)
