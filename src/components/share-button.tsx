interface Props {
  title: string
  url: string
  text: string
}
const ShareIcon = ({ style }: { style?: string }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      viewBox="0 0 24 24"
      className={style}
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
      text,
      url,
    })
  }

  return (
    <button onClick={handleClick} className="button-secondary" title="Share">
      <ShareIcon style="text-white md:w-6 md:h-6 w-4 h-4" />
    </button>
  )
}
