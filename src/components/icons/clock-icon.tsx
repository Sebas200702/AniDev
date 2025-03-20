interface Props {
  className?: string
}

/**
 * ClockIcon component renders an icon representing a clock.
 * 
 * This component accepts a className prop for styling purposes and is used as a visual representation.
 * 
 * @param {Props} props - The component's props
 * @returns {JSX.Element} The ClockIcon component
 */
export const ClockIcon = ({ className }: Props) => (
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
    <path d="M0 0h24v24H0z" stroke="none"></path>
    <path d="M3 12a9 9 0 1 0 18 0 9 9 0 0 0-18 0"></path>
    <path d="M12 7v5l3 3"></path>
  </svg>
)
