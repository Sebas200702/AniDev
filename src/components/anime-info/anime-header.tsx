import type { Anime } from 'types'
import { AnimeNavBar } from '@components/anime-info/anime-nav-bar'
import { AnimeNumbers } from '@components/anime-info/anime-numbers'
import { AnimeTag } from '@components/anime-tag'
import { getAnimeType } from '@utils/getanime-type'
import { normalizeRating } from '@utils/normalize-rating'

interface Props {
  animeData: Anime
}

export const AnimeHeader = ({ animeData }: Props) => {
  return (
    <header className="flex w-auto flex-col md:col-span-2 gap-4 xl:col-span-4 justify-end  anime-header xl:mt-0">
      <h2 className="title max-w-[30ch] text-pretty md:text-wrap">
        {animeData.title}
      </h2>
      <ul
        className="flex flex-row flex-wrap gap-3"
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

      <div className="anime-header grid items-center justify-between gap-4 grid-cols-1 md:grid-cols-2 xl:grid-cols-3">
        <AnimeNavBar />
        <AnimeNumbers
          score={animeData.score}
          year={animeData.year}
          duration={animeData.duration}
        />
      </div>
    </header>
  )
}
