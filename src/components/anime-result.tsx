import { AnimeTag } from '@components/anime-tag'
import { getAnimeType } from '@utils/getanime-type'
import { normalizeString } from '@utils/normalize-string'

interface Props {
  mal_id: number
  title: string
  image_webp: string
  type: string
}

const PlayButton = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    fill="currentColor"
    className="icon icon-tabler icons-tabler-filled icon-tabler-player-play"
    viewBox="0 0 24 24"
  >
    <path fill="none" d="M0 0h24v24H0z" />
    <path d="M6 4v16a1 1 0 0 0 2 1l13-8a1 1 0 0 0 0-2L8 3a1 1 0 0 0-2 1z" />
  </svg>
)

export const AnimeResult = ({ mal_id, title, image_webp, type }: Props) => (
  <article className="group relative transition-transform duration-200 ease-in-out">
    <a
      href={`/${normalizeString(title)}_${mal_id}`}
      className="flex h-auto w-full flex-col rounded-lg p-2 duration-200 ease-in-out"
    >
      <picture className="aspect-[225/330] h-full rounded-lg">
        <img
          src={image_webp}
          alt={title}
          loading="lazy"
          className="aspect-[225/330] h-full rounded-lg object-cover transition-all ease-in-out group-hover:scale-105"
        />
      </picture>

      <h3 className="mt-2 max-w-40 truncate text-base font-semibold text-gray-900 transition-opacity duration-200 ease-in-out">
        {title}
      </h3>
    </a>

    <AnimeTag
      tag={getAnimeType(type)}
      type={type}
      style="w-min  absolute bottom-12   xl:ml-4 md:ml-2 ml-3"
    />
  </article>
)
