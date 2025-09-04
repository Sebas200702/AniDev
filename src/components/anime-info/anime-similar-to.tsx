import { AnimeCard } from '@components/anime-info/anime-card'
import { useFetch } from '@hooks/useFetch'
import type { AnimeCardInfo } from 'types'

interface props {
  title: string
  mal_id: number
}
export const SimilarToComponet = ({ title, mal_id }: props) => {
  const { data, loading } = useFetch<AnimeCardInfo[]>({
    url: `/api/getRecomendations?similar_to=${title}&currentAnime=${mal_id}`,
  })

  return (
    <section
      className='flex flex-col md:row-span-2 md:col-span-3 md:col-start-2 border-Primary-800/30 from-Complementary via-Primary-950 to-Complementary/95 hover:border-Primary-700/50 relative z-10   overflow-hidden rounded-xl border bg-gradient-to-br shadow-2xl backdrop-blur-sm transition-all duration-500 ease-in-out hover:shadow-xl"
      role="tabpanel '
    >
      <div className="from-Primary-950/20 to-Primary-900/10 pointer-events-none absolute inset-0 bg-gradient-to-t via-transparent" />

      <div className="border-Primary-800/30 from-Primary-950/80 to-Complementary/80 relative z-20 flex-shrink-0 border-b bg-gradient-to-r p-6 backdrop-blur-md">
        <h3 className='text-lx'>Similar To</h3>
      </div>
      <ul className='grid xl:grid-cols-4 md:grid-cols-3 grid-cols-2 gap-8 p-6'>
        {data?.map((anime) => (
          <AnimeCard anime={anime} key={anime.mal_id} />
        ))}
      </ul>
    </section>
  )
}
