import { AnimeDetailCard } from '@components/anime-detail-card'
import { LoadingCard } from '@components/search/results/loading-card'
import { useFetch } from '@hooks/useFetch'
import type { AnimeDetail } from 'types'

/**
 * AnimeRelated component displays a grid of related anime recommendations.
 *
 * @description This component fetches and displays a collection of anime that are related
 * to a specific anime (determined by animeId). It utilizes a responsive grid layout that
 * adapts to different screen sizes, showing anime cards in multiple columns.
 *
 * The component features:
 * - Automatic data fetching using the useFetch hook
 * - Responsive grid layout (2 columns on mobile, 3 on tablet, 4 on desktop)
 * - Loading state with skeleton cards
 * - Clean section layout with consistent spacing and background
 * - Z-index management for proper layering
 * - Reusable AnimeCard components for each related anime
 *
 * During the loading state, the component displays skeleton cards that match
 * the layout of the actual content, providing a smooth loading experience.
 * The grid automatically adjusts its layout based on screen size using
 * Tailwind's responsive classes.
 *
 * @param {Props} props - The component props
 * @param {number} props.animeId - The ID of the anime to fetch related content for
 * @returns {JSX.Element} A section containing a grid of related anime or loading skeletons
 *
 * @example
 * <AnimeRelated animeId={1234} />
 */

export const AnimeRelated = ({ animeId }: { animeId: number }) => {
  const { data, loading } = useFetch<AnimeDetail[]>({
    url: `/api/getAnimeRelations?animeId=${animeId}`,
  })

  if (loading)
    return (
      <div className="relative z-10 flex flex-col gap-4 rounded-lg p-4 md:p-6">
        <header className="flex items-center justify-between">
          <h2 className="text-lxx font-bold">Related</h2>
        </header>
        <ul className="grid grid-cols-1 gap-4 md:gap-6 xl:grid-cols-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i + 1}
              className="mx-auto flex aspect-[100/30] h-full w-full animate-pulse flex-row rounded-lg bg-zinc-800 md:max-h-36"
            >
              <div className="aspect-[225/330] h-full animate-pulse rounded-l-lg bg-zinc-700 object-cover object-center transition-all ease-in-out md:max-h-36"></div>
            </div>
          ))}
        </ul>
      </div>
    )

  return (
    <section className="relative z-10 flex flex-col gap-4 rounded-lg p-4 md:p-6">
      <header className="flex items-center justify-between">
        <h2 className="text-lxx font-bold">Related</h2>
      </header>

      <ul className="grid grid-cols-1 gap-4 md:gap-6 xl:grid-cols-2">
        {data?.map((anime) => (
          <AnimeDetailCard anime={anime} key={anime.mal_id} />
        ))}
      </ul>
    </section>
  )
}
