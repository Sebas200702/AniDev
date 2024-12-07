import { useState } from 'react'
import { useFetch, useDebounce } from '@hooks/index'
import type { Anime } from 'types'
import { baseUrl } from '@utils'

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
export const SearchComponent = () => {
  const [query, setQuery] = useState('')
  const [filters, setFilters] = useState<object | null>(null)
  const debouncedQuery = useDebounce(query, 300)
  const url = debouncedQuery
    ? `${baseUrl}/api/animes?search_query=${debouncedQuery}&limit_count=5`
    : ''
  const {
    data: animes,
    loading,
    error,
  } = useFetch<Anime[]>({
    url,
  })

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value)
  }
  return (
    <section className="flex flex-col gap-4">
      <search className="w-full">
        <form className="w-full max-w-3xl mx-auto">
          <input
            type="search"
            id="default-search"
            className="w-full  p-4 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500  "
            placeholder="Search Animes..."
            required
            onInput={handleInput}
          />
        </form>
      </search>

      <ul className="flex flex-row flex-wrap gap-4 max-w-6xl mx-auto">
        {animes?.map(({ title, image_webp, mal_id }) => (
          <article
            key={mal_id}
            className="relative group  transition-transform duration-200 ease-in-out"
          >
            <a
              href={`/${title}`}
              className=" flex flex-col  items-center w-52 h-auto   rounded-lg shadow-md group-hover:shadow-xl p-4 transition-shadow duration-200 ease-in-out"
            >
              <img
                src={image_webp}
                alt={title}
                loading="lazy"
                className=" aspect-[225/330] group-hover:scale-105 w-full rounded-lg transition-all ease-in-out"
              />
              <h3 className="text-sm max-w-32 group-hover:opacity-0 transition-opacity duration-200 ease-in-out truncate font-semibold mt-2 text-gray-900 ">
                {title}
              </h3>
              <a
                href={`/play/${title}?ep=1`}
                className="absolute flex text-blue-500 z-10 bottom-2 right-0 left-0 w-full justify-center items-center  opacity-0 group-hover:opacity-100 transition-opacity duration-200 ease-in-out"
              >
                <PlayButton />
              </a>
            </a>
          </article>
        ))}
      </ul>
    </section>
  )
}
