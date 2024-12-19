import {
  getAnimeType,
  getTagColor,
  normalizeString,
  createImageUrlProxy,
  baseUrl,
} from '@utils'

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

interface TagProps {
  tag: string
  style?: string
}

export const Tag = ({ tag, style }: TagProps) => {
  const tagColor = getTagColor(tag)
  return (
    <a
      href="/"
      className={`${tagColor} ${style ?? 'w-min'} rounded-2xl px-2 py-1 text-xs font-medium text-gray-800 transition-all duration-200 ease-in-out`}
    >
      {tag}
    </a>
  )
}

export const AnimeResult = ({ mal_id, title, image_webp, type }: Props) => (
  <article className="group relative transition-transform duration-200 ease-in-out">
    <a
      href={`/${normalizeString(title)}_${mal_id}`}
      className="flex h-28 w-full flex-row items-center gap-5 rounded-lg p-3 shadow-md transition-shadow duration-200 ease-in-out group-hover:shadow-xl"
    >
      <img
        src={createImageUrlProxy(baseUrl, image_webp)}
        alt={title}
        loading="lazy"
        className="aspect-[225/330] h-full rounded-lg transition-all ease-in-out group-hover:scale-105"
      />
      <div className="flex w-full flex-col gap-2">
        <h3 className="mt-2 max-w-40 truncate text-sm font-semibold text-gray-900 transition-opacity duration-200 ease-in-out">
          {title}
        </h3>
        <Tag tag={getAnimeType(type)} />
      </div>
    </a>
  </article>
)
