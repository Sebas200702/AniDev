import { AnimeCard } from '@components/anime-card'
import { LoadingCard } from '@components/search/results/loading-card'
import { useFetch } from '@hooks/useFetch'
import type { AnimeCardInfo } from 'types'

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
  const { data, loading } = useFetch<AnimeCardInfo[]>({
    url: `/api/getAnimeRelations?animeId=${animeId}`,
  })

  if (loading)
    return (
      <div className="bg-Complementary relative z-10 flex flex-col gap-4 rounded-lg p-4">
        <header className="flex items-center justify-between px-10">
          <h2 className="text-2xl font-bold">Related</h2>
        </header>
        <ul className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <li key={index}>
              <LoadingCard />
            </li>
          ))}
        </ul>
      </div>
    )

  return (
    <section className="bg-Complementary relative z-10 flex flex-col gap-4 rounded-lg p-4">
      <header className="flex items-center justify-between px-10">
        <h2 className="text-2xl font-bold">Related</h2>
      </header>

      <ul className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
        {data?.map((anime) => (
          <li key={anime.mal_id}>
            <AnimeCard anime={anime} />
          </li>
        ))}
      </ul>
    </section>
  )
}
