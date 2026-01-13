import { Pagination } from '@watch/components/episodes/pagination'

/**
 * Player Loader
 *
 * Skeleton loader for the video player
 */
const PlayerLoader = () => {
  return (
    <div className="aspect-video w-full animate-pulse rounded-lg bg-zinc-800 transition-all duration-200 ease-in-out"></div>
  )
}

/**
 * Footer Loader
 *
 * Skeleton loader for episode information footer
 */
const FooterLoader = () => {
  return (
    <footer className="flex h-full w-full animate-pulse flex-col gap-8 rounded-lg p-4 transition-all duration-300 ease-in-out">
      <div className="h-16 w-full animate-pulse rounded-md bg-zinc-800 transition-all duration-200 ease-in-out md:w-120 xl:h-8"></div>
      <div className="h-32 w-full animate-pulse rounded-md bg-zinc-800 transition-all duration-200 ease-in-out xl:h-20"></div>
    </footer>
  )
}

/**
 * Episodes List Loader
 *
 * Skeleton loader for episodes list with pagination
 */
const EpisodesListLoader = ({
  totalPages,
  page,
  handlePageChange,
}: {
  totalPages: number
  page: number | null
  handlePageChange: (newPage: number) => void
}) => {
  return (
    <div className="my-10 rounded-lg bg-[#1c1c1c] p-4 xl:mt-0">
      {/* Navigation buttons loader */}
      <div className="flex justify-between">
        <div className="h-10 w-32 animate-pulse rounded-md bg-zinc-800 transition-all duration-200 ease-in-out"></div>
        <div className="h-10 w-32 animate-pulse rounded-md bg-zinc-800 transition-all duration-200 ease-in-out"></div>
      </div>

      {/* Episodes grid loader */}
      <div className="relative mx-auto flex h-full xl:w-96">
        <div className="z-10 w-full p-2">
          <div className="anime-list custom-scrollbar relative grid max-h-[500px] w-full grid-cols-1 gap-4 overflow-y-auto p-2 md:grid-cols-3 md:overflow-y-auto xl:mt-0 xl:max-h-[90%] xl:grid-cols-1 xl:overflow-y-auto">
            {new Array(12).fill(0).map((_, i) => (
              <div
                className="flex h-full w-full animate-pulse flex-col gap-4 rounded-lg bg-zinc-700 p-2 transition-all duration-300 ease-in-out md:max-w-[400px]"
                key={i}
              >
                <div className="aspect-video h-full w-full animate-pulse rounded-md bg-zinc-800 object-cover transition-all duration-200 ease-in-out"></div>
                <div className="h-8 w-full animate-pulse rounded-md bg-zinc-800 transition-all duration-200 ease-in-out"></div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          {
            <div className="w-full">
              <Pagination
                totalPages={totalPages}
                initialPage={page ?? 1}
                onPageChange={handlePageChange}
              />
            </div>
          }
        </div>
      </div>
    </div>
  )
}

/**
 * Watch Anime Loader Component
 *
 * Full page skeleton loader for the watch anime page
 * Matches the structure of WatchAnime component
 */
export const WatchAnimeLoader = ({
  totalPages = 1,
  currentPage = 1,
  onPageChange,
}: {
  totalPages?: number
  currentPage?: number
  onPageChange?: (page: number) => void
}) => {
  const handlePageChange = onPageChange || (() => {})

  return (
    <section className="mx-auto mt-20 flex h-min w-full flex-col justify-center gap-20 overflow-hidden p-4 md:px-20 xl:max-h-[calc(100dvh-80px)] xl:w-full xl:flex-row">
      {/* Player and footer section */}
      <div className="flex aspect-[16/9] w-full flex-col gap-5 md:relative md:mb-44 md:max-w-full xl:max-h-[calc(100dvh-80px)]">
        <PlayerLoader />
        <FooterLoader />
      </div>

      {/* Episodes list section */}
      <EpisodesListLoader
        totalPages={totalPages}
        page={currentPage}
        handlePageChange={handlePageChange}
      />
    </section>
  )
}
