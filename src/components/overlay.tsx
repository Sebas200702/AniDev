/**
 * Overlay component displays a semi-transparent overlay that can be styled.
 *
 * @description This component provides a customizable semi-transparent overlay that can be placed
 * over other content. It supports additional className props for custom styling and positioning.
 * The overlay has built-in transition effects with smooth animation properties for fading in and out.
 * It uses a transparent gradient as its base style and positions itself absolutely to cover the
 * bottom portion of its container element.
 *
 * The component is designed to be lightweight and reusable across different contexts where
 * overlays are needed, such as image cards, banners, or modal backgrounds. The transition
 * properties allow for smooth visual effects when the overlay appears or disappears.
 *
 * @param {Props} props - The component props
 * @param {string} [props.className] - Optional additional classes for styling the overlay
 * @returns {JSX.Element} The rendered overlay div with applied styles and transitions
 *
 * @example
 * <Overlay className="bg-gradient-to-t from-black/80 h-1/2" />
 */
interface Props {
  className?: string
}
export const Overlay = ({ className }: Props) => {
  return (
    <div
      className={`absolute right-0 bottom-0 left-0 from-transparent ${className} transition-all duration-300 ease-in-out pointer-events-none`}
    />
  )
}
