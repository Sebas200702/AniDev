import { AnimeCard } from '@anime/components/anime-card/anime-card'
import type { AnimeCardInfo } from '@anime/types'
import { LoadingCard } from '@search/components/search-results/loading-card'
import { useFetch } from '@shared/hooks/useFetch'
import { useGlobalUserPreferences } from '@user/stores/user-store'
import { MainInfo } from 'domains/shared/components/layout/base/MainInfo'

interface Props {
  title: string
  mal_id: number
}
export const SimilarToComponet = ({ title, mal_id }: Props) => {
  const { parentalControl } = useGlobalUserPreferences()
  const { data, loading } = useFetch<AnimeCardInfo[]>({
    url: `/api/animes/getRecomendations?similar_to=${title}&currentAnime=${mal_id}&parental_control=${parentalControl}`,
  })

  return (
    <MainInfo>
      <div className="from-Primary-950/20 to-Primary-900/10 pointer-events-none absolute inset-0 bg-gradient-to-t via-transparent" />

      <div className="border-Primary-800/30 from-Primary-950/80 to-Complementary/80 relative z-20 flex-shrink-0 border-b bg-gradient-to-r p-6 backdrop-blur-md">
        <h3 className="text-lx">Similar To</h3>
      </div>
      <ul className="no-scrollbar grid max-h-[600px] grid-cols-2 gap-8 overflow-y-scroll p-6 md:grid-cols-3 xl:grid-cols-4">
        {loading || !data
          ? Array(10)
              .fill(null)
              .map((_, idx) => <LoadingCard key={idx} />)
          : data?.map((anime) => (
              <AnimeCard anime={anime} key={anime.mal_id} />
            ))}
      </ul>
    </MainInfo>
  )
}
