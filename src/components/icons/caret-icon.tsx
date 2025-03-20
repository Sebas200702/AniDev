/**
 * CaretIcon component renders a caret icon for indicating direction.
 *
 * This component accepts a className prop for custom styling.
 *
 * @param {Object} props
 * @param {string} [props.className] - Optional class name for custom styling.
 */
export const CaretIcon = ({ className }: { className?: string }) => {
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
      <path d="M0 0h24v24H0z" stroke="none" />
      <path d="m6 10 6 6 6-6H6" />
    </svg>
  )
}
