import { AnimeTag } from '@components/anime-tag'
import { normalizeString } from '@utils/normalize-string'
import { genreToColor } from '@utils/genre-to-color'
import type { Anime } from 'types'

interface Props {
  anime: Anime
  context?: string
}

interface StatusPoinProps {
  class: string
  status?: string
}

const StatusPoin = ({ class: className, status }: StatusPoinProps) => {
  return (
    <div title={status}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="currentColor"
        viewBox="0 0 24 24"
        className={className}
      >
        <path d="M0 0h24v24H0z" fill="none" />
        <path d="M12 7a5 5 0 1 1-4.995 5.217L7 12l.005-.217A5 5 0 0 1 12 7z" />
      </svg>
    </div>
  )
}
export const AnimeCard = ({ anime, context }: Props) => {
  const {
    title,
    image_large_webp,
    mal_id,
    year,
    image_small_webp,
    status,
    genres,
  } = anime
  const slug = normalizeString(title)

  return (
    <article className="group relative transition-all duration-200 ease-in-out md:hover:scale-[1.03]">
      <a
        href={`/${slug}_${mal_id}`}
        className={`flex h-auto flex-col items-center rounded-lg p-4 ${context === 'search' ? '' : 'w-[calc((100dvw)/2.4)] md:w-[calc((100dvw)/4.4)] xl:w-[calc((100dvw)/6.4)]'}`}
        aria-label={`View details for ${title}`}
      >
        <picture
          className="relative h-full w-full rounded-lg"
          style={{
            backgroundImage: `url(${image_small_webp})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
          }}
        >
          <img
            src={image_large_webp}
            alt={title}
            className="aspect-[225/330] w-full rounded-lg object-cover object-center transition-all ease-in-out"
            loading="lazy"
          />
          <div className="duration-400 absolute bottom-0 left-0 h-1/3 w-full rounded-lg bg-gradient-to-b from-transparent to-black/70 opacity-100 transition-all ease-in-out md:group-hover:h-full md:group-hover:to-black/90" />
        </picture>
        <footer className="absolute bottom-4 left-1 z-10 flex w-full max-w-[90%] flex-row items-center justify-center gap-2 p-2 md:left-3">
          <StatusPoin
            class={`h-6 w-6 ${status === 'Currently Airing' ? 'text-green-400 md:group-hover:text-green-500' : 'text-enfasisColor md:group-hover:text-enfasisColor'}`}
            status={status}
          />
          <h3
            className={`w-full ${genreToColor(genres[0])} truncate text-xs font-semibold text-white transition-opacity duration-200 ease-in-out md:text-sm`}
            aria-hidden="true"
          >
            {title}
          </h3>
        </footer>
      </a>
      <div className="absolute right-2 top-5">
        <AnimeTag tag={year} type={year} />
      </div>
    </article>
  )
}
