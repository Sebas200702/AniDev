interface Props {
  class?: string
}

export const PlayIcon = ({ class: className }: Props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="currentColor"
    className={`${className ?? ''} `}
    viewBox="0 0 32 32"
  >
    <path fill="none" d="M0 0h24v24H0z"></path>
    <path d="M6 4v16a1 1 0 0 0 2 1l13-8a1 1 0 0 0 0-2L8 3a1 1 0 0 0-2 1z"></path>
  </svg>
)
