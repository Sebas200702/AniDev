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
    <section className="relative mx-auto w-[100dvw] justify-center fade-out">
      <AnimeTopHeader />
      <ul className="mx-auto grid grid-cols-2 justify-around gap-4 md:grid-cols-5 md:px-4 xl:grid-cols-10">
        {aninme.map((anime, index) => (
          <AnimeTopItem key={anime.mal_id} anime={anime} index={index} />
        ))}
      </ul>
    </section>
  )
}
