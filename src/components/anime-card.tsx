import { AnimeTag } from '@components/anime-tag'
import { getAnimeType } from '@utils/getanime-type'
import { normalizeString } from '@utils/normalize-string'
import { AddToListIcon } from '@icons/add-to-list-icon'
import { PlayIcon } from '@icons/play-icon'
import type { Anime } from 'types'

interface Props {
  anime: Anime
  context?: string
}

export const AnimeCard = ({ anime, context }: Props) => {
  const { title, image_webp, mal_id, type, image_small_webp } = anime
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
        className="flex h-auto w-[calc((100dvw-8px)/2.4)] flex-col items-center rounded-lg p-4 md:w-[calc((100dvw-8px)/4.4)] xl:w-[calc((100dvw-8px)/6.4)]"
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
            src={image_webp}
            alt={title}
            className="aspect-[225/330] w-full rounded-lg object-cover transition-all ease-in-out group-hover:scale-105"
            loading="lazy"
            width={225}
            height={330}
          />
          <div className="absolute bottom-0 left-0 h-full w-full rounded-lg bg-gradient-to-b from-transparent to-black/70 opacity-0 transition-all duration-200 ease-in-out group-hover:scale-105 group-hover:opacity-100" />
        </picture>

        <h3
          className="mt-4 w-full max-w-[90%] truncate text-base font-semibold text-gray-900 transition-opacity duration-200 ease-in-out"
          aria-hidden="true"
        >
          {title}
        </h3>
      </a>
      <div className="absolute bottom-16 left-0 right-0 flex h-auto w-full flex-row items-center justify-between px-5 text-blue-500 group-hover:opacity-100">
        <AnimeTag tag={animeType} type={animeType} />
        <div className="flex w-auto flex-row items-center opacity-0 transition-all duration-200 ease-in-out group-hover:opacity-100">
          {actions.map((action) => (
            <a
              key={action.name}
              href={action.href}
              className="flex h-12 w-12 flex-row items-center justify-center opacity-70 transition-opacity duration-200 ease-in-out hover:opacity-100 hover:saturate-200"
            >
              <action.icon class="h-12 w-12" />
            </a>
          ))}
        </div>
      </div>
    </article>
  )
}
