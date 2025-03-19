import type { Anime } from 'types'
import { AnimeNavBar } from '@components/anime-info/anime-nav-bar'
import { AnimeTag } from '@components/anime-tag'
import { getAnimeType } from '@utils/getanime-type'
import { normalizeRating } from '@utils/normalize-rating'

interface Props {
  animeData: Anime
}

export const AnimeHeader = ({ animeData }: Props) => {
  return (
    <header className="anime-header flex w-auto flex-col justify-end gap-4 md:col-span-2 xl:col-span-4 xl:mt-0">
      <h2 className="title max-w-[30ch] text-pretty text-center md:text-left md:text-wrap">
        {animeData.title}
      </h2>
      <ul
        className="flex flex-row items-center justify-center md:justify-start flex-wrap gap-3"
        aria-label="Categorías y géneros"
      >
        <AnimeTag tag={getAnimeType(animeData.type)} type={animeData.type} />
        {animeData.genres.map((genre) => (
          <AnimeTag key={genre} tag={genre} type={genre} style="w-auto" />
        ))}
        {animeData.rating && (
          <AnimeTag
            tag={normalizeRating(animeData.rating)}
            type={animeData.rating}
          />
        )}
      </ul>

      <div className="anime-header grid grid-cols-1 items-center justify-between gap-4 md:grid-cols-2 xl:grid-cols-3">
        <AnimeNavBar />

      </div>
    </header>
  )
}
