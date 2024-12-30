type ActionType = 'Next' | 'Prev'
interface Props {
  episodesLength: number
  currentEpisode: number
  action: ActionType
  slug: string
}
export const NextPrevEpisodeBtn = ({
  episodesLength,
  currentEpisode,
  action,
  slug,
}: Props) => {
  const isStart = currentEpisode === 1
  const isEnd = currentEpisode === episodesLength
  const getHref = () => {
    if (action === 'Next' && currentEpisode < episodesLength) {
      return `/watch/${slug}?ep=${currentEpisode + 1}`
    }
    if (action === 'Prev' && currentEpisode > 1) {
      return `/watch/${slug}?ep=${currentEpisode - 1}`
    }
    return ''
  }

  return (
    <a
      className={`flex items-center justify-center rounded-full bg-gray-800 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-300 focus:ring-offset-2 ${action === 'Prev' && isStart ? 'hidden' : ''} ${action === 'Next' && isEnd ? 'hidden' : ''}`}
      href={getHref()}
    >
      {action} Episode
    </a>
  )
}
