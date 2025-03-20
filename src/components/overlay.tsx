/**
 * Overlay component displays a semi-transparent overlay that can be styled.
 *
 * @param {Object} props - The props for the component.
 * @param {string} [props.className] - Optional additional classes for styling the overlay.
 */
interface Props {
  className?: string
}
export const Overlay = ({ className }: Props) => {
  return (
    <div
      className={`absolute right-0 bottom-0 left-0 from-transparent ${className} transition-all duration-300 ease-in-out`}
    />
  )
}
