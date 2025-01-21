import type { Anime } from 'types'
import { reduceString } from '@utils/reduce-string'
import { AnimeTag } from '@components/anime-tag'
import '@styles/buttons.css'
import { WatchAnimeButton } from '@components/watch-anime'
import { ShareButton } from '@components/share-button'
import { normalizeString } from '@utils/normalize-string'
import { useEffect, useState } from 'react'

const StarIcon = ({ style }: { style?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className={style}
    viewBox="0 0 24 24"
    fill="currentColor"
  >
    <path d="M0 0h24v24H0z" fill="none"></path>
    <path d="m8.243 7.34-6.38.925-.113.023a1 1 0 0 0-.44 1.684l4.622 4.499-1.09 6.355-.013.11a1 1 0 0 0 1.464.944l5.706-3 5.693 3 .1.046a1 1 0 0 0 1.352-1.1l-1.091-6.355 4.624-4.5.078-.085a1 1 0 0 0-.633-1.62l-6.38-.926-2.852-5.78a1 1 0 0 0-1.794 0L8.243 7.34z"></path>
  </svg>
)
interface Props {
  anime: Anime
}
export const CollectionItem = ({ anime }: Props) => {
  return (
    <li
      key={anime.mal_id}
      className="mx-auto flex aspect-[500/260] w-full max-w-[500px] flex-row rounded-lg bg-secondary"
    >
      <picture
        className="aspect-[225/330] h-full w-[35%] overflow-hidden rounded-l-lg"
        style={{
          backgroundImage: `url(${anime.image_small_webp})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
        }}
      >
        <a href={`/${anime.title}_${anime.mal_id}`}>
          <img
            src={anime.image_large_webp}
            alt={anime.title}
            className="aspect-[225/330] h-full rounded-lg object-cover object-center transition-all ease-in-out hover:scale-110"
            loading="lazy"
          />
        </a>
      </picture>

      <div className="flex h-full w-[65%] flex-col justify-between px-2 py-1 xl:p-4">
        <h3 className="overflow-hidden text-pretty font-bold text-white xl:text-xl">
          {reduceString(anime.title, 40)}
        </h3>
        <p className="text-xs text-gray-500">
          {reduceString(anime.synopsis, 60)}
        </p>
        <div className="mt-1 flex flex-row gap-2 text-xs text-gray-500 xl:mt-2 xl:text-base">
          {anime.genres.slice(0, 2).map((genre) => (
            <AnimeTag key={genre} tag={genre} type={genre} style="w-auto" />
          ))}
        </div>
        <span className="flex items-center gap-2 py-2 text-xs text-gray-400 md:text-sm">
          <StarIcon style="text-enfasisColor xl:h-4 xl:w-4 h-3 w-3" />
          {anime.score}/10
        </span>
        <footer className="flex flex-row justify-center gap-4">
          <WatchAnimeButton
            url={`/watch/${normalizeString(anime.title)}_${anime.mal_id}`}
          />
          <ShareButton
            title={anime.title}
            url={`/${normalizeString(anime.title)}_${anime.mal_id}`}
            text={`Watch ${anime.title} on Animeflix`}
          />
        </footer>
      </div>
    </li>
  )
}
