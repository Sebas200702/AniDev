import type { AnimeBannerInfo } from '@anime/types'
import { WatchAnimeButton } from '@shared/components/buttons/watch-anime'
import { Picture } from '@shared/components/media/picture'
import { normalizeString } from '@utils/normalize-string'
import { Overlay } from 'domains/shared/components/layout/overlay'

interface CarouselItemProps {
  anime: AnimeBannerInfo
  index: number
}

export const CarouselItem = ({ anime, index }: CarouselItemProps) => {
  return (
    <li
      key={anime.mal_id}
      className={`relative flex h-full w-full flex-shrink-0 flex-col items-center justify-center p-6 pt-36 md:justify-normal md:p-20 ${index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'}`}
    >
      <div className="absolute inset-0 h-[40vh] w-full overflow-hidden md:h-full">
        <Picture
          image={anime.banner_image || ''}
          isBanner
          placeholder={anime.banner_image || ''}
          alt={`${anime.title} banner`}
          styles="w-full h-full object-cover object-center relative"
        />
      </div>

      <div
        className={`z-10 flex max-w-[800px] flex-col items-center gap-6 text-white md:items-start md:justify-start md:gap-4`}
      >
        <h2 className="title line-clamp-1 max-h-44 text-center drop-shadow-md md:mb-4">
          {anime.title}
        </h2>
        <p className="text-l text-Primary-200 mb-4 line-clamp-2 text-center drop-shadow md:text-left">
          {anime.synopsis ?? 'No description available'}
        </p>
        <div className="mx-auto flex w-full flex-row items-center gap-4 md:mx-0 md:w-96 md:justify-center">
          <a
            className="button-secondary md:text-m text-s flex w-full items-center justify-center"
            href={`/anime/${normalizeString(anime.title)}_${anime.mal_id}`}
            title={`Discover ${anime.title}`}
          >
            Discover More
          </a>
          <WatchAnimeButton
            url={`/watch/${normalizeString(anime.title)}_${anime.mal_id}`}
            title={anime.title}
          />
        </div>
      </div>

      <Overlay className="to-Primary-950 via-Primary-950 md:via-Primary-950/10 h-full w-full bg-gradient-to-b" />
      <Overlay
        className={`md:to-Primary-950 md:via-Primary-950/80 h-full w-full ${index % 2 === 0 ? 'bg-gradient-to-l' : 'bg-gradient-to-r'}`}
      />
    </li>
  )
}
