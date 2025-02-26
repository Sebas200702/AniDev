import type { Anime } from 'types'
import { Overlay } from '@components/overlay'
import { WatchAnimeButton } from '@components/buttons/watch-anime'
import { createImageUrlProxy } from '@utils/craete-imageurl-proxy'
import { normalizeString } from '@utils/normalize-string'
import { reduceString } from '@utils/reduce-string'

interface CarouselItemProps {
  anime: Anime
  index: number
}
export const CarouselItem = ({ anime, index }: CarouselItemProps) => {
  return (
    <li
      key={anime.mal_id}
      className={`relative flex h-full w-full flex-shrink-0 flex-col items-center justify-center p-6 md:justify-normal md:p-20 ${index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'}`}
    >
      <div
        className="absolute inset-0 -z-10 h-full w-full"
        style={{
          backgroundImage: `url(${createImageUrlProxy(anime.banner_image, '1920', '50', 'webp')})`,
          backgroundRepeat: 'no-repeat',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />
      <div
        className={`absolute bottom-0 h-full w-full from-transparent ${index % 2 === 0 ? 'left-0 md:bg-gradient-to-l' : 'right-0 md:bg-gradient-to-r'} to-Primary-950/70`}
      />
      <Overlay
        heigth="full"
        color="Primary-950/100"
        width="auto"
        gradient="b"
        rounded="none"
        hover="none"
      />
      <div
        className={`z-10 mb-20 flex max-w-[800px] flex-col items-center gap-8 text-white md:items-start md:justify-start md:gap-4`}
      >
        <h2 className="title max-h-44 text-center drop-shadow-md md:mb-4">
          {reduceString(anime.title, 40)}
        </h2>
        <p className="text-l mb-4 hidden drop-shadow md:flex">
          {reduceString(anime.synopsis, 160)}
        </p>
        <div className="mx-auto flex w-[300px] flex-row items-center gap-4 md:mx-0 md:w-96 md:justify-center">
          <a
            href={`/${normalizeString(anime.title)}_${anime.mal_id}`}
            className="button-secondary text-s flex w-full"
          >
            Learn More
          </a>
          <WatchAnimeButton
            url={`/watch/${normalizeString(anime.title)}_${anime.mal_id}`}
          />
        </div>
      </div>
    </li>
  )
}
