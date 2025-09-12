import { AnimatedCounter } from '@search/components/search-stats/search-animated-counter'
import { HistoryIcon } from '@shared/components/icons/search/history-icon'

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
    <footer className="mt-16 flex items-center justify-between p-4 md:px-20 xl:px-30">
      <div className="flex items-center justify-center gap-2 self-center text-center text-sm text-gray-300">
        <AnimatedCounter value={totalResults} isLoading={isLoadingMore} />
        <span>results found</span>
      </div>
      <button
        onClick={onHistoryClick}
        className="hover:text-enfasisColor cursor-pointer rounded-lg p-2 text-gray-400 transition-colors hover:bg-zinc-800"
        title="View search history"
        aria-label="View search history"
      >
        <HistoryIcon className="h-5 w-5" />
      </button>
    </footer>
  )
}
