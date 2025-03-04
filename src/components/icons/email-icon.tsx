interface Props {
  class?: string
}

export const EmailIcon = ({ class: className }: Props) => (
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
    <path d="M3 7a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7z"></path>
    <path d="m3 7 9 6 9-6"></path>
  </svg>
)
