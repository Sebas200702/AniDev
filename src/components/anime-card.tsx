import { AnimeTag } from '@components/anime-tag'
import { getAnimeType } from '@utils/getanime-type'
import { normalizeString } from '@utils/normalize-string'
import { AddToListIcon } from '@icons/add-to-list-icon'
import { genreToColor } from '@utils/genre-to-color'
import { PlayIcon } from '@icons/play-icon'
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
    type,
    image_small_webp,
    status,
    genres,
  } = anime
  const slug = normalizeString(title)
  const animeType = getAnimeType(type)

  const actions = [
    {
      name: 'Play',
      icon: PlayIcon,
      href: `/watch/${slug}_${mal_id}?ep=1`,
    },
    {
      name: 'Add to list',
      icon: AddToListIcon,
      href: `/add-to-list/${slug}_${mal_id}`,
    },
  ]

  return (
    <article className="group relative transition-transform duration-200 ease-in-out">
      <a
        href={`/${slug}_${mal_id}?context=${context}`}
        className={` ${context === 'search' ? '' : 'flex h-auto w-[calc((100dvw-8px)/2.4)] flex-col items-center rounded-lg p-4 md:w-[calc((100dvw-8px)/4.4)] xl:w-[calc((100dvw-8px)/6.4)]'}`}
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
            className="aspect-[225/330] w-full rounded-lg transition-all ease-in-out md:group-hover:scale-105"
            loading="lazy"
            width={225}
            height={330}
          />
          <div className="absolute bottom-0 left-0 h-full w-full rounded-lg bg-gradient-to-b from-transparent to-black/70 opacity-0 transition-all duration-200 ease-in-out md:group-hover:scale-105 md:group-hover:opacity-100" />
        </picture>
        <footer className="mt-4 flex w-full flex-row items-center justify-center gap-2">
          <StatusPoin
            class={`h-6 w-6 ${status === 'Currently Airing' ? 'text-green-400 md:group-hover:text-green-500' : 'text-blue-400 md:group-hover:text-blue-500'}`}
            status={status}
          />
          <h3
            className={`w-full max-w-[90%] ${genreToColor(genres[0])} truncate text-base font-semibold text-gray-900 transition-opacity duration-200 ease-in-out`}
            aria-hidden="true"
          >
            {title}
          </h3>
        </footer>
      </a>
      <div
        className={` ${context === 'search' ? 'bottom-10 px-2' : 'bottom-16 px-5'} absolute left-0 right-0 flex h-auto w-full flex-row items-center justify-between text-blue-500 md:group-hover:opacity-100`}
      >
        <AnimeTag tag={animeType} type={type} style="w-auto" />
        <div className="flex w-auto flex-row items-center opacity-0 transition-all duration-200 ease-in-out md:group-hover:opacity-100">
          {actions.map((action) => (
            <a
              key={action.name}
              href={action.href}
              className="flex flex-row items-center justify-center opacity-70 transition-opacity duration-200 ease-in-out hover:opacity-100 hover:saturate-200 md:h-12 md:w-12"
            >
              <action.icon class="mt-2 h-8 w-8 md:h-10 md:w-10" />
            </a>
          ))}
        </div>
      </div>
    </article>
  )
}
