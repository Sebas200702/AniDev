import { AddToListButton } from '@components/buttons/add-to list-button'
import type { Anime } from 'types'
import { AnimeTag } from '@components/anime-tag'
import { Picture } from '@components/picture'
import { ShareButton } from '@components/buttons/share-button'
import { StarIcon } from '@components/icons/star-icon'
import { WatchAnimeButton } from '@components/buttons/watch-anime'
import { normalizeString } from '@utils/normalize-string'

interface Props {
  anime: Anime
}
export const CollectionItem = ({ anime }: Props) => {
  return (
    <li
      key={anime.mal_id}
      className="bg-Complementary mx-auto flex aspect-[700/400] w-full overflow-hidden rounded-lg"
    >
      <Picture
        image={anime.image_small_webp}
        styles="aspect-[225/330] h-full w-auto overflow-hidden rounded-l-lg"
      >
        <a href={`/${normalizeString(anime.title)}_${anime.mal_id}`}>
          <img
            src={anime.image_large_webp}
            alt={anime.title}
            className="aspect-[225/330] h-full w-full rounded-lg object-cover object-center transition-all duration-300 ease-in-out md:hover:scale-110"
            loading="lazy"
          />
        </a>
      </Picture>
      <div className="flex h-full w-[75%] flex-col justify-between p-4">
        <h3
          title={anime.title}
          className="text-l line-clamp-1 w-full overflow-hidden font-bold text-pretty text-white xl:line-clamp-2"
        >
          {anime.title}
        </h3>

        <div className="text-s mt-1 flex flex-row gap-2 text-xs text-gray-500 xl:mt-2">
          {anime.genres.slice(0, 2).map((genre) => (
            <AnimeTag key={genre} tag={genre} type={genre} style="w-auto" />
          ))}
        </div>
        <p className="text-sx text-Primary-200 line-clamp-2">
          {anime.synopsis ?? 'No description available'}
        </p>
        <span className="text-sx flex items-center gap-2 text-gray-400">
          <StarIcon style="text-enfasisColor h-5 w-5 " />
          {anime.score}/10
        </span>
        <footer className="flex h-min flex-row gap-2">
          <WatchAnimeButton
            url={`/watch/${normalizeString(anime.title)}_${anime.mal_id}`}
          />
          <AddToListButton />
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
