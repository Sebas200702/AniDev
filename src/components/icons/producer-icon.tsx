/**
 * ProducerIcon component renders an icon representing a producer.
 *
 * This component takes an optional className prop to allow for custom styling.
 *
 * @param {Object} props - Component props
 * @param {string} [props.className] - Optional class name for custom styling
 */
export const ProducerIcon = ({ className }: { className?: string }) => {
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
