import type { IconProps } from 'types'

/**
 * CloseIcon component renders an X-shaped close button icon.
 *
 * @description
 * This component renders a simple SVG icon representing a close or dismiss action.
 * The icon consists of two diagonal lines forming an X shape. It uses the current
 * text color through the `currentColor` value and supports custom styling through
 * the className prop.
 *
 * The icon is designed to be minimal and clear, with rounded line caps and joins
 * for a polished appearance. It maintains a consistent 24x24 viewport and uses
 * a 2px stroke width for optimal visibility at various sizes.
 *
 * @param {IconProps} props - The component props
 * @param {string} [props.className] - Optional additional CSS classes for styling
 * @returns {JSX.Element} The rendered close icon SVG
 *
 * @example
 * <CloseIcon className="w-6 h-6 text-red-500" />
 */
interface Props extends IconProps {
  styles?: string
}
export const CloseIcon = ({ className, styles }: Props) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={`${className} ${styles}`}
    >
      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
      <path d="M18 6l-12 12" />
      <path d="M6 6l12 12" />
    </svg>
  )
}
