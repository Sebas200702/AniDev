interface Props {
  title: string
  url: string
  text: string
}
const ShareIcon = ({ style }: { style?: string }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M0 0h24v24H0z" stroke="none" />
      <path d="M13 4v4C6.425 9.028 3.98 14.788 3 20c-.037.206 5.384-5.962 10-6v4l8-7-8-7z" />
    </svg>
  )
}

export const ShareButton = ({ title, url, text }: Props) => {
  const handleClick = () => {
    navigator.share({
      title,
      text: 'Check out this episode!',
      url,
    })
  }

  return (
    <button onClick={handleClick} className="button-secondary" title="Share">
      <ShareIcon style="text-white" />
    </button>
  )
}
