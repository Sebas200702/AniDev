import type { Anime } from 'types'
import { AnimeTag } from '@components/anime-tag'
import { Overlay } from '@components/overlay'
import { Picture } from '@components/picture'
import { genreToColor } from '@utils/genre-to-color'
import { normalizeString } from '@utils/normalize-string'
import { useWindowWidth } from '@store/window-width'

interface Props {
  anime: Anime
  context?: string
}

interface StatusPoinProps {
  class: string
  status?: string
}

const StatusPoin = ({ class: className, status }: StatusPoinProps) => {
  return (
    <div title={status}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="currentColor"
        viewBox="0 0 24 24"
        className={className}
      >
        <path d="M0 0h24v24H0z" fill="none" />
        <path d="M12 7a5 5 0 1 1-4.995 5.217L7 12l.005-.217A5 5 0 0 1 12 7z" />
      </svg>
    </div>
  )
}
export const AnimeCard = ({ anime, context }: Props) => {
  const {
    title,
    image_large_webp,
    mal_id,
    year,
    image_small_webp,
    image_webp,
    status,
    genres,
  } = anime
  const slug = normalizeString(title)
  const { width: windowWidth } = useWindowWidth()
  const isMobile = windowWidth && windowWidth < 768

  return (
    <article
      className="group relative transition-all duration-200 ease-in-out md:hover:scale-[1.02]"
      title={title}
    >
      <a
        href={`/${slug}_${mal_id}`}
        className={`flex h-auto flex-col items-center rounded-lg ${context === 'search' ? '' : 'w-[calc((100dvw-32px)/2.4)] md:w-[calc((100dvw-280px)/4)] xl:w-[calc((100dvw-360px)/6)]'}`}
        aria-label={`View details for ${title}`}
      >
        <Picture
          image={image_small_webp}
          styles="relative h-full w-full rounded-lg"
        >
          <img
            src={isMobile ? image_webp : image_large_webp}
            alt={title}
            className="aspect-[225/330] w-full rounded-lg object-cover object-center transition-all ease-in-out"
            loading="lazy"
            width={225}
            height={330}
          />
          <Overlay
            heigth="1/3"
            color="Primary-950/70"
            width="full"
            gradient="b"
            rounded="lg"
            zIndex={10}
            hover="h-full"
          />
        </Picture>

        <footer className="absolute bottom-1 left-0 z-10 flex w-full max-w-[90%] flex-row items-center justify-center gap-2 p-2 md:left-3">
          <StatusPoin
            class={`h-6 w-6 ${status === 'Currently Airing' ? 'text-green-400 md:group-hover:text-green-500' : status === 'Finished Airing' ? 'text-blue-400 md:group-hover:text-blue-500' : 'text-yellow-400 md:group-hover:text-yellow-500'}`}
            status={status}
          />
          <h5
            className={`w-full ${genreToColor(genres[0])} text-s truncate font-semibold text-white transition-opacity duration-200 ease-in-out md:text-sm`}
            aria-hidden="true"
          >
            {title}
          </h5>
        </footer>
      </a>
      <div className="absolute top-2 -right-2">
        <AnimeTag tag={year} type={year} />
      </div>
    </article>
  )
}
