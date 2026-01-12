import { AnimeCard } from '@anime/components/anime-card/anime-card'
import type { AnimeCardInfo } from '@anime/types'
import { DataWrapper } from '@shared/components/error/data-wrapper'
import { MainInfo } from '@shared/components/layout/base/MainInfo'
import { AnimeSimilarToLoader } from './anime-info-similar-to-loader'

interface Props {
  loading: boolean
  data: AnimeCardInfo[]
  error: Error
}
export const AnimeSimilarTo = ({ loading, data, error }: Props) => {
  return (
    <MainInfo>
      <div className="from-Primary-950/20 to-Primary-900/10 pointer-events-none absolute inset-0 bg-gradient-to-t via-transparent" />

      <div className="border-Primary-800/30 from-Primary-950/80 to-Complementary/80 relative z-20 flex-shrink-0 border-b bg-gradient-to-r p-6 backdrop-blur-md">
        <h3 className="text-lx">Similar To</h3>
      </div>
      <ul className="no-scrollbar grid max-h-[600px] grid-cols-2 gap-8 overflow-y-scroll p-6 md:grid-cols-3 xl:grid-cols-4">
        <DataWrapper<AnimeCardInfo[]>
          data={data}
          loading={loading}
          error={error}
          loadingFallback={<AnimeSimilarToLoader />}
        >
          {(data) =>
            data?.map((anime) => <AnimeCard anime={anime} key={anime.mal_id} />)
          }
        </DataWrapper>
      </ul>
    </MainInfo>
  )
}
