/**
 * AiredFromIcon component renders an icon representing the start date an anime aired.
 *
 * This component accepts a className prop to allow for custom styling.
 *
 * @param {Object} props - Component props
 * @param {string} [props.className] - Custom class name for the icon
 */
export const AiredFromIcon = ({ className }: { className?: string }) => {
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
      <path d="M12.5 21h-6.5a2 2 0 0 1 -2 -2v-12a2 2 0 0 1 2 -2h12a2 2 0 0 1 2 2v5" />
      <path d="M19 16v6" />
      <path d="M22 19l-3 3l-3 -3" />
      <path d="M16 3v4" />
      <path d="M8 3v4" />
      <path d="M4 11h16" />
    </svg>
  )
}
