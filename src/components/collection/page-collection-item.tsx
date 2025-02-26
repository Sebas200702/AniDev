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
      className="bg-Complementary mx-auto  aspect-[600/390] w-full  flex  rounded-lg overflow-hidden"
    >
      <picture
        className="aspect-[225/330] h-full w-auto overflow-hidden rounded-l-lg"
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
            className="w-full aspect-[225/330]  h-full rounded-lg object-cover object-center transition-all duration-300 ease-in-out md:hover:scale-110"
            loading="lazy"
          />
        </a>
      </picture>

      <div className="flex h-full w-[65%]  flex-col justify-between p-2 xl:p-4">
        <h3
          title={anime.title}
          className="overflow-hidden w-full font-bold text-pretty text-white text-l"
        >
          {reduceString(anime.title, 20)}
        </h3>

        <div className="mt-1 flex flex-row gap-2 text-xs text-gray-500 xl:mt-2 text-s">
          {anime.genres.slice(0, 2).map((genre) => (
            <AnimeTag key={genre} tag={genre} type={genre} style="w-auto" />
          ))}
        </div>
        <p className=" text-sx text-Primary-200 flex">
          {reduceString(anime.synopsis, 50)}
        </p>
        <span className="flex items-center gap-2 text-sx text-gray-400 ">
          <StarIcon style="text-enfasisColor h-5 w-5 " />
          {anime.score}/10
        </span>
        <footer className=" flex flex-row h-min  gap-2 ">
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
