import { HistoryIcon } from '@components/icons/history-icon'
import { AnimatedCounter } from '@components/search/animated-counter'

interface SearchStatsProps {
  totalResults: number
  isLoadingMore: boolean
  onHistoryClick: () => void
}

/**
 * SearchStats component displays the total number of search results and a history button.
 *
 * @description This component shows an animated counter of total results and a button to view search history.
 * It uses semantic HTML to improve accessibility and SEO.
 *
 * @param {SearchStatsProps} props - The component props
 * @param {number} props.totalResults - The total number of search results
 * @param {boolean} props.isLoadingMore - Whether more results are being loaded
 * @param {() => void} props.onHistoryClick - Callback function when history button is clicked
 *
 * @returns {JSX.Element} The rendered search stats section
 */
export const SearchStats = ({
  totalResults,
  isLoadingMore,
  onHistoryClick,
}: SearchStatsProps) => {
  return (
    <footer className="flex items-center justify-between md:px-20 xl:px-30 p-4 mt-16">
      <div className="text-gray-300 text-sm self-center text-center gap-2 flex justify-center items-center">
        <AnimatedCounter value={totalResults} isLoading={isLoadingMore} />
        <span>results found</span>
      </div>
      <button
        onClick={onHistoryClick}
        className="p-2 text-gray-400 cursor-pointer hover:text-enfasisColor transition-colors rounded-lg hover:bg-zinc-800"
        title="View search history"
        aria-label="View search history"
      >
        <HistoryIcon className="w-5 h-5" />
      </button>
    </footer>
  )
}
