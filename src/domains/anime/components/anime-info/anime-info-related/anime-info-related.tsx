import { AnimeDetailCard } from '@anime/components/anime-card/anime-detail-card'
import { AnimeRelatedLoader } from '@anime/components/anime-info/anime-info-related/anime-info-related-loader'
import type { AnimeDetail } from '@anime/types'
import { DataWrapper } from '@shared/components/data-wrapper'

interface Props {
  related: AnimeDetail[]
  isLoading: boolean
  error?: Error | null
}
export const AnimeRelated = ({ related, error, isLoading }: Props) => {
  return (
    <section className="relative z-10 flex flex-col gap-4 rounded-lg p-4 md:p-6">
      <header className="flex items-center justify-between">
        <h2 className="text-lxx font-bold">Related</h2>
      </header>

      <DataWrapper<AnimeDetail[]>
        error={error}
        loading={isLoading}
        data={related}
        loadingFallback={<AnimeRelatedLoader />}
      >
        {(related) => (
          <ul className="grid grid-cols-1 gap-4 md:gap-6 xl:grid-cols-2">
            {related?.map((anime) => (
              <AnimeDetailCard anime={anime} key={anime.mal_id} />
            ))}
          </ul>
        )}
      </DataWrapper>
    </section>
  )
}
