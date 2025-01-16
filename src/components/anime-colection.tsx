import { useFetch } from '@hooks/useFetch'
import type { Anime , Collection } from 'types'



export const AnimeCollection = ({ title, query }: Collection) => {
  const { data: animes, loading } = useFetch<Anime[]>({
    url: `/api/animes?limit_count=3&${query}&banners_filter=false`,
  })
  const style1 = 'rotate-[-10deg] translate-x-8 translate-y-[35%] hover:translate-y-[20%] transition-transform duration-200 ease-in-out'
  const style2 = 'z-10 -translate-x-1 translate-y-[40%] hover:translate-y-[25%] transition-transform duration-200 ease-in-out'
  const style3 = 'z-20 -translate-x-6 translate-y-1/2 rotate-[10deg] hover:translate-y-[35%] transition-transform duration-200 ease-in-out'

  return (
    <article className="mx-auto mb-6 flex max-h-60 max-w-[450px] flex-col overflow-hidden rounded-lg bg-secondary p-4">
        <a href="/">
      <h2 className="mx-auto max-w-44 text-balance px-4 text-center text-2xl font-bold text-white">
        {title}
      </h2>

      <ul className="mx-auto flex h-full w-full flex-row justify-center -mt-4">
        {animes?.map((anime, i) => (
          <li key={anime.mal_id}>
            <img
              src={anime.image_webp}
              alt={anime.title}
              className={`h-auto min-w-28 rounded-md object-cover object-center ${i === 0 ? style1 : i === 1 ? style2 : style3}`}
              loading="lazy"
            />
          </li>
        ))}
      </ul>
      </a>
    </article>
  )
}
