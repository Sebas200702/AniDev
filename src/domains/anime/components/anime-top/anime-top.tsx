import type { AnimeTopInfo } from '@anime/types'
import { AnimeTopItem } from '@anime/components/anime-top/anime-top-item'

interface Props {
  animes: AnimeTopInfo[]
}

export const AnimeTop = ({ animes }: Props) => {
  return (
    <section className="fade-out relative mx-auto w-full justify-center">
      <header className="relative mx-auto flex w-[100dvw] flex-row items-center gap-4 px-4 py-4 md:px-20">
        <span className="bg-enfasisColor h-8 w-2 rounded-lg xl:h-10"></span>
        <h3 className="text-lx text-center font-bold">Top Anime</h3>
      </header>
      <ul className="mx-auto grid grid-cols-1 justify-around gap-y-4 px-4 py-4 md:px-20 xl:grid-cols-2 xl:gap-x-12">
        {animes.map((anime, index) => (
          <AnimeTopItem key={anime.mal_id} anime={anime} index={index} />
        ))}
      </ul>
    </section>
  )
}
