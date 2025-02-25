import type { Anime } from 'types'
import { AnimeTag } from '@components/anime-tag'
import { ShareButton } from '@components/buttons/share-button'
import { StarIcon } from '@components/icons/star-icon'
import { WatchAnimeButton } from '@components/buttons/watch-anime'
import { normalizeString } from '@utils/normalize-string'
import { reduceString } from '@utils/reduce-string'

interface Props {
  anime: Anime
}
export const CollectionItem = ({ anime }: Props) => {
  return (
    <li
      key={anime.mal_id}
      className="bg-secondary mx-auto flex aspect-[500/260] w-full max-w-[500px] flex-row rounded-lg"
    >
      <picture
        className="aspect-[225/330] h-full w-[35%] overflow-hidden rounded-l-lg"
        title={anime.title}
        style={{
          backgroundImage: `url(${anime.image_small_webp})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
        }}
      >
        <a href={`/${normalizeString(anime.title)}_${anime.mal_id}`}>
          <img
            src={anime.image_large_webp}
            alt={anime.title}
            className="aspect-[225/330] h-full rounded-lg object-cover object-center transition-all duration-300 ease-in-out md:hover:scale-110"
            loading="lazy"
          />
        </a>
      </picture>

      <div className="flex h-full w-[65%] flex-col justify-between p-3 xl:p-4">
        <h3
          title={anime.title}
          className="overflow-hidden font-bold text-pretty text-white xl:text-xl"
        >
          {reduceString(anime.title, 40)}
        </h3>
        <p className="hidden text-xs text-gray-500 md:flex">
          {reduceString(anime.synopsis, 60)}
        </p>
        <div className="mt-1 flex flex-row gap-2 text-xs text-gray-500 xl:mt-2 xl:text-base">
          {anime.genres.slice(0, 2).map((genre) => (
            <AnimeTag key={genre} tag={genre} type={genre} style="w-auto" />
          ))}
        </div>
        <span className="flex items-center gap-2 text-xs text-gray-400 md:text-sm">
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
