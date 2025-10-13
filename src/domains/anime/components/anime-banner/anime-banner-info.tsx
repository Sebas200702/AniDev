import type { AnimeBannerInfo } from '@anime/types'
import { WatchAnimeButton } from '@shared/components/buttons/watch-anime'
import { Overlay } from '@shared/components/layout/overlay'
import { Picture } from '@shared/components/media/picture'
import { normalizeString } from '@utils/normalize-string'

interface BannerInfoProps {
  banner: AnimeBannerInfo
  animationNumber: number
}

export const BannerInfo = ({ banner, animationNumber }: BannerInfoProps) => {
  return (
    <section className="relative flex flex-row items-center md:px-20 md:py-4">
      <article
        className={`anime-banner-${animationNumber} fade-outgroup bg-Complementary relative w-full overflow-hidden transition-all duration-400 ease-in-out md:rounded-2xl md:hover:opacity-95`}
      >
        <a
          href={`/anime/${normalizeString(banner.title)}_${banner.mal_id}`}
          aria-label={`View details for ${banner.title}`}
        >
          <Picture
            image={banner.banner_image || ''}
            placeholder={banner.banner_image || ''}
            isBanner
            alt="Anime Banner"
            styles="aspect-[1080/500] h-full w-full  md:aspect-[1080/300] object-cover object-center relative"
          />

          <Overlay className="to-Primary-950/80 h-1/3 w-full bg-gradient-to-b" />
          <Overlay className="to-Primary-950/30 h-full w-0 bg-gradient-to-l md:group-hover:w-full" />
        </a>
        <div
          className={`bg-Primary-950/50 absolute bottom-0 z-10 flex h-full w-full flex-col items-center justify-between p-4 md:right-0 md:rounded-l-2xl md:p-6 xl:bottom-10 xl:max-h-60 xl:max-w-120 xl:pr-10`}
        >
          <a
            href={`/anime/${normalizeString(banner.title)}_${banner.mal_id}`}
            className="transition-all duration-200 ease-in-out md:hover:opacity-95"
          >
            <h3 className="text-lx line-clamp-1 max-h-44 w-full overflow-hidden text-center font-bold text-white">
              {banner.title}
            </h3>
          </a>

          <p className="text-s line-clamp-2 max-h-32 w-full overflow-hidden text-center text-white">
            {banner.synopsis}
          </p>
          <WatchAnimeButton
            url={`/watch/${normalizeString(banner.title)}_${banner.mal_id}`}
            title={banner.title}
          />
        </div>
      </article>
    </section>
  )
}
