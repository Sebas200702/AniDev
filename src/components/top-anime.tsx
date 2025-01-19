import { useFetch } from '@hooks/useFetch'
import type { Anime } from 'types'
import { createImageUrlProxy } from '@utils/craete-imageurl-proxy'
import { normalizeString } from '@utils/normalize-string'

export const AnimeTop = () => {
  const { data: aninme, loading } = useFetch<Anime[]>({
    url: '/api/animes?order_by=score_desc&limit_count=10&type_filter=tv',
  })

  if (loading || !aninme)
    return (
      <div className="relative">
        <header className="flex w-full flex-row items-center justify-around gap-4 p-4">
          <div className="mt-2 flex-1 border-t border-white/20"></div>
          <h2 className="text-center text-3xl font-bold text-white">
            Top Animes
          </h2>
          <div className="mt-2 flex-1 border-t border-white/20"></div>
        </header>
        <div className="grid grid-cols-2 justify-between gap-8 p-8 md:grid-cols-5 xl:grid-cols-10">
          {Array(10)
            .fill(0)
            .map((_, i) => (
              <div key={i + 1} className="flex flex-col items-center p-4">
                <div className="aspect-[225/330] h-auto w-full max-w-32 animate-pulse rounded-lg bg-zinc-800 md:aspect-[225/330]"></div>
                <div className='h-6 mt-2 w-32 bg-zinc-800 rounded-lg animate-pulse'></div>
              </div>
            ))}
        </div>
      </div>
    )
  return (
    <section className="relative mx-auto w-[100dvw] justify-center">
      <header className="flex w-full flex-row items-center justify-around gap-4 p-4">
        <div className="mt-2 flex-1 border-t border-white/20"></div>
        <h2 className="text-center text-3xl font-bold text-white">
          Top Animes
        </h2>
        <div className="mt-2 flex-1 border-t border-white/20"></div>
      </header>

      <ul className="mx-auto grid grid-cols-2 justify-around p-4 md:grid-cols-5 xl:grid-cols-10">
        {aninme?.map((anime, index) => (
          <div key={anime.mal_id} className="flex flex-col items-center p-4">
            <li className="relative">
              <a href={`/${normalizeString(anime.title)}_${anime.mal_id}`}>
                <picture
                  className="aspect-[225/330] h-auto rounded-md object-cover object-center"
                  style={{
                    backgroundImage: `url(${createImageUrlProxy(
                      anime.image_small_webp,
                      '40',
                      '1'
                    )})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    backgroundRepeat: 'no-repeat',
                  }}
                >
                  <img
                    src={anime.image_webp}
                    alt={anime.title}
                    className="aspect-[225/330] h-auto max-w-32 rounded-md object-cover object-center"
                    fetchPriority="high"
                  />
                </picture>
                <div className="absolute bottom-0 left-0 z-10 h-1/2 w-full rounded-lg bg-gradient-to-b from-transparent to-black/70 opacity-100 transition-all duration-200 ease-in-out md:group-hover:h-full md:group-hover:to-black/90" />
                <span className="absolute bottom-2 left-1 z-20 text-pretty text-5xl font-bold text-white">
                  {index + 1}
                </span>
              </a>
            </li>

            <span className="mx-auto mt-2 max-w-32 text-sm text-white">
              {anime.title}
            </span>
          </div>
        ))}
      </ul>
    </section>
  )
}
