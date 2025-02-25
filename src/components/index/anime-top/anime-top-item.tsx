import type { Anime } from 'types'

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
        <picture
          className="relative h-full w-full max-w-36 overflow-hidden rounded-lg"
          style={{
            backgroundImage: `url(${anime.image_small_webp})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
          }}
        >
          <img
            src={anime.image_large_webp}
            alt={anime.title}
            className="aspect-[225/330] w-full rounded-lg object-cover object-center transition-all ease-in-out group-hover:scale-105"
            loading="lazy"
          />
          <div className="absolute bottom-0 left-0 h-1/3 w-full rounded-lg bg-gradient-to-b from-transparent to-black/70 opacity-100 transition-all duration-400 ease-in-out md:group-hover:h-full md:group-hover:to-black/90" />
          <span className="absolute bottom-0 left-2 text-5xl font-bold">
            {index + 1}
          </span>
        </picture>

        <footer className="mt-4">
          <h5 className="max-w-32 truncate text-left text-sm">{anime.title}</h5>
        </footer>
      </a>
    </li>
  )
}
