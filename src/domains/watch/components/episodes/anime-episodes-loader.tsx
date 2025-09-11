import Pagination from 'domains/watch/components/episodes/pagination'

/**
 * AnimeEpisodesLoader component displays a loading state for anime episodes list.
 *
 * @description This component provides visual feedback while episode data is being fetched.
 * It displays a series of pulsing placeholder elements that mimic the structure of the actual
 * episode list. The component creates a responsive grid layout that maintains visual consistency
 * with the loaded content.
 *
 * The layout includes placeholder elements for episode thumbnails and titles, styled with
 * animation effects to signal to users that content is loading. The component also displays
 * pagination controls when there are multiple pages of episodes available.
 *
 * The component adapts to different screen sizes, with different grid layouts for mobile,
 * tablet, and desktop views. It maintains consistent padding and spacing to ensure a smooth
 * transition when the actual content loads.
 *
 * The animations use a consistent pulse effect across all placeholder elements to provide
 * a cohesive loading experience that aligns with the application's visual language.
 *
 * @param {Object} props - The component props
 * @param {number} props.totalPages - The total number of pages available for pagination
 * @param {number|null} props.page - The current active page, or null if no page is selected
 * @param {Function} props.handlePageChange - Callback function to handle page changes
 * @returns {JSX.Element} The rendered loading animation for the anime episodes list with pagination
 *
 * @example
 * <AnimeEpisodesLoader totalPages={5} page={1} handlePageChange={(page) => setCurrentPage(page)} />
 */
export const AnimeEpisodesLoader = ({
  totalPages,
  page,
  handlePageChange,
}: {
  totalPages: number
  page: number | null
  handlePageChange: (newPage: number) => void
}) => {
  return (
    <div className="z-10 h-full w-full p-2">
      <div className="anime-list custom-scrollbar relative grid max-h-[500px] w-full grid-cols-1 gap-4 overflow-y-auto p-2 md:grid-cols-3 md:overflow-y-auto xl:mt-0 xl:max-h-[90%] xl:grid-cols-1 xl:overflow-y-auto">
        {Array(100)
          .fill(0)
          .map((_, i) => (
            <div
              className="flex h-full w-full animate-pulse flex-col gap-4 rounded-lg bg-zinc-700 p-2 transition-all duration-300 ease-in-out md:max-w-[400px]"
              key={i + 1}
            >
              <div className="aspect-[16/9] h-full w-full animate-pulse rounded-md bg-zinc-800 object-cover transition-all duration-200 ease-in-out"></div>
              <div className="h-8 w-full animate-pulse rounded-md bg-zinc-800 transition-all duration-200 ease-in-out"></div>
            </div>
          ))}
      </div>
      <div className={`w-full ${totalPages > 1 ? '' : 'hidden'}`}>
        <Pagination
          totalPages={totalPages}
          initialPage={page ?? 1}
          onPageChange={handlePageChange}
        />
      </div>
    </div>
  )
}
