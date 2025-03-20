interface Props {
  className: string
}

/**
 * PlayIcon component renders an icon representing play functionality.
 *
 * This component takes a className prop for styling purposes and is used as a visual representation.
 */
export const PlayIcon = ({ className }: Props) => (
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
