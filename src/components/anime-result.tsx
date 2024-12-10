import { getAnimeType, normalizeString, getTagColor } from '@utils'

interface Props {
  mal_id: number
  title: string
  image_webp: string
  type: string
}

const PlayButton = () => {
  return (
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
}
interface TagProps {
  tag: string
}

const Tag = ({ tag }: TagProps) => {
  const tagColor = getTagColor(tag)
  return (
    <a
      href="/"
      className={`${tagColor} w-min text-xs font-medium text-gray-800 px-2 py-1 transition-all duration-200 ease-in-out rounded-2xl`}
    >
      {tag}
    </a>
  )
}

export const AnimeResult = ({ mal_id, title, image_webp, type }: Props) => {
  return (
    <article
      key={mal_id}
      className="relative group transition-transform duration-200 ease-in-out"
    >
      <a
        href={`/${normalizeString(title)}_${mal_id}`}
        className=" flex flex-row w-full h-28 gap-5 items-center  rounded-lg shadow-md group-hover:shadow-xl p-3 transition-shadow duration-200 ease-in-out"
      >
        <img
          src={image_webp}
          alt={title}
          loading="lazy"
          className=" aspect-[225/330] group-hover:scale-105 h-full rounded-lg transition-all ease-in-out"
        />
        <div className="flex flex-col gap-2 w-full">
          <h3 className="text-sm max-w-40  transition-opacity duration-200 ease-in-out truncate font-semibold mt-2 text-gray-900 ">
            {title}
          </h3>
          <Tag tag={getAnimeType(type)} />
        </div>
      </a>
    </article>
  )
}
