import type { Anime } from 'types'
import { Overlay } from '@components/overlay'
import { Picture } from '@components/picture'

interface AnimeTopItemProps {
  anime: Anime
  index: number
}
export const AnimeTopItem = ({ anime, index }: AnimeTopItemProps) => {
  return (
    <li
      className="group relative transition-all duration-200 ease-in-out"
      title={anime.title}
      key={anime.mal_id}
    >
      <a
        href={`/${anime.title}_${anime.mal_id}`}
        className={`flex h-auto flex-col items-center rounded-lg`}
        aria-label={`View details for ${anime.title}`}
      >
        <Picture
          image={anime.image_small_webp}
          styles="aspect-[225/330]  w-full max-w-36 overflow-hidden rounded-lg relative"
        >
          <img
            src={anime.image_large_webp}
            alt={anime.title}
            className="aspect-[225/330] w-full rounded-lg object-cover object-center transition-all ease-in-out group-hover:scale-105"
            loading="lazy"
          />
          <Overlay className="to-Primary-950/80 h-1/3 w-full bg-gradient-to-b md:group-hover:h-full" />
          <span className="absolute bottom-0 left-2 text-5xl font-bold">
            {index + 1}
          </span>
        </Picture>

        <footer className="mt-4">
          <h5 className="max-w-32 truncate text-left text-sm">{anime.title}</h5>
        </footer>
      </a>
    </li>
  )
}
