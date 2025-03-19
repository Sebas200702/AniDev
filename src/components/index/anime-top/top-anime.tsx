import type { Anime } from 'types'
import { AnimeTopHeader } from '@components/index/anime-top/header'
import { AnimeTopItem } from '@components/index/anime-top/anime-top-item'
import { AnimeTopLoader } from '@components/index/anime-top/top-anime-loader'
import { useFetch } from '@hooks/useFetch'

export const AnimeTop = () => {
  const { data: aninme, loading } = useFetch<Anime[]>({
    url: '/api/animes?order_by=score&limit_count=10&type_filter=tv&banner_filter=false',
  })

  if (loading || !aninme) return <AnimeTopLoader />

  return (
    <section className="fade-out relative mx-auto w-[100dvw] justify-center">
      <AnimeTopHeader />
      <ul className="mx-auto grid grid-cols-1 justify-around gap-y-4 px-4 py-4 md:px-20 xl:grid-cols-2 xl:gap-x-12">
        {aninme.map((anime, index) => (
          <AnimeTopItem key={anime.mal_id} anime={anime} index={index} />
        ))}
      </ul>
    </section>
  )
}
