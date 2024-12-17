import { useState } from 'react'
import { AnimeGenres, AnimeFilters, AnimeTypes } from '@utils'

const Filters = Object.values(AnimeFilters)
const Genres = Object.values(AnimeGenres)
const Types = Object.values(AnimeTypes)
const ArrowIcon = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      className="h-4 w-4"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M19.5 8.25l-7.5 7.5-7.5-7.5"
      />
    </svg>
  )
}
const FilterButton = ({ children }: { children: React.ReactNode }) => {
  return (
    <button
      className="flew-row flex items-center gap-2 rounded-lg bg-slate-50 px-4 py-2 shadow-lg"
      onClick={() => console.log(children)}
    >
      {children}
      <ArrowIcon />
    </button>
  )
}

const Filter = ({ filter }: { filter: string }) => {
  const filterToShow = filter.replace(/\b\w/g, (l) => l.toUpperCase())
  return (
    <div className="flex w-min flex-col gap-2">
      <FilterButton>{filterToShow}</FilterButton>
      <ul className="z-10 flex max-w-72 flex-row flex-wrap gap-2 opacity-100 transition-opacity duration-300 ease-in-out"></ul>
    </div>
  )
}

const FilterItems = ({ filter }: { filter: string }) => {}
export const FilterSection = () => {
  const [genre, setGenre] = useState<string>('All')

  return (
    <form className="mx-auto flex w-full flex-row gap-4">
      {Filters.map((filter: string) => (
        <Filter filter={filter} key={filter} />
      ))}
    </form>
  )
}
