import { AnimeCard } from '@components/anime-card'
import { LoadingCard } from '@components/search/results/loading-card'
import { useFetch } from '@hooks/useFetch'
import type { AnimeCardInfo } from 'types'

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
