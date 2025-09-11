/**
 * NextPrevEpisodeBtn component renders a navigation button for anime episodes.
 *
 * @description This component provides navigation controls between episodes of an anime.
 * It dynamically determines whether to display the button based on the current episode position
 * within the episode list. The component hides the "Previous" button when on the first episode
 * and hides the "Next" button when on the last episode.
 *
 * The component generates the appropriate URL for navigation by combining the anime slug with
 * the target episode number. It handles edge cases by preventing navigation beyond the available
 * episode range and returns an empty URL when navigation is not possible.
 *
 * The UI displays a button with the action text ("Next" or "Previous") and applies appropriate
 * styling including hover effects and focus states for accessibility. The component is designed
 * to be used in pairs to provide complete navigation controls within an anime episode viewer.
 *
 * @param {Props} props - The component props
 * @param {number} props.episodesLength - The total number of episodes available for the anime
 * @param {number} props.currentEpisode - The current episode number being viewed
 * @param {ActionType} props.action - The navigation direction, either "Next" or "Previous"
 * @param {string} props.slug - The anime slug used for constructing navigation URLs
 * @returns {JSX.Element} The rendered navigation button with appropriate visibility and link
 *
 * @example
 * <NextPrevEpisodeBtn episodesLength={24} currentEpisode={5} action="Next" slug="my-anime" />
 */
type ActionType = 'Next' | 'Previous'
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
    if (action === 'Previous' && currentEpisode > 1) {
      return `/watch/${slug}?ep=${currentEpisode - 1}`
    }
    return ''
  }

  return (
    <a
      className={`flex items-center justify-center rounded-sm px-4 py-2 text-sm font-medium text-white transition-colors hover:opacity-50 focus:ring-1 focus:ring-gray-300 focus:ring-offset-1 focus:outline-none ${action === 'Previous' && isStart ? 'hidden' : ''} ${action === 'Next' && isEnd ? 'hidden' : ''}`}
      href={getHref()}
    >
      {action}
    </a>
  )
}
