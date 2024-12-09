import { normalizeString } from '@utils'
import type { Anime } from 'types'
import { getAnimeType } from '@utils'

interface Props {
  animes: Anime[] | null
}
interface TagProps {
  tag: string
  isOnAnimeCard?: boolean
}
const Tag = ({ tag, isOnAnimeCard }: TagProps) => {
  return (
    <a
      href=""
      className={`${isOnAnimeCard ? ' bg-blue-400 hover:bg-blue-500 ' : ' flex items-center justify-center  hover:bg-gray-400 w-min bg-gray-300 '} text-xs font-medium text-gray-800 px-2 py-1 transition-all duration-200 ease-in-out rounded-2xl`}
    >
      {tag}
    </a>
  )
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

export const SearchResults = ({ animes }: Props) => {
  return (
    <ul className="grid grid-cols-3 gap-4  w-full">
      {animes?.length === 0 && (
        <div className="flex flex-col items-center justify-center mt-9 w-full h-full">
          <h1 className="text-2xl font-bold text-gray-900">No results found</h1>
        </div>
      )}
      {animes?.map(({ title, image_webp, mal_id, type }) => (
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
      ))}
    </ul>
  )
}
